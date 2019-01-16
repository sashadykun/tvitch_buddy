$(document).ready(init);
/*************************************************************************/
//Global Variables go down here:
var arrayOfPlayers = [];
var arrayCommaString = arrayOfPlayers.join();
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
    julianjanganoo: 'JulianJanganoo',
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
    Fnatic_Ettnix: 'Twitch-Ettnix',
    trymacs: "twitch trymacs",
    drnkie: "drnkie",
}
var codPlayers = {
    Rallied: 'RalDaddy',
    Octane: 'Octane623',
    K1LLa93: 'AdamKIIIa',
    Xposed: 'Xposet',
    Blazt: 'lBlaztR',
    Dashy: 'Dashy-SZN',
    aBeZy: 'aBeZy-',
    pamaj: "pamajino",
}
var gameDataBf;
var gameDataCod;
var gameDataDota = {};
var fortniteStatsObject = {};

/*************************************************************************/
//All functions go down here:

function init() {
    $("#headerContainer").click(displayHome)
    createAllPlayersArray(dotaPlayers, bfPlayers, fortniteTopPlayers, codPlayers);
    getOnlinePlayers();
    $("#arrow-right").click(scrollRight)
    $("#arrow-left").click(scrollLeft)
    displaytIntroModal()
}
//
// function init() {
//     $("#headerContainer").click(displayHome)
//     $("#arrow-right").click(scrollRight)
//     $("#arrow-left").click(scrollLeft)
//     createAllPlayersArray(dotaPlayers, bfPlayers, fortniteTopPlayers, codPlayers);
//     getOnlinePlayers();
// }
function displaytIntroModal(){
    $('#intro_modal').modal('show');
}

function scrollRight(){
    var elmnt = document.getElementById("livePlayers");
    var w = elmnt.clientWidth
    $('#livePlayers').animate({ scrollLeft: "+="+w }, "slow");
    
    // elmnt.scrollLeft += w;
      
}
function scrollLeft(){
    var elmnt = document.getElementById("livePlayers");
    var w = elmnt.clientWidth
    $('#livePlayers').animate({ scrollLeft: "-="+w }, "slow");
    
    // elmnt.scrollLeft += w;
      
}
//


function createAllPlayersArray(firstObject, secondObject, thirdObject, fourthObject){
    var newArray = [firstObject,secondObject,thirdObject,fourthObject]
    for (var arrayIndex = 0; arrayIndex < newArray.length; arrayIndex++){
        arrayOfPlayers.push(...Object.keys(newArray[arrayIndex]));
    }
}

function getBfPlayerData(player) {
    var ajaxConfig = {
        url: "https://danielpaschal.com/lfzproxies/battlefieldproxy.php",
        method: "GET",
        dataType: 'Json',
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
                'Accuracy': parseFloat(accuracyRatio * 100).toFixed(1) + "%"
            }
            displayStats(gameDataBf)
        }
    }
    $.ajax(ajaxConfig)
}

