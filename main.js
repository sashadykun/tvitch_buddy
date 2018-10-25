$(document).ready(init);

/*************************************************************************/
//Global Variables go down here:
var arrayOfPlayers = [];
var arrayCommaString = arrayOfPlayers.join();
var twitchStreamer = "ninja";
var onlinePlayerArray = [];
var dotaPlayers = {
    Masondota2: "315657960",
    Dendi: "70388657",
    Arteezy: "104070670",
    SexyBamboe: "20321748",
    Singsing: "97577101",
    Darskyl: "161444478",
    Gorgc: "56939869",
    Canceldota: "141690233",
    Timado: "97658618",
    henry: "205743502"
}
var bfPlayers = {
    twistydoesntmiss: 'TwistyDoesntMlSS',
    dazs: 'Ascend_Dazs',
    Boccarossa13: 'Boccarossa',
    misterkaiser: 'Mister_Kaiser',
    mistersamonte: 'MisterSamonte',
    Gen_Odyssey: 'Gen-Odyssey',
    th1r3een: 'l---th1r3een---I',
    julianjanganoo:'JulianJanganoo',
    fragurassTV: 'fragurassTV'
}
var fortniteTopPlayers = {
    Ninja: 'Ninja',
    NICKMERCS: 'NICKMERCS',
    TwitchProspering: 'TwitchProspering',
    twitch_bogdanakh: 'twitch_bogdanakh',
    TSM_Myth: 'TSM_Myth',
    CourageJD: 'CourageJD',
    Dakotaz: 'Dakotaz',
    Ranger: 'WBG Ranger',
    SypherPK: 'SypherPK',
    Svennoss: 'Svennoss',
    uwatakashi: 'Uwatakashi_',
    Fnatic_Ettnix:'Twitch-Ettnix'
}
var gameDataBf;
var gameDataDota = {}; 
var gameDataLeague = {};
var fortniteStatsObject = {};

/*************************************************************************/
//All functions go down here:

function init () {
   createAllPlayersArray(dotaPlayers, bfPlayers, fortniteTopPlayers);
   getOnlinePlayers();
}

function createAllPlayersArray(firstArray, secondArray, thirdArray){
    var newArray = [firstArray,secondArray,thirdArray]
    for (var arrayIndex = 0; arrayIndex < newArray.length; arrayIndex++){
        arrayOfPlayers.push(...Object.keys(newArray[arrayIndex]));
    }
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
            var wins = response.result.basicStats.wins;
            var losses = response.result.basicStats.losses;
            var kills = response.result.basicStats.kills;
            var deaths = response.result.basicStats.deaths;
            var accuracyRatio = response.result.accuracyRatio;
            gameDataBf = {
                'Player': player, 
                'Wins': wins, 
                'Losses': losses, 
                'Kills': kills, 
                'Deaths': deaths, 
                'Accuracy': parseFloat(accuracyRatio*100).toFixed(1)+"%"
            } 
            displayStats(gameDataBf)
        }
    }
    $.ajax(ajaxConfig)
}

function getOnlinePlayers(){
    var arrayCommaString = arrayOfPlayers.join();
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.twitch.tv/kraken/streams?channel="+arrayCommaString,
        "method": "GET",
        "headers": {
          "Client-ID": "2jfkzp4pqy42ge7y17na6l0kf8fdtx",
        }
    }
    $.ajax(settings).done(function (response) {
        makeOnlinePlayerObj(response);
        renderLivePlayersOnDom();
    });
}

function recreateOnlinePlayerArrayToHaveOnlyOurGamePlayers(){
    var validGames = ["Battlefield 1", "Dota 2", "Fortnite"];
    for (var arrayIndex = 0; arrayIndex<onlinePlayerArray.length; arrayIndex++){
        var currentGame = onlinePlayerArray[arrayIndex].game;
        if (!validGames.includes(currentGame)) {
            onlinePlayerArray.splice(arrayIndex,1);
        }
    }
}

function makeOnlinePlayerObj(response){
    for (var i=0; i<response.streams.length; i++) {
        var tempPlayerObj = {};
        var streamingGame = response.streams[i].game;
        var thumbnail = response.streams[i].preview.large;
        var displayName = response.streams[i].channel.display_name;
        var status = response.streams[i].channel.status;
        var viewers = response.streams[i].viewers;
        tempPlayerObj.game = streamingGame; 
        tempPlayerObj.thumbnail = thumbnail;
        tempPlayerObj.displayName = displayName;
        onlinePlayerArray.push(tempPlayerObj);
    }
}
    
