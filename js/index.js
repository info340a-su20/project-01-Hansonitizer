// The array contains the basic game data we will use.
let gameList = [];
let genreList = [];
let platformList = [];

// Get initial gameList[], here we want 100 games which is 5 pages
getGameList(5);
// initialize genre list 
getGenreList();
// initialize platform list
getPlatformList();

// Switch between two views
function switchview(checkbox) {
    let listViewElem = document.getElementById("listView");
    let cardViewElem = document.getElementById("cardView");
    if (checkbox.checked) {
        renderCardView(gameList);
        listViewElem.style.display = "none"
        cardViewElem.style.display = "block"
    } else {
        renderListView(gameList)
        cardViewElem.style.display = "none"
        listViewElem.style.display = "block"
    }
}

// Fetch the data and store it in a global variable gameList[]
function getGameListByPage(pageNum, pageCounts) {
    let fetchResult = fetch("https://api.rawg.io/api/games?page=" + pageNum)
    .then(function(response) {
        let dataPromise = response.json();
        return dataPromise;
    })
    .then(function(data) {
        alterGameList(data);
        if (gameList.length >= (pageCounts * 20)){
            console.log(gameList);
            renderListView(gameList);
        }
        return data;
    })
    .catch(err => {
	console.log(err);
    });
    return fetchResult;
}

// Add the game to the global gameList[]
function alterGameList(data) {
    for (let each of data.results) {
        gameList.push(each);
    }
}

// Add the genre to the global genreList[]
function alterGenreList(data) {
    for (let each of data.results) {
        genreList.push(each);
    }
}

// Add the platform to tge global platformList[]
// Only take first 22 platform
function alterPlatformList(data) {
    for (let i = 0; i < 22; i++) {
        platformList.push(data.results[i]);
    }
}

// Get game list base on the pageCounts, each page has 20 games
function getGameList(pageCounts) {
    for (let i = 1; i <= pageCounts; i++) {
        getGameListByPage(i, pageCounts);
    }
}

// Get and render the genre list
function getGenreList(){
    let fetchResult = fetch("https://api.rawg.io/api/genres")
    .then(function(response) {
        let dataPromise = response.json();
        return dataPromise;
    })
    .then(function(data) {
        alterGenreList(data);
        renderGenreSelector();
        return data;
    })
    .catch(err => {
	console.log(err);
    });
    return fetchResult;
}

// Get and render the platform list
function getPlatformList(){
    let fetchResult = fetch("https://api.rawg.io/api/platforms")
    .then(function(response) {
        let dataPromise = response.json();
        return dataPromise;
    })
    .then(function(data) {
        alterPlatformList(data);
        renderPlatformSelector();
        return data;
    })
    .catch(err => {
	console.log(err);
    });
    return fetchResult;
}

// Render the list view base on the array passed in 
function renderListView(list) {
    document.querySelector("#listView").innerHTML = "";
    for (let each of list) {
        renderSingleListView(each);
    }
}

// Render the card view base on the array passed in 
function renderCardView(list) {
    document.querySelector("#cardView").innerHTML = "";
    for (let each of list) {
        renderSingleCardView(each);
    }
}

// Render a single list view block
function renderSingleListView(game) {
    let cardElem = document.createElement("div");
    cardElem.classList.add("card");
    let cardBodyElem = document.createElement("div");
    cardBodyElem.classList.add("card-body");
    cardElem.appendChild(cardBodyElem);
    let rowElem = document.createElement("div");
    rowElem.classList.add("row");
    cardBodyElem.appendChild(rowElem);
    let imgColElem = document.createElement("div");
    imgColElem.classList.add("col-sm-auto");
    rowElem.appendChild(imgColElem);
    let textColElem = document.createElement("div");
    textColElem.classList.add("col-sm");
    rowElem.appendChild(textColElem);
    let imgElem = document.createElement("img");
    imgElem.classList.add("pb-3", "img-fluid", "img-max");
    imgElem.src = game.background_image;
    imgElem.alt = "img of " + game.name;
    imgElem.setAttribute("aria-label", ("img of " + game.name));
    imgColElem.appendChild(imgElem);
    let h2Elem = document.createElement("h2");
    h2Elem.classList.add("card-title");
    h2Elem.textContent = game.name;
    textColElem.appendChild(h2Elem);
    let pElem = document.createElement("p");
    pElem.classList.add("card-text");
    pElem.innerHTML = "Rating: " + game.rating + "<br>" 
        + "Length: " + game.playtime + " hours" + "<br>"
        + "Released: " + game.released + "<br>"
        + "Genres: " + createGenreString(game) + "<br>"
        + "Platforms: " + createPlatformString(game); 
    textColElem.appendChild(pElem);
    let listViewElem = document.querySelector("#listView");
    listViewElem.appendChild(cardElem);
}

// Render a single card view block
function renderSingleCardView(game) {
    var cardhtml = 
    (`<div class="col-md-6">
    <div class="card card-img-top" id="hover-info">
    <img class="card-img img-fluid fit-image" src="${game.background_image}" alt="Card image">
    <div class="card-img-overlay">
        <h3 class="card-title text-black">${game.name}</h3>
        <p class="card-text text-black">${game.genre}<br>${game.playtime} hours<br>${game.released}<br>${game.platforms[1].platform.name}, ${game.platforms[2].platform.name}</p>
    </div>
    </div>
    </div>`);
    $('#cardrow').append(cardhtml);
}

// Return the string of genres
function createGenreString(game){
    let genreList = [];
    for (let each of game.genres) {
        genreList.push(each.name);
    }
    return arrayToString(genreList);
}

// Return the string of platforms
function createPlatformString(game){
    let platformList = [];
    for (let each of game.platforms) {
        platformList.push(each.platform.name);
    }
    return arrayToString(platformList);
}

// Convert the array to string
function arrayToString(array) {
    resultString = "";
    for (let each of array) {
        resultString = resultString + each + " / ";
    }
    resultString = resultString.substring(0, resultString.length - 3);
    return resultString;
}

// Render genre selector
function renderGenreSelector() {
    let genreSelectorElem = document.querySelector("#genre");
    genreSelectorElem = appendFirstOption(genreSelectorElem);
    for (let each of genreList) {
        let optionElem = document.createElement("option");
        optionElem.value = each.slug;
        optionElem.textContent = each.name;
        genreSelectorElem.appendChild(optionElem);
    }
}

// Render platform selector
function renderPlatformSelector() {
    let platformSelectorElem = document.querySelector("#platform");
    platformSelectorElem = appendFirstOption(platformSelectorElem);
    for (let each of platformList) {
        let optionElem = document.createElement("option");
        optionElem.value = each.slug;
        optionElem.textContent = each.name;
        platformSelectorElem.appendChild(optionElem);
    }
}

// Append the first child of selector which is "All"
function appendFirstOption(parent) {
    let firstOptionElem = document.createElement("option");
    firstOptionElem.value = "all";
    firstOptionElem.textContent = "All";
    parent.appendChild(firstOptionElem);
    return parent;
}






