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

function calcularTotal() {

    let total = 0;

    for (const item of carrito) {
        total += item.precio * item.cantidad;
    }

    return total;
}

function crearFactura (nombre, calle, altura) {
   

    const total = calcularTotal(); 

    let listaProductos = "";

    for(let i = 0; i < carrito.length; i++) {
        listaProductos += `
        <li>
        ${carrito[i].nombre} x ${carrito[i].cantidad}
        </li>

        `;
        }
        Swal.fire({
            title: "Factura generada",
            html: `
            <p><strong>Cliente:</strong> ${nombre}</p>
            <p><strong>Calle:</strong> ${calle}</p>
            <p><strong>Altura:</strong> ${altura}</p>
            <ul>${listaProductos}</ul>
            <p><strong>Total:</strong> $${total}</p>
            `,

            icon: "success",
            confirmButtonText: "Aceptar"
        }).then((result) => {
            if (result.isConfirmed) {
                vaciarCarrito() 
            }
            
        });
  

}





botonVaciar.addEventListener("click", vaciarCarrito);

document.getElementById("btn-comprar").addEventListener("click", () => {

     if (carrito.length === 0) {
        Swal.fire("El carrito esta vacio", "", "warning");
        return;
    }

    Swal.fire({
        title: "Datos del cliente",
        html:`
        <input id="swal-nombre" class="swal2-input" placeholder="Nombre">
        <input id="swal-calle" class="swal2-input" placeholder="calle">
        <input id="swal-altura" class="swal2-input" placeholder="altura">
        `,
        confirmButtonText: "Generar factura",
        focusConfirm: false,
        preConfirm: () => {
            const nombre = document.getElementById("swal-nombre").value.trim();
            const calle = document.getElementById("swal-calle").value.trim();
            const altura = document.getElementById("swal-altura").value.trim();


            if (!nombre || !calle || !altura) {
                Swal.showValidationMessage("Es obligatorio rellenar los campos");
                return false;
            }

            if(!/^\d+$/.test(altura) || parseInt(altura) <= 0) {
                Swal.showValidationMessage("Altura Invalida");
                return false;
            }
            
            if (calle.length < 2) {
                Swal.showValidationMessage("calle Invalida");
                return false;
            }
            return{ nombre, calle, altura };
        }

    }).then((result) => {

        if (result.isConfirmed){
        const { nombre, calle, altura } = result.value;
        
        crearFactura (nombre,calle, altura);
        }
    });

    
});



renderCarrito();


//Falta  arreglar el campo cuando queda en blanco que no avisa que los campos son obligatorios y no se genera la factura poniendo los datos