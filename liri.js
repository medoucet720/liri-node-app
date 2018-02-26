require("dotenv").config();
var request = require("request");
var Twitter = require("twitter");
var spotify = require("node-spotify-api");
var keys= require("./keys.js");
var fs = require("fs-extra");

var client = new Twitter(keys.twitter);
// var spotify = new Spotify(keys.spotify);

//Stored argument's array
var nodeArgv = process.argv;
var command = process.argv[2];
//movie or song
var x = "";
//attaches multiple word arguments
for (var i=3; i<nodeArgv.length; i++){
  if(i>3 && i<nodeArgv.length){
    x = x + "+" + nodeArgv[i];
  } else{
    x = x + nodeArgv[i];
  }
}

switch(command){
  case "my-tweets":
    showTweets();
  break;

  case "spotify-this-song":
    if(x){
      spotifySong(x);
    } else{
      spotifySong("The Sign");
    }
  break;

  case "movie-this":
    if(x){
      omdbData(x)
    } else{
      omdbData("Mr. Nobody")
    }
  break;

  case "do-what-it-says":
    doThing();
  break;

  default:
    console.log("{Please enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
  break;
}



function showTweets(){
  //Display last 20 Tweets
  var client = new Twitter (keys.twitter);
  var screenName = {screen_name: 'unhbootcamp1'};
  var params={screen_name: screenName, count : 20 };
  client.get('statuses/user_timeline', params, function(error, tweets, response){
    if(!error){
    	data = [];
      for(var i = 0; i < tweets.length; i++){
        data.push({
        	"created at: " : tweets[i].created_at,
        	"Tweets: " : tweets[i].text
        });
    }
        console.log(data);
       
      }
    });
  };


function spotifySong(song){
	var spotifyUser = new spotify(keys.spotify);
	var command = process.argv;
	var songName = "";

  for(var i = 3; i < command.length; i++){
  	if (i > 3 && i < command.length){
  		songName = songName + "+" + command[i];
  	} else {
  		songName += command[i];
  	}
  }
    if(!songName){
    	songName = "The Sign";
    	console.log("The Sign by Ace of Base");
    }

    spotifyUser.search({type:"track", query: songName, limit:1}, function(error, data){
    	if (error){
    		return console.log("Error");
    	} else{


   
        //artist
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        //song name
        console.log("Song: " + songName);
        //spotify preview link
        console.log("Preview URL: " + data.tracks.items[0].preview_url);
        //album name
        console.log("Album: " + data.tracks.items[0].album.name);

    } 
  })
};


function omdbData(movie){
var command = process.argv;
var movieName = "";
for(var i = 3; i < command.length; i++){
	if (i>3 && i < command.length){
		movieName = movieName + "+" + command[i];
	}else{
		movieName += command[i];
	}
}

if(!movieName){
	movie = "Mr.Nobody";
	return console.log("Mr.Nobody");
}
  var omdbURL = 'http://www.omdbapi.com/?t=' + movieName + '&y=&plot=short&apikey=trilogy';

  request(omdbURL, function (error, response, body){
    if(!error && response.statusCode == 200){
      var body = JSON.parse(body);

      console.log("Title: " + body.Title);
      console.log("Release Year: " + body.Year);
      console.log("IMdB Rating: " + body.imdbRating);
      console.log("Country: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
     

     

    } else{
      console.log('Error occurred.')
    }
    });
};

 

function doThing(){
  fs.readFile('random.txt', "utf8", function(error, data){
    if(error){
    	console.log("Error");
    }else{

    var txt = data.split(',');
    var arg2 = txt[0];
    var arg3= txt[1];
    process.argv.splice(2,1);
 	process.argv.push(arg2);
 	process.argv.push(arg3);
    spotifySong();
}
  });
};
