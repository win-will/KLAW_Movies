var omdbAPIkey = "31aa90e4";
var imdbAPIkey = "k_lomgkwyt";
var titleEl = document.getElementById("#movietitle");
var searchMovie = "";
var personalMainImage = $("#personalMainImg");

let favMovies= { personalSaves:[] };
let moveTitleGlobal = "";
let posterGlobal = "";
let pboxIndex = 0;
let loadingImage = "./assets/images/loading.gif"
let errorImage = "./assets/images/error.jpg"

//After a refresh check to see if the local storage has values
let savedPosters = JSON.parse(localStorage.getItem('favMovies'));

//Hide add favorites
$("#favBtn").hide();

if(savedPosters != null){
    // console.log("Loading posters");
    favMovies = savedPosters;
    // $("#favorites").empty();
    
    $("#pbox" + pboxIndex).empty();
    
    //Add items from local storage to personalized page
    for(var i = 0; i < savedPosters.personalSaves.length; i++){    
        $("#pbox" + pboxIndex).empty();
        $("#pbox" + pboxIndex).append(`<img src="`  + savedPosters.personalSaves[i].poster + `" style="max-width:100%;">`);
        pboxIndex++;    
    } 
}

//modal2 for Site Map
$("#siteMapBtn").on("click", async function(event){
    document.getElementById('modal2').classList.add(isVisible);
});

//Case 0 is it doesn't display when the site loaded
//Case 1 is user clicks on Add Favs and the Add button goes away and Added Favorite appears
//Case 2 user search for the same movie and the Added Favorites appears but the button doesn't appear



//Get movie details and posters
$("#searchBtn").on("click", async function(event){
    event.stopPropagation();
    var notSaved = false;

    // $("#favBtn").show();
    // $("#addedFav").hide();


    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);

    if ($("#searchmovies").val()) {
        searchMovie = $("#searchmovies").val();

        //append search history
        if ($("#selectVal").val() === "Recent Searches"){

            $("#selectVal").empty();
            $("#selectVal").append("<option>"+$("#searchmovies").val()+"</option>");

        }
        else {
            $("#selectVal").append("<option>"+$("#searchmovies").val()+"</option>");

        }


    }
    else if ($("#selectVal").val() != "Recent Searches"){
        searchMovie = $("#selectVal").val();
    }
    else {
        console.log("Error Nothing selected for search");
    }

    
    if (searchMovie) {
        // clearMovie();

        if ($("input[type='radio']:checked").attr("id") === "imdbSearch"){
            getIMDBmovies();
        }
        else if($("input[type='radio']:checked").attr("id") === "omdbSearch"){
            getOMDBmovies();
        }
        else if ($("input[type='radio']:checked").attr("id") === "tmdbSearch"){
            getTMDBmovies();
        }
        else{
            console.log("Error with gathering API search info from search form");
        }
    }
});

//Add movies to the personalized page
$("#favBtn").on("click", function(event){
    event.stopPropagation();

    $("#favBtn").hide();
    $("#addedFav").show();

    personal = { movieTitle: "", poster: "" };
    personal.movieTitle = moveTitleGlobal;
    personal.poster = posterGlobal;
    var notSaved = true;

    //Don't add items if they exist on the personalized page
    for (let i = 0; i < favMovies.personalSaves.length; i++) {

        if (personal.movieTitle === favMovies.personalSaves[i].movieTitle) {
            notSaved = false;
            break;
        }
    }

    //Save new items to local storage and place in memory
    if (notSaved){

        if (pboxIndex === 8) {
            //console.log("save after pbox 8 -- pbox is " + pboxIndex)
            favMovies.personalSaves.shift();
            favMovies.personalSaves.push(personal);
            localStorage.setItem("favMovies", JSON.stringify(favMovies));
            
            for (let i = 0; i < favMovies.personalSaves.length; i++){
                $("#pbox" + pboxIndex).empty();
                $("#pbox" + pboxIndex).append(`<img src="`  + favMovies.personalSaves[i].poster + `" style="max-width:100%;">`);
            }
           
        }
        else{
            // console.log("save before pbox 8 -- pbox is " + pboxIndex)
            favMovies.personalSaves.push(personal);
            localStorage.setItem("favMovies", JSON.stringify(favMovies));
            $("#pbox" + pboxIndex).empty();
            $("#pbox" + pboxIndex).append(`<img src="`  + personal.poster + `" style="max-width:100%;">`);
            pboxIndex++;
        }
        
    }

    return true;
});

for (let i = 0; i < 8; i++) {
    $("#pbox" + i).on("click", function(event){
        event.stopPropagation();
        console.log(this.children[0])
        console.log(this.children[0].getAttribute("src"));
        console.log(!this.innerHTML.includes("add_favorites.jpg"));

        if (!this.innerHTML.includes("add_favorites.jpg")){
            personalMainImage.empty();
            personalMainImage.attr('src', this.children[0].getAttribute("src"));
        }
    
    });
}

