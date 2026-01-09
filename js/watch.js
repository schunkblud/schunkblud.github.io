const API_URL = "https://api.jikan.moe/v4";

const params = new URLSearchParams(window.location.search);
const animeId = params.get("anime");
const episodeParam = params.get("ep") || 1;

let currentEpisode = parseInt(episodeParam);

async function loadWatchPage() {
    const res = await fetch(`${API_URL}/anime/${animeId}`);
    const data = await res.json();
    const anime = data.data;

    renderAnimeInfo(anime);
    renderEpisodes(anime.episodes || 12);
    loadVideo(currentEpisode);

    loadTopAnime();
}

function loadVideo(ep) {
    const player = document.getElementById("videoPlayer");
    player.src = "https://www.w3schools.com/html/mov_bbb.mp4";

    document.querySelectorAll(".episode-btn").forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.querySelector(`[data-ep="${ep}"]`);
    if (activeBtn) activeBtn.classList.add("active");
}

function renderEpisodes(total) {
    const list = document.getElementById("episodeList");
    list.innerHTML = "";

    for (let i = 1; i <= total; i++) {
        const btn = document.createElement("div");
        btn.className = "episode-btn";
        btn.textContent = i;
        btn.dataset.ep = i;

        if (i === currentEpisode) btn.classList.add("active");

        btn.addEventListener("click", () => {
            currentEpisode = i;
            loadVideo(i);
            history.replaceState(null, "", `watch.html?anime=${animeId}&ep=${i}`);
        });

        list.appendChild(btn);
    }
}

function renderAnimeInfo(anime) {
    const container = document.getElementById("animeInfo");

    container.innerHTML = `
        <img src="${anime.images.jpg.large_image_url}">
        <div class="anime-details">
            <h2>${anime.title}</h2>
            <div class="anime-meta">
                <span>Tür: ${anime.genres.map(g => g.name).join(", ")}</span>
                <span>Yıl: ${anime.year || "Bilinmiyor"}</span>
                <span>Durum: ${anime.status}</span>
                <span>Puan: ⭐ ${anime.score || "N/A"}</span>
            </div>
            <p>${anime.synopsis || "Açıklama bulunamadı."}</p>
        </div>
    `;
}

async function loadTopAnime() {
    const res = await fetch(`${API_URL}/top/anime`);
    const data = await res.json();
    const list = document.getElementById("topAnimeList");
    list.innerHTML = "";

    data.data.slice(0, 9).forEach((anime, index) => {
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

loadWatchPage();
