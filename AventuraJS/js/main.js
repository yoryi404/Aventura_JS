import Jugador from "./clases/Jugador.js";
import { PRODUCTOS, ENEMIGOS, JEFES } from "./constants.js";
import { showScene } from "./util.js";
import { combate } from "./moduloBatalla.js";
import { distinguirJugador } from "./moduloRanking.js";

export const jugador = new Jugador("Marilynn", "./AventuraJS/characters/Personaje_Principal.png");
window.jugador = jugador;

let enemigosActuales = [];
let enemigoActualIndex = 0;
let enemigosDerrotados = 0;
let jefesDerrotados = 0;

document.addEventListener("DOMContentLoaded", () => {
    inicializarEscena1();
    
    document.getElementById("btn-to-scene-2")?.addEventListener("click", () => {
        cargarMercado();
        showScene("scene-2");
    });

    document.getElementById("btn-to-scene-3")?.addEventListener("click", () => {
        if (jugador.inventario.length === 0) {
            alert("¡Debes comprar al menos un objeto!");
            return;
        }
        actualizarEscena3();
        showScene("scene-3");
    });

    document.getElementById("btn-to-scene-4")?.addEventListener("click", () => {
        cargarEnemigos();
        showScene("scene-4");
    });

    document.getElementById("btn-to-scene-5")?.addEventListener("click", () => {
        iniciarBatallas();
        showScene("scene-5");
    });

    document.getElementById("btn-restart")?.addEventListener("click", () => {
        reiniciarJuego();
    });
});

function inicializarEscena1() {
    document.getElementById("ataque-inicial").textContent = jugador.obtenerAtaqueTotal();
    document.getElementById("defensa-inicial").textContent = jugador.obtenerDefensaTotal();
    document.getElementById("puntos-inicial").textContent = jugador.puntos;
    document.getElementById("vida-inicial").textContent = jugador.vida;
}

function cargarMercado() {
    const productosGrid = document.getElementById("productos-grid");
    productosGrid.innerHTML = "";

    const rarezas = ["Común", "Rara", "Épica", "Legendaria"];
    const rarezaDescuento = rarezas[Math.floor(Math.random() * rarezas.length)];

    PRODUCTOS.forEach((prod, index) => {
        const productoDiv = document.createElement("div");
        productoDiv.classList.add("img-store");

        let precioFinal = prod.rareza === rarezaDescuento ? Math.floor(prod.precio * 0.8) : prod.precio;

        productoDiv.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}">
            <p class="nombre-producto">${prod.nombre}</p>
            <p class="precio-producto">${(precioFinal / 100).toFixed(2)}€</p>
            <button data-index="${index}">Comprar</button>
        `;

        productosGrid.appendChild(productoDiv);
    });

    inicializarBotonesCompra();
}

function inicializarBotonesCompra() {
    document.querySelectorAll("#productos-grid .img-store button").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            comprarProducto(parseInt(btn.dataset.index), btn);
        });
    });
}

function comprarProducto(index, boton) {
    const producto = PRODUCTOS[index];
    if (!producto) return;

    const tarjeta = boton.closest(".img-store");

    if (tarjeta.classList.contains("added")) {
        const indiceInventario = jugador.inventario.findIndex(p => p.nombre === producto.nombre);
        if (indiceInventario > -1) jugador.inventario.splice(indiceInventario, 1);

        tarjeta.classList.remove("added");
        boton.textContent = "Comprar";
        quitarDelFooter(producto.nombre);
    } else {
        jugador.añadirProducto(producto);
        tarjeta.classList.add("added");
        boton.textContent = "Retirar";
        agregarAlFooter(producto);
    }
}

function agregarAlFooter(producto) {
    const item = document.createElement("div");
    item.classList.add("item");
    item.dataset.nombre = producto.nombre;

    const img = document.createElement("img");
    img.src = producto.imagen;
    img.alt = producto.nombre;

    item.appendChild(img);
    document.getElementById("inventory-container").appendChild(item);
}

function quitarDelFooter(nombreProducto) {
    const item = document.getElementById("inventory-container").querySelector(`[data-nombre="${nombreProducto}"]`);
    if (item) item.remove();
}

function actualizarEscena3() {
    document.getElementById("ataque-total").textContent = jugador.obtenerAtaqueTotal();
    document.getElementById("defensa-total").textContent = jugador.obtenerDefensaTotal();
    document.getElementById("vida-total").textContent = jugador.obtenerVidaTotal();

    const inventoryDisplay = document.getElementById("inventory-display");
    inventoryDisplay.innerHTML = "";

    jugador.inventario.forEach(producto => {
        const item = document.createElement("div");
        item.classList.add("item");

        const img = document.createElement("img");
        img.src = producto.imagen;
        img.alt = producto.nombre;
        img.title = `${producto.nombre} (+${producto.bonus} ${producto.tipo})`;

        item.appendChild(img);
        inventoryDisplay.appendChild(item);
    });
}

function cargarEnemigos() {
    enemigosActuales = [...ENEMIGOS, ...JEFES];
    const enemigosGrid = document.getElementById("enemigos-grid");
    enemigosGrid.innerHTML = "";

    enemigosActuales.forEach((enemigo) => {
        const enemigoCard = document.createElement("div");
        enemigoCard.classList.add("enemy-card");
        
        if (JEFES.some(j => j.nombre === enemigo.nombre)) {
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
    });
}

function iniciarBatallas() {
    enemigoActualIndex = 0;
    enemigosDerrotados = 0;
    jefesDerrotados = 0;
    iniciarBatallaConEnemigo(0);
}

function iniciarBatallaConEnemigo(index) {
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
    
    document.getElementById("battle-log").innerHTML = "";
    document.getElementById("battle-result").classList.add("hidden");
    document.getElementById("btn-continue-battle").classList.add("hidden");
    document.getElementById("btn-to-scene-6").classList.add("hidden");
    
    setTimeout(() => {
        const resultado = combate(enemigo, jugador);
        mostrarResultadoBatalla(resultado, enemigo);
    }, 500);
}
