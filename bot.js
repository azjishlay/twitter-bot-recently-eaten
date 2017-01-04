/*
    1. Connect to Twitter account

Consumer Key (API Key)	kPup9PnThBcQo1pdrZszdfzI9
Consumer Secret (API Secret)	NFmcZUwHUaQGhX1fsAaqGki1TUzWVjAR1uV1kmRpbE4lJNx147


*/

var Twitter = require('twitter');
var fs = require('fs');

var client = new Twitter({
  consumer_key: '4hS7WxUzhCap7dmNr7rV6NCTf',
  consumer_secret: 'XwUEWVTZPZwyp3t7meqbWz2WrRi3oFkVfw4cOOLpXwCO6dcLDe',
  access_token_key: '816467288274718720-tRXuasODLALlXcAsItTr8KkBBcC1qjA',
  access_token_secret: '4HE3DqHw2XtY3dvIkLcw9X53sJuRjf8muTqLjCAIoP9nV'
});

// Get historic tweets

var historic_tweets = [];

fs.readFile('historic_tweets.json', 'utf8', function (err, data) {
  if (err) throw err;
  if (!data) {
    historic_tweets = [];
  }
  else {
    historic_tweets = JSON.parse(data);
  }
});

// Run Twitter search

var result_tweets = [];

function tweetTweet() {

  // Search tweets
  client.get('search/tweets', {q: 'best food i ate'}, function(error, tweets, response) {
    // console.log(tweets);

    for (tweet in tweets.statuses) {
      result_tweets.push({
        "id": tweets.statuses[tweet].id,
        "text": tweets.statuses[tweet].text,
        "name": tweets.statuses[tweet].user.name,
        "screen_name": tweets.statuses[tweet].user.screen_name,
        "location": tweets.statuses[tweet].user.location,
        "url": tweets.statuses[tweet].user.url
      });
    }
    // console.log(result_tweets);

    fs.writeFile('result_tweets.json', JSON.stringify(result_tweets, null, '\t'), (err) => {
      if (err) throw err;
      // console.log('Updated result_tweets!');
    });

    var tweet_found = false;

    // Select random and new tweet
    while (!tweet_found) {
      var random_number = Math.floor(Math.random() * result_tweets.length + 1);
      var selected_tweet = result_tweets[random_number];

      if (!(selected_tweet in historic_tweets) && (selected_tweet.screen_name != "recently_eaten")) {
        tweet_found = true;
        historic_tweets.push(selected_tweet);
        // console.log(selected_tweet);

        // Tweet the tweet
        var custom_tweet = selected_tweet.text.substring(0,120) + " ... -@" + selected_tweet.screen_name;
        client.post('statuses/update', {status: custom_tweet}, function(error, tweet, response) {
          if (!error) {
            console.log(custom_tweet);
          }
        });

        // Save tweet
        fs.writeFile('historic_tweets.json', JSON.stringify(historic_tweets, null, '\t'), (err) => {
          if (err) throw err;
          // console.log('Updated historic_tweets!');
        });
      }
    }
  });
}

tweetTweet();





// var params = {screen_name: 'nodejs'};
// client.get('statuses/user_timeline', params, function(error, tweets, response) {
//   if (!error) {
//     console.log(tweets);
//   }
// });
