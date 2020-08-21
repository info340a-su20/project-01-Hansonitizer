// Switch between two views
function switchview(checkbox) {
    var all = document.getElementById("listView");
    var img = document.getElementById("cardView");
    if (checkbox.checked) {
        img.style.display = "block"
        all.style.display = "none"
    } else {
        all.style.display = "block"
        img.style.display = "none"
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
            //renderListView(gameList);
            renderCardView(gameList);
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

}

function renderSingleCardView(game) {
    var cardhtml = 
    (`<div class="col-md-6">
    <div class="card card-img-top" id="hover-info">
    <img class="card-img img-fluid" src="${game.background_image}" alt="Card image">
    <div class="card-img-overlay">
        <h3 class="card-title text-black">${game.name}</h3>
        <p class="card-text text-black">${game.genre}<br>${game.playtime}<br>${game.released}<br>${game.platforms}</p>
    </div>
    </div>
    </div>`);
    $('#cardView').append(cardhtml);
}