function getOnlinePlayers() {
    var arrayCommaString = arrayOfPlayers.join();
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.twitch.tv/kraken/streams?channel=" + arrayCommaString,
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

function recreateOnlinePlayerArrayToHaveOnlyOurGamePlayers() {
    var validGames = ["Battlefield 1", "Dota 2", "Fortnite", "Call of Duty: Black Ops 4"];

    for (var arrayIndex = 0; arrayIndex<onlinePlayerArray.length; arrayIndex++){
        var currentGame = onlinePlayerArray[arrayIndex].game;
        if (!validGames.includes(currentGame)) {
            onlinePlayerArray.splice(arrayIndex,1);
            arrayIndex--;

        }
        
    }
}

function makeOnlinePlayerObj(response) {
    onlinePlayerArray=[]
    for (var i = 0; i < response.streams.length; i++) {
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

function getDotaPlayers(player, name) {
    var rank = {
        "url": "https://api.opendota.com/api/players/" + player,
        "method": "GET"
    }
    var winLoss = {
        "url": "https://api.opendota.com/api/players/" + player + "/wl",
        "method": "GET"
    }
    var previousGame = {
        "url": "https://api.opendota.com/api/players/" + player + "/matches",
        "method": "GET"
    }
    gameDataDota.Player = name
    $.ajax(rank).then(getDotaRank)
    $.ajax(winLoss).then(getDotaWinLoss)
    $.ajax(previousGame).then(getDotaPreviousGame)
}

function getDotaRank(response) {
        gameDataDota.Rank = response.mmr_estimate.estimate;
}

function getDotaWinLoss(response) {
        gameDataDota.Wins = response.win;
        gameDataDota.Loses = response.lose;
}

function getDotaPreviousGame(response) {
        gameDataDota["Previous Kills"] = response[0].kills;
        gameDataDota["Previous Deaths"] = response[0].deaths;
        gameDataDota["Previous Assists"] = response[0].assists;
        if (response[0].radiant_win === false) {
            gameDataDota["Previous Game"] = "Lost"
        }
        else {
            gameDataDota["Previous Game"] = "Won"
        }
        console.log(gameDataDota)
        displayStats(gameDataDota)
}

function getFortnitePlayerData(playerName) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://danielpaschal.com/lfzproxies/fortniteproxy.php",
        "method": "GET",
        dataType: 'json',
        data: {
            platform: 'pc',
            player: playerName,
        },
        "headers": {
            "TRN-Api-Key": "516f26d7-878d-41f9-b03e-df2ad5a11530",
        }
    }
    $.ajax(settings).done(function (response) {
        
        fortniteStatsObject['Player'] = response.epicUserHandle;
        for (var index = 7; index < response.lifeTimeStats.length; index++) {
            fortniteStatsObject[response.lifeTimeStats[index].key] = response.lifeTimeStats[index].value;
        }
        displayStats(fortniteStatsObject)
        return
    });
}

function getCodPlayers(player, name) {
    var codPlayer = {
        "url": "https://my.callofduty.com/api/papi-client/crm/cod/v2/title/bo4/platform/psn/gamer/" + player + "/profile/",
        "method": "GET",
        dataType: "json"
    }
    $.ajax(codPlayer).done(function (response) {
        var stats = response.data.mp.lifetime.all;
        var average = stats.scorePerGame
        var gameWins = stats.wins;
        var gameLosses = stats.losses;
        var kdr = stats.kdRatio;
        var headshots = stats.headshots;
        var accuracy = response.data.mp.weekly.all.accuracy;
        var killstreak = stats.longestKillstreak;
        gameDataCod = {
            'Player': name,
            'Wins': gameWins,
            'Losses': gameLosses,
            'K/D': parseFloat(kdr).toFixed(1),
            'Longest Killstreak': killstreak,
            'Average Score': parseInt(average),
            'Headshots': headshots,
            'Accuracy': parseFloat(accuracy * 100).toFixed(1) + "%",
        }
        displayStats(gameDataCod);
    });
}

function renderLivePlayersOnDom() {
    
    recreateOnlinePlayerArrayToHaveOnlyOurGamePlayers();
    onlinePlayerArray.sort(function (a, b) { return 0.5 - Math.random() });
    for (let i = 0; i < onlinePlayerArray.length; i++) {
        let playerCard = $("<div>", {
            addClass: "playerCard",
            css: ({ "background-image": "url(" + onlinePlayerArray[i].thumbnail + ")" }),
            on: {
                click: function () {
                    let streamName = onlinePlayerArray[i].displayName
                    
                    
                    
                    displayVideo(streamName);
                    
                    let gameName = onlinePlayerArray[i].game;
                    gameDataFetch(gameName, streamName)
                }
            },
            
            appendTo: $("#livePlayers"),
        })
        
        let nameCard = $("<div>", {
            addClass: "nameCard nameCard2",
            appendTo: playerCard
        })
        
        let displayName = $("<div>", {
            addClass: "name",
            text: onlinePlayerArray[i].displayName,
            appendTo: nameCard
        })
        if (onlinePlayerArray[i].game === "Call of Duty: Black Ops 4") {
            let displayGame = $("<div>", {
                addClass: "game",
                text: "Black Ops 4",
                appendTo: nameCard
            })
        }
        else {
            let displayGame = $("<div>", {
                addClass: "game",
                text: onlinePlayerArray[i].game,
                appendTo: nameCard
            })
        }
        
    }
    
}

function displayVideo(twitchName) {
    let loader = $('<div>', {
        class: 'loader',
        appendTo: '#container'
    })
    setTimeout(function () {
        loader.removeClass('loader').css('display', 'none')
    }, 3000)
    $('.loader').removeClass('hide')
    $("#arrows").removeClass("hide").addClass("hide")
    $('iframe').remove();
    $('#stats').remove();
    
    $('#footerContainer').removeClass().addClass("hide");
    $('#headerContainer').removeClass().addClass();
    $('#container').removeClass().addClass('containerSecondPage');
    $('#livePlayersContainer').removeClass().addClass("livePlayersContainerSecondPage")
    $('.playerCard').removeClass().addClass("playerCardSecondPage")
    $('#livePlayers').removeClass().addClass('livePlayersSecondPage')
    
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
        appendTo: $('.videoAndStatsContainer')
    })
    
    
}
function displayHome() {
    
    $("#arrows").removeClass("hide")
    console.log("clicked")
    $('.playerCard').removeClass().addClass("playerCard")
    $('#livePlayersContainer').removeClass().addClass("livePlayersContainer")
    $('#livePlayers').empty().addClass("livePlayers")
    $('iframe').remove();
    $('#stats').remove();
    $('#footerContainer').removeClass("hide")
    $('#headerContainer').removeClass('hide');
    $('#container').removeClass().addClass("container1");
    $('#livePlayers2').removeAttr().attr('id', 'livePlayersContainer')
    arrayOfPlayers=[]
    onlinePlayerArray=[]
    createAllPlayersArray(dotaPlayers, bfPlayers, fortniteTopPlayers, codPlayers);
    
    getOnlinePlayers();
    
    // $('.playerCard2').removeClass('playerCard2').addClass('playerCard')
    
    
    
}

