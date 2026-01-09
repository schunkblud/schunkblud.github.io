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
        <div class="info-poster">
            <img src="${anime.images.jpg.large_image_url}">
        </div>

        <div class="info-content">
            <h2 class="info-title">${anime.title}</h2>
            <div class="info-subtitle">${anime.title_english || anime.title_japanese || ""}</div>

            <p class="info-description">
                ${anime.synopsis || "Açıklama bulunamadı."}
            </p>

            <div class="info-meta">
                <div class="meta-col">
                    <div><span>Tür:</span> ${anime.genres.map(g => g.name).join(", ")}</div>
                    <div><span>Stüdyo:</span> ${anime.studios.map(s => s.name).join(", ") || "Bilinmiyor"}</div>
                    <div><span>Yıl:</span> ${anime.year || "Bilinmiyor"}</div>
                    <div><span>Durum:</span> ${anime.status}</div>
                    <div><span>Tür:</span> ${anime.type || "?"}</div>
                </div>

                <div class="meta-col">
                    <div><span>Puan:</span> ⭐ ${anime.score || "N/A"}</div>
                    <div><span>Başlangıç:</span> ${anime.season ? anime.season.toUpperCase() : "?"}</div>
                    <div><span>Süre:</span> ${anime.duration || "?"}</div>
                    <div><span>Kalite:</span> HD</div>
                    <div><span>İzlenme:</span> ${anime.members?.toLocaleString() || "?"}</div>
                </div>
            </div>
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
