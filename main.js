$(document).ready(init);
function init () {
   getDotaPlayers();
}

var dotaPlayers = {
  masondota2: "315657960",
  dendi: "70388657",
  arteezy: "104070670",
  sexyBamboe: "20321748",
  singsing: "97577101"
}

function getDotaPlayers(){
   var accountInfo = {
      "url": "https://api.opendota.com/api/players/"+dotaPlayers,
      "method": "GET"
    }

    var winLoss = {
       "url": "https://api.opendota.com/api/players/"+dotaPlayers+"/wl",
       "method": "GET"
    }

    var previousGame = {
      "url": "https://api.opendota.com/api/players/"+dotaPlayers+"/matches",
      "method": "GET"
    }
    
    $.ajax(accountInfo).done(function (response) {
      dotaPlayers.soloRank = response.solo_competitive_rank
    });

    $.ajax(winLoss).done(function (response2) {
      dotaPlayers.wins = response2.win;
      dotaPlayers.loses = response2.lose;
    });

    $.ajax(previousGame).done(function (response3) {
      dotaPlayers.kills = response3[0].kills;
      dotaPlayers.deaths = response3[0].deaths;
      dotaPlayers.assists = response3[0].assists;
      if(response3[0].radiant_win === false){
        dotaPlayers.win = "lost"
      }else{
        dotaPlayers.win = "win"
      }
      console.log(dotaPlayers)
    });
}