//API call for the posters that also adds items to the home page
function getIMDBmovies(){
    
    var imdbAPI = "https://imdb-api.com/API/AdvancedSearch/" + imdbAPIkey + "/?title=" + searchMovie;
    // console.log(imdbAPI);
        fetch(imdbAPI)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log(data);
            var poster = data.results[0].image;
            var titleVal = data.results[0].title;        
            var yearVal = data.results[0].description.split('(')[1].split('–')[0];
            var plotVal = data.results[0].plot;
            var ratingVal = data.results[0].imDbRating;
            var notSaved = true;

            for (let i = 0; i < favMovies.personalSaves.length; i++) {

                console.log(titleVal);
                console.log(favMovies.personalSaves[i].movieTitle);

                if (titleVal === favMovies.personalSaves[i].movieTitle) {
                    notSaved = false;
                    break;
                }
            }
        
            if (notSaved){
                $("#favBtn").show();
                $("#addedFav").hide();
            }
            else {
                $("#favBtn").hide();
                $("#addedFav").show();
            }

            $("#movieTitle").text(titleVal);
            $("#releaseYear").text(yearVal);
            $("#moviePoster").attr('src', poster);
            $("#moviePlot").text("Summary: " + plotVal);


            if (ratingVal > 8){
                $("#ratingEl").text("IMDB Rating: " + ratingVal);
            }
            else {
                $("#ratingEl").text("IMDB Rating: " + ratingVal + " (Highly Rated!)");
            }
            
            posterGlobal = poster;
            moveTitleGlobal = titleVal;
            // console.log(moveTitleGlobal + " " + posterGlobal);

           
            return true;
        });

    return true;
};

function getTMDBmovies(){
    var tmDBAPI = `https://api.themoviedb.org/3/search/movie?api_key=ae8cbfc11d012e219d3b44e276a96f51&language=en-US&page=1&include_adult=false&query="` + searchMovie + `"`;

    fetch(tmDBAPI)
        .then(function(response){
            return response.json();       
            
        })
        .then(function(data){
            var poster = "https://image.tmdb.org/t/p/w500" + data.results[0].poster_path;
            var titleVal = data.results[0].title;        
            var yearVal = data.results[0].release_date.split('-')[0];
            var plotVal = data.results[0].overview;
            var ratingVal = data.results[0].vote_average;
            var notSaved = true;

            for (let i = 0; i < favMovies.personalSaves.length; i++) {

                console.log(titleVal);
                console.log(favMovies.personalSaves[i].movieTitle);

                if (titleVal === favMovies.personalSaves[i].movieTitle) {
                    notSaved = false;
                    break;
                }
            }
        
            if (notSaved){
                $("#favBtn").show();
                $("#addedFav").hide();
            }
            else {
                $("#favBtn").hide();
                $("#addedFav").show();
            }

            $("#movieTitle").text(titleVal);
            $("#releaseYear").text(yearVal);
            $("#moviePoster").attr('src', poster);
            $("#moviePlot").text("Summary: " + plotVal);


            if (ratingVal > 8){
                $("#ratingEl").text("IMDB Rating: " + ratingVal);
            }
            else {
                $("#ratingEl").text("IMDB Rating: " + ratingVal + " (Highly Rated!)");
            }
            
            posterGlobal = poster;
            moveTitleGlobal = titleVal;
           
            return true;
        });

    return true;
};

//API call for movie details that also adds items to the home pages
function getOMDBmovies(){
    var omdbAPI = "http://www.omdbapi.com/?apikey=31aa90e4&t=" + searchMovie + "&plot=full&r=json";
    console.log(omdbAPI);
    fetch(omdbAPI)
        .then(function(response){
        return response.json();

    })
    
    .then(function(data){
        var poster = data.Poster;
        var titleVal = data.Title;        
        var yearVal = data.Year;
        var plotVal = data.Plot;
        var ratingVal = data.imdbRating;
        var titleVal = data.Title;
        var yearVal = data.Year;
        var plotVal = data.Plot;
        var ratingVal = data.imdbRating;
        var notSaved = true;

        for (let i = 0; i < favMovies.personalSaves.length; i++) {

            console.log(titleVal);
            console.log(favMovies.personalSaves[i].movieTitle);

            if (titleVal === favMovies.personalSaves[i].movieTitle) {
                notSaved = false;
                break;
            }
        }
    
        if (notSaved){
            $("#favBtn").show();
            $("#addedFav").hide();
        }
        else {
            $("#favBtn").hide();
            $("#addedFav").show();
        }

        $("#movieTitle").text(titleVal);
        $("#releaseYear").text(yearVal);
        $("#moviePoster").attr('src', poster);
        $("#moviePlot").text("Summary: " + plotVal);


        if (ratingVal > 8){
            $("#ratingEl").text("IMDB Rating: " + ratingVal);
        }
        else {
            $("#ratingEl").text("IMDB Rating: " + ratingVal + " (Highly Rated!)");
        }

        posterGlobal = poster;
        moveTitleGlobal = titleVal;

        return true;
    })

    return true;
};


