(function(){
    const lat = -34.5555447;
    const lng = -58.4823779;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

})