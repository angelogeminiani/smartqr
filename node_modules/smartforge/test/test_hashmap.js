var assert = require('assert'),
    hashmap = require('../lib/collections/hashmap.js');

var map = hashmap.newInstance();

var objKey = {id:3};

map.put('key1', {name:'test1'});
map.put('key2', {name:'test2'});
map.put(objKey, {name:'test3'});

console.log(map.toString());
assert.ok(map.size()===3);

// remove object key
map.remove(objKey);

console.log(map.toString());
assert.ok(map.size()===2);

// clear
map.clear();

console.log(map.toString());
assert.ok(map.size()===0);