//Modal Open and close functionality
const openEls = document.querySelectorAll("[data-open]");
const closeEls = document.querySelectorAll("[data-close]");
const isVisible = "is-visible";
 
// $("searchBtn").on("click", function() {
    
// });

for (const el of closeEls) {
    console.log(el);
    el.addEventListener("click", function() {
        document.querySelector(".modal.is-visible").classList.remove(isVisible);
        console.log("Here");
    });
}
 
document.addEventListener("keyup", e => {
  if (e.key == "Escape" && document.querySelector(".modal.is-visible")) {
    document.getElementById('para').classList.remove(isVisible);
  }
  
});

//Hamburger menu
document.addEventListener('DOMContentLoaded', () => {

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  
    // Add a click event on each of them
    $navbarBurgers.forEach( el => {
      el.addEventListener('click', () => {
  
        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);
  
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
  
      });
    });
  
  });


//Clear movie details and posters form home page
// function clearMovie(){
//     $("#movie-title").empty();
//     $("#movie-poster").empty();
//     $("#movie-data").empty();
// }


$("#homeSec").show();
$("#searchBar").show();
$("#aboutSec").hide();
$("#personalizeSec").hide();
$("#top20Sec").hide();
$("#triviaSec").hide();


$("#homeBtn").on("click", function(){
    $("#homeSec").show();
    $("#searchBar").show();
    $("#aboutSec").hide();
    $("#personalizeSec").hide();
    $("#top20Sec").hide();
    $("#triviaSec").hide();

    // clearMovie()
    $(".display-poster").css('display', "inline")

});

$("#aboutBtn").on("click", function(){
    $("#homeSec").hide();
    $("#aboutSec").show();
    $("#personalizeSec").hide();
    $("#top20Sec").hide();
    $("#triviaSec").hide();
    $("#searchBar").hide();

});

$("#personalizeBtn").on("click", function(){
    $("#homeSec").hide();
    $("#aboutSec").hide();
    $("#personalizeSec").show();
    $("#top20Sec").hide();
    $("#triviaSec").hide();
    $("#searchBar").show();

});

$("#top20Btn").on("click", function(){
    $("#homeSec").hide();
    $("#aboutSec").hide();
    $("#personalizeSec").hide();
    $("#top20Sec").show();
    $("#triviaSec").hide();
    $("#searchBar").hide();

});

var clickedTriviaBtn = false;
$("#triviaBtn").on("click", function(){
    $("#homeSec").hide();
    $("#aboutSec").hide();
    $("#personalizeSec").hide();
    $("#top20Sec").hide();
    $("#triviaSec").show();
    $("#searchBar").hide();

   
    $("#guessingGame").hide();
    $("#quizPage").hide();
    $("#matchingGame").hide();
    $("#progressBar").hide();
    $("gameStatus").hide();

    $("#gamesMiddleMovies").show();
    $("#gamesMiddle").show();
    clickedTriviaBtn = true;

    restartGames();

});

$("#poster1").on("click", function(){
    // clearMovie()
    // $("#favBtn").show();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie="Spirited Away";
    getTMDBmovies()
    // getMovie(searchMovie);
});

$("#poster2").on("click", function(){
    // clearMovie()
    // $("#favBtn").show();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie="Independence Day";
    getTMDBmovies()
    // getMovie(searchMovie);
});

$("#poster3").on("click", function(){
    // clearMovie()
    // $("#favBtn").show();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie="Insidious";
    getTMDBmovies()
    // getMovie(searchMovie);
});

$("#poster4").on("click", function(){
    // clearMovie()
    // $("#favBtn").show();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie="The Devil Wears Prada";
    getTMDBmovies()
    // getMovie(searchMovie);
});

$("#poster5").on("click", function(){
    // clearMovie()
    // $("#favBtn").show();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie="The English Patient";
    getTMDBmovies()
    // getMovie(searchMovie);
});

//Code for Favorites Section

