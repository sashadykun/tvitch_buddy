$(document).ready(init);

var arrayOfPlayers = ["ninja", "nickmercs", "shroud", "drdisrespectlive",];
var arrayCommaString = arrayOfPlayers.join();
var twitchStreamer = "ninja";
var onlinePlayerArray = [];

function init () {
    getOnlinePlayers()
    
    console.log("online array works"+onlinePlayerArray.length);
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
        console.log(onlinePlayerArray);
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


        console.log(response);
    }
    

}

function renderLivePlayersOnDom() {
    console.log("render dom ran 1");
    console.log(onlinePlayerArray.length);
    for (var i=0; i<onlinePlayerArray.length;i++){
        console.log("render dom ran 2");
        var playerCard = $("<div>").addClass("playerCard").css({
            "background-image": "url("+onlinePlayerArray[i].thumbnail+")",
        })
        $("#livePlayers").append(playerCard);
    }
}