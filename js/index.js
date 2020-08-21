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


// The array contains the basic game data we will use.
let gameList = [];

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

// Get game list base on the pageCounts, each page has 20 games
function getGameList(pageCounts) {
    for (let i = 1; i <= pageCounts; i++) {
        getGameListByPage(i, pageCounts);
    }
}

// Get initial gameList[], here we want 100 games which is 5 pages
getGameList(5);

function renderListView(list) {
    for (let each of list) {
        renderSingleListView(each);
    }
}

function renderCardView(list) {
    for (let each of list) {
        renderSingleCardView(each);
    }
}

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
    imgElem.classList.add("pb-3", "img-fluid", "img-max", "fit-list-image");
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
    pElem.innerHTML = "User Rating: " + game.rating + "<br>"
        + "Metacritic Score: " + game.metacritic + "<br>"
        + "Length: " + game.playtime + " hours" + "<br>"
        + "Released: " + game.released + "<br>"
        + "Genres: " + createGenreString(game) + "<br>"
        + "Platforms: " + createPlatformString(game); 
    textColElem.appendChild(pElem);
    let listViewElem = document.querySelector("#listView");
    listViewElem.appendChild(cardElem);
}

function createGenreString(game){
    let genreList = [];
    for (let each of game.genres) {
        genreList.push(each.name);
    }
    return arrayToString(genreList);
}

function createPlatformString(game){
    let platformList = [];
    for (let each of game.platforms) {
        platformList.push(each.platform.name);
    }
    return arrayToString(platformList);
}

function arrayToString(array) {
    resultString = "";
    for (let each of array) {
        resultString = resultString + each + " / ";
    }
    resultString = resultString.substring(0, resultString.length - 3);
    return resultString;
}

function renderSingleCardView(game) {
    var cardhtml = 
    (`<div class="col-md-6">
    <div class="card card-img-top" id="hover-info">
    <img class="card-img img-fluid fit-image" src="${game.background_image}" alt="Card image">
    <div class="card-img-overlay">
        <h3 class="card-title text-black">${game.name}</h3>
        <p class="card-text text-black">${createGenreString(game)}<br>${game.playtime} hours<br>${game.released}<br>${createPlatformString(game)}</p>
    </div>
    </div>
    </div>`);
    $('#cardrow').append(cardhtml);
}







