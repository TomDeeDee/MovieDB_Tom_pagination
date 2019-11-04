import Axios from "axios";
import { KEY } from "./config";
// import { page } from "./pagination";

export function initOverview() {
  document.getElementById("index").style.display = "block";
  getData();
  isPageOne();
  // getNext();
}


let movies;
let genres;
let page = 1;

function isPageOne(){
  const previousAction = document.querySelector("#previous");
  
if(page === 1){
  previousAction.style.opacity = 0.5;
  previousAction.removeEventListener("click", previous);
  previousAction.style.cursor = "default";
  }else{
  previousAction.style.opacity = 1;
  previousAction.addEventListener("click", previous);
  previousAction.style.cursor = "pointer";

  }
}

document.querySelector("#next").addEventListener("click", next);
function next() {
  page = page+1;
  getNext();
  console.log(page);
}

function previous() {
  if (page === 1){
    console.log("already one");
  }else{
    page = page-1;
    getNext();
    console.log(page);
  }
  }


// Genereer de data bij laden of klikken:
function getData() {
  
  Axios.get(
    "https://api.themoviedb.org/3/discover/movie?api_key=" + KEY + "&sort_by=popularity.desc&page=" + page
  ).then(response => {
    movies = response.data.results;

    Axios.get(
      "https://api.themoviedb.org/3/genre/movie/list?api_key=" + KEY
    ).then(responseGenre => {
      genres = responseGenre.data.genres;
      renderPage();
    });

  });
}

// Genereer de volgende pagina
// document.querySelector("#next").addEventListener("click", getNext);
function getNext() {
  
  document.querySelector("#index .row").innerHTML = "";
  getData();
  isPageOne();
}


// Kotjes zettem per film
function renderPage() {
  let genrenaam;
  movies.forEach(movie => {

    const movieGenres = [];
    movie.genre_ids.forEach(id => {
        const genre = genres.find(genre => genre.id === id).name;
        movieGenres.push(genre);
    });
    // console.log(movieGenres);
    var allHtml = "";
    for (genrenaam of movieGenres) {
        // console.log(genrenaam);
        allHtml += `<span class="badge badge-secondary">${genrenaam}</span>`;
    };

    document.querySelector("#index .row").innerHTML += `
        <div class="col-md-4 mb-4">
            <div class="card">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${movie.title} <span class="badge badge-primary">${movie.vote_average}</span></h5>
                <h6 class="card-subtitle mb-4">Release: ${movie.release_date}</h6>
                <p class="card-text mb-4">${movie.overview}</p>
                <div id="genrebox">${allHtml}</div>

                
                <a href="?movie=${movie.id}" class="btn btn-primary">Details</a>
            </div>
            </div>
        </div>
    `;
  });


}

