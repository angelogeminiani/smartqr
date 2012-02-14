/*!
 * SmartForge - test_utils
 * Copyright(c) 2011 Gian Angelo Geminiani
 * MIT Licensed
 */

var assert = require('assert'),
    utils = require('../lib/utils.js');

// ---------------------------------------------------------------------------------------------------------------
//                              toArray
// ---------------------------------------------------------------------------------------------------------------
function testToArray(){
    var arr = utils.toArray(arguments);
    return arr;
}
var arr = testToArray('item1', 'item2');
assert.ok(Array.isArray(arr));
assert.ok(arr[0]==='item1');


arr = utils.toArray('item1', 'item2');
assert.ok(Array.isArray(arr));
assert.ok(arr[0]==='item1');

arr = utils.toArray('item1');
assert.ok(Array.isArray(arr));
assert.ok(arr[0]==='item1');