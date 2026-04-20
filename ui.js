let myChart;

function initUI() {
    const ctx = document.getElementById('realtimeChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Kadar Gas',
                borderColor: '#00ff88',
                data: [],
                fill: true,
                backgroundColor: 'rgba(0, 255, 136, 0.1)',
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { grid: { color: '#333' } },
                x: { grid: { display: false } }
            }
        }
    });
}

function updateDashboard(data) {
    const statusEl = document.getElementById('status');
    
    if (!data) {
        statusEl.innerText = "OFFLINE (Cek WiFi/CORS)";
        statusEl.style.color = "red";
        return;
    }

    statusEl.innerText = "ONLINE";
    statusEl.style.color = "#00ff88";

    // Update Angka
    document.getElementById('gas-val').innerText = data.gas;
    document.getElementById('temp-val').innerText = data.temp.toFixed(1);
    document.getElementById('hum-val').innerText = data.hum.toFixed(1);
    document.getElementById('press-val').innerText = data.press.toFixed(1);

    // Update Grafik
    const now = new Date().toLocaleTimeString();
    myChart.data.labels.push(now);
    myChart.data.datasets[0].data.push(data.gas);

    if (myChart.data.labels.length > 15) {
        myChart.data.labels.shift();
        myChart.data.datasets[0].data.shift();
    }
    myChart.update();
}