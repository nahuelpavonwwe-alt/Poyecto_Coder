let carrito = JSON.parse(localStorage.getItem("carrito")) || [];





const botonvaciar = document.getElementById("vaciar-carrito");


function agregarAlCarrito(producto){
let existe = false;

for(const item of carrito) {
    if (item.id === productos.id) {
        
        item.cantidad++;

        existe = true;
    }
}
if (!existe) {

    carrito.push({

        id: producto.id,
        nombre: producto.nombre,
        precio: productos.precio,
        cantidad: 1


    });
    guardarCarrito();
}
}
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));

}

function renderCarrito(){
    const contenedor = document.getElementById("carrito");
    contenedor.innerHTML = "";

    for(const item of carrito) {
        const p = document.createElement("p");
        p.textContent.Content = `${item.nombre} x ${item.cantidad}`;
        contenedor.appendChild(p);
    }

    mostrarTotal()
}

function mostrarTotal() {
    let total = 0;

    for (const item of carrito) {
        total += item.precio * item.cantidad;
    }

    document.getElementById("total").textContent = "total $" + total;


}

renderCarrito();

document.addEventListener("click", function (e){
    if (e.target.tagName === "BUTTON" && e.target.dataset.id) {
        const id = Number(e.target.dataset.id);

        let productoSeleccionado = null;

        for (const producto of productos) {

            if (producto.id === id) {
                productoSeleccionado = producto;
            } 
        }
        
        if(productoSeleccionado) {

            agregarAlCarrito(productoSeleccionado);
        }
    }

});

function vaciarCarrito() {
    carrito = [];
    localStorage.removeItem("carrito");
}

botonvaciar.addEventListener("click", vaciarCarrito);

