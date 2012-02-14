/*!
 * SmartForge - test_mongo
 * Copyright(c) 2011 Gian Angelo Geminiani
 * MIT Licensed
 */

var mongo = require('mongodb'),
    assert = require('assert');

var server = new mongo.Server("127.0.0.1", 27017, {poolSize:3});
var db_connector1 = new mongo.Db('test', server);
var test = function (err, Collection) {
    Collection.insert({a:2}, function (err, docs) {

        Collection.count(function (err, count) {
            assert.ok(count > 0);
        });

        // Locate all the entries using find
        Collection.find().toArray(function (err, results) {
            assert.ok(results.length > 0);
            assert.ok(results[0].a === 2);

            console.log(results);

            // Let's close the db
            db_connector1.close();
            server.close();
        });
    });
};

db_connector1.open(function (err, p_client) {
    if (!err) {
        db_connector1.collection('test_insert', test);
    } else {
        console.log(err);
    }

});

var server2 = new mongo.Server("127.0.0.1", 27017, {});
var db_connector = new mongo.Db('smartcart', server2, {"native_parser ":true});

db_connector.open(function (err, db) {
    if (!err) {
        db.collection('countries', function (err, collection) {
            if (!err) {
                collection.find().toArray(function (err, results) {
                    if (!err) {
                        console.log('found: ' + results.length);
                        result = results;
                    } else {
                        console.log(err);
                        result = [];
                    }
                    // Let's close the db
                    db.close();
                    server2.close();
                });
            } else {
                console.log(err);
                result = [];
            }
        });
    } else {
        console.log(err);
        result = [];
    }

});
