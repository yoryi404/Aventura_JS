//  PUNTUACIÓN 
export const PUNTUACION_BASE = 100;
export const UMBRAL_VETERANO = 500;

//  RAREZAS
export const RAREZAS = {
    COMUN: "Común",
    RARA: "Rara",
    EPICA: "Épica",
    LEGENDARIA: "Legendaria"
};

// TIPOS DE PRODUCTOS
export const TIPOS = {
    ARMA: "Arma",
    ARMADURA: "Armadura",
    CONSUMIBLE: "Consumible"
};

// PRODUCTOS DEL MERCADO
export const PRODUCTOS = [
    // ARMAS
    {
        nombre: "Daga",
        imagen: "./AventuraJS/objects/Dagger.png",
        precio: 300,
        rareza: RAREZAS.COMUN,
        tipo: TIPOS.ARMA,
        bonus: 10
    },
    {
        nombre: "Cuchilla",
        imagen: "./AventuraJS/objects/Cuchilla.png",
        precio: 500,
        rareza: RAREZAS.COMUN,
        tipo: TIPOS.ARMA,
        bonus: 15
    },
    {
        nombre: "Pistola",
        imagen: "./AventuraJS/objects/Pistola.png",
        precio: 800,
        rareza: RAREZAS.RARA,
        tipo: TIPOS.ARMA,
        bonus: 25
    },
    {
        nombre: "Katana",
        imagen: "./AventuraJS/objects/Katana.png",
        precio: 1200,
        rareza: RAREZAS.EPICA,
        tipo: TIPOS.ARMA,
        bonus: 35
    },

    // ARMADURAS
    {
        nombre: "Armadura Ligera",
        imagen: "./AventuraJS/objects/Armadura.png",
        precio: 200,
        rareza: RAREZAS.COMUN,
        tipo: TIPOS.ARMADURA,
        bonus: 8
    },
    {
        nombre: "Robot Ayduante",
        imagen: "./AventuraJS/objects/robot_ayudante.png",
        precio: 500,
        rareza: RAREZAS.COMUN,
        tipo: TIPOS.ARMADURA,
        bonus: 12
    }, {
        nombre: "Brazo mecanico",
        imagen: "./AventuraJS/objects/Brazo_mecanico.png",
        precio: 500,
        rareza: RAREZAS.COMUN,
        tipo: TIPOS.ARMADURA,
        bonus: 10
    },{
        nombre: "Escudo",
        imagen: "./AventuraJS/objects/escudo.png",
        precio: 500,
        rareza: RAREZAS.COMUN,
        tipo: TIPOS.ARMADURA,
        bonus: 10
    },{
        nombre: "Gafas",
        imagen: "./AventuraJS/objects/gafas-cyberpunk.png",
        precio: 500,
        rareza: RAREZAS.COMUN,
        tipo: TIPOS.ARMADURA,
        bonus: 10
    },

    // CONSUMIBLES
    {
        nombre: "Poción Pequeña",
        imagen: "./AventuraJS/objects/Pocion.png",
        precio: 200,
        rareza: RAREZAS.COMUN,
        tipo: TIPOS.CONSUMIBLE,
        bonus: 20
    },
    {
        nombre: "Energitica",
        imagen: "./AventuraJS/objects/Energetica.png",
        precio: 200,
        rareza: RAREZAS.COMUN,
        tipo: TIPOS.CONSUMIBLE,
        bonus: 20
    }
];

// ENEMIGOS
export const ENEMIGOS = [
    {
        nombre: "Hacker Novato",
        avatar: "./AventuraJS/enemies/Enemy_1.png",
        nivelAtaque: 15,
        vida: 80
    },
    {
        nombre: "Kiddie",
        avatar: "./AventuraJS/enemies/Enemy_2.png",
        nivelAtaque: 20,
        vida: 100
    },
    {
        nombre: "Madisson",
        avatar: "./AventuraJS/enemies/Enemy_3.png",
        nivelAtaque: 30,
        vida: 120
    },
    {
        nombre: "Josefina",
        avatar: "./AventuraJS/enemies/Enemy_4.png",
        nivelAtaque: 40,
        vida: 150
    }
];

// JEFES
export const JEFES = [
    {
        nombre: "Adam Smasher",
        avatar: "./AventuraJS/enemies/Boss.png",
        nivelAtaque: 50,
        vida: 200,
        multiplicador: 1.5
    }
];