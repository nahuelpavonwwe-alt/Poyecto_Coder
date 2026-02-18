let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


const contenedor = document.getElementById("carrito");
const botonVaciar = document.getElementById("vaciar-carrito");
const totalElemento = document.getElementById("total");



function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}



function renderCarrito() {

    contenedor.innerHTML = "";

    if (carrito.length === 0) {
        contenedor.textContent = "El carrito está vacío";
        totalElemento.textContent = "Total $0";
        return;
    }

    carrito.forEach(item => {
        const p = document.createElement("p");
        p.textContent = `${item.nombre} x ${item.cantidad}`;
        contenedor.appendChild(p);
        
    });
    mostrarTotal();
}

function mostrarTotal() {
    const total = carrito.reduce((acumulador, item) => {
        return acumulador + item.precio * item.cantidad;
    }, 0);
    totalElemento.textContent = `Total $${total}`;
}



function vaciarCarrito() {
    carrito = [];
    localStorage.removeItem("carrito");
    renderCarrito();
}



botonVaciar.addEventListener("click", vaciarCarrito);



renderCarrito();
