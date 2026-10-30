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

// Año actual en el pie de página
document.querySelector("#anio").textContent = new Date().getFullYear();