function favoriteMoviesTMDB(){
    var tmDBAPI = `https://api.themoviedb.org/3/search/movie?api_key=ae8cbfc11d012e219d3b44e276a96f51&language=en-US&page=1&include_adult=false&query="` + searchMovie + `"`;
    console.log(tmDBAPI);

    fetch(tmDBAPI)
        .then(function(response){
            return response.json();       
            
        })
        .then(function(data){
            var poster = "https://image.tmdb.org/t/p/w500" + data.results[0].poster_path;
            var titleVal = data.results[0].title;        
            var yearVal = data.results[0].release_date;
            var plotVal = data.results[0].overview;
            var ratingVal = data.results[0].vote_average;
            var notSaved = true;

            for (let i = 0; i < favMovies.personalSaves.length; i++) {

                console.log(titleVal);
                console.log(favMovies.personalSaves[i].movieTitle);

                if (titleVal === favMovies.personalSaves[i].movieTitle) {
                    notSaved = false;
                    break;
                }
            }
        
            if (notSaved){
                $("#favBtn").show();
                $("#addedFav").hide();
            }
            else {
                $("#favBtn").hide();
                $("#addedFav").show();
            }

            $("#movieTitle").text(titleVal);
            $("#releaseYear").text(yearVal);
            $("#moviePoster").attr('src', poster);
            $("#moviePlot").text("Summary: " + plotVal);


            if (ratingVal > 8){
                $("#ratingEl").text("IMDB Rating: " + ratingVal);
            }
            else {
                $("#ratingEl").text("IMDB Rating: " + ratingVal + " (Highly Rated!)");
            }
            
            posterGlobal = poster;
            moveTitleGlobal = titleVal;
           
            return true;
        });

    return true;
};

function favoriteMoviesIMDB(){
    
    var imdbAPI = "https://imdb-api.com/en/API/SearchMovie/k_a87jnn16/" + searchMovie;
    // console.log(imdbAPI);
        fetch(imdbAPI)
        .then(function(response){
            return response.json();       
            
        })
        .then(function(data){
            console.log(data);
            var poster = data.results[0].image;
            var titleVal = data.results[0].title;        
            var yearVal = data.results[0].description;
            var plotVal = data.results[0].plot;
            var ratingVal = data.results[0].imDbRating;
            var notSaved = true;

            for (let i = 0; i < favMovies.personalSaves.length; i++) {

                console.log(titleVal);
                console.log(favMovies.personalSaves[i].movieTitle);

                if (titleVal === favMovies.personalSaves[i].movieTitle) {
                    notSaved = false;
                    break;
                }
            }
        
            if (notSaved){
                $("#favBtn").show();
                $("#addedFav").hide();
            }
            else {
                $("#favBtn").hide();
                $("#addedFav").show();
            }

            $("#movieTitle").text(titleVal);
            $("#releaseYear").text(yearVal);
            $("#moviePoster").attr('src', poster);
            $("#moviePlot").text("Summary: " + plotVal);


            if (ratingVal > 8){
                $("#ratingEl").text("IMDB Rating: " + ratingVal);
            }
            else {
                $("#ratingEl").text("IMDB Rating: " + ratingVal + " (Highly Rated!)");
            }
            
            posterGlobal = poster;
            moveTitleGlobal = titleVal;

           
            return true;
        });

    return true;
};

// function clearFavorite(){
//     $("#favorite-title").empty();
//     $("#favorite-poster").empty();
//     $("#favorite-data").empty();
// }

$("#top20Btn").on("click", function(){
    $("#homeSec").hide();
    $("#aboutSec").hide();
    $("#personalizeSec").hide();
    $("#top20Sec").show();
    $("#triviaSec").hide();
    $("#displayFav").hide();

});

$("#kelsie1").on("click", function(){
    // clearFavorite();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie = "Uptown Girls";
    favoriteMoviesTMDB(searchMovie);
});

$("#kelsie2").on("click", function(){
    // clearFavorite();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie = "Ella Enchanted";
    favoriteMoviesTMDB(searchMovie);
});

$("#kelsie3").on("click", function(){
    // clearFavorite();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie = "New York Minute";
    favoriteMoviesTMDB(searchMovie);
});

$("#kelsie4").on("click", function(){
    // clearFavorite();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie = "The Lorax";
    favoriteMoviesTMDB(searchMovie);
});

$("#kelsie5").on("click", function(){
    // clearFavorite();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie = "The Social Network";
    favoriteMoviesTMDB(searchMovie);
});

$("#lauren1").on("click", function(){
    // clearFavorite();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie = "Spirited Away";
    favoriteMoviesIMDB(searchMovie);
});

$("#lauren2").on("click", function(){
    // clearFavorite();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie = "My Neighbor Totoro";
    favoriteMoviesTMDB(searchMovie);
});

$("#lauren3").on("click", function(){
    // clearFavorite();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie = "Your Name";
    favoriteMoviesIMDB(searchMovie);
});

$("#lauren4").on("click", function(){
    // clearFavorite();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie = "Sinister";
    favoriteMoviesTMDB(searchMovie);
});

