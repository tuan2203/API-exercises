let APIKey = "1ab14ddc5c8441039a96babdb5764630";
let listMovieId = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + APIKey;
let movieDisplay_1 = document.getElementById("movieDisplay_1");
let movieDisplay_2 = document.getElementById("movieDisplay_2");
let movieDisplay_3 = document.getElementById("movieDisplay_3")

async function getValueAPI(url) {

    let result = await fetch(url)
    return result.json();
};

getValueAPI(listMovieId)
    .then(dataMovieId => {

        dataMovieId.genres.map(item => {
            let select = document.getElementById("genreMovie");
            let option = document.createElement("option");
            option.value = `${item.id}`;
            option.innerHTML = `${item.name}`;
            select.appendChild(option);

        });
        $(".chosen").chosen(); //chosen library
    });

function handlerGenreMovie(movieId = 16) {

    let movieGenreOption = `https://api.themoviedb.org/3/discover/movie?with_genres=${movieId}&api_key=` + APIKey ;

    getValueAPI(movieGenreOption) //The function is called
        .then(genreMovie => {
            //console.log(genreMovie.results);


            genreMovie.results.map((itemGenre, index) => {

                function processHtmlElement(element) {

                    let newDiv = document.createElement("div");
                    let img = document.createElement("img");
                    let newP = document.createElement("p");

                    img.src = `https://image.tmdb.org/t/p/w200/${itemGenre.poster_path}`
                    img.title = `${itemGenre.title}`;
                    img.alt = "";

                    newP.innerHTML = `${itemGenre.title.split(":").pop()}` // bỏ dấu 2 chấm trong title
                    newDiv.className = "col- sm-2 text-center p-1 rounded";
                    img.className = " img-fluid rounded myImg";
                    newP.className = " pt-2";

                    newDiv.appendChild(img);
                    newDiv.appendChild(newP)
                    element.appendChild(newDiv);
                };

                if (index < 6) {
                    processHtmlElement(movieDisplay_1);
                } else if (index <= 12 && index > 6) {
                    processHtmlElement(movieDisplay_2);
                }
            });

            $("img").mouseover(function () {
               
                $(this).css("filter", "brightness(120%)");
                $(this).siblings("p").css("color", "blue");
            })

            $("img").mouseout(function (){

                $(this).css("filter", "brightness()");
                $(this).siblings("p").css("color", "");
            });
           // console.log(genreMovie);

            $('img').click(function(){
                movieDisplay_1.innerHTML = " ";
                movieDisplay_2.innerHTML = " ";
                let videoId = "";
                genreMovie.results.map(itemId => {
                    
                    itemId.title.includes($(this).attr('title')) ? videoId = `https://api.themoviedb.org/3/movie/${itemId.id}?api_key=${APIKey}&append_to_response=videos` : "";
                });
                //console.log(videoId);
                getValueAPI(videoId).then(videoData => {

                    //console.log(videoData);
                    let seeMovie = "<div class ='col-9'>";
                    seeMovie += `<iframe width="420" height="345" src="https://www.youtube.com/embed/${videoData.videos.results[0].key}"></iframe>`;
                    seeMovie += `<p class ='p-2'>${videoData.overview}</p>`;
                    seeMovie += "</div>";

                    let informationMovie = "<div class ='col-3 border '>";

                    informationMovie += `<h4 class ='text-center  p-2'>${videoData.title}</h4>`
                    informationMovie += `<p>release date : ${videoData.release_date}</p>`
                    informationMovie += `<p> time : ${videoData.runtime}</p>`
                    informationMovie += `<p> genre : ${videoData.genres[0].name}</p>`
                    informationMovie += `<p> countries : ${videoData.production_countries[0].name}</p>`

                    informationMovie += "</div>";

                    movieDisplay_3.innerHTML += seeMovie + informationMovie;
                }).catch(e => console.log("Error",e));
            });
        });
}
handlerGenreMovie();

$("#genreMovie").change( () => { // select tag

    handlerGenreMovie($("#genreMovie").val()); // dùng cho chuỗi movieGenreOption = `https://api.themoviedb.org/3/discover/movie?with_genres=....; 
    movieDisplay_1.innerHTML = " ";
    movieDisplay_2.innerHTML = " ";
});




