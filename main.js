$(document).ready(init);
function init () {

}

var fortniteTopPlayers= [
    {name: 'Ninja', gtag: 'Ninja'},
    {name: 'NickMercs', gtag: 'NICKMERCS'},
    {name: 'TwitchProspering,  gtag: TwitchProspering' },
    {name: 'twitch_bogdanakh', gtag: 'twitch_bogdanakh'},
    {name: 'TSM_Myth', gtag: 'TSM_Myth'},
    {name: 'CourageJD', gtag: 'CourageJD'},

]
console.log (fortniteTopPlayers);

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
        console.log(response);
        apiCallDataForTwitchProspering = response;
    });
}



