let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


const contenedor = document.getElementById("carrito");
const botonVaciar = document.getElementById("vaciar-carrito");
const totalElemento = document.getElementById("total");



function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function aumentarCantidad(id) {
    const producto = carrito.find(item => item.id === id);
    if (producto) {
        producto.cantidad++;
        guardarCarrito();
        renderCarrito();

    }
}
function disminuirCantidad(id) {
    const producto = carrito.find(item => item.id === id);
    if (producto) {
        producto.cantidad--;
        if (producto.cantidad <= 0) {
            carrito = carrito.filter(item => item.id !== id)
        }

        guardarCarrito();
        renderCarrito();

    }
}

function eliminarProducto(id) {
    carrito = carrito.filter(item => item.id !==id);
    guardarCarrito();
    renderCarrito();
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


contenedor.addEventListener("click", (e) => {
    const id = Number(e.target.dataset.id);

    if(e.target.classList.contains("sumar")) {
        aumentarCantidad(id);
    }
    
    if(e.target.classList.contains("restar")) {
        disminuirCantidad(id);
    }

    if(e.target.classList.contains("eliminar")) {
        eliminarProducto(id);
    }

});

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

    carrito.forEach(item => {
        const div = document.createElement("div");

        div.innerHTML =`
        <p>${item.nombre} - $${item.precio}</p>
        <button class="restar" data-id="${item.id}">-</button>
        <span>${item.cantidad}</span>
        <button class="sumar" data-id="${item.id}">+</button>
        <button class="eliminar" data-id="${item.id}">ELIMINAR</button>
        `;
        contenedor.appendChild(div)
    })
}

botonVaciar.addEventListener("click", vaciarCarrito);



renderCarrito();
