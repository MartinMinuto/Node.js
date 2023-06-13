(function(){
    const lat = -34.5555447;
    const lng = -58.4823779;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    const obtenerPropiedades = async () => {
        try {
            const url = '/api/propiedades'
            const respuesta = await fetch(url)
            const propiedades = await respuesta.json()

        } catch (error) {
            console.log(error)
        }
    }

})