function getDotaPlayers(player, name){
    gameDataDota.Player = name;
   var soloRank = {
      "url": "https://api.opendota.com/api/players/"+player,
      "method": "GET"
    }
    var winLoss = {
       "url": "https://api.opendota.com/api/players/"+player+"/wl",
       "method": "GET"
    }
    var previousGame = {
      "url": "https://api.opendota.com/api/players/"+player+"/matches",
      "method": "GET"
    }
    $.ajax(soloRank).done(function (response) {
        if(response.mmr_estimate.estimate >= 5440){
            gameDataDota.Rank = "Divine 5"
        }
        else if(response.mmr_estimate.estimate >= 5280){
            gameDataDota.Rank = "Divine 4"
        }
        else if(response.mmr_estimate.estimate >= 5120){
            gameDataDota.Rank = "Divine 3"
        }
        else if(response.mmr_estimate.estimate >= 4960){
            gameDataDota.Rank = "Divine 2"
        }
        else if(response.mmr_estimate.estimate >= 4800){
            gameDataDota.Rank = "Divine 1"
        }
        else if(response.mmr_estimate.estimate >= 4640){
            gameDataDota.Rank = "Ancient 5"
        }
        else if(response.mmr_estimate.estimate >= 4480){
            gameDataDota.Rank = "Ancient 4"
        }
        else if(response.mmr_estimate.estimate >= 4320){
            gameDataDota.Rank = "Ancient 3"
        }
        else if(response.mmr_estimate.estimate >= 4160){
            gameDataDota.Rank = "Ancient 2"
        }
        else if(response.mmr_estimate.estimate >= 4000){
            gameDataDota.Rank = "Ancient 1"
        }
    });
    $.ajax(winLoss).done(function (response2) {
        gameDataDota.Wins = response2.win;
        gameDataDota.Loses = response2.lose;
    });
    $.ajax(previousGame).done(function (response3) {
        gameDataDota.Kills = response3[0].kills;
        gameDataDota.Deaths = response3[0].deaths;
        gameDataDota.Assists = response3[0].assists;
        if(response3[0].radiant_win === false){
            gameDataDota.Game = "Lost"
        }
        else{
            gameDataDota.Game = "Won"
        }
        displayStats(gameDataDota)
    });
}

function getFortnitePlayerData(playerName) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://danielpaschal.com/lfzproxies/fortniteproxy.php",
        "method": "GET",
        dataType: 'json',
        data:{
            platform: 'pc',
            player: playerName,
        },
        "headers": {
            "TRN-Api-Key": "516f26d7-878d-41f9-b03e-df2ad5a11530",
        }
    }
    $.ajax(settings).done(function (response) {
        console.log(response.epicUserHandle)
        fortniteStatsObject['Player'] = response.epicUserHandle;
        for (var index = 7; index < response.lifeTimeStats.length; index++){
            fortniteStatsObject[response.lifeTimeStats[index].key] = response.lifeTimeStats[index].value;
        }
        displayStats(fortniteStatsObject)
        return
    });
}

function renderLivePlayersOnDom() {
    recreateOnlinePlayerArrayToHaveOnlyOurGamePlayers();
    onlinePlayerArray.sort(function (a, b) {return 0.5 - Math.random()});
    for (let i=0; i<onlinePlayerArray.length;i++){
        let playerCard = $("<div>", {
            addClass: "playerCard",
            css: ({"background-image": "url("+onlinePlayerArray[i].thumbnail+")"}),
            on: {
                click: function() {
                    let streamName = onlinePlayerArray[i].displayName
                    displayVideo(streamName);
                    let gameName = onlinePlayerArray[i].game;
                    gameDataFetch(gameName, streamName)
                }
            },
            appendTo: $("#livePlayers"),
        })
        let nameCard = $("<div>",{
            addClass: "nameCard",
            appendTo: playerCard
        })
        let displayName = $("<div>",{
            addClass: "name",
            text:onlinePlayerArray[i].displayName,
            appendTo: nameCard
        })
        let displayGame = $("<div>",{
            addClass: "game",
            text:onlinePlayerArray[i].game,
            appendTo: nameCard
        })
    }
}

function displayVideo(twitchName) {
    $('iframe').remove();
    $('#stats').remove();
    $('#footerContainer').remove();
    $('#headerContainer').remove();
    $('#livePlayers').attr("id","livePlayers2");
    $('.playerCard').removeClass('playerCard').addClass('playerCard2')
    var createIframe = $('<iframe>', {
        addClass: 'currentVideo',
        attr: ({
            'src': `https://player.twitch.tv/?channel=${twitchName}&muted=true`, 
            'height': "720",
            'width': "1280",
            'frameborder': "0",
            'scrolling': "no",
            'allowfullscreen': "true"
            }),
        appendTo: $('.container')
    })
}

function displayStats(gameObj) {
    var overallStatsDiv = $('<div>').attr('id', 'stats')
    for (var key in gameObj) {
        var statsCont = $('<div>').addClass('statCard');
        var statKey = $('<div>').addClass('statKey').text(key);
        var statVal = $('<div>').addClass('statValue').text(gameObj[key]);
        statsCont.append(statKey, statVal);
        overallStatsDiv.append(statsCont);  
    }
    $('.container').append(overallStatsDiv)
}

function gameDataFetch(game, streamName) {
    switch (game) {
        case 'Fortnite':
            for (var key in fortniteTopPlayers) {
                if (key.toUpperCase() == streamName.toUpperCase()){
                    getFortnitePlayerData(fortniteTopPlayers[key])
                    return fortniteStatsObject;
                }
            }
        case 'Dota 2':
            for (var key in dotaPlayers) {
                if (key.toUpperCase() == streamName.toUpperCase()){
                    getDotaPlayers(dotaPlayers[key], key)
                    return gameDataDota;
                }
            }
        case 'Battlefield 1': 
            for (var key in bfPlayers) {
                if (key.toUpperCase() == streamName.toUpperCase()){
                    getBfPlayerData(bfPlayers[key])
                    return gameDataBf; 
                }
            }
    }
}