$("#lauren5").on("click", function(){
    // clearFavorite();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie = "As Above So Below";
    favoriteMoviesTMDB(searchMovie);
});

$("#drew1").on("click", function(){
    // clearFavorite();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie = "Hitch";
    favoriteMoviesTMDB(searchMovie);
});

$("#drew2").on("click", function(){
    // clearFavorite();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie = "The Secret Life of Walter Mitty";
    favoriteMoviesTMDB(searchMovie);
});

$("#drew3").on("click", function(){
    // clearFavorite();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie = "The Green Mile";
    favoriteMoviesTMDB(searchMovie);
});

$("#drew4").on("click", function(){
    // clearFavorite();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie = "Treasure Planet";
    favoriteMoviesTMDB(searchMovie);
});

$("#drew5").on("click", function(){
    // clearFavorite();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie = "Guardians of the Galaxy Vol. 2";
    favoriteMoviesTMDB(searchMovie);
});

$("#will1").on("click", function(){
    // clearFavorite();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie = "Back to the Future Part II";
    favoriteMoviesTMDB(searchMovie);
});

$("#will2").on("click", function(){
    // clearFavorite();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie = "Terminator 2";
    favoriteMoviesTMDB(searchMovie);
});

$("#will3").on("click", function(){
    // clearFavorite();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie = "Forest Gump";
    favoriteMoviesTMDB(searchMovie);
});

$("#will4").on("click", function(){
    // clearFavorite();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie = "Memento";
    favoriteMoviesTMDB(searchMovie);
});

$("#will5").on("click", function(){
    // clearFavorite();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie = "Black Panther";
    favoriteMoviesTMDB(searchMovie);

});

$("#poster6").on("click", function(){
    // clearMovie()
    // $("#favBtn").show();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie="Ella Enchanted";
    getTMDBmovies()
    // getMovie(searchMovie);
});

$("#poster7").on("click", function(){
    // clearMovie()
    // $("#favBtn").show();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie="My Neighbor Totoro";
    getTMDBmovies()
    // getMovie(searchMovie);
});

$("#poster8").on("click", function(){
    // clearMovie()
    // $("#favBtn").show();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie="The Secret Life of Walter Mitty";
    getTMDBmovies()
    // getMovie(searchMovie);
});

$("#poster9").on("click", function(){
    // clearMovie()
    // $("#favBtn").show();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie="Terminator 2 Judgement Day";
    getTMDBmovies()
    // getMovie(searchMovie);
});


var dropdown1 = document.getElementById('kelsieDropDown');
var dropdown2 = document.getElementById('laurenDropDown');
var dropdown3 = document.getElementById('drewDropDown');
var dropdown4 = document.getElementById('willDropDown');
var dropdown5 = document.getElementById('gamesDropDown');

dropdown1.addEventListener('click', function(event) {
    event.stopPropagation();
    dropdown1.classList.toggle('is-active');
});

dropdown2.addEventListener('click', function(event) {
    event.stopPropagation();
    dropdown2.classList.toggle('is-active');
});

dropdown3.addEventListener('click', function(event) {
    event.stopPropagation();
    dropdown3.classList.toggle('is-active');
});

dropdown4.addEventListener('click', function(event) {
    event.stopPropagation();
    dropdown4.classList.toggle('is-active');
});

dropdown5.addEventListener('click', function(event) {
    event.stopPropagation();
    dropdown5.classList.toggle('is-active');
});

var gameType = "";
var maxProgess = null;
var currentProgress = 0;

function updateProgress(){
    currentProgress++;
    $("#progressBar").attr("value",currentProgress);
}

$("#selectMatching").on("click", function(){
    $("#gamesMiddleMovies").hide();
    $("#guessingGame").hide();
    $("#quizPage").hide();
    $("#matchingGame").show();
    $("#gameStatus").show();
    $("#gamesMiddle").hide();
    $("#progressBar").show();
    $("#navbarMenuHeroB").hide();

    document.getElementById('gameName').innerHTML = `<p class="is-size-2 has-text-weight-semibold">Match Movie Poster With Release Year</p><br>`;
    document.getElementById('gameInstructions').innerHTML ="<p>You have 90 seconds to match the movie images with the release year of the movie. The bar at the top indicates your progress in this game, and the timer lets you know how much time is left in it.</p>";
    document.getElementById('modal3').classList.add(isVisible);
    //Set Game Type
    gameType = "match";
    maxProgess = 5;
    $("#progressBar").attr("max","5");
});

