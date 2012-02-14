var assert = require('assert'),
    utilsFs = require('../lib/utilsFs.js'),
    twitter = require('../lib/module_twitter/twitter.js'),
    gmap = require('../lib/module_google/maps/googlemaps.js');

var config = utilsFs.readJSONSync('z:/_settings/twitter-toi.json');
var twit = twitter.newInstance(config);

var test_send = false,
    test_credentials = false,
    test_direcmessages_sent = false,
    test_direcmessages_received = false,
    test_mentions = false,
    test_trends = false,
    test_stream = true;


/**
 * CREDENTIALS
 */
if(test_credentials){
    twit.verifyCredentials(function (err, data) {
        if(err){
            console.log(console.dir(err));
        } else if(data){
            console.log(console.dir(data));
        }
    });
}

/**
 * SEND MESSAGE
 */
if(test_send){
    twit.updateStatus('@angelogeminiani Test tweet from smartforge twitter API. ver. ' + twitter.VERSION + " at " + new Date(),
        function (err, data) {
            if(err){
                console.log(console.dir(err));
            } else if(data){
                console.log(console.dir(data));
            }
        }
    );
}

if(test_direcmessages_received){

    twit.getDirectMessages({},
        function (err, data) {
            console.log("DIRECT MESSAGE RECEIVED");
            if(err){
                console.log(console.dir(err));
            } else if(data){
                console.log(console.dir(data));
            }
        }
    );
}
if(test_direcmessages_sent){
    twit.getDirectMessagesSent(
        {},
        function (err, data) {
            console.log("DIRECT MESSAGES SENT");
            if(err){
                console.log(console.dir(err));
            } else if(data){
                console.log(console.dir(data));
            }
        }
    );
}

/**
 * getMentions (/statuses/mentions.json)
 */
if(test_mentions){
    twit.getMentions(
        {
            "count": 1,
            "contributor_details":true,
            "include_entities":true
        },
        function (err, data) {
            console.log("MENTIONS");
            if(err){
                console.log(console.dir(err));
            } else if(data && data.length>0){
                for(var i=0;i<data.length;i++){
                    var item = data[i];
                    console.log(item.text);
                    if(item.geo){
                        console.log(item.geo);
                        if(item.geo.coordinates && item.geo.coordinates.length===2){
                            gmap.reverseGeocode(item.geo.coordinates.join(','),
                                function(err, data){
                                    if(data && data.results && data.results.length>0){
                                        var address = data.results[0];
                                        console.log(address);
                                    }
                                });
                        }
                    }
                }
            }
        }
    );
}

if(test_trends){
    twit.getWeeklyTrends({},
        function (err, data) {
            console.log("TRENDS");
            if(err){
                console.log(console.dir(err));
            } else if(data){
                console.log(console.dir(data));
            }
        }
    );
}

if(test_stream){
    twit.stream('user', {}, function(emitter){
        emitter.on('data', function(data){
            console.log(data);
        });
    });
}

