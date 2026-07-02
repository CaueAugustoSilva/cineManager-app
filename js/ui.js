export function escapeHTML(valor) {
    return String(valor ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

export function formatarMoeda(valor) {
    return Number(valor ?? 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

export function formatarData(valor) {
    if (!valor) return "-";

    const data = new Date(`${valor}T00:00:00`);

    if (Number.isNaN(data.getTime())) return escapeHTML(valor);

    return data.toLocaleDateString("pt-BR");
}

export function formatarDataHora(valor) {
    if (!valor) return "-";

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
        return escapeHTML(String(valor).replace("T", " "));
    }

    return data.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    });
}

export function paraInputDateTime(valor) {
    if (!valor) return "";

    return String(valor).slice(0, 16);
}

export function setLinhaCarregando(tbody, colSpan, mensagem = "Carregando...") {
    tbody.innerHTML = `
        <tr>
            <td colspan="${colSpan}" class="text-center text-muted py-4">${escapeHTML(mensagem)}</td>
        </tr>
    `;
}

export function setLinhaVazia(tbody, colSpan, mensagem = "Nenhum registro encontrado.") {
    tbody.innerHTML = `
        <tr>
            <td colspan="${colSpan}" class="text-center text-muted py-4">${escapeHTML(mensagem)}</td>
        </tr>
    `;
}

export function mostrarErro(erro, contexto = "Erro") {
    console.error(contexto, erro);
    alert(`${contexto}: ${erro?.message ?? erro}`);
}
