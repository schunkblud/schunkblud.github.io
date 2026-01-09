const API_URL = "https://api.jikan.moe/v4";

let allAnime = [];

async function loadHome() {
    const res = await fetch(`${API_URL}/top/anime`);
    const data = await res.json();
    allAnime = data.data;

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

        card.innerHTML = `
            <img src="${anime.images.jpg.image_url}">
            <div class="title">${anime.title}</div>

            <!-- HOVER PREVIEW -->
            <div class="hover-preview">
                <img src="${anime.images.jpg.large_image_url}">
                <h4>${anime.title}</h4>
                <div class="meta">${year} • ${genres}</div>
                <p>${anime.synopsis ? anime.synopsis.slice(0, 150) + "..." : "Açıklama yok."}</p>
                <a href="anime.html?id=${anime.mal_id}" class="btn-hover-watch">İzle</a>
            </div>
        `;

        card.addEventListener("click", () => {
            window.location.href = `anime.html?id=${anime.mal_id}`;
        });

        grid.appendChild(card);
    });
}

// Popüler animeler
function loadTopList() {
    const list = document.getElementById("topAnimeList");
    list.innerHTML = "";

    allAnime.slice(0, 8).forEach(anime => {
        const li = document.createElement("li");
        li.textContent = anime.title;
        li.addEventListener("click", () => {
            window.location.href = `anime.html?id=${anime.mal_id}`;
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
