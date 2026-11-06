document.addEventListener("DOMContentLoaded", function () {
    // 1. Inisialisasi Peta
    const map = L.map("map").setView([-2.548926, 118.0148634], 5);

    // 2. Tile Layer OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    let markersLayer = L.layerGroup().addTo(map);

    // 3. Fungsi Render Marker
    function renderMarkers(kategoriFilter = "Semua") {
        markersLayer.clearLayers();

        let filteredData = dataPeluang;
        if (kategoriFilter !== "Semua") {
            filteredData = dataPeluang.filter(item => item.kategori === kategoriFilter);
        }

        let bounds = [];

        filteredData.forEach(item => {
            const customIcon = L.divIcon({
                className: 'custom-marker-icon',
                html: `<div style="
                    background-color: #B84D2B; 
                    width: 24px; 
                    height: 24px; 
                    border-radius: 50%; 
                    border: 3px solid #F5EBDD; 
                    box-shadow: 0 3px 8px rgba(0,0,0,0.3);
                "></div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
                popupAnchor: [0, -12]
            });

            const marker = L.marker([item.latitude, item.longitude], { icon: customIcon });

            const popupContent = `
                <div style="font-family: inherit; color: #174A35; min-width: 200px;">
                    <h6 style="font-weight: bold; border-bottom: 2px solid #B84D2B; padding-bottom: 5px; margin-bottom: 8px;">
                        ${item.nama}
                    </h6>
                    <p style="margin: 3px 0;"><b>Penyelenggara:</b> ${item.penyelenggara}</p>
                    <p style="margin: 3px 0;"><b>Kategori:</b> <span style="background-color: #174A35; color: #F5EBDD; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${item.kategori}</span></p>
                    <p style="margin: 3px 0;"><b>Lokasi:</b> ${item.lokasi}</p>
                    <p style="margin: 3px 0 0 0;"><b>Deadline:</b> <span style="color: #B84D2B; font-weight: bold;">${item.deadline}</span></p>
                </div>
            `;

            marker.bindPopup(popupContent);
            markersLayer.addLayer(marker);
            bounds.push([item.latitude, item.longitude]);
        });

        if (bounds.length > 0 && kategoriFilter !== "Semua") {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
        }
    }

    // Render Awal
    renderMarkers("Semua");

    // 4. Listener Event Filter Kategori
    const filterSelect = document.getElementById("filterKategori");
    if (filterSelect) {
        filterSelect.addEventListener("change", function () {
            renderMarkers(this.value);
        });
    }

    // Refresh ukuran peta agar tidak blank/abu-abu
    setTimeout(() => {
        map.invalidateSize();
    }, 200);
});