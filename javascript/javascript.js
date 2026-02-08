const productos = [
    { id: 1, nombre: "Jean baggy", categoria: "Pantalon", precio: 45000 },
    { id: 2, nombre: "Jean slim fit", categoria: "Pantalon", precio: 40000 },
    { id: 3, nombre: "Remera oversize", categoria: "Remera", precio: 10000 },
    { id: 4, nombre: "Remera regular", categoria: "Remera", precio: 9000 },
    { id: 5, nombre: "Buzo", categoria: "Abrigo", precio: 50000 },
    { id: 6, nombre: "Campera", categoria: "Abrigo", precio: 100000 }
];




let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

carrito = carrito.map(item => ({
    ...item,
    cantidad: item.cantidad || 1
}));




const productsContainer = document.getElementById("cont-productos");
const contenedorFiltros = document.getElementById("cont-filtro");




const categorias = [...new Set(productos.map(p => p.categoria))];




function renderProductos(productsArray) {
    productsContainer.innerHTML = "";

    for (const producto of productsArray) {
        const card = document.createElement("div");

        card.innerHTML = `
            <h3>${producto.nombre}</h3>
            <h4>$${producto.precio}</h4>
            <button class="productoAgregar" id="${producto.id}">
                Agregar
            </button>
        `;

        productsContainer.appendChild(card);
    }
}

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(id) {

    const producto = productos.find(p => p.id === id);
    const existe = carrito.find(item => item.id === id);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1
        });
    }

    guardarCarrito();
    console.log("Carrito:", carrito);
}

function crearBotonesFiltros() {

    
    const botonTodos = document.createElement("button");
    botonTodos.textContent = "Todos";
    botonTodos.dataset.categoria = "Todos";
    contenedorFiltros.appendChild(botonTodos);

    for (const categoria of categorias) {
        const boton = document.createElement("button");
        boton.textContent = categoria;
        boton.dataset.categoria = categoria;
        contenedorFiltros.appendChild(boton);
    }
}




contenedorFiltros.addEventListener("click", (e) => {

    if (!e.target.dataset.categoria) return;

    const categoria = e.target.dataset.categoria;

    if (categoria === "Todos") {
        renderProductos(productos);
        return;
    }

    const filtrados = productos.filter(
        p => p.categoria === categoria
    );

    renderProductos(filtrados);
});

productsContainer.addEventListener("click", (e) => {

    if (!e.target.classList.contains("productoAgregar")) return;

    const id = Number(e.target.id);
    agregarAlCarrito(id);
});




crearBotonesFiltros();
renderProductos(productos);
