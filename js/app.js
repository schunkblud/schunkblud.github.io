const API_URL = "https://api.jikan.moe/v4";

let allAnime = [];

async function loadHome() {
    const res = await fetch(`${API_URL}/top/anime`);
    const data = await res.json();
    allAnime = data.data;
    loadTopList("day");

    // Slider
    const featured = data.data[0];
    const hero = document.getElementById("hero");

    hero.style.background = `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.3)), url('${featured.images.jpg.large_image_url}') center/cover no-repeat`;
    hero.querySelector("h1").textContent = featured.title;
    hero.querySelector("p").textContent = featured.synopsis?.slice(0, 150) + "...";

    // Son Güncellenenler
    renderGrid(allAnime.slice(1, 13));

    // Popüler Liste
    loadTopList();

    // Türleri Yükle
    loadGenres();
}

// Grid render
function renderGrid(animeList) {
    const grid = document.getElementById("recentGrid");
    grid.innerHTML = "";

    animeList.forEach(anime => {
        const card = document.createElement("div");
        card.className = "anime-card";

        const genres = anime.genres.map(g => g.name).join(", ");
const year = anime.year || "Bilinmiyor";
const score = anime.score || "?";

card.innerHTML = `
    <img src="${anime.images.jpg.image_url}">
    <div class="title">${anime.title}</div>

    <!-- HOVER PREVIEW (9ANIME STYLE) -->
    <div class="hover-preview">
        <div class="hover-header">
            <h4>${anime.title}</h4>
            <div class="hover-tags">
                <span class="tag sub">SUB</span>
                <span class="tag ona">ONA</span>
            </div>
        </div>

        <div class="hover-episode">Episode 1/${anime.episodes || "?"}</div>

        <p class="hover-desc">
            ${anime.synopsis ? anime.synopsis.slice(0, 180) + "..." : "Açıklama bulunamadı."}
        </p>

        <div class="hover-meta">
            <div><span>Other names:</span> ${anime.title_english || anime.title_japanese || "-"}</div>
            <div><span>Score:</span> ${score}</div>
            <div><span>Date aired:</span> ${year}</div>
            <div><span>Status:</span> ${anime.status}</div>
            <div><span>Genre:</span> ${genres}</div>
        </div>

        <a href="watch.html?anime=${anime.mal_id}&ep=1" class="hover-watch-btn">
            ▶ WATCH NOW!
        </a>
    </div>
`;

        card.addEventListener("click", () => {
            window.location.href = `anime.html?id=${anime.mal_id}`;
        });

        grid.appendChild(card);
    });
}

// Popüler animeler
function loadTopList(type = "day") {
    const list = document.getElementById("topAnimeList");
    list.innerHTML = "";

    let sorted = [...allAnime];

    // Sözde izlenme mantığı
    if (type === "day") {
        sorted = sorted.sort((a, b) => b.score - a.score);
    } else if (type === "week") {
        sorted = sorted.sort((a, b) => b.popularity - a.popularity);
    } else if (type === "month") {
        sorted = sorted.sort((a, b) => b.members - a.members);
    }

    sorted.slice(0, 9).forEach((anime, index) => {
        const li = document.createElement("li");
        li.className = "top-item";
        li.innerHTML = `
            <div class="top-rank">${index + 1}</div>
            <img src="${anime.images.jpg.image_url}">
            <div class="top-info">
                ${anime.title}
                <span>⭐ ${anime.score || "N/A"}</span>
            </div>
        `;

        li.addEventListener("click", () => {
            window.location.href = `watch.html?anime=${anime.mal_id}&ep=1`;
        });

        list.appendChild(li);
    });
}

// Türleri yükle
async function loadGenres() {
    const res = await fetch(`${API_URL}/genres/anime`);
    const data = await res.json();
    const select = document.getElementById("genreFilter");

    data.data.forEach(genre => {
        const opt = document.createElement("option");
        opt.value = genre.mal_id;
        opt.textContent = genre.name;
        select.appendChild(opt);
    });
}

// Filtreleme
document.getElementById("filterBtn").addEventListener("click", () => {
    const genre = document.getElementById("genreFilter").value;
    const year = document.getElementById("yearFilter").value;

    let filtered = allAnime;

    if (genre) {
        filtered = filtered.filter(anime =>
            anime.genres.some(g => g.mal_id == genre)
        );
    }

    if (year) {
        filtered = filtered.filter(anime =>
            anime.year == year
        );
    }

    renderGrid(filtered.slice(0, 12));
});

loadHome();

// TOP TAB SWITCH
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("tab")) {
        document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
        e.target.classList.add("active");

        const type = e.target.dataset.type;
        loadTopList(type);
    }
});