$("#selectGuessing").on("click", function(){
    $("#gamesMiddleMovies").hide();
    $("#guessingGame").show();
    $("#quizPage").hide();
    $("#matchingGame").hide();
    $("#gamesMiddle").hide();
    $("#gameStatus").show();
    $("#progressBar").show();
    $("#navbarMenuHeroB").hide();

    document.getElementById('gameName').innerHTML = `<p class="is-size-2 has-text-weight-semibold">Guess This Movie Title</p><br>`;
    document.getElementById('gameInstructions').innerHTML ="<p>You have 90 seconds to guess correct movie title for the image using your the keys on your keyboard. The bar at the top indicates your progress in this game, and the timer lets you know how much time is left in it.</p>";
    document.getElementById('modal3').classList.add(isVisible);
    //Set Game 
    $("#progressBar").attr("max","9");
    maxProgess = 9;
    gameType = "guess";
});

$("#selectTrivia").on("click", function(){
    $("#gamesMiddleMovies").hide();
    $("#guessingGame").hide();
    $("#quizPage").show();
    $("#matchingGame").hide();
    $("#gamesMiddle").hide();
    $("#gameStatus").show();
    $("#progressBar").show();
    $("#navbarMenuHeroB").hide();

    startGame();
    document.getElementById('gameName').innerHTML = `<p class="is-size-2 has-text-weight-semibold">Movie Trivia</p><br>`;
    document.getElementById('gameInstructions').innerHTML ="<p>You have 90 seconds to guess correct movie titles for the images that wil be displayed. The bar at the top indicates your progress in this game, and the timer lets you know how much time is left in it.</p>";

    document.getElementById('modal3').classList.add(isVisible);
    //Set Game Type
    console.log($("#progressBar"));
    $("#progressBar").attr("max","5");
    maxProgess = 5;
    gameType = "trivia";
});

var timeLeft = 90;
var gameComplete = false;

$("#startGames").on("click", function (event) {
    // event.preventDefault();
    event.stopPropagation();
    timeLeft = 90;
    currentProgress = 0;
    $("#progressBar").attr("value","0");

    
    // Use the `setInterval()` method to call a function to be executed every 1000 milliseconds
    var timeInterval = setInterval(function () {
      // As long as the `timeLeft` is greater than 1
      if (timeLeft > 0) {
        // Set the `textContent` of `timerEl` to show the remaining seconds
        $("#timer").text("Time: " + timeLeft);
        // Decrement `timeLeft` by 1
        timeLeft--;
      
      } else {
        // Once `timeLeft` gets to 0, set `timerEl` to an empty string
        
        $("#timer").text("Time: 90");

        clearInterval(timeInterval);
        if (gameComplete){
            $("#gameOver").text("You completed this activity!");
            if (gameType === "trivia"){
                $("#overallProgress").text("You got " + score + " out of " + maxProgess + " answers correct.");
            }

            document.getElementById('modal4').classList.add(isVisible);            
        }
        else {
           $("#gameOver").text("This activity timed out.");
           if (gameType === "trivia"){
                $("#overallProgress").text("You got " + score + " out of " + maxProgess + " answers correct.");
            }

            document.getElementById('modal4').classList.add(isVisible);
        }
  
      }
  
    }, 1000);

});


$("#returnGames").on("click", function (event) {
    restartGames();
    $("#gamesMiddleMovies").show();
    $("#guessingGame").hide();
    $("#quizPage").hide();
    $("#matchingGame").hide();
    $("#gamesMiddle").show();
    $("#gameStatus").hide();
    $("#progressBar").hide();
    $("#navbarMenuHeroB").show();

});


//Matching Game

var cards = [
    {
        src: "./assets/images/matchPosters/beverly_hills_cop_3.jpg",
        id: "1"
    },
    {
        src: "./assets/images/matchPosters/1994.jpg",
        id: "1"
    },
    {
        src: "./assets/images/matchPosters/true_romance.jpg",
        id: "2"
    },

    {
        src: "./assets/images/matchPosters/1993.jpg",
        id: "2"
    },
    {
        src: "./assets/images/matchPosters/predator_2.jpg",
        id: "3"
    },
    {
        src: "./assets/images/matchPosters/1990.jpg",
        id: "3"
    },

    {
        src: "./assets/images/matchPosters/back_to_the_future_2.jpg",
        id: "4"
    },
    {
        src: "./assets/images/matchPosters/1989.jpg",
        id: "4"
    },
    {
        src: "./assets/images/matchPosters/oceans_eleven.jpg",
        id: "5"
    },
    {
        src: "./assets/images/matchPosters/2001.jpg",
        id: "5"
    }
];

// console.log(cards);cards = shuffleArray(cards);
var imgHtmlhidden = `<img style="max-width:75%;" src="./assets/images/matchPosters/hiddenCard.png">`
var activated = [];

for (let i = 0; i < 10; i++){
    activated.push(false);
    $("#matchBtn" + i).append(imgHtmlhidden);

}
    
