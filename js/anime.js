const API_URL = "https://api.jikan.moe/v4";

const params = new URLSearchParams(window.location.search);
const animeId = params.get("id");

async function loadAnime() {
    const res = await fetch(`${API_URL}/anime/${animeId}`);
    const data = await res.json();
    const anime = data.data;

    const container = document.getElementById("animeDetail");

    container.innerHTML = `
        <div style="display:flex; gap:20px;">
            <img src="${anime.images.jpg.large_image_url}" style="width:250px; border-radius:10px;">
            <div>
                <h1>${anime.title}</h1>
                <p><strong>Tür:</strong> ${anime.genres.map(g => g.name).join(", ")}</p>
                <p><strong>Yıl:</strong> ${anime.year}</p>
                <p><strong>Puan:</strong> ${anime.score}</p>
                <p style="margin-top:10px;">${anime.synopsis}</p>
                <br>
                <a href="watch.html?anime=${anime.mal_id}&ep=1" class="btn-login">İzlemeye Git</a>
            </div>
        </div>
    `;
}

loadAnime();
