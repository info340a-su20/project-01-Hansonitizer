// Fetch the data and store it in a global variable gameList[]
let gameList = [];

function getGameListByPage(pageNum) {
    let fetchResult = fetch("https://api.rawg.io/api/games?page=" + pageNum)
    .then(function(response) {
        let dataPromise = response.json();
        return dataPromise;
    })
    .then(function(data) {
        alterGameList(data);
        console.log(gameList);
        return data;
    })
    .catch(err => {
	console.log(err);
    });
    return fetchResult;
}

function alterGameList(data) {
    for (let each of data.results) {
        gameList.push(each);
    }
}

function getGameList(pageCounts) {
    for (let i = 1; i <= pageCounts; i++) {
        getGameListByPage(i);
    }
}

getGameList(5);

