let productos = [];

fetch("./db/productos.json")
    .then(response => response.json())
    .then(data => {

        productos = data;

        renderProductos(productos);

        const categorias = [];

        productos.forEach(producto => {
            if (!categorias.includes(producto.categoria)) {
                categorias.push(producto.categoria);
            }
        });

       crearBotonesFiltros(categorias, productos); 
    })
    .catch(error => console.log("Error al cargar productos: ", error))

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

carrito = carrito.map(item => ({
    ...item,
    cantidad: item.cantidad || 1
}));






const productsContainer = document.getElementById("cont-productos");

const contenedorFiltros = document.getElementById("cont-filtro");

const buscador = document.getElementById("buscador");

const categorias = [];

productos.forEach(producto => {

    if (!categorias.includes(producto.categoria)) {
        categorias.push(producto.categoria);
    }
});

function renderProductos(productsArray) {
    productsContainer.innerHTML = "";

    for (const producto of productsArray) {
        const card = document.createElement("div");
        card.classList.add("product-card");

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

function buscarProductos(texto) {

    const textoLower = texto.toLowerCase();

    const productosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(textoLower)
    );

    renderProductos(productosFiltrados);
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
   
}


function crearBotonesFiltros(categorias, productos) {

    
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

buscador.addEventListener("input", (e) => {
    buscarProductos(e.target.value);
});




renderProductos(productos);
