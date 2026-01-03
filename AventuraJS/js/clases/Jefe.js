import { Enemigo } from "./Enemigo.js";
class Jefe extends Enemigo {
    constructor(nombre, avatar, nivelAtaque, vida, multiplicador = 1.2) {
        super(nombre, avatar, nivelAtaque, vida);
        this.multiplicador = multiplicador;
    }
}

export default Jefe;