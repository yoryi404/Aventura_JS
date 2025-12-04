class Jugador {

    constructor(nombre, avatar) {
        this.nombre = nombre;
        this.avatar = avatar;
        this.puntos = 0;
        this.vida = 100;
        this.vidaMaxima = 100;
        this.dinero = 500;
        this.inventario = [];
    }

    añadirProducto(producto) {
        // Clonamos el producto como un objeto simple
        const productoClonado = {
            nombre: producto.nombre,
            imagen: producto.imagen,
            precio: producto.precio,
            rareza: producto.rareza,
            tipo: producto.tipo,
            bonus: producto.bonus
        };
        this.inventario.push(productoClonado);
    }

    sumarPuntos(p) {
        this.puntos += p;
    }

    obtenerAtaqueTotal() {
        let total = 0;
        for (let i = 0; i < this.inventario.length; i++) {
            if (this.inventario[i].tipo === "Arma") {
                total += this.inventario[i].bonus;
            }
        }
        return total;
    }


    obtenerDefensaTotal() {
        let total = 0;
        for (let i = 0; i < this.inventario.length; i++) {
            if (this.inventario[i].tipo === "Armadura") {
                total += this.inventario[i].bonus;
            }
        }
        return total;
    }

    obtenerVidaTotal() {
        let total = this.vida;
        for (let i = 0; i < this.inventario.length; i++) {
            if (this.inventario[i].tipo === "Consumible") {
                total += this.inventario[i].bonus;
            }
        }
        return total;
    }
    //MODIFICACION - Dinero 
    obtenerDinetoTotal() {
        let total = this.dinero;
        for (let i = 0; i < this.inventario.length; i++) {
            if (total < 0) {
                alert("No tienes suficiente dinero.")
            } else if (this.inventario[i].tipo === "Consumible" || this.inventario[i].tipo === "Arma" || this.inventario[i].tipo === "Armadura") {
                total -= this.inventario[i].precio;
            }
        }
        return total;
    }

    obtenerDineroEnemigos() {
        let total = this.dinero;
        let enemigosDerrotados = 0
        let jefesDerrotados = 0
        if (enemigosDerrotados[i].tipo === "ENEMIGO") {
            total += 5
        } else if (jefesDerrotados[i].tipo === "JEFES") {
            total += 10
        }
    }

    reiniciar() {
        this.puntos = 0;
        this.vida = this.vidaMaxima;
        this.inventario = [];
    }
}

export default Jugador;