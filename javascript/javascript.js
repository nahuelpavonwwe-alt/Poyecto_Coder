let productos = [];
const url = "./db/productos.json"
fetch(url)
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
    .catch(error => {
        Swal.fire(
        "Error",
        "No se pudieron cargar los productos. Intente nuevamente más tarde.",
        "error"
        );
    });

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

carrito = carrito.map(item => ({
    ...item,
    cantidad: item.cantidad || 1
}));






const productsContainer = document.getElementById("cont-productos");

const contenedorFiltros = document.getElementById("cont-filtro");

const buscador = document.getElementById("buscador");


function renderProductos(productsArray) {
    productsContainer.innerHTML = "";

    for (const producto of productsArray) {
        
        const card = document.createElement("div");
        
        card.classList.add("product-card");
        
        const colores = [...new Set(producto.variantes.map(v => v.color))]
        
        let selectorColor = `<select class="color-selector" data-id="${producto.id}">
        <option value="">Seleccionar color</option>`


        colores.forEach(color => {
            selectorColor += `<option value="${color}">${color}</option>`
        })
        selectorColor += `</select>`
        card.innerHTML = `
            <h3>${producto.nombre}</h3>
            <h4>$${producto.precio}</h4>
            <label>Color :</label>
            ${selectorColor}

            <div id="talles-${producto.id}"></div>
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
        producto.nombre.toLowerCase().includes(textoLower) ||
        producto.categoria.toLowerCase().includes(textoLower)
    );

    renderProductos(productosFiltrados);
}


function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(id) {

    const producto = productos.find(p => Number(p.id) === id);

    const selectorColor = document.querySelector(`select[data-id="${id}"]`);
    const color = selectorColor.value;

    const talleSeleccionado = document.querySelector(`input[name="talle-${id}"]:checked`);

    const talle = talleSeleccionado.value;

    const variante = producto.variantes.find(v =>
        v.color === color && v.talle === talle
    );

    const existe = carrito.find(item =>
        item.varianteId === variante.idvariable
    );

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({
            varianteId: variante.idvariable,
            productoId: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            color: color,
            talle: talle,
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

document.addEventListener("change", e => {

    if (e.target.classList.contains("color-selector")) {

        const id = Number(e.target.dataset.id);
        const color = e.target.value;

        const producto = productos.find(p => p.id === id);

        const variantesColor = producto.variantes.filter(
            v => v.color === color
        );

        const contenedorTalles = document.getElementById(`talles-${id}`);

        contenedorTalles.innerHTML = "";

        variantesColor.forEach(v => {

            contenedorTalles.innerHTML += `
                <label>
                    <input type="radio" name="talle-${id}" value="${v.talle}">
                    ${v.talle} (stock ${v.stock})
                </label>
            `;

        });

    }

});



