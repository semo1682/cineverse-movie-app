const API_KEY = "206c1c394f566c10d5fd8c8555c8ae08";

const IMG_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_URL = "https://image.tmdb.org/t/p/original";

const TRENDING_URL = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;
const TOP_RATED_URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`;
const ACTION_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28`;
const COMEDY_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=35`;
const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

const trendingGrid = document.getElementById("trendingGrid");
const topRatedGrid = document.getElementById("topRatedGrid");
const actionGrid = document.getElementById("actionGrid");
const comedyGrid = document.getElementById("comedyGrid");
const searchResultsGrid = document.getElementById("searchResultsGrid");

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

const hero = document.getElementById("hero");
const heroTitle = document.getElementById("heroTitle");
const heroOverview = document.getElementById("heroOverview");
const infoBtn = document.getElementById("infoBtn");
const playBtn = document.getElementById("playBtn");

const movieModal = document.getElementById("movieModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalRating = document.getElementById("modalRating");
const modalDate = document.getElementById("modalDate");
const modalOverview = document.getElementById("modalOverview");
const watchTrailerBtn = document.getElementById("watchTrailerBtn");

let featuredMovie = null;

async function fetchMovies(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
}

async function initializeApp() {
  const trendingMovies = await fetchMovies(TRENDING_URL);
  const topRatedMovies = await fetchMovies(TOP_RATED_URL);
  const actionMovies = await fetchMovies(ACTION_URL);
  const comedyMovies = await fetchMovies(COMEDY_URL);

  if (trendingMovies.length > 0) {
    setHeroMovie(trendingMovies[0]);
  }

  renderMovies(trendingMovies, trendingGrid);
  renderMovies(topRatedMovies, topRatedGrid);
  renderMovies(actionMovies, actionGrid);
  renderMovies(comedyMovies, comedyGrid);
}

function setHeroMovie(movie) {
  featuredMovie = movie;

  const title = movie.title || movie.name || "Featured Movie";
  const overview = movie.overview || "No description available.";
  const backdrop = movie.backdrop_path
    ? `${BACKDROP_URL}${movie.backdrop_path}`
    : "";

  hero.style.backgroundImage = `url('${backdrop}')`;
  heroTitle.textContent = title;
  heroOverview.textContent = overview;
}

function renderMovies(movies, container) {
  container.innerHTML = "";

  if (!movies.length) {
    container.innerHTML = `<p>No movies found.</p>`;
    return;
  }

  movies.forEach((movie) => {
    const title = movie.title || movie.name || "Unknown Title";
    const poster = movie.poster_path
      ? `${IMG_URL}${movie.poster_path}`
      : "https://via.placeholder.com/500x750?text=No+Image";
    const vote = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
    const date = movie.release_date || "Unknown";
    const overview = movie.overview || "No overview available.";

    const movieCard = document.createElement("article");
    movieCard.classList.add("movie-card");

    movieCard.innerHTML = `
      <img class="movie-poster" src="${poster}" alt="${title}">
      <div class="movie-info">
        <h3 class="movie-title">${title}</h3>
        <div class="movie-meta">
          <span class="rating ${getRatingClass(movie.vote_average)}">${vote}</span>
          <span class="movie-date">${date}</span>
        </div>
        <p class="movie-overview">${overview}</p>
      </div>
    `;

    movieCard.addEventListener("click", () => openModal(movie));
    container.appendChild(movieCard);
  });
}

function getRatingClass(vote) {
  if (vote >= 7.5) return "green";
  if (vote >= 5) return "orange";
  return "red";
}

function openModal(movie) {
  const title = movie.title || movie.name || "Unknown Title";
  const poster = movie.poster_path
    ? `${IMG_URL}${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";
  const vote = movie.vote_average ? `Rating: ${movie.vote_average.toFixed(1)}` : "Rating: N/A";
  const date = movie.release_date ? `Release: ${movie.release_date}` : "Release: Unknown";
  const overview = movie.overview || "No overview available.";

  modalImage.src = poster;
  modalImage.alt = title;
  modalTitle.textContent = title;
  modalRating.textContent = vote;
  modalDate.textContent = date;
  modalOverview.textContent = overview;

  watchTrailerBtn.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(title + " trailer")}`;

  movieModal.classList.remove("hidden");
}

function closeModal() {
  movieModal.classList.add("hidden");
}

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = searchInput.value.trim();

  if (!query) {
    searchResultsGrid.innerHTML = "";
    return;
  }

  const results = await fetchMovies(`${SEARCH_URL}${encodeURIComponent(query)}`);
  renderMovies(results, searchResultsGrid);

  document.getElementById("searchResultsSection").scrollIntoView({
    behavior: "smooth"
  });
});

infoBtn.addEventListener("click", () => {
  if (featuredMovie) openModal(featuredMovie);
});

playBtn.addEventListener("click", () => {
  if (featuredMovie) {
    window.open(
      `https://www.youtube.com/results?search_query=${encodeURIComponent((featuredMovie.title || featuredMovie.name) + " trailer")}`,
      "_blank"
    );
  }
});

closeModalBtn.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);

initializeApp();