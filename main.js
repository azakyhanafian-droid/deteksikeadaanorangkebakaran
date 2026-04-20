const IP_ESP = "http://10.150.226.103/data";
const IP_PYTHON = "http://localhost:5000/status";
const IP_LOG = "http://localhost:5000/logs";
const IP_PDF = "http://localhost:5000/export-pdf";

let lastBuzzerStatus = null;

// ==============================
// SENSOR ESP32
// ==============================
async function fetchIoT() {
  const statusBadge = document.getElementById("status");

  try {
    const response = await fetch(IP_ESP);
    const data = await response.json();

    document.getElementById("gas-val").innerText = data.gas;
    document.getElementById("temp-val").innerText = data.temp.toFixed(1);

    statusBadge.classList.remove("offline");
    statusBadge.classList.add("online");
    statusBadge.innerText = "ONLINE";

    const buzText = document.getElementById("buzzer-status");
    const wrapper = document.querySelector(".wrapper");
    const alarmIcon = document.querySelector(".sensor-icon.alarm");

    const isDanger = data.buzzer === true || data.buzzer === "true";

    if (isDanger) {
      buzText.innerText = "DANGER!";
      buzText.style.color = "#ef4444";
      wrapper.classList.add("danger-mode");
      alarmIcon.classList.add("danger");
      updatePythonStatus("BAHAYA");
    } else {
      buzText.innerText = "AMAN";
      buzText.style.color = "#10b981";
      wrapper.classList.remove("danger-mode");
      alarmIcon.classList.remove("danger");
      updatePythonStatus("AMAN");
    }
  } catch (e) {
    statusBadge.classList.remove("online");
    statusBadge.classList.add("offline");
    statusBadge.innerText = "OFFLINE";
    console.error("ESP32 ERROR:", e);
  }
}

// ==============================
// STATUS KE PYTHON
// ==============================
async function updatePythonStatus(statusValue) {
  if (statusValue !== lastBuzzerStatus) {
    try {
      await fetch(`${IP_PYTHON}?value=${statusValue}`);
      lastBuzzerStatus = statusValue;
    } catch (err) {
      console.error("Gagal kirim ke AI:", err);
    }
  }
}

// ==============================
// AMBIL LOG DB
// ==============================
async function fetchLogs() {
  try {
    const res = await fetch(IP_LOG);
    const result = await res.json();

    renderLogs(result.data || []);
  } catch (e) {
    console.error("Gagal ambil log:", e);
  }
}

// ==============================
// DOWNLOAD PDF (FIX LANGSUNG DOWNLOAD)
// ==============================
async function downloadPDF() {
  try {
    const response = await fetch(IP_PDF);

    if (!response.ok) throw new Error("Gagal download PDF");

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "laporan_kebakaran.pdf"; // nama file

    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert("Gagal download PDF. Pastikan server Python aktif.");
    console.error(err);
  }
}

// ==============================
// clear database
// ==============================

async function clearDatabase() {
  const confirmClear = confirm("Yakin mau hapus semua data?");

  if (!confirmClear) return;

  try {
    const res = await fetch("http://localhost:5000/clear-db");
    const result = await res.json();

    alert("Database berhasil dihapus!");
    fetchLogs(); // refresh data
  } catch (err) {
    alert("Gagal clear database");
    console.error(err);
  }
}

// ==============================
// RENDER LOG
// ==============================
function renderLogs(logs) {
  const list = document.getElementById("log-list");

  if (!list) return;

  if (!logs || logs.length === 0) {
    list.innerHTML = "<li>Tidak ada data</li>";
    return;
  }

  list.innerHTML = "";

  logs.forEach((log) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <strong style="color:red">${log.status}</strong><br>
      Gas: ${log.gas} | Suhu: ${log.suhu}°C | Orang: ${log.orang}<br>
      <small>${log.waktu}</small>
    `;

    list.appendChild(li);
  });
}

// ==============================
// LOOP
// ==============================
setInterval(fetchIoT, 1000);
setInterval(fetchLogs, 5000);
