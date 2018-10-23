// $(document).ready(init);
// function init () {

// }

var gameData = [];

var bfPlayers = {
    twistydoesntmiss: 'TwistyDoesntMlSS',
    dazs: 'Ascend_Dazs',
    Boccarossa13: 'Boccarossa',
    misterkaiser: 'Mister_Kaiser',
    mistersamonte: 'MisterSamonte'
}

function getBfPlayerData (player) {
    var ajaxConfig = {
        url: "https://danielpaschal.com/lfzproxies/battlefieldproxy.php",
        method: "GET",
        dataType:'Json',
        data: {
            platform: 3,
            displayName: player
        },
        headers: {
        "TRN-Api-Key": "2e1d6fb9-7bd6-4cd5-8121-2eeb037845eb"
        },
        success: function (response) {
            gameData = response;
            var wins = gameData.result.basicStats.wins;
            var losses = gameData.result.basicStats.losses;
            var kills = gameData.result.basicStats.kills;
            var deaths = gameData.result.basicStats.deaths;
            var accuracyRatio = gameData.result.accuracyRatio;
            console.log(wins, losses, kills, deaths, accuracyRatio)
        }
    }
    $.ajax(ajaxConfig)
}
getBfPlayerData(bfPlayers);