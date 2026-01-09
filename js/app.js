const urlParams = new URLSearchParams(window.location.search);
const genreParam = urlParams.get("genre");

const API_URL = "https://api.jikan.moe/v4";

let allAnime = [];

async function loadHome() {
    try {
        const res = await fetch(`${API_URL}/top/anime`);

        if (!res.ok) {
            throw new Error("API Hatası: " + res.status);
        }

        const data = await res.json();

        if (!data.data || data.data.length === 0) {
            throw new Error("Anime verisi alınamadı.");
        }

        allAnime = data.data;

// Eğer URL'de genre varsa filtrele
let filteredAnime = allAnime;

if (genreParam) {
    filteredAnime = allAnime.filter(anime =>
        anime.genres.some(g => g.mal_id == genreParam)
    );
}

// 🔥 SLIDER (her zaman genel liste)
renderSlider(allAnime);

// 🔥 SON GÜNCELLENENLER (filtreli liste)
renderGrid(filteredAnime.slice(0, 12));

// 🔥 SAĞ PANEL (TOP ANIME her zaman genel)
renderTopAnime(allAnime);

    // Türleri Yükle
    loadGenres();

        } catch (err) {
        console.error("Anasayfa yüklenemedi:", err);

        // Kullanıcıya mesaj göster
        const slider = document.getElementById("animeSlider");
        if (slider) {
            slider.innerHTML = `<div style="color:#fff; padding:40px;">Şu anda veriler yüklenemiyor. Lütfen biraz sonra tekrar deneyin.</div>`;
        }
    }
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
    <div class="card-thumb">
        <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
        
        <!-- ÜST ETİKET -->
        <span class="badge hd">HD</span>

        <!-- ALT ETİKETLER -->
        <div class="card-badges">
            <span class="badge ep">Ep 1/${anime.episodes || "?"}</span>
            <span class="badge sub">SUB</span>
            <span class="badge dub">DUB</span>
        </div>
    </div>

    <!-- ALT GRADIENT + BAŞLIK -->
    <div class="card-info">
        <h4>${anime.title}</h4>
    </div>

    <!-- HOVER PREVIEW (daha önce yaptığımız) -->
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
            <div><span>Score:</span> ${anime.score || "?"}</div>
            <div><span>Date aired:</span> ${anime.year || "Bilinmiyor"}</div>
            <div><span>Status:</span> ${anime.status}</div>
            <div><span>Genre:</span> ${anime.genres.map(g => g.name).join(", ")}</div>
        </div>

        <a href="watch.html?anime=${anime.mal_id}&ep=1" class="hover-watch-btn">
            ▶ WATCH NOW!
        </a>
    </div>
`;

        card.addEventListener("click", () => {
    window.location.href = `watch.html?anime=${anime.mal_id}&ep=1`;
});

        grid.appendChild(card);
    });
}

// Popüler animeler
function renderTopAnime(listData) {
    const featured = document.getElementById("topFeatured");
    const list = document.getElementById("topAnimeList");

    featured.innerHTML = "";
    list.innerHTML = "";

    // 1. SIRA (BÜYÜK KART)
    const first = listData[0];
    featured.innerHTML = `
        <div class="top-featured" onclick="location.href='watch.html?anime=${first.mal_id}&ep=1'">
            <img src="${first.images.jpg.large_image_url}">
            <div class="featured-overlay">
                <div class="featured-rank">1</div>
                <div class="featured-info">
                    <h4>${first.title}</h4>
                    <span>👁 ${first.members?.toLocaleString() || "?"}</span>
                </div>
            </div>
        </div>
    `;

    // 2–9 ARASI LİSTE
    listData.slice(1, 9).forEach((anime, index) => {
        const li = document.createElement("li");
        li.className = "top-item";
        li.innerHTML = `
            <div class="top-rank">${index + 2}</div>
            <img src="${anime.images.jpg.image_url}">
            <div class="top-info">
                <div class="top-title">${anime.title}</div>
                <span>👁 ${anime.members?.toLocaleString() || "?"}</span>
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

let currentSlide = 0;
let sliderInterval;

function renderSlider(animeList) {
    const slider = document.getElementById("animeSlider");
    const dots = document.getElementById("sliderDots");

    slider.innerHTML = "";
    dots.innerHTML = "";

    animeList.slice(0, 5).forEach((anime, index) => {
    const slide = document.createElement("div");
    slide.className = "slide";

    // 🔥 EN KALİTELİ GÖRSEL SEÇİMİ
    const imgSrc =
        anime.images.webp?.large_image_url ||
        anime.images.jpg?.large_image_url ||
        anime.images.jpg?.image_url;

    slide.innerHTML = `
        <img src="${imgSrc}" alt="${anime.title}">
        <div class="slide-content">
            <h1>${anime.title}</h1>
            <p>${anime.synopsis ? anime.synopsis.slice(0, 150) + "..." : ""}</p>
            <button class="btn-watch">Şimdi İzle</button>
        </div>
    `;

        slide.addEventListener("click", () => {
            window.location.href = `watch.html?anime=${anime.mal_id}&ep=1`;
        });

        slider.appendChild(slide);

        // Dot
        const dot = document.createElement("span");
        dot.addEventListener("click", () => {
            goToSlide(index);
        });

        dots.appendChild(dot);
    });

    updateSlider();
    startAutoSlide();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
    restartAutoSlide();
}

function updateSlider() {
    const slider = document.getElementById("animeSlider");
    const dots = document.querySelectorAll("#sliderDots span");

    slider.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentSlide);
    });
}

function startAutoSlide() {
    sliderInterval = setInterval(() => {
        const slides = document.querySelectorAll(".slide");
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }, 5000);
}

function restartAutoSlide() {
    clearInterval(sliderInterval);
    startAutoSlide();
}

document.getElementById("searchBtn").addEventListener("click", () => {
    const q = document.getElementById("searchInput").value.trim();
    if (q) {
        window.location.href = `index.html?search=${encodeURIComponent(q)}`;
    }
});

document.getElementById("searchInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        document.getElementById("searchBtn").click();
    }
});
