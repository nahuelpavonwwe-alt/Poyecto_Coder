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
    totalElemento.textContent = `Total : $${total}`;
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
        
            <p>${item.nombre} - ${item.talle} - ${item.color} $${item.precio}</p>

            <button class="restar" 
            data-id="${item.id}" 
            data-color="${item.color}" 
            data-talle="${item.talle}">-</button>

            <span>${item.cantidad}</span>

            <button class="sumar" 
            data-id="${item.id}" 
            data-color="${item.color}" 
            data-talle="${item.talle}">+</button>

            <button class="eliminar" 
        data-id="${item.id}" 
        data-color="${item.color}" 
        data-talle="${item.talle}">
        ELIMINAR
        </button>
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

function crearFactura (nombre, calle, altura, metodo) {
   

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
            <p><strong>Total: </strong> $${total}</p>
            <p><strong>Metodo de pago :</strong> ${metodo}</p>
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
        <div class="radio-pago" style="text-align:left;">
            <label><input type="radio" name="metodo" value="efectivo"> Efectivo 💵</label>
            <label><input type="radio" name="metodo" value="transferencia"> Transferencia 🏦</label>
            <label><input type="radio" name="metodo" value="tarjeta"> Tarjeta 💳</label>
        </div>

        <div id="datosTarjeta" style="display:none;">
            <input id="numeroTarjeta" class="swal2-input" placeholder="Numero de tarjeta :">
            <input id="cvv" class="swal2-input" placeholder="CVV :">
        </div>

         <div id="datosTransferencia" style="display:none; margin-top:10px;">
            <p><sstrong>Alias para transferencia :</strong></p>
            <p>mi.negocio.clothing</p>
            <p>BANCO SASNTANDER RIO</p>
        </div>

        <div id="datosEfectivo" style="display:none; margin-top:10px;">
            <p><sstrong>Datos para efectivo</strong></p>
            <p>Acerquese al Rapipago mas cercano con este numero</p>
            <p>00002323204242</p>
            <p>(Puede tardar 24hs habiles en acreditarse)</p>
        </div>
        `,
        confirmButtonText: "Generar factura",
        focusConfirm: false,
        didOpen: () => {

                const radios = document.querySelectorAll('input[name="metodo"]');
                const datosTarjeta = document.getElementById("datosTarjeta");

                radios.forEach(radio => {
                    radio.addEventListener("change", () => {
                        switch(radio.value){
                            case "tarjeta":
                                datosTarjeta.style.display = "block";
                                datosTransferencia.style.display = "none";
                                datosEfectivo.style.display = "none";
                                break;
                                
                             case "transferencia":
                                datosTransferencia.style.display = "block";
                                datosTarjeta.style.display = "none";
                                datosEfectivo.style.display = "none";
                                
                                break;

                            case "efectivo":
                                datosEfectivo.style.display = "block";
                                datosTransferencia.style.display = "none";
                                datosTarjeta.style.display = "none";
                                break;
                        }
                    });
                });

            },
        preConfirm: () => {
            const nombre = document.getElementById("swal-nombre").value.trim();
            const calle = document.getElementById("swal-calle").value.trim();
            const altura = document.getElementById("swal-altura").value.trim();
            const metodo = Swal.getPopup().querySelector('input[name="metodo"]:checked')?.value;
            const numeroTarjeta = document.getElementById("numeroTarjeta")?.value;
            const cvv = document.getElementById("cvv")?.value;

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

            if (!metodo) {
                Swal.showValidationMessage("Seleccione un metodo de pago");
                return false;
            }
            if (metodo === "tarjeta") {
                if (!numeroTarjeta || !cvv) {
                    Swal.showValidationMessage("Es obligatorio introducir los datos de la tarjeta")
                    return false;
                    }

                if (!/^\d{16}$/.test(numeroTarjeta)) {
                    Swal.showValidationMessage("El numero de tarjeta solo debe tener 16 numeros")
                    return false;
                }

                if (!/^\d{3,4}$/.test(cvv)) {
                    Swal.showValidationMessage("El numero de seguridad solo debe tener numeros y ser menor a 5 digitos")
                    return false;
                }
            

            return{ nombre, calle, altura, metodo };

        }
    }
    }).then((result) => {

        if (result.isConfirmed){
        const { nombre, calle, altura, metodo } = result.value;
        
        crearFactura (nombre,calle, altura, metodo);
        }
    });

    
});



renderCarrito();


