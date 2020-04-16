// Search and display movie
const SEARCH_URL = `http://www.omdbapi.com/?i=tt3896198&apikey=${apikey}`;
const show_movie = document.getElementById("displayMovies");


// Modal
const modal = document.getElementById("descriptionModal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementsByClassName("close")[0];

// Movie Request By User
movieRequest = (e) => {
    let requestedMovie = document.getElementsByTagName("input")[0].value;
    if (requestedMovie != "") searchMovie(requestedMovie);
    e.preventDefault();
};
document.getElementById("button-submit").addEventListener("click", movieRequest);

// Movie Research
searchMovie = (movie) => {
    let newUrl = SEARCH_URL + `&s=${movie}`;

    fetch(newUrl)
        .then((response) => response.json())
        .then((response) => {
            show_movie.innerHTML = "";
            const foundMovies = response.Search;
            console.log(response);
            foundMovies.forEach((movie) => {
                showMovie(movie.Poster, movie.Title, movie.Year, movie.imdbID);
            });
            return response;
        })
        .then((response) => {
            let observer = new IntersectionObserver(
                function (cards) {
                    cards.forEach(function (card) {
                        if (card.intersectionRatio > 0.3) {
                            card.target.classList.remove("not-visible");
                            console.log("Item visible");
                        }
                    });
                }, {
                    threshold: [0.5],
                }
            );

            let items = document.querySelectorAll(".card");
            items.forEach(function (item) {
                item.classList.add("not-visible");
                observer.observe(item);
            });
        })
        .catch((error) => console.error(error));
};

// ShowMovie
showMovie = (image, title, year, id) => {
    show_movie.innerHTML += `
    <div class="card mr-3 mt-5 mb-2 col-lg-5 p-0" style="width: 18rem;">
        <img class="card-img-top" src="${image}" alt="Card image cap">
        <div class="card-body">
            <p class="h1 card-title text-center">${title}</p>
            <p class="card-text">${year}</p>
        </div>
        <button type="button" class="btn btn-dark p-3 lead" onclick="seeMoreIsClicked('${image}', '${title}', '${year}', '${id}')" id="${id}">See more</button>
    </div>
`;
};

// Modal 
seeMoreIsClicked = (image, title, year, id) => {
    const DESCRIPTION_RESEARCH_URL = `http://www.omdbapi.com/?apikey=${apikey}&i=${id}`;

    fetch(DESCRIPTION_RESEARCH_URL)
        .then((response) => response.json())
        .then((response) => {
            console.log(response);
            return response;
        })
        .then((response) => {
            let description = response.Plot;
            showDescription(image, title, year, description);
        })
        .catch((error) => console.error(error));
};

showDescription = (image, title, year, description) => {
    modal.style.display = "block";
    modalContent.innerHTML = `
      <div class="col-sm ml-2">
        <img src="${image}" alt="No image" />
      </div>
      <div class="col-lg-8 text-justify">
        <h1>${title}</h1>
        <h4 class="text-right mr-5">${year}</h4>
        <p class="container mt-5 pr-5 h4">${description}</p>
      </div>
  `;
};
closeDescription = () => {
    modal.style.display = "none";
};
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};