class Jugador {
    constructor(nombre, avatar) {
        this.nombre = nombre;
        this.avatar = avatar;
        this.puntos = 0;
        this.vida = 100;
        this.inventario = [];
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
}