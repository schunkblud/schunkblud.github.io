const API_URL = "https://api.jikan.moe/v4";

const params = new URLSearchParams(window.location.search);
const query = params.get("q");

const searchTitle = document.getElementById("searchTitle");
const searchGrid = document.getElementById("searchGrid");

if (!query) {
    searchTitle.textContent = "Arama terimi bulunamadı.";
} else {
    searchTitle.textContent = `"${query}" için arama sonuçları`;
    searchAnime(query);
}

async function searchAnime(q) {
    try {
        const res = await fetch(`${API_URL}/anime?q=${encodeURIComponent(q)}&limit=24`);
        const data = await res.json();

        if (!data.data || data.data.length === 0) {
            searchGrid.innerHTML = `<p style="color:#aaa;">Sonuç bulunamadı.</p>`;
            return;
        }

        renderGrid(data.data);

    } catch (err) {
        console.error("Arama hatası:", err);
        searchGrid.innerHTML = `<p style="color:red;">Bir hata oluştu.</p>`;
    }
}

function renderGrid(animeList) {
    searchGrid.innerHTML = "";

    animeList.forEach(anime => {
        const card = document.createElement("div");
        card.className = "anime-card";

        card.innerHTML = `
            <div class="card-thumb">
                <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
                <span class="badge hd">HD</span>
            </div>

            <div class="card-info">
                <h4>${anime.title}</h4>
            </div>
        `;

        card.addEventListener("click", () => {
            window.location.href = `watch.html?anime=${anime.mal_id}&ep=1`;
        });

        searchGrid.appendChild(card);
    });
}
