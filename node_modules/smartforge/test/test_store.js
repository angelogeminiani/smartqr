var assert = require('assert'),
    store = require('../lib/module_jsondb');

var db = store.open({name:'test'});

var coll = db.openSync('test');

console.log(coll);

var coll2 = db.open('test2', function(err, coll){
    if(err){
        console.log(err);
    } else {
        var maxSize = 10;

        coll.setMaxSize(maxSize);

        for(var i=0;i<1000;i++){
            coll.insert({field1:'#'+ i + ' hello, this is a test', field2: {name:'embedded'}});
        }

        console.log(coll.count());

        console.log(coll);

        assert.ok(coll.count()===maxSize);
    }
});

