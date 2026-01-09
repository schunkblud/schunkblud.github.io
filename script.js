console.log("script.js çalışıyor");

function toggleMenu() {
    document.querySelector(".nav-links").classList.toggle("active");
}

// ===== JSON'DAN ANIME YÜKLEME =====

async function loadAnimes() {
    const res = await fetch("./data.json");
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

    const res = await fetch("");
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

    const res = await fetch("");
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

    const res = await fetch("");
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

// ===== JIKAN API İLE GERÇEK ANIME VERİSİ =====

async function fetchAnimeFromAPI(animeName) {
    const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(animeName)}&limit=1`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (!data.data || data.data.length === 0) {
            console.log("Anime bulunamadı:", animeName);
            return null;
        }

        const anime = data.data[0];

        return {
            id: anime.mal_id,
            ad: anime.title,
            yil: anime.year || "Bilinmiyor",
            puan: anime.score || "N/A",
            durum: anime.status || "Bilinmiyor",
            turler: anime.genres.map(g => g.name),
            aciklama: anime.synopsis || "Açıklama bulunamadı.",
            kapak: anime.images.jpg.large_image_url
        };

    } catch (err) {
        console.error("API Hatası:", err);
        return null;
    }
}

// ===== ANASAYFAYA TOPLU ANİME YÜKLE (JIKAN) =====
async function loadAnimesFromAPI() {
    const grid = document.querySelector(".anime-grid");
    if (!grid) return;

    grid.innerHTML = "";

    try {
        // En popüler animeleri çek
        const res = await fetch("https://api.jikan.moe/v4/top/anime?limit=12");
        const data = await res.json();

        for (const item of data.data) {
            const card = document.createElement("div");
            card.className = "anime-card";

            card.innerHTML = `
                <div class="card-image">
                    <span class="hd-badge">HD</span>
                    <img src="${item.images.jpg.large_image_url}" alt="${item.title}">
                    <div class="card-overlay">
                        <a href="anime.html?id=${item.mal_id}">
                            <button>▶ İzle</button>
                        </a>
                    </div>
                </div>
                <h4 class="anime-title">${item.title}</h4>
            `;

            grid.appendChild(card);
        }

    } catch (err) {
        console.error("Anime yükleme hatası:", err);
    }
}

document.addEventListener("DOMContentLoaded", loadAnimesFromAPI);

// ===== API'DEN ANIME DETAY SAYFASI =====

async function loadAnimeDetailFromAPI() {
    const params = new URLSearchParams(window.location.search);
    const animeId = params.get("id");

    if (!animeId) return;

    const url = `https://api.jikan.moe/v4/anime/${animeId}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        const anime = data.data;

        const container = document.getElementById("animeDetail");
        if (!container) return;

        const turkceAciklama = await translateToTurkish(anime.synopsis || "Açıklama yok.");

container.innerHTML = `
    <h1>${anime.title}</h1>

    <div class="anime-meta">
        <span>⭐ ${anime.score || "N/A"}</span>
        <span>${anime.year || "Bilinmiyor"}</span>
        <span>${anime.status}</span>
    </div>

    <div class="anime-genres">
        ${anime.genres.map(g => `<span>${g.name}</span>`).join("")}
    </div>

    <p class="anime-desc">${turkceAciklama}</p>

    <a href="bolumler.html?id=${anime.mal_id}" class="watch-btn big">📺 Bölümleri Gör</a>
`;
    } catch (err) {
        console.error("Detay API Hatası:", err);
    }
}

document.addEventListener("DOMContentLoaded", loadAnimeDetailFromAPI);

// ===== SLIDER'I API'DEN DOLDUR =====

async function loadSliderFromAPI() {
    const slider = document.getElementById("mainSlider");
    const content = document.getElementById("sliderContent");
    if (!slider || !content) return;

    const featuredAnime = "Jujutsu Kaisen";
    const anime = await fetchAnimeFromAPI(featuredAnime);
    if (!anime) return;

    // 🔁 Açıklamayı Türkçeye çevir
    const turkceAciklama = await translateToTurkish(anime.aciklama);

    slider.style.background = `
        linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.2)),
        url('${anime.kapak}') center/cover
    `;

    content.innerHTML = `
        <div>
            ${anime.turler.map(t => `<span class="slider-tag">${t}</span>`).join("")}
        </div>

        <h2>${anime.ad}</h2>

        <div class="slider-meta">
            <span>${anime.yil}</span>
            <span>⭐ ${anime.puan}</span>
            <span>${anime.durum}</span>
        </div>

        <p>${turkceAciklama}</p>

        <a href="anime.html?id=${anime.id}">
            <button class="watch-btn">▶ Şimdi İzle</button>
        </a>
    `;
}

// Sayfa yüklendiğinde slider'ı da doldur
document.addEventListener("DOMContentLoaded", loadSliderFromAPI);

// ===== METNİ OTOMATİK TÜRKÇEYE ÇEVİR =====

async function translateToTurkish(text) {
    if (!text) return "";

    try {
        const res = await fetch("https://libretranslate.de/translate", {
            method: "POST",
            body: JSON.stringify({
                q: text,
                source: "en",
                target: "tr",
                format: "text"
            }),
            headers: { "Content-Type": "application/json" }
        });

        const data = await res.json();
        return data.translatedText || text;
    } catch (err) {
        console.error("Çeviri hatası:", err);
        return text; // Çeviri olmazsa İngilizce göster
    }
}