function displayStats(gameObj) {
    $('#stats').remove();
    
    // setTimeout(function () {
    //     loader.removeClass('loader').css('display', 'none')
    // }, 2500)
    var overallStatsDiv = $('<div>').attr('id', 'stats')
    for (var key in gameObj) {
        var statsCont = $('<div>').addClass('statCard');
        var statKey = $('<div>').addClass('statKey').text(key);
        var statVal = $('<div>').addClass('statValue').text(gameObj[key]);
        statsCont.append(statKey, statVal);
        overallStatsDiv.append(statsCont);
    }
    $('#container').append(overallStatsDiv)
    
}

function gameDataFetch(game, streamName) {
    switch (game) {
        case 'Fortnite':
            for (var key in fortniteTopPlayers) {
                if (key.toUpperCase() == streamName.toUpperCase()) {
                    getFortnitePlayerData(fortniteTopPlayers[key])
                    break;
                }
            }
        case 'Dota 2':
            for (var key in dotaPlayers) {
                if (key.toUpperCase() == streamName.toUpperCase()) {
                    getDotaPlayers(dotaPlayers[key], key)
                    break;
                }
            }
        case 'Battlefield 1':
            for (var key in bfPlayers) {
                if (key.toUpperCase() == streamName.toUpperCase()) {
                    getBfPlayerData(bfPlayers[key])
                    break; 

                }
            }
        case 'Call of Duty: Black Ops 4':
            for (var key in codPlayers) {
                if (key.toUpperCase() == streamName.toUpperCase()) {
                    getCodPlayers(codPlayers[key], key)
                    break;
                }
            }
    }
}



