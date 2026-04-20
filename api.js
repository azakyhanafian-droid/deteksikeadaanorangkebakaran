async function fetchSensorData() {
    try {
        const response = await fetch(CONFIG.API_URL);
        if (!response.ok) throw new Error("Gagal ambil data");
        return await response.json();
    } catch (error) {
        console.error("Error API:", error);
        return null;
    }
}