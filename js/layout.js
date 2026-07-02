export async function carregarNavbar() {
    const container = document.getElementById("navbar");

    if (!container) return;

    try {
        const response = await fetch("./components/navbar.html");

        if (!response.ok) {
            throw new Error("Não foi possível carregar a navbar.");
        }

        container.innerHTML = await response.text();
        destacarPaginaAtual();
    } catch (erro) {
        console.error(erro);
        container.innerHTML = `
            <nav class="navbar navbar-dark bg-dark">
                <div class="container">
                    <a class="navbar-brand fw-bold" href="./index.html">🎬 CineManager</a>
                </div>
            </nav>
        `;
    }
}

function destacarPaginaAtual() {
    const paginaAtual = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".navbar .nav-link").forEach(link => {
        const href = link.getAttribute("href")?.replace("./", "");

        if (href === paginaAtual) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });
}

carregarNavbar();
