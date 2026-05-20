const miManzana = document.getElementById("manzana");
const miBotella = document.getElementById("botella");
const miCarton = document.getElementById("carton");

let contador = document.getElementById("contadorPuntos");
let miContador = 0;

const cuboVerde = document.getElementById("uno");      
const cuboAzul = document.getElementById("dos");       
const cuboAmarillo = document.getElementById("tres");   

const cartel = document.getElementById("cartelObjetivo");

document.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', (e) => e.preventDefault());
});

const estados = [
    { texto: "¡MANZANA!", clase: "cartelObjetivo" },   
    { texto: "¡CARTÓN!", clase: "cartelObjetivo2" },   
    { texto: "¡PLASTICO!", clase: "cartelObjetivo3" }  
];
let indiceActual = 0;

function rotarCartel() {
    indiceActual = (indiceActual + 1) % estados.length;
    const nuevoEstado = estados[indiceActual];
    cartel.innerText = nuevoEstado.texto;
    cartel.className = nuevoEstado.clase;
    cartel.style.color = nuevoEstado.clase === "cartelObjetivo3" ? "black" : "white";
}
setInterval(rotarCartel, 10000);

let cuboSeleccionado = null;

let xUno = window.innerWidth * 0.25;
let xDos = window.innerWidth * 0.50;
let xTres = window.innerWidth * 0.75;

function obtenerX(evento) {
    if (evento.touches && evento.touches.length > 0) {
        return evento.touches[0].clientX;
    }
    return evento.clientX;
}

function empezarAgarre(elemento, evento) {
    cuboSeleccionado = elemento;
}

cuboVerde.addEventListener("mousedown", (e) => empezarAgarre(cuboVerde, e));
cuboVerde.addEventListener("touchstart", (e) => empezarAgarre(cuboVerde, e), { passive: true });

cuboAzul.addEventListener("mousedown", (e) => empezarAgarre(cuboAzul, e));
cuboAzul.addEventListener("touchstart", (e) => empezarAgarre(cuboAzul, e), { passive: true });

cuboAmarillo.addEventListener("mousedown", (e) => empezarAgarre(cuboAmarillo, e));
cuboAmarillo.addEventListener("touchstart", (e) => empezarAgarre(cuboAmarillo, e), { passive: true });

window.addEventListener("mouseup", () => { cuboSeleccionado = null; });
window.addEventListener("touchend", () => { cuboSeleccionado = null; });

function moverElemento(evento) {
    if (cuboSeleccionado !== null) {
        const clienteX = obtenerX(evento);
        const mitadAnchoCubo = cuboSeleccionado.offsetWidth / 2;
        const posicionX = clienteX - mitadAnchoCubo;
        
        cuboSeleccionado.style.left = posicionX + "px";
        
        if (cuboSeleccionado === cuboVerde) xUno = posicionX;
        if (cuboSeleccionado === cuboAzul) xDos = posicionX;
        if (cuboSeleccionado === cuboAmarillo) xTres = posicionX;
    }
}

window.addEventListener("mousemove", moverElemento);
window.addEventListener("touchmove", moverElemento, { passive: false });

const carriles = ["20%", "45%", "70%"];
let manzanaTop = 0;
let botellaTop = 0;
let cartonTop = 0;

let velocidad = 6.5; 

let pxCarriles = [0, 0, 0];
let alturaSuelo = window.innerHeight - 180; 

function ajustarMedidasPantalla() {
    const anchoPantalla = window.innerWidth;
    pxCarriles = [anchoPantalla * 0.20, anchoPantalla * 0.45, anchoPantalla * 0.70];
    alturaSuelo = window.innerHeight - 160; 
}
ajustarMedidasPantalla();
window.addEventListener("resize", ajustarMedidasPantalla);

let carrilManzana = 0;
let carrilBotella = 1;
let carrilCarton = 2;

function cambiarDeCarril(elementoHTML, tipo) {
    const indiceAzar = Math.floor(Math.random() * carriles.length);
    elementoHTML.style.left = carriles[indiceAzar];
    
    if (tipo === "manzana") carrilManzana = indiceAzar;
    if (tipo === "botella") carrilBotella = indiceAzar;
    if (tipo === "carton") carrilCarton = indiceAzar;
}

function reiniciarJuego() {
    miContador = 0;
    contador.innerText = miContador;
    manzanaTop = 0; botellaTop = 0; cartonTop = 0;
    cambiarDeCarril(miManzana, "manzana");
    cambiarDeCarril(miBotella, "botella");
    cambiarDeCarril(miCarton, "carton");
}

cambiarDeCarril(miManzana, "manzana");
cambiarDeCarril(miBotella, "botella");
cambiarDeCarril(miCarton, "carton");

function estaDebajo(indiceCarril, cuboX) {
    const residuoX = pxCarriles[indiceCarril];
    const margen = window.innerWidth < 600 ? 65 : 95; 
    return Math.abs(residuoX - cuboX) < margen; 
}

function juegoLluvia() {
    manzanaTop += velocidad;
    botellaTop += velocidad;
    cartonTop += velocidad;

    miManzana.style.top = manzanaTop + "px";
    miBotella.style.top = botellaTop + "px";
    miCarton.style.top = cartonTop + "px";

    const zonaCaptura = alturaSuelo - 80;
    const zonaLimite = alturaSuelo;

    if (manzanaTop > zonaCaptura) { 
        if (estados[indiceActual].texto === "¡MANZANA!") {
            if (estaDebajo(carrilManzana, xDos)) {
                miContador += 1;
                contador.innerText = miContador;
                manzanaTop = 0;
                cambiarDeCarril(miManzana, "manzana");
            } else if (manzanaTop > zonaLimite) {
                alert("¡FALLASTE! La manzana cayó al suelo.");
                reiniciarJuego();
                return;
            }
        } else if (manzanaTop > zonaLimite) {
            manzanaTop = 0;
            cambiarDeCarril(miManzana, "manzana");
        }
    }

    if (botellaTop > zonaCaptura) {
        if (estados[indiceActual].texto === "¡PLASTICO!") {
            if (estaDebajo(carrilBotella, xTres)) {
                miContador += 1;
                contador.innerText = miContador;
                botellaTop = 0;
                cambiarDeCarril(miBotella, "botella");
            } else if (botellaTop > zonaLimite) {
                alert("¡FALLASTE! La botella cayó al suelo.");
                reiniciarJuego();
                return;
            }
        } else if (botellaTop > zonaLimite) {
            botellaTop = 0;
            cambiarDeCarril(miBotella, "botella");
        }
    }

    if (cartonTop > zonaCaptura) {
        if (estados[indiceActual].texto === "¡CARTÓN!") {
            if (estaDebajo(carrilCarton, xUno)) {
                miContador += 1;
                contador.innerText = miContador;
                cartonTop = 0;
                cambiarDeCarril(miCarton, "carton");
            } else if (cartonTop > zonaLimite) {
                alert("¡FALLASTE! El cartón cayó al suelo.");
                reiniciarJuego();
                return;
            }
        } else if (cartonTop > zonaLimite) {
            cartonTop = 0;
            cambiarDeCarril(miCarton, "carton");
        }
    }
}

setInterval(juegoLluvia, 16);