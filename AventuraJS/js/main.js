import Jugador from "./clases/Jugador.js";
import { PRODUCTOS, ENEMIGOS, JEFES } from "./constants.js";
import { showScene } from "./util.js";
import { combate } from "./moduloBatalla.js";
import { distinguirJugador } from "./moduloRanking.js";

export let jugador = null;
let enemigosActuales = [];
let enemigoActualIndex = 0;
let enemigosDerrotados = 0;
let jefesDerrotados = 0;

document.addEventListener("DOMContentLoaded", function () {

    inicializarFormulario();

    const btnEscena2 = document.getElementById("btn-to-scene-2");
    if (btnEscena2) {
        btnEscena2.addEventListener("click", function () {
            cargarMercado();
            showScene("scene-2");
        });
    }

    const btnEscena3 = document.getElementById("btn-to-scene-3");
    if (btnEscena3) {
        btnEscena3.addEventListener("click", function () {
            if (jugador.inventario.length === 0) {
                alert("¡Debes comprar al menos un objeto!");
                return;
            }
            actualizarEscena3();
            showScene("scene-3");
        });
    }

    const btnEscena4 = document.getElementById("btn-to-scene-4");
    if (btnEscena4) {
        btnEscena4.addEventListener("click", function () {
            cargarEnemigos();
            showScene("scene-4");
        });
    }

    const btnEscena5 = document.getElementById("btn-to-scene-5");
    if (btnEscena5) {
        btnEscena5.addEventListener("click", function () {
            iniciarBatallas();
            showScene("scene-5");
        });
    }

    const btnRanking = document.getElementById("btn-to-ranking");
    if (btnRanking) {
        btnRanking.addEventListener("click", function () {
            mostrarRanking();
            showScene("scene-7");
        });
    }

    const btnReiniciar = document.getElementById("btn-restart");
    if (btnReiniciar) {
        btnReiniciar.addEventListener("click", function () {
            reiniciarJuego();
        });
    }
});

function inicializarFormulario() {
    const form = document.getElementById("form-personaje");
    const nombreInput = document.getElementById("nombre-personaje");
    const ataqueInput = document.getElementById("ataque-personaje");
    const defensaInput = document.getElementById("defensa-personaje");
    const vidaInput = document.getElementById("vida-personaje");
    const errorNombre = document.getElementById("error-nombre");

    const botones = document.querySelectorAll(".btn-control");
    for (let i = 0; i < botones.length; i++) {
        botones[i].addEventListener("click", function () {
            const accion = this.dataset.action;
            const objetivo = this.dataset.target;

            let ataque = parseInt(ataqueInput.value);
            let defensa = parseInt(defensaInput.value);
            let vida = parseInt(vidaInput.value);
            let total = ataque + defensa + vida;

            if (accion === "increase") {
                if (total >= 110) {
                    alert("No tienes más puntos disponibles");
                    return;
                }

                if (objetivo === "ataque") ataque++;
                else if (objetivo === "defensa") defensa++;
                else if (objetivo === "vida") vida++;
            } else {
                if (objetivo === "ataque" && ataque > 0) ataque--;
                else if (objetivo === "defensa" && defensa > 0) defensa--;
                else if (objetivo === "vida" && vida > 100) vida--;
            }

            ataqueInput.value = ataque;
            defensaInput.value = defensa;
            vidaInput.value = vida;

            total = ataque + defensa + vida;
            document.getElementById("total-asignado").textContent = total;
            document.getElementById("puntos-disponibles").textContent = 110 - total;
        });
    }

    nombreInput.addEventListener("input", function () {
        const nombre = nombreInput.value.trim();
        const regex = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ\s]{0,19}$/;

        if (nombre && !regex.test(nombre)) {
            errorNombre.textContent = "Primera letra mayúscula, solo letras y espacios (máx. 20)";
        } else {
            errorNombre.textContent = "";
        }
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const nombre = nombreInput.value.trim();
        const ataque = parseInt(ataqueInput.value);
        const defensa = parseInt(defensaInput.value);
        const vida = parseInt(vidaInput.value);
        const regex = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ\s]{0,19}$/;

        if (!nombre || /^\s+$/.test(nombre)) {
            alert("El nombre no puede estar vacío");
            return;
        }

        if (!regex.test(nombre)) {
            alert("El nombre debe empezar con mayúscula");
            return;
        }

        if (ataque + defensa + vida !== 110) {
            alert("Debes asignar exactamente 10 puntos");
            return;
        }

        jugador = new Jugador(nombre, "./AventuraJS/characters/Personaje_Principal.png");
        jugador.ataqueBase = ataque;
        jugador.defensaBase = defensa;
        jugador.vida = vida;
        jugador.vidaMaxima = vida;

        document.querySelector("#jugador-escena-1 h2").textContent = nombre;
        document.getElementById("ataque-inicial").textContent = ataque;
        document.getElementById("defensa-inicial").textContent = defensa;
        document.getElementById("vida-inicial").textContent = vida;
        document.getElementById("dinero-jugador").textContent = jugador.dinero;

        showScene("scene-1");
    });
}

