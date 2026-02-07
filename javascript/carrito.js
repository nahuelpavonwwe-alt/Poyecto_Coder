
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

    for (const item of carrito) {
        const p = document.createElement("p");
        p.textContent = `${item.nombre} x ${item.cantidad} - $${item.precio}`;
        contenedor.appendChild(p);
    }

    mostrarTotal();
}



function mostrarTotal() {
    let total = 0;

    for (const item of carrito) {
        total += item.precio * item.cantidad;
    }

    totalElemento.textContent = "Total $" + total;
}



function vaciarCarrito() {
    carrito = [];
    localStorage.removeItem("carrito");
    renderCarrito();
}



botonVaciar.addEventListener("click", vaciarCarrito);



renderCarrito();
