// =========================================================
// Cambio de idioma (español / inglés)
// =========================================================
// El HTML tiene cada texto dos veces: class="es" y class="en".
// estilos.css oculta el idioma que no coincide con <html lang="...">,
// así que acá solo hay que cambiar ese atributo y recordar la elección.

const botonIdioma = document.querySelector("#cambiar-idioma");
const imagenesTraducidas = document.querySelectorAll("img[data-alt-en]");

// Guardamos el texto alternativo en español que ya viene en el HTML
imagenesTraducidas.forEach((img) => {
  img.dataset.altEs = img.alt;
});

function aplicarIdioma(idioma) {
  document.documentElement.lang = idioma;

  // Textos alternativos de las imágenes (para lectores de pantalla)
  imagenesTraducidas.forEach((img) => {
    img.alt = idioma === "en" ? img.dataset.altEn : img.dataset.altEs;
  });

  botonIdioma.setAttribute("aria-label", idioma === "en" ? "Ver en español" : "View in English");

  // localStorage puede fallar en modo privado; por eso el try/catch
  try {
    localStorage.setItem("idioma", idioma);
  } catch (error) {}
}

function idiomaInicial() {
  try {
    const guardado = localStorage.getItem("idioma");
    if (guardado) return guardado;
  } catch (error) {}
  // Si nunca eligió, usamos el idioma del navegador
  return navigator.language.startsWith("es") ? "es" : "en";
}

botonIdioma.addEventListener("click", () => {
  const nuevo = document.documentElement.lang === "es" ? "en" : "es";
  aplicarIdioma(nuevo);
});

aplicarIdioma(idiomaInicial());

// =========================================================
// Menú desplegable en celular
// =========================================================
const botonMenu = document.querySelector("#abrir-menu");
const enlacesMenu = document.querySelector("#menu-enlaces");

function abrirMenu(abrir) {
  enlacesMenu.classList.toggle("abierto", abrir);
  botonMenu.setAttribute("aria-expanded", abrir);
}

botonMenu.addEventListener("click", () => {
  abrirMenu(!enlacesMenu.classList.contains("abierto"));
});

// Se cierra al elegir una sección o al tocar la tecla Escape
enlacesMenu.querySelectorAll("a").forEach((enlace) => {
  enlace.addEventListener("click", () => abrirMenu(false));
});
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") abrirMenu(false);
});

// =========================================================
// Botón "volver arriba": aparece después de bajar un poco
// =========================================================
const botonArriba = document.querySelector(".arriba");

function mostrarBotonArriba() {
  botonArriba.classList.toggle("visible", window.scrollY > 600);
}

window.addEventListener("scroll", mostrarBotonArriba, { passive: true });
mostrarBotonArriba();

// =========================================================
// Cabecera: iniciales mientras el nombre se ve en el inicio o en el pie;
// en el resto de la página, nombre completo
// =========================================================
const marca = document.querySelector(".marca");
const cabecera = document.querySelector(".cabecera");
const nombreGrande = document.querySelector(".hero__nombre");
const nombrePie = document.querySelector(".contacto__nombre");

function actualizarMarca() {
  const enElInicio = nombreGrande.getBoundingClientRect().bottom > cabecera.offsetHeight;
  const enElPie = nombrePie.getBoundingClientRect().top < window.innerHeight;
  marca.classList.toggle("marca--iniciales", enElInicio || enElPie);
}

window.addEventListener("scroll", actualizarMarca, { passive: true });
window.addEventListener("resize", actualizarMarca);
actualizarMarca();

// =========================================================
// Visor de imágenes (se abre al hacer clic en una imagen)
// =========================================================
// Recorre las imágenes de la galería del mismo proyecto con
// las flechas, el teclado (← →) o deslizando el dedo en celular.

const visor = document.querySelector("#visor");
const visorImagen = document.querySelector("#visor-imagen");
const visorTexto = document.querySelector("#visor-texto");
let imagenesDelProyecto = [];
let posicion = 0;

function mostrarImagen(nuevaPosicion) {
  // Si pasa la última vuelve a la primera (y al revés)
  posicion = (nuevaPosicion + imagenesDelProyecto.length) % imagenesDelProyecto.length;
  const img = imagenesDelProyecto[posicion];
  const figura = img.closest("figure");

  visorImagen.src = img.src; // src siempre es la versión grande
  visorImagen.alt = img.alt;
  // innerText solo toma el texto visible (el del idioma activo)
  const pie = figura ? figura.querySelector("figcaption").innerText : img.alt;
  visorTexto.textContent = `${pie}  ·  ${posicion + 1} / ${imagenesDelProyecto.length}`;
}

document.querySelectorAll(".galeria img.media").forEach((img) => {
  // Para que también se pueda abrir con el teclado
  img.tabIndex = 0;
  img.setAttribute("role", "button");

  const abrir = () => {
    imagenesDelProyecto = [...img.closest(".galeria").querySelectorAll("img.media")];
    mostrarImagen(imagenesDelProyecto.indexOf(img));
    visor.showModal();
  };
  img.addEventListener("click", abrir);
  img.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      abrir();
    }
  });
});

// Botones: cerrar, anterior y siguiente
visor.addEventListener("click", (evento) => {
  const accion = evento.target.closest("[data-accion]")?.dataset.accion;
  if (accion === "cerrar") visor.close();
  if (accion === "anterior") mostrarImagen(posicion - 1);
  if (accion === "siguiente") mostrarImagen(posicion + 1);
  // Clic en el fondo oscuro (fuera de la imagen y los botones): cerrar
  if (evento.target === visor || evento.target.classList.contains("visor__figura")) visor.close();
});

// Teclado: flechas para moverse (Escape ya cierra el <dialog> solo)
visor.addEventListener("keydown", (evento) => {
  if (evento.key === "ArrowLeft") mostrarImagen(posicion - 1);
  if (evento.key === "ArrowRight") mostrarImagen(posicion + 1);
});

// Celular: deslizar el dedo a izquierda o derecha
let inicioDedo = null;
visor.addEventListener("touchstart", (evento) => {
  inicioDedo = evento.touches[0].clientX;
}, { passive: true });
visor.addEventListener("touchend", (evento) => {
  if (inicioDedo === null) return;
  const distancia = evento.changedTouches[0].clientX - inicioDedo;
  if (distancia > 50) mostrarImagen(posicion - 1);
  if (distancia < -50) mostrarImagen(posicion + 1);
  inicioDedo = null;
});

// Año actual en el pie de página
document.querySelector("#anio").textContent = new Date().getFullYear();
