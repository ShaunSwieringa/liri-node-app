require("dotenv").config();

var request = require("request");

var moment = require('moment');

var fs = require("fs");

var keys = require("./keys.js");

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var omdb = (keys.omdb);
var bandsintown = (keys.bandsintown);

var userInput = process.argv[2];
var userQuery = process.argv[3].join(" ");


function userCommand(userInput, userQuery) {
    switch (userInput) {
        case "concert-this":
            concertThis();
            break;
        case "spotify-this":
            spotifyThisSong();
            break;
        case "movie-this":
            movieThis();
            break;
        case "do-this":
            doThis(userQuery);
            break;
        default:
            console.log("I don't understand");
            break;
    }
}

userCommand(userInput, userQuery);

function concertThis() {
    console.log(`\n - - - - -\n\nSEARCHING FOR...${userQuery}'s next show...`);
    request("https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=" + bandsintown, function (error, response, body) {
     {
            var userBand = JSON.parse(body);
            if (userBand.length > 0) {
                for (i = 0; i < 1; i++) {

                    console.log(`\nArtist: ${userBand[i].lineup[0]} \nVenue: ${userBand[i].venue.name} \nVenue City: ${userBand[i].venue.city}, ${userBand[i].venue.country}`)
                    var concertDate = moment(userBand[i].datetime).format("MM/DD/YYYY hh:00 A");
                    console.log(`Date and Time: ${concertDate}`);
                };
            } else {
                console.log('Not found');
            };
        };
    });
};

function spotifyThisSong() {
    console.log(`\nSearch for "${userQuery}"`);

    if (!userQuery) {
        userQuery = "the sign ace of base"
    };

    spotify.search({
        type: 'track',
        query: userQuery,
        limit: 1
    }, function (error, data) {
        if (error) {
            return console.log('Error: ' + error);
        }
        var spotifyArr = data.tracks.items;

        for (i = 0; i < spotifyArr.length; i++) {
            console.log(`\nArtist: ${data.tracks.items[i].album.artists[0].name} \nSong: ${data.tracks.items[i].name} \nAlbum: ${data.tracks.items[i].album.name} \nSpotify link: ${data.tracks.items[i].external_urls.spotify}`)
        };
    });
}

function movieThis() {
    console.log(`\nSearch for "${userQuery}"`);
    if (!userQuery) {
        userQuery = "mr nobody";
    };
    request("http://www.omdbapi.com/?t=" + userQuery + "&apikey=4fb8177a", function (error, response, body) {
        var userMovie = JSON.parse(body);

        var ratingsArr = userMovie.Ratings;
        if (ratingsArr.length > 2) {}

        if (error) {
            console.log(`\nTitle: ${userMovie.Title} \nCast: ${userMovie.Actors} \nReleased: ${userMovie.Year} \nIMDb Rating: ${userMovie.imdbRating} \nCountry: ${userMovie.Country} \nLanguage: ${userMovie.Language} \nPlot: ${userMovie.Plot}`)
        } else {
            return console.log("Error:" + error)
        };
    })
};

function doThis() {
    fs.readFile("random.txt", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArray = data.split(",");

        userInput = dataArray[0];
        userQuery = dataArray[1];
        userCommand(userInput, userQuery);
    });
};