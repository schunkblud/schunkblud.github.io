const API_URL = "https://api.jikan.moe/v4";

async function loadHome() {
    // Slider için popüler anime
    const res = await fetch(`${API_URL}/top/anime`);
    const data = await res.json();

    const featured = data.data[0];
    const hero = document.getElementById("hero");

    hero.style.background = `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.3)), url('${featured.images.jpg.large_image_url}') center/cover no-repeat`;
    hero.querySelector("h1").textContent = featured.title;
    hero.querySelector("p").textContent = featured.synopsis?.slice(0, 150) + "...";

    // Recently Updated
    const grid = document.getElementById("recentGrid");
    data.data.slice(1, 13).forEach(anime => {
        const card = document.createElement("div");
        card.className = "anime-card";
        card.innerHTML = `
            <img src="${anime.images.jpg.image_url}">
            <div class="title">${anime.title}</div>
        `;
        grid.appendChild(card);
    });
}

loadHome();
