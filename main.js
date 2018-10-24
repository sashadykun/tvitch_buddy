$(document).ready(init);

var arrayOfPlayers = ["ninja", "nickmercs", "shroud", "drdisrespectlive",];
var arrayCommaString = arrayOfPlayers.join();
var twitchStreamer = "ninja";
var onlinePlayerArray = [];
var dotaPlayers = {
  masondota2: "315657960",
  dendi: "70388657",
  arteezy: "104070670",
  sexyBamboe: "20321748",
  singsing: "97577101",
  darskyl: "161444478"
}

var bfPlayers = {
    twistydoesntmiss: 'TwistyDoesntMlSS',
    dazs: 'Ascend_Dazs',
    Boccarossa13: 'Boccarossa',
    misterkaiser: 'Mister_Kaiser',
    mistersamonte: 'MisterSamonte'
}

// var leaguePlayser = {
//     froggen: '71899217'
// }

var gameDataBf;
var gameDataFortNite;
var gameDataDota = {}; 
var gameDataLeague = {};

function init () {
   getOnlinePlayers();
   getBfPlayerData('TwistyDoesntMlSS')
   getDotaPlayers("315657960");
//    getLeaguePlayers()
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
            gameDataBf = {'Player': player, 'Wins': wins, 'Losses': losses, 'Kills': kills, 'Deaths': deaths, 'Accuracy Ratio': accuracyRatio} 
        }
    }
    $.ajax(ajaxConfig)
}


function getOnlinePlayers(){
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
        makeOnlinePlayerObj(response)
        renderLivePlayersOnDom();
      });
      
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

    }}
    
function getDotaPlayers(player){
    gameDataDota.Player = player;
   var accountInfo = {
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
    
    $.ajax(accountInfo).done(function (response) {
        gameDataDota.SoloRank = response.solo_competitive_rank
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
        gameDataDota.Win = "lost"
      }else{
        gameDataDota.Win = "win"
      }
    });
}

var fortniteTopPlayers= [
    {name: 'Ninja', gtag: 'Ninja'},
    {name: 'NickMercs', gtag: 'NICKMERCS'},
    {name: 'TwitchProspering,  gtag: TwitchProspering' },
    {name: 'twitch_bogdanakh', gtag: 'twitch_bogdanakh'},
    {name: 'TSM_Myth', gtag: 'TSM_Myth'},
    {name: 'CourageJD', gtag: 'CourageJD'},

]


var fortnitePlayersData = [];

function detFortnitePlayerData(playerName) {
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
        apiCallDataForTwitchProspering = response;
    });
}

// function getLeaguePlayers(){
//     var accountInfo = {
//         "url": "https://na1.api.riotgames.com/lol/summoner/v3/summoners/71899217?api_key=RGAPI-25569727-3b8d-4531-ad45-b80cd4d1a8f3",
//         "method": "GET",
//         dataType: "json"
//         }
      
//       $.ajax(accountInfo).done(function (response) {
//         console.log(response);
//       });
// }



function renderLivePlayersOnDom() {
    
    for (var i=0; i<onlinePlayerArray.length;i++){
        
        var playerCard = $("<div>").addClass("playerCard").css({
            "background-image": "url("+onlinePlayerArray[i].thumbnail+")",
        })
        $("#livePlayers").append(playerCard);
    }
}

