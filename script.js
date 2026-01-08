fetch("data.json")
  .then(response => response.json())
  .then(data => {
    const grid = document.getElementById("animeGrid");

    data.forEach(anime => {
      const card = document.createElement("div");
      card.className = "anime-card";

      card.innerHTML = `
        <img src="${anime.image}">
        <span class="ep">${anime.episode}</span>
        <span class="lang">${anime.lang}</span>
        <h3>${anime.title}</h3>
      `;

      grid.appendChild(card);
    });
  })
  .catch(err => console.error("Anime yüklenemedi:", err));
