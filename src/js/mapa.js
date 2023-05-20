(function() {
    const lat = document.querySelector('#lat').value || -34.5555447;
    const lng = document.querySelector('#lng').value || -58.4823779;
    const mapa = L.map('mapa').setView([lat, lng ], 15);
    let marker;

    const geocodeService = L.esri.Geocoding.geocodeService()
    

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

        geocodeService.reverse().LatLng(posicion, 13).run(function(error, resultado) {
            marker.bindPopup(resultado.address.LongLabel)

            document.querySelector(".calle").textContent = resultado?.address?.Address ?? "";
            document.querySelector("#calle").value = resultado?.address?.Address ?? "";
            document.querySelector("#lat").value = resultado?.LatLng?.lat ?? "";
            document.querySelector("#lng").value = resultado?.LatLng?.lng ?? "";
        })
    })


})()