function toggleMenu() {
    document.querySelector(".nav-links").classList.toggle("active");
}

// ===== JSON'DAN ANIME YÜKLEME =====

async function loadAnimes() {
    const res = await fetch("data.json");
    const data = await res.json();

    const grid = document.querySelector(".anime-grid");
    if (!grid) return;

    grid.innerHTML = "";

    data.animeler.forEach(anime => {
        const card = document.createElement("div");
        card.className = "anime-card";

        card.innerHTML = `
            <div class="card-image">
                <span class="hd-badge">HD</span>
                <span class="episode">Bölüm ${anime.bolumler.length}</span>
                <img src="${anime.kapak}">
                <div class="card-overlay">
                    <a href="anime.html?id=${anime.id}">
                        <button>▶ İzle</button>
                    </a>
                </div>
            </div>
            <h4 class="anime-title">${anime.ad}</h4>
        `;

        grid.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", loadAnimes);
