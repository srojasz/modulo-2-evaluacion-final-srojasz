"use strict";

// Arrays

let shows = [];
let favs = [];

// Variables globales

const input = document.querySelector(".js-search__input");
const searchButton = document.querySelector(".js-search__button");
const showsList = document.querySelector(".js-shows__list");
const favsList = document.querySelector(".js-favs__list");
const showItems = document.querySelectorAll(".js-show__item");
const resetButton = document.querySelector(".reset__btn");
const defaultImage =
  "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";

// Fetch que se ejecuta cuando hagamos click en buscar

function getServerData(event) {
  let inputValue = input.value;
  event.preventDefault();
  const url = `http://api.tvmaze.com/search/shows?q=${inputValue}`;
  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(serverData) {
      shows = serverData;
      paintShows();
      listenShows();
    })
    .catch(function(err) {
      console.log("Error al traer los datos del servidor", err);
    });
}
searchButton.addEventListener("click", getServerData);

// Pintar Shows

function paintShows() {
  let htmlCode = "";
  for (let i = 0; i < shows.length; i++) {
    let showName = shows[i].show.name;
    let showId = shows[i].show.id;
    let showImage = shows[i].show.image;

    const indexShow = favs.findIndex(function(fav) {
      return fav.show.id === showId;
    });
    const isFav = indexShow !== -1;

    if (showImage === null) {
      showImage = defaultImage;
    } else {
      showImage = showImage.medium;
    }

    if (isFav) {
      htmlCode += `<li class="show__item js-show__item show__item__fav" id=${showId}>`;
    } else {
      htmlCode += `<li class="show__item js-show__item" id=${showId}>`;
    }

    htmlCode += `<h2 class="show__item__title">${showName}</h2>`;
    htmlCode += `<img src="${showImage}"/>`;
    htmlCode += "</li>";
  }
  showsList.innerHTML = htmlCode;
}

// Escuchar Shows y Favs

function listenShows() {
  const showsItems = document.querySelectorAll(".js-show__item");
  for (const showItem of showsItems) {
    showItem.addEventListener("click", addFav);
  }
}

function listenFavs() {
  const favItems = document.querySelectorAll(".js-fav__item");
  for (const favItem of favItems) {
    favItem.addEventListener("click", addFav);
  }
}

// Añadir favorito al array (objeto completo) y sacarlo cuando esté dentro

function addFav(ev) {
  const clickedId = parseInt(ev.currentTarget.id);
  const clickedFav = favs.find(function(fav) {
    if (fav.show.id === clickedId) {
      return true;
    }
  });
  if (clickedFav) {
    const clickedFavIndex = favs.findIndex(function(fav) {
      if (fav.show.id === clickedId) {
        return true;
      }
    });
    favs.splice(clickedFavIndex, 1);
  } else {
    const clickedShow = shows.find(function(show) {
      if (show.show.id === clickedId) {
        return true;
      }
    });
    favs.push(clickedShow);
  }

  paintShows();
  listenShows();
  paintFavs();
  setFavData();
}

// Pintar favoritos

function paintFavs() {
  let htmlCode = "";
  for (let i = 0; i < favs.length; i++) {
    let favName = favs[i].show.name;
    let favId = favs[i].show.id;
    let favImage = favs[i].show.image;

    if (favImage === null) {
      favImage = defaultImage;
    } else {
      favImage = favImage.medium;
    }

    htmlCode += `<li class="fav__item">`;
    htmlCode += `<div class="fav__item__header">`;
    htmlCode += `<h2 class="fav__title">${favName}</h2>`;
    htmlCode += `<i class="js-trash fas fa-trash js-fav__item" id="${favId}"></i>`;
    htmlCode += `</div>`;
    htmlCode += `<img class="fav__img" src="${favImage}"/>`;
    htmlCode += "</li>";
  }

  favsList.innerHTML = htmlCode;
  listenFavs();
}

// Local Storage

function setFavData() {
  localStorage.setItem("favs", JSON.stringify(favs));
}

function getFavData() {
  const lsFavs = localStorage.getItem("favs");
  const lsFavShows = JSON.parse(lsFavs);
  if (lsFavShows !== null) {
    favs = lsFavShows;

    paintFavs();
  }
}

// Botón reset

function resetFavs(ev) {
  ev.preventDefault();
  favs = [];
  paintFavs();
  setFavData();
}
resetButton.addEventListener("click", resetFavs);

//Funciones que arrancan al cargar la página

getFavData();
