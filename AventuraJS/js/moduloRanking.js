export function distinguirJugador(puntuacion, umbral = 500) {
    return puntuacion >= umbral ? "Smasher" : "Novato";
}