import Jugador from "./clases/Jugador.js";
import { PRODUCTOS, ENEMIGOS, JEFES } from "./constants.js";
import { showScene } from "./util.js";
import { combate } from "./moduloBatalla.js";
import { distinguirJugador } from "./moduloRanking.js";

// Jugador principal
export const jugador = new Jugador("Marilynn", "./AventuraJS/characters/Personaje_Principal.png");
window.jugador = jugador;

// Variables globales
let enemigosActuales = [];
let enemigoActualIndex = 0;
let enemigosDerrotados = 0;
let jefesDerrotados = 0;

document.addEventListener("DOMContentLoaded", function() {
    inicializarEscena1();
    
    // Escena 1 --> Escena 2
    const botonEscena2 = document.getElementById("btn-to-scene-2");
    if (botonEscena2) {
        botonEscena2.addEventListener("click", function() {
            cargarMercado();
            showScene("scene-2");
        });
    }

    // Escena 2 --> Escena 3
    const botonEscena3 = document.getElementById("btn-to-scene-3");
    if (botonEscena3) {
        botonEscena3.addEventListener("click", function() {
            if (jugador.inventario.length === 0) {
                alert("¡Debes comprar al menos un objeto!");
                return;
            }
            actualizarEscena3();
            showScene("scene-3");
        });
    }

    // Escena 3 --> Escena 4
    const botonEscena4 = document.getElementById("btn-to-scene-4");
    if (botonEscena4) {
        botonEscena4.addEventListener("click", function() {
            cargarEnemigos();
            showScene("scene-4");
        });
    }

    // Escena 4 --> Escena 5
    const botonEscena5 = document.getElementById("btn-to-scene-5");
    if (botonEscena5) {
        botonEscena5.addEventListener("click", function() {
            iniciarBatallas();
            showScene("scene-5");
        });
    }

    // Boton reiniciar juego
    const botonReiniciar = document.getElementById("btn-restart");
    if (botonReiniciar) {
        botonReiniciar.addEventListener("click", function() {
            reiniciarJuego();
        });
    }
});

// Estadisticas personaje principal
function inicializarEscena1() {
    document.getElementById("ataque-inicial").textContent = jugador.obtenerAtaqueTotal();
    document.getElementById("defensa-inicial").textContent = jugador.obtenerDefensaTotal();
    document.getElementById("puntos-inicial").textContent = jugador.puntos;
    document.getElementById("vida-inicial").textContent = jugador.vida;
}