function cargarMercado() {
    const productosGrid = document.getElementById("productos-grid");
    productosGrid.innerHTML = "";

    for (let i = 0; i < PRODUCTOS.length; i++) {
        const producto = PRODUCTOS[i];
        const div = document.createElement("div");
        div.classList.add("img-store");

        const precio = producto.precio;
        const precioEuros = precio;

        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <p class="nombre-producto">${producto.nombre}</p>
            <p class="precio-producto">${precioEuros}€</p>
            <button data-index="${i}" data-precio="${precio}">Comprar</button>
        `;

        productosGrid.appendChild(div);
    }

    const botones = productosGrid.querySelectorAll("button");
    for (let i = 0; i < botones.length; i++) {
        botones[i].addEventListener("click", function () {
            const index = parseInt(this.dataset.index);
            const precio = parseInt(this.dataset.precio);
            const producto = PRODUCTOS[index];
            const tarjeta = this.closest(".img-store");

            if (tarjeta.classList.contains("added")) {
                let pos = -1;
                for (let j = 0; j < jugador.inventario.length; j++) {
                    if (jugador.inventario[j].nombre === producto.nombre) {
                        pos = j;
                        break;
                    }
                }

                if (pos !== -1) {
                    jugador.inventario.splice(pos, 1);
                    jugador.dinero = jugador.dinero + precio;
                    document.getElementById("dinero-jugador").textContent = jugador.dinero;
                }

                tarjeta.classList.remove("added");
                this.textContent = "Comprar";

                const item = document.querySelector('[data-nombre="' + producto.nombre + '"]');
                if (item) item.remove();
            } else {
                if (jugador.dinero < precio) {
                    alert("¡No tienes suficiente dinero!");
                    return;
                }

                jugador.añadirProducto(producto);
                jugador.dinero = jugador.dinero - precio;
                document.getElementById("dinero-jugador").textContent = jugador.dinero;

                tarjeta.classList.add("added");
                this.textContent = "Retirar";

                const item = document.createElement("div");
                item.classList.add("item");
                item.dataset.nombre = producto.nombre;
                item.innerHTML = '<img src="' + producto.imagen + '" alt="' + producto.nombre + '">';
                document.getElementById("inventory-container").appendChild(item);
            }
        });
    }
}

function actualizarEscena3() {
    document.querySelector("#jugador-escena-3 h2").textContent = jugador.nombre;
    document.getElementById("ataque-total").textContent = jugador.obtenerAtaqueTotal();
    document.getElementById("defensa-total").textContent = jugador.obtenerDefensaTotal();
    document.getElementById("vida-total").textContent = jugador.obtenerVidaTotal();

    const display = document.getElementById("inventory-display");
    display.innerHTML = "";

    for (let i = 0; i < jugador.inventario.length; i++) {
        const producto = jugador.inventario[i];
        const item = document.createElement("div");
        item.classList.add("item");
        item.innerHTML = '<img src="' + producto.imagen + '" alt="' + producto.nombre + '" title="' + producto.nombre + ' (+' + producto.bonus + ' ' + producto.tipo + ')">';
        display.appendChild(item);
    }
}

function cargarEnemigos() {
    enemigosActuales = [];

    for (let i = 0; i < ENEMIGOS.length; i++) {
        enemigosActuales.push(ENEMIGOS[i]);
    }

    for (let i = 0; i < JEFES.length; i++) {
        enemigosActuales.push(JEFES[i]);
    }

    const grid = document.getElementById("enemigos-grid");
    grid.innerHTML = "";

    for (let i = 0; i < enemigosActuales.length; i++) {
        const enemigo = enemigosActuales[i];
        const card = document.createElement("div");
        card.classList.add("enemy-card");

        let esJefe = false;
        for (let j = 0; j < JEFES.length; j++) {
            if (JEFES[j].nombre === enemigo.nombre) {
                esJefe = true;
                break;
            }
        }

        if (esJefe) card.classList.add("boss");

        card.innerHTML = `
            <img src="${enemigo.avatar}" alt="${enemigo.nombre}">
            <h3>${enemigo.nombre}</h3>
            <div class="enemy-stats">
                <div class="enemy-stat"><span>Ataque:</span><span>${enemigo.nivelAtaque}</span></div>
                <div class="enemy-stat"><span>Vida:</span><span>${enemigo.vida}</span></div>
            </div>
        `;

        grid.appendChild(card);
    }
}

function iniciarBatallas() {
    enemigoActualIndex = 0;
    enemigosDerrotados = 0;
    jefesDerrotados = 0;
    iniciarBatalla(0);
}

function iniciarBatalla(index) {
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

    document.getElementById("battle-result").classList.add("hidden");
    document.getElementById("btn-continue-battle").classList.add("hidden");
    document.getElementById("btn-to-scene-6").classList.add("hidden");

    setTimeout(function () {
        const resultado = combate(enemigo, jugador);
        mostrarResultado(resultado, enemigo);
    }, 1300);
}

function mostrarResultado(resultado, enemigo) {
    const battleResult = document.getElementById("battle-result");

    if (resultado.ganador === "jugador") {
        jugador.sumarPuntos(resultado.puntos);

        const monedas = Math.floor(Math.random() * 50) + 30;
        jugador.dinero = jugador.dinero + monedas;
        document.getElementById("dinero-jugador").textContent = jugador.dinero;

        mostrarAnimacionMonedas();

        let esJefe = false;
        for (let i = 0; i < JEFES.length; i++) {
            if (JEFES[i].nombre === enemigo.nombre) {
                esJefe = true;
                break;
            }
        }

        if (esJefe) {
            jefesDerrotados++;
        } else {
            enemigosDerrotados++;
        }

        actualizarBarraVida("enemy", 0, enemigo.vida);

        battleResult.classList.remove("hidden", "defeat");
        battleResult.innerHTML = `
            <h2>¡Victoria!</h2>
            <p>Has derrotado a ${enemigo.nombre}</p>
            <p>+${resultado.puntos} puntos</p>
            <p>+${monedas} monedas</p>
        `;

        enemigoActualIndex++;

        if (enemigoActualIndex < enemigosActuales.length) {
            const btn = document.getElementById("btn-continue-battle");
            btn.classList.remove("hidden");
            btn.onclick = function () {
                btn.classList.add("hidden");
                iniciarBatalla(enemigoActualIndex);
            };
        } else {
            const btn = document.getElementById("btn-to-scene-6");
            btn.classList.remove("hidden");
            btn.onclick = function () {
                mostrarResultadoFinal();
            };
        }
    } else {
        actualizarBarraVida("player", 0, jugador.obtenerVidaTotal());

        battleResult.classList.remove("hidden");
        battleResult.classList.add("defeat");
        battleResult.innerHTML = `
            <h2>Derrota...</h2>
            <p>Has sido derrotado por ${enemigo.nombre}</p>
            <p>Puntuación final: ${jugador.puntos}</p>
        `;

        const btn = document.getElementById("btn-to-scene-6");
        btn.classList.remove("hidden");
        btn.onclick = function () {
            mostrarResultadoFinal();
        };
    }
}

function actualizarBarraVida(tipo, actual, maxima) {
    let porcentaje = (actual / maxima) * 100;
    if (porcentaje < 0) porcentaje = 0;

    document.getElementById(tipo + "-health-bar").style.width = porcentaje + "%";

    let vidaMostrar = Math.floor(actual);
    if (vidaMostrar < 0) vidaMostrar = 0;

    document.getElementById(tipo + "-combat-health").textContent = vidaMostrar + " / " + maxima;
}

function mostrarAnimacionMonedas() {
    const animacion = document.getElementById("monedas-animacion");
    animacion.classList.remove("hidden");

    setTimeout(function () {
        animacion.classList.add("hidden");
    }, 3000);
}

function mostrarResultadoFinal() {
    showScene("scene-6");

    const rango = distinguirJugador(jugador.puntos);

    document.getElementById("player-rank").textContent = rango.toUpperCase();
    document.getElementById("final-points").textContent = jugador.puntos;
    document.getElementById("enemies-defeated").textContent = enemigosDerrotados;
    document.getElementById("bosses-defeated").textContent = jefesDerrotados;
    document.getElementById("final-money").textContent = jugador.dinero;

    const rankDisplay = document.getElementById("mostrar-rango");
    if (rango === "Novato") {
        rankDisplay.classList.add("novato");
    } else {
        rankDisplay.classList.remove("novato");
        lanzarConfeti();
    }

    guardarEnRanking();
}

function lanzarConfeti() {
    const duracion = 1500;
    const fin = Date.now() + duracion;

    const intervalo = setInterval(function () {
        if (Date.now() > fin) {
            clearInterval(intervalo);
            return;
        }
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }, 250);
}

function guardarEnRanking() {
    let ranking = [];
    const datos = localStorage.getItem("rankingAventuraJS");

    if (datos) {
        ranking = JSON.parse(datos);
    }

    ranking.push({
        nombre: jugador.nombre,
        puntos: jugador.puntos,
        monedas: jugador.dinero
    });

    ranking.sort(function (a, b) {
        return b.puntos - a.puntos;
    });

    if (ranking.length > 20) {
        ranking = ranking.slice(0, 20);
    }

    localStorage.setItem("rankingAventuraJS", JSON.stringify(ranking));
}

function mostrarRanking() {
    let ranking = [];
    const datos = localStorage.getItem("rankingAventuraJS");

    if (datos) {
        ranking = JSON.parse(datos);
    }

    // AÑADIR DATOS SIMULADOS SI NO HAY NINGUNO
    if (ranking.length === 0) {
        ranking = [
            { nombre: "Alex Knight", puntos: 950, monedas: 750 },
            { nombre: "María Tech", puntos: 890, monedas: 680 },
            { nombre: "Carlos Cyber", puntos: 850, monedas: 620 }
        ];
    }

    const tbody = document.getElementById("ranking-body");
    tbody.innerHTML = "";

    for (let i = 0; i < ranking.length; i++) {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${i + 1}</td>
            <td>${ranking[i].nombre}</td>
            <td>${ranking[i].puntos}</td>
            <td>${ranking[i].monedas}</td>
        `;
        tbody.appendChild(fila);
    }
}
function reiniciarJuego() {
    jugador = null;

    document.getElementById("inventory-container").innerHTML = "";
    document.getElementById("nombre-personaje").value = "";
    document.getElementById("ataque-personaje").value = "0";
    document.getElementById("defensa-personaje").value = "0";
    document.getElementById("vida-personaje").value = "100";
    document.getElementById("puntos-disponibles").textContent = "10";
    document.getElementById("total-asignado").textContent = "100";
    document.getElementById("error-nombre").textContent = "";
    document.getElementById("monedero-container").style.display = "none";
    document.getElementById("dinero-jugador").textContent = "500";

    showScene("scene-0");
}