firstCardIndex = null;
    
for (let i = 0; i < 10; i++){

    $("#matchBtn" + i).on("click", async function(){  
        if (!activated[i]) {
            var imgHtml = `<img style="max-width:75%;" src="` + cards[i].src + `">`
            $("#matchBtn" + i).empty();
            $("#matchBtn" + i).append(imgHtml);

            if (firstCardIndex != null){

                if (cards[i].id === cards[firstCardIndex].id){
                    activated[i] = true;
                    activated[firstCardIndex] = true;
                    updateProgress();

                    if (!activated.includes(false)) {
                        gameComplete = true;
                        timeLeft = 0;
                    }
                }
                else {
                    await sleep(1000);
                    $("#matchBtn" + i).empty();
                    $("#matchBtn" + i).append(imgHtmlhidden);
                    $("#matchBtn" + firstCardIndex).empty();
                    $("#matchBtn" + firstCardIndex).append(imgHtmlhidden);
                }

                firstCardIndex = null;
            }
            else {

                firstCardIndex = i;
            }
        }
    
    });
}






$("#resetMatchBtn").on("click", function(){
    cards = shuffleArray(cards);
    activated = [];

    for(i=0; i < cards.length;i++){
        activated.push(false);
        $("#matchBtn" + i).empty();
        $("#matchBtn" + i).append(imgHtmlhidden);
    }
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}           

function shuffleArray(arr) {
    arr.sort(() => Math.random() - 0.5);
    return arr;
}

//Guessing
var matchTitle = "INCEPTION"
var printTitle = ""

for (let i = 0; i < matchTitle.length;i++){

    printTitle = printTitle + "_";
}

$("#matchTitle").text(printTitle);

$(document).keydown(function(event) {

    // alert('You pressed down a key ' + );
    if (matchTitle.includes(String.fromCharCode(event.which))){
        

        for (let i = 0; i < matchTitle.length; i++) {
            
            if (matchTitle[i] === String.fromCharCode(event.which)){
                console.log(matchTitle[i] + " = " + String.fromCharCode(event.which))
                printTitle = replaceChar(printTitle, i, String.fromCharCode(event.which))
                updateProgress();
            //     console.log(printTitle[i] = );
            }
        
        }
        
        $("#matchTitle").text(printTitle);

        if (!printTitle.includes("_")){

            gameComplete = true;
            timeLeft = 0;

        }

    }
    else {

        console.log(String.fromCharCode(event.which));
    }
    
});

function replaceChar(str, index, replacement) {
    if (index >= str.length) {
        return str.valueOf();
    }
 
    var chars = str.split('');
    chars[index] = replacement;
    return chars.join('');
}

function loadBackdrops() {

    var posters = "https://api.themoviedb.org/3/movie/27205/similar?api_key=ae8cbfc11d012e219d3b44e276a96f51&language=en-US&page=1";
}

$("#poster10").on("click", function(){
    // clearMovie()
    // $("#favBtn").show();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie="New Your Minute";
    getTMDBmovies()
    // getMovie(searchMovie);
});

$("#poster11").on("click", function(){
    // clearMovie()
    // $("#favBtn").show();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie="Your Name";
    getTMDBmovies()
    // getMovie(searchMovie);
});

$("#poster12").on("click", function(){
    // clearMovie()
    // $("#favBtn").show();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie="The Green Mile";
    getTMDBmovies()
    // getMovie(searchMovie);
});

$("#poster13").on("click", function(){
    // clearMovie()
    // $("#favBtn").show();
    $("#movieTitle").empty
    $("#releaseYear").empty
    $("#moviePoster").attr('src', loadingImage);
    $("#moviePlot").empty

    document.getElementById('modal1').classList.add(isVisible);
    searchMovie="Forest Gump";
    getTMDBmovies()
    // getMovie(searchMovie);
});


//Trivia Game 
var startQuiz = document.querySelector("#startTriviaQuiz");
var startQuizBtn = document.querySelector("#startGameTrivia");
var quizPage = document.querySelector("#quizPage");
var questionList = document.querySelector("#questionList");
var buttonA = document.querySelector("#A");
var buttonB = document.querySelector("#B");
var buttonC = document.querySelector("#C");
var buttonD = document.querySelector("#D");
var endGame = document.querySelector("#endGame");
var answerChoice = document.querySelector("#rightwrong");
var yourScore = document.querySelector("#yourScore");
var finalScore = document.querySelector("#finalscore");
var restartQuizBtn = document.querySelector("#restartQuiz");
var endQuizBtn = document.querySelector("#endQuiz");

var myImage = document.getElementById("#movieImageOne");
var questionIndex = 0;
var imageIndex = 1;
var correctAnswer;
var score = 0;
var text = document.createElement("text");

var imageArray = [
    './assets/images/rent.png',
    './assets/images/brothersGrimm.png',
    './assets/images/it.png',
    './assets/images/schindlersList.png',
    './assets/images/halfBloodPrince.png'
];

 function showImage()  {
    $("#movieImageOne").attr("src", imageArray[questionIndex]);

 }

var answersI = 0;
var answers = ["A","B","C","D"];

$("#A").on("click", function () {
    checkAnswer("A");
});

$("#B").on("click", function () {
    checkAnswer("B");
});

$("#C").on("click", function () {
    checkAnswer("C");
});

$("#D").on("click", function () {
    checkAnswer("D");
});

    
var quizQuestions = [
    {
        question: "What is the title of this movie?",

        A: "My Girl",
        B: "Rent",
        C: "The Perfect Storm",
        D: "Raising Helen",

        correctChoice: "B"
    },
    {
        question: "What year was 'The Brother's Grimm' released?",

        A: "2005",
        B: "2001",
        C: "1999",
        D: "2007",

        correctChoice: "A"
    },
    {
        question: "Who was the director the movie 'It'?",

        A: "Steven Spielberg",
        B: "Christoper Nolan",
        C: "David Fincher",
        D: "Andrés Muschietti",

        correctChoice: "D"
    },
    {
        question: "What year was 'Schindler's List' released?",

        A: "1994",
        B: "1992",
        C: "2005",
        D: "2000",

        correctChoice: "A"

    },
    {

        question: "Which Harry Potter movie is this?",

        A: "Chamber of Secrets",
        B: "Goblet of Fire",
        C: "Order of the Phoenix",
        D: "Half-Blood Prince",

        correctChoice: "D"

    }
];

var quizLength = quizQuestions.length

function startGame() {
    console.log("startGame");
    showImage();
    addQuizQuestions();
    questionIndex++;
    endGame.style.display = "none";
    quizPage.style.display = "block";
    updateProgress();
    

};

// startQuizBtn.addEventListener("click", startGame);

function addQuizQuestions() {
    // console.log(quizQuestions[questionIndex].question);
    var currentQuestion = quizQuestions[questionIndex];
    questionList.textContent = currentQuestion.question;
    buttonA.textContent = "A. " + currentQuestion.A;
    buttonB.textContent = "B. " + currentQuestion.B;
    buttonC.textContent = "C. " + currentQuestion.C;
    buttonD.textContent = "D. " + currentQuestion.D;
    
};

function checkAnswer (answer) {
    updateProgress();
    // console.log((questionIndex-1));

    if (questionIndex-1<5) {
        
        correct = quizQuestions[questionIndex-1].correctChoice;
        if (answer === correct) {
            text.textContent = 'Correct';
            score++;
            // console.log(score);
            console.log("Correct");
        } 
        else {
            console.log("Incorrect");
            text.textContent = 'Incorrect';
        }
        rightwrong.setAttribute("style", "display:Block");
        rightwrong.appendChild(text);
        
    }
    if (questionIndex < 5) {
        showImage();
        addQuizQuestions();
        questionIndex++;
    }
    else {
        // displayScore();
        gameComplete = true;
        timeLeft = 0;

    }   
};


function displayScore(){
    $('#quizPage').hide();
    $('#endGame').show();
    finalScore.textContent = score + " out of " + quizLength;   
};

endQuizBtn.addEventListener("click", function(){
    endGame.setAttribute("style", "display: none");
    quizPage.setAttribute("style", "display: none");
    score=0;
    questionIndex=0;
    text.textContent = "";
});

restartQuizBtn.addEventListener("click", function(){
    endGame.setAttribute("style", "display: none");
    quizPage.setAttribute("style", "display: none");
    score=0;
    questionIndex=0;
    text.textContent = "";
    startGame();
});

function restartGames() {

    //Reset Trivia
    endGame.setAttribute("style", "display: none");
    quizPage.setAttribute("style", "display: none");
    score=0;
    questionIndex=0;
    text.textContent = "";

    //Reset Guessing
    printTitle = ""
    for (let i = 0; i < matchTitle.length;i++){

        printTitle = printTitle + "_";
    }

    console.log(printTitle);

    $("#matchTitle").empty
    $("#matchTitle").text(printTitle);

    //Reset Match Game
    cards = shuffleArray(cards);
    activated = [];

    for(i=0; i < cards.length;i++){
        activated.push(false);
        $("#matchBtn" + i).empty();
        $("#matchBtn" + i).append(imgHtmlhidden);
    }
    $("#progressBar").attr("value","");
    timeLeft = 0;
    currentProgress = 0;

    gameType=""
    $("#overallProgress").empty();
    $("#gameOver").empty();
}

