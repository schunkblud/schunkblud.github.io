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

// ===== ANIME DETAY SAYFASI =====

async function loadAnimeDetail() {
    const params = new URLSearchParams(window.location.search);
    const animeId = params.get("id");

    if (!animeId) return;

    const res = await fetch("data.json");
    const data = await res.json();

    const anime = data.animeler.find(a => a.id === animeId);
    if (!anime) return;

    const container = document.getElementById("animeDetail");

    container.innerHTML = `
        <h1>${anime.ad}</h1>

        <div class="anime-meta">
            <span>⭐ ${anime.puan}</span>
            <span>${anime.yil}</span>
            <span>${anime.durum}</span>
        </div>

        <div class="anime-genres">
            ${anime.turler.map(t => `<span>${t}</span>`).join("")}
        </div>

        <p class="anime-desc">${anime.aciklama}</p>

        <a href="bolumler.html?id=${anime.id}" class="watch-btn big">📺 Bölümleri Gör</a>
    `;
}

document.addEventListener("DOMContentLoaded", loadAnimeDetail);

// ===== BÖLÜM LİSTESİ =====

async function loadEpisodes() {
    const params = new URLSearchParams(window.location.search);
    const animeId = params.get("id");

    if (!animeId) return;

    const res = await fetch("data.json");
    const data = await res.json();

    const anime = data.animeler.find(a => a.id === animeId);
    if (!anime) return;

    const list = document.getElementById("episodeList");
    list.innerHTML = "";

    anime.bolumler.forEach(bolum => {
        const item = document.createElement("a");
        item.className = "episode-item";
        item.href = `izle.html?id=${anime.id}&bolum=${bolum.no}`;
        item.innerHTML = `
            <span>Bölüm ${bolum.no}</span>
            <span>HD</span>
        `;
        list.appendChild(item);
    });
}

document.addEventListener("DOMContentLoaded", loadEpisodes);

// ===== PLAYER SAYFASI =====

async function loadPlayer() {
    const params = new URLSearchParams(window.location.search);
    const animeId = params.get("id");
    const bolumNo = params.get("bolum");

    if (!animeId || !bolumNo) return;

    const res = await fetch("data.json");
    const data = await res.json();

    const anime = data.animeler.find(a => a.id === animeId);
    if (!anime) return;

    const bolum = anime.bolumler.find(b => b.no == bolumNo);
    if (!bolum) return;

    const player = document.getElementById("videoPlayer");
    player.innerHTML = `
        <iframe 
            src="${bolum.video}"
            frameborder="0"
            allowfullscreen>
        </iframe>
    `;
}

document.addEventListener("DOMContentLoaded", loadPlayer);