// Carga todos los productos en el mercado
function cargarMercado() {
    const productosGrid = document.getElementById("productos-grid");
    productosGrid.innerHTML = "";

    const rarezas = ["Común", "Rara", "Épica", "Legendaria"];
    const numeroAleatorio = Math.floor(Math.random() * rarezas.length);
    const rarezaDescuento = rarezas[numeroAleatorio];

    // Recorrer cada producto y crear su tarjeta
    for (let i = 0; i < PRODUCTOS.length; i++) {
        const producto = PRODUCTOS[i];
        
        const productoDiv = document.createElement("div");
        productoDiv.classList.add("img-store");

        // Calcular el precio final
        let precioFinal = producto.precio;
        if (producto.rareza === rarezaDescuento) {
            precioFinal = Math.floor(producto.precio * 0.8);
        }

        // Convertir céntimos a euros
        const precioEnEuros = (precioFinal / 100).toFixed(2);

        // Crear el HTML de la tarjeta del producto
        productoDiv.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <p class="nombre-producto">${producto.nombre}</p>
            <p class="precio-producto">${precioEnEuros}€</p>
            <button data-index="${i}">Comprar</button>
        `;

        productosGrid.appendChild(productoDiv);
    }

    inicializarBotonesCompra();
}

// Evento de click a todos los botones de compra
function inicializarBotonesCompra() {
    const botones = document.querySelectorAll("#productos-grid .img-store button");

    for (let i = 0; i < botones.length; i++) {
        const boton = botones[i];
        boton.addEventListener("click", function(evento) {
            evento.preventDefault();
            const index = parseInt(boton.dataset.index);
            comprarProducto(index, boton);
        });
    }
}

function comprarProducto(index, boton) {
    const producto = PRODUCTOS[index];
    
    if (!producto) {
        return;
    }

    const tarjeta = boton.closest(".img-store");

    // Si ya esta comprado, lo quito
    if (tarjeta.classList.contains("added")) {
        // Busco el producto en el inventario
        let posicionEnInventario = -1;
        for (let i = 0; i < jugador.inventario.length; i++) {
            if (jugador.inventario[i].nombre === producto.nombre) {
                posicionEnInventario = i;
                break;
            }
        }
        
        // Si lo encontramos, lo elimino
        if (posicionEnInventario !== -1) {
            jugador.inventario.splice(posicionEnInventario, 1);
        }

        // Cambiar la apariencia de la tarjeta
        tarjeta.classList.remove("added");
        boton.textContent = "Comprar";

        // Quitar del carrito visual
        quitarDelFooter(producto.nombre);
    } else {
        // Si no esta comprado, lo añado
        jugador.añadirProducto(producto);

        // Cambiar la apariencia de la tarjeta
        tarjeta.classList.add("added");
        boton.textContent = "Retirar";

        // Mostrar en el carrito visual
        agregarAlFooter(producto);
    }
}

// Muestra un producto en el carrito del footer
function agregarAlFooter(producto) {
    const inventario = document.getElementById("inventory-container");

    const item = document.createElement("div");
    item.classList.add("item");
    item.dataset.nombre = producto.nombre;

    const img = document.createElement("img");
    img.src = producto.imagen;
    img.alt = producto.nombre;

    item.appendChild(img);
    inventario.appendChild(item);
}

// Quita un producto del carrito del footer
function quitarDelFooter(nombreProducto) {
    const inventario = document.getElementById("inventory-container");
    const item = inventario.querySelector(`[data-nombre="${nombreProducto}"]`);
    
    if (item) {
        item.remove();
    }
}

// Actualiza las estadisticas de la escena 3
function actualizarEscena3() {
    document.getElementById("ataque-total").textContent = jugador.obtenerAtaqueTotal();
    document.getElementById("defensa-total").textContent = jugador.obtenerDefensaTotal();
    document.getElementById("vida-total").textContent = jugador.obtenerVidaTotal();

    const inventoryDisplay = document.getElementById("inventory-display");
    inventoryDisplay.innerHTML = "";

    // Mostrar cada producto del inventario
    for (let i = 0; i < jugador.inventario.length; i++) {
        const producto = jugador.inventario[i];
        
        const item = document.createElement("div");
        item.classList.add("item");

        const img = document.createElement("img");
        img.src = producto.imagen;
        img.alt = producto.nombre;
        img.title = producto.nombre + " (+" + producto.bonus + " " + producto.tipo + ")";

        item.appendChild(img);
        inventoryDisplay.appendChild(item);
    }
}

// Carga y muestra todos los enemigos en la escena 4
function cargarEnemigos() {
    // Juntar enemigos normales y jefes en un solo array
    enemigosActuales = [];
    
    for (let i = 0; i < ENEMIGOS.length; i++) {
        enemigosActuales.push(ENEMIGOS[i]);
    }
    
    for (let i = 0; i < JEFES.length; i++) {
        enemigosActuales.push(JEFES[i]);
    }

    const enemigosGrid = document.getElementById("enemigos-grid");
    enemigosGrid.innerHTML = "";

    // Crear tarjeta para cada enemigo
    for (let i = 0; i < enemigosActuales.length; i++) {
        const enemigo = enemigosActuales[i];
        
        const enemigoCard = document.createElement("div");
        enemigoCard.classList.add("enemy-card");
        
        // Verificar si es un jefe
        let esJefe = false;
        for (let j = 0; j < JEFES.length; j++) {
            if (JEFES[j].nombre === enemigo.nombre) {
                esJefe = true;
                break;
            }
        }
        
        if (esJefe) {
            enemigoCard.classList.add("boss");
        }

        enemigoCard.innerHTML = `
            <img src="${enemigo.avatar}" alt="${enemigo.nombre}">
            <h3>${enemigo.nombre}</h3>
            <div class="enemy-stats">
                <div class="enemy-stat"><span>Ataque:</span><span>${enemigo.nivelAtaque}</span></div>
                <div class="enemy-stat"><span>Vida:</span><span>${enemigo.vida}</span></div>
            </div>
        `;

        enemigosGrid.appendChild(enemigoCard);
    }
}

// Reinicia los contadores y empieza la primera batalla
function iniciarBatallas() {
    enemigoActualIndex = 0;
    enemigosDerrotados = 0;
    jefesDerrotados = 0;
    iniciarBatallaConEnemigo(0);
}

// Prepara y ejecuta una batalla contra un enemigo específico
function iniciarBatallaConEnemigo(index) {

    // Si ya no quedan enemigos muetra resultado final
    if (index >= enemigosActuales.length) {
        mostrarResultadoFinal();
        return;
    }
    
    const enemigo = enemigosActuales[index];
    
    document.getElementById("jugador-combate-nombre").textContent = jugador.nombre;
    document.getElementById("jugador-combate-avatar").src = jugador.avatar;
    document.getElementById("enemigo-combate-nombre").textContent = enemigo.nombre;
    document.getElementById("enemigo-combate-avatar").src = enemigo.avatar;
    
    const vidaTotal = jugador.obtenerVidaTotal();
    actualizarBarraVida("player", vidaTotal, vidaTotal);
    actualizarBarraVida("enemy", enemigo.vida, enemigo.vida);
    
    // Limpiar elementos anteriores
    document.getElementById("battle-log").innerHTML = "";
    document.getElementById("battle-result").classList.add("hidden");
    document.getElementById("btn-continue-battle").classList.add("hidden");
    document.getElementById("btn-to-scene-6").classList.add("hidden");
    
    // Reiniciar y activar las animaciones de entrada
    const jugadorCombate = document.getElementById("jugador-combate");
    const enemigoCombate = document.getElementById("enemigo-combate");

    jugadorCombate.style.animation = "none";
    enemigoCombate.style.animation = "none";

    setTimeout(function() {
        jugadorCombate.style.animation = "slideInLeft 0.8s ease-out";
        enemigoCombate.style.animation = "slideInRight 0.8s ease-out";
    }, 10);

    setTimeout(function() {
        const resultado = combate(enemigo, jugador);
        mostrarResultadoBatalla(resultado, enemigo);
    }, 1300);
}

// Muestra el resultado de la batalla
function mostrarResultadoBatalla(resultado, enemigo) {
    const battleResult = document.getElementById("battle-result");
    
    // Si el jugador gana
    if (resultado.ganador === "jugador") {
        jugador.sumarPuntos(resultado.puntos);
        
        // Verificar si el enemigo derrotado era un jefe
        let esJefe = false;
        for (let i = 0; i < JEFES.length; i++) {
            if (JEFES[i].nombre === enemigo.nombre) {
                esJefe = true;
                break;
            }
        }
        
        if (esJefe) {
            jefesDerrotados = jefesDerrotados + 1;
        } else {
            enemigosDerrotados = enemigosDerrotados + 1;
        }
        
        // Actualizar barra de vida del enemigo a 0
        actualizarBarraVida("enemy", 0, enemigo.vida);
        
        // Mostrar mensaje de victoria
        battleResult.classList.remove("hidden");
        battleResult.classList.remove("defeat");
        battleResult.innerHTML = `
            <h2>¡Victoria!</h2>
            <p>Has derrotado a ${enemigo.nombre}</p>
            <p>+${resultado.puntos} puntos</p>
            <p>Puntuación total: ${jugador.puntos}</p>
        `;
        
        // Pasar al siguiente enemigo
        enemigoActualIndex = enemigoActualIndex + 1;
        
        // Verificar si quedan más enemigos
        if (enemigoActualIndex < enemigosActuales.length) {
            // Mostrar botón para continuar a la siguiente batalla
            const btnContinue = document.getElementById("btn-continue-battle");
            btnContinue.classList.remove("hidden");
            btnContinue.onclick = function() {
                btnContinue.classList.add("hidden");
                iniciarBatallaConEnemigo(enemigoActualIndex);
            };
        } else {
            const btnFinal = document.getElementById("btn-to-scene-6");
            btnFinal.classList.remove("hidden");
            btnFinal.onclick = function() {
                mostrarResultadoFinal();
            };
        }
    } else {
        // Si el jugador pierde
        actualizarBarraVida("player", 0, jugador.obtenerVidaTotal());
        
        battleResult.classList.remove("hidden");
        battleResult.classList.add("defeat");
        battleResult.innerHTML = `
            <h2>Derrota...</h2>
            <p>Has sido derrotado por ${enemigo.nombre}</p>
            <p>Puntuación final: ${jugador.puntos}</p>
        `;
        
        // Mostrar boton para ir al resultado final
        const btnFinal = document.getElementById("btn-to-scene-6");
        btnFinal.classList.remove("hidden");
        btnFinal.onclick = function() {
            mostrarResultadoFinal();
        };
    }
}

// Actualiza la barra de vida y el texto de un combatiente
function actualizarBarraVida(tipo, vidaActual, vidaMaxima) {
    // Calcular el porcentaje de vida
    let porcentaje = (vidaActual / vidaMaxima) * 100;
    
    if (porcentaje < 0) {
        porcentaje = 0;
    }
    
    // Actualizar la barra visual
    document.getElementById(tipo + "-health-bar").style.width = porcentaje + "%";
    
    // Actualizar el texto
    let vidaMostrar = Math.floor(vidaActual);
    if (vidaMostrar < 0) {
        vidaMostrar = 0;
    }
    
    document.getElementById(tipo + "-combat-health").textContent = vidaMostrar + " / " + vidaMaxima;
}

// Muestra la pantalla final con el rango del jugador
function mostrarResultadoFinal() {
    showScene("scene-6");
    
    // Calcular el rango del jugador
    const rango = distinguirJugador(jugador.puntos);
    
    // Actualizar los datos en pantalla
    document.getElementById("player-rank").textContent = rango.toUpperCase();
    document.getElementById("final-points").textContent = jugador.puntos;
    document.getElementById("enemies-defeated").textContent = enemigosDerrotados;
    document.getElementById("bosses-defeated").textContent = jefesDerrotados;
    
    // Cambiar el estilo según el rango
    const rankDisplay = document.getElementById("mostrar-rango");
    
    if (rango === "Novato") {
        rankDisplay.classList.add("novato");
    } else {
        rankDisplay.classList.remove("novato");
        lanzarConfeti();
    }
}

// Confeti
function lanzarConfeti() {
    const duracion = 1500;
    const fin = Date.now() + duracion;

    const intervalo = setInterval(function() {
        if (Date.now() > fin) {
            clearInterval(intervalo);
            return;
        }

        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
        });
    }, 250);
}

// Reinicia el juego a su estado inicial
function reiniciarJuego() {
    jugador.reiniciar();
    document.getElementById("inventory-container").innerHTML = "";
    inicializarEscena1();
    showScene("scene-1");
}