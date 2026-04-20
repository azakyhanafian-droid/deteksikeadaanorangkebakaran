import threading
from flask import Flask, request, Response, send_from_directory, send_file
from flask_cors import CORS
from ultralytics import YOLO
import cv2
from gtts import gTTS
import pygame
import io
import time
import os
import requests
import psycopg2
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet

# ==============================
# FIX RTSP & ENVIRONMENT
# ==============================
os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = "rtsp_transport;tcp|max_delay;500000"

app = Flask(__name__)
CORS(app)

IMAGE_FOLDER = "images"
if not os.path.exists(IMAGE_FOLDER):
    os.makedirs(IMAGE_FOLDER)

# ==============================
# DATABASE CONNECTION
# ==============================
def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        database="smart_safety",
        user="postgres",
        password="zaky12345"
    )

# ==============================
# THREADED VIDEO READ (SOLUSI LAG)
# ==============================
class VideoStream:
    def __init__(self, src):
        self.cap = cv2.VideoCapture(src, cv2.CAP_FFMPEG)
        self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1) # Minimalkan buffer
        self.ret, self.frame = self.cap.read()
        self.stopped = False

    def start(self):
        threading.Thread(target=self.update, args=(), daemon=True).start()
        return self

    def update(self):
        while not self.stopped:
            ret, frame = self.cap.read()
            if not ret:
                continue
            self.ret, self.frame = ret, frame

    def read(self):
        return self.frame

# Inisialisasi Kamera
rtsp_url = "rtsp://admin:z12345@10.150.226.4:8554/Streaming/Channels/102"
vs = VideoStream(rtsp_url).start()

# ==============================
# YOLO & STATUS
# ==============================
model = YOLO("best.pt")
status_kebakaran = "AMAN"
last_count = -1
last_speak_time = 0
last_save_time = 0
SPEAK_COOLDOWN = 5
SAVE_COOLDOWN = 10
ESP_IP = "http://10.150.226.103/data"

# ==============================
# AUDIO (ASYNCHRONOUS)
# ==============================
pygame.mixer.init()
def speak(text):
    def run():
        try:
            mp3_fp = io.BytesIO()
            tts = gTTS(text=text, lang='id')
            tts.write_to_fp(mp3_fp)
            mp3_fp.seek(0)
            pygame.mixer.music.load(mp3_fp, "mp3")
            pygame.mixer.music.play()
        except Exception as e:
            print("Error suara:", e)
    threading.Thread(target=run, daemon=True).start()

# ==============================
# API LOGS & PDF (STRUKTUR DATA DI PERTAHANKAN)
# ==============================
@app.route('/logs')
def get_logs():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM log_kebakaran ORDER BY id DESC LIMIT 10")
        rows = cursor.fetchall()
        data = []
        for r in rows:
            data.append({
                "id": r[0], "waktu": str(r[1]), "gas": r[2], "suhu": r[3],
                "hum": r[4], "orang": r[5], "status": r[6],
                "gambar": r[7] if len(r) > 7 else None
            })
        cursor.close()
        conn.close()
        return {"data": data}
    except Exception as e:
        return {"error": str(e)}

@app.route('/export-pdf')
def export_pdf():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM log_kebakaran ORDER BY id DESC LIMIT 20")
        rows = cursor.fetchall()

        file_path = "laporan_kebakaran.pdf"
        doc = SimpleDocTemplate(file_path)
        styles = getSampleStyleSheet()
        elements = [Paragraph("LAPORAN KEBAKARAN SISTEM AI", styles['Title']), Spacer(1, 20)]

        for r in rows:
            text = f"Waktu: {r[1]}<br/>Gas: {r[2]}<br/>Suhu: {r[3]}°C<br/>Hum: {r[4]}<br/>Orang: {r[5]}<br/>Status: {r[6]}"
            elements.append(Paragraph(text, styles['Normal']))
            elements.append(Spacer(1, 10))
            if len(r) > 7 and r[7]:
                img_path = os.path.join(IMAGE_FOLDER, r[7])
                if os.path.exists(img_path):
                    elements.append(Image(img_path, width=200, height=150))
                    elements.append(Spacer(1, 20))
        
        doc.build(elements)
        cursor.close()
        conn.close()
        return send_file(file_path, as_attachment=True)
    except Exception as e:
        return {"error": str(e)}

# ==============================
# clear database
# ==============================
@app.route('/clear-db')
def clear_db():
    try:
        conn_local = psycopg2.connect(
            host="localhost",
            database="smart_safety",
            user="postgres",
            password="zaky12345"
        )

        cur = conn_local.cursor()
        cur.execute("TRUNCATE TABLE log_kebakaran RESTART IDENTITY")
        conn_local.commit()

        cur.close()
        conn_local.close()

        return {"status": "Database berhasil dikosongkan"}

    except Exception as e:
        return {"error": str(e)}
# ==============================
# GENERATOR STREAM + YOLO (OPTIMIZED)
# ==============================
def generate_yolo():
    global last_count, last_speak_time, last_save_time, status_kebakaran

    while True:
        frame = vs.read()
        if frame is None:
            continue
        
        # Copy frame agar tidak mengganggu thread utama kamera
        display_frame = frame.copy()
        people_count = 0
        now = time.time()

        if status_kebakaran == "BAHAYA":
            # Perkecil resolusi input YOLO untuk performa (imgsz=320)
            results = model(display_frame, imgsz=320, verbose=False, conf=0.4)
            for r in results:
                for box in r.boxes:
                    if int(box.cls[0]) == 0: # 0 adalah Person
                        people_count += 1
                        x1, y1, x2, y2 = map(int, box.xyxy[0])
                        cv2.rectangle(display_frame, (x1, y1), (x2, y2), (0, 0, 255), 2)

            # Suara
            if (people_count != last_count) and (now - last_speak_time > SPEAK_COOLDOWN):
                speak(f"Ada {people_count} orang di area bahaya")
                last_count = people_count
                last_speak_time = now

            # Simpan Data (Gunakan timeout pada request sensor)
            if now - last_save_time > SAVE_COOLDOWN:
                try:
                    res = requests.get(ESP_IP, timeout=0.5).json()
                    if res.get("buzzer") and people_count > 0:
                        img_name = f"{int(now)}.jpg"
                        cv2.imwrite(os.path.join(IMAGE_FOLDER, img_name), display_frame)
                        
                        conn = get_db_connection()
                        cur = conn.cursor()
                        cur.execute(
                            "INSERT INTO log_kebakaran (gas, suhu, kelembaban, jumlah_orang, status, gambar) VALUES (%s,%s,%s,%s,%s,%s)",
                            (res["gas"], res["temp"], res["hum"], people_count, "BAHAYA", img_name)
                        )
                        conn.commit()
                        cur.close()
                        conn.close()
                        last_save_time = now
                except:
                    pass
        else:
            last_count = -1

        # UI Overlay
        color = (0, 0, 255) if status_kebakaran == "BAHAYA" else (0, 255, 0)
        cv2.putText(display_frame, f"STATUS: {status_kebakaran}", (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

        ret, buffer = cv2.imencode('.jpg', display_frame)
        if not ret:
            continue

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

@app.route('/video')
def video():
    return Response(generate_yolo(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/status')
def update_status():
    global status_kebakaran
    val = request.args.get('value')
    if val: status_kebakaran = val.upper()
    return f"Status {status_kebakaran}"

@app.route('/images/<filename>')
def get_image(filename):
    return send_from_directory(IMAGE_FOLDER, filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True, debug=False)