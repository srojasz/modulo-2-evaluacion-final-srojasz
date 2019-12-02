"use strict";

// Arrays

let shows = [];
let favs = [];

// Variables globales

const input = document.querySelector(".js-search__input");

const searchButton = document.querySelector(".js-search__button");

const showsContainer = document.querySelector(".js-shows__container");

const showsList = document.querySelector(".js-shows__list");

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

// Pintar y escuchar Shows

function paintShows() {
  let htmlCode = "";
  for (let i = 0; i < shows.length; i++) {
    let showName = shows[i].show.name;
    let showId = shows[i].show.id;
    let showImage = shows[i].show.image;

    if (showImage === null) {
      showImage = "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
    } else {
      showImage = showImage.medium;
    }

    htmlCode += `<li class="js-show__item" id=${showId}>`;
    htmlCode += `<h2>${showName}</h2>`;
    htmlCode += `<img src="${showImage}"/>`;
    htmlCode += "</li>";
  }
  showsList.innerHTML = htmlCode;
}

function listenShows() {
  const showsItems = document.querySelectorAll(".js-show__item");

  for (const showItem of showsItems) {
    showItem.addEventListener("click", addFav);
  }
}

// Añadir favorito al array (objeto completo)

function addFav(ev) {
  const clickedId = parseInt(ev.currentTarget.id);

  const clickedShow = shows.find(function(show) {
    if (show.show.id === clickedId) {
      return true;
    }
  });
  favs.push(clickedShow);
  console.log(favs);
}
