(function() {
    const lat = -34.5555447;
    const lng = -58.4823779;
    const mapa = L.map('mapa').setView([lat, lng ], 15);
    let marker;
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    })
    .addTo(mapa)

    marker.on('moveend', function(event){
        marker = event.target

        const posicion = marker.getLatLng()
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))
    })


})()