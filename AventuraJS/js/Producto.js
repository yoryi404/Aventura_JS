class Producto {
    constructor(nombre, imagen, precio, rareza, tipo, bonus) {
        this.nombre = nombre;
        this.imagen = imagen;
        this.precio = precio;
        this.rareza = rareza;
        this.tipo = tipo;
        this.bonus = bonus;
    }

    formatearPrecio() {
        return (this.precio / 100) + "€";
    }

    aplicarDescuento(descuento) {
        return new Producto(this.nombre, this.imagen, this.precio - descuento, this.rareza, this.tipo, this.bonus);
    }
}