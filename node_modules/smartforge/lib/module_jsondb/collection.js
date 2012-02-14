/*!
 * SmartForge - collection
 * Copyright(c) 2011 Gian Angelo Geminiani
 * MIT Licensed
 */

/**
 * Module dependencies
 */
var events = require('events'),
    utils = require('../utils.js'),
    utilsFs = require('../utilsFs.js'),
    utilsCrypto = require('../utilsCrypto.js'),
    defer = utils.defer;

/**
 * CONSTANTS
 */

var FIELD_ID = '_id',
    EVENT_CHANGED = 'changed'; // collection changed (add, insert, updare, remove)

// --------------------------------------------------------------------------------------------------------------
//                              public
// --------------------------------------------------------------------------------------------------------------

/**
 *
 * @param options
 *      - name {string}: Collection name
 *      - root {string}: Collection root. i.e. '/storepath/'
 *      - ext {string}: (Optional) extension for collection file
 *      - maxSize: {integer}: (Optional) default is 0. Max size of collection. Default is 0 (infinite).
 */
function Collection(options) {
    //-- internal constants --//
    this.COLL_EXT = options.ext || '.json';
    this.EVENT_CHANGED = EVENT_CHANGED;
    //-- internal fields --//
    this._name = options.name;
    this._root = options.root;
    this._maxSize = options.maxSize || 0;
    this._path = utilsFs.pathJoin(this._root, this._name.concat(this.COLL_EXT));
    this._rows = new Array();
    this._cursorIndex = -1;

    // init
    if (options.callback) {
        loadAsync(this, options.callback);
    } else {
        loadSync(this);
    }
}
// inherit from EventEmitter
utils.inherits(Collection, events.EventEmitter);

/**
 * Returns number of items.
 */
Collection.prototype.count = function () {
    return this._rows.length;
};

Collection.prototype.setMaxSize = function (maxSize) {
    this.resize(maxSize);
};

Collection.prototype.resize = function (maxSize) {
    this._maxSize = maxSize || 0;
    if (maxSize > 0 && this._rows.length > maxSize) {
        while (this._rows.length > maxSize) {
            this._rows.splice(0, 1);
        }
    }
};

Collection.prototype.getMaxSize = function () {
    return this._maxSize;
};

Collection.prototype.findAll = function () {
    return utils.clone(this._rows);
};

/**
 *
 * @param id
 * @param callback {function} (Optional) function(err, data)
 */
Collection.prototype.exists = function (id, callback) {
    var self = this;
    if (utils.isFunction(callback)) {
        this.get(id, function (err, data) {
            callback.call(self, err, null != data);
        });
    } else {
        return null != this.get(id);
    }
};

/**
 *
 * @param item
 * @param callback {function} (Optional) function(err, data)
 */
Collection.prototype.insert = function (item, callback) {
    if (item) {
        if (utils.isFunction(callback)) {
            insertAsync(this, item, callback);
        } else {
            insertSync(this, item);
        }
    }
};

/**
 * Return item by id. If 'callback' param is passed, method is executed Async., otherwise
 * is Sync.
 * @param id
 * @param callback {function} (Optional) function(err, data)
 */
Collection.prototype.get = function (id, callback) {
    if (id) {
        if (utils.isFunction(callback)) {
            findByIdAsync(this, id, callback);
        } else {
            return findByIdSync(this, id);
        }
    }
    return null;
};

Collection.prototype.remove = function (id, callback) {
    if (id) {
        if (utils.isFunction(callback)) {
            removeAsync(this, id, callback);
        } else {
            return removeSync(this, id);
        }
    }
    return null;
};

// --------------------------------------------------------------------------------------------------------------
//                              private
// --------------------------------------------------------------------------------------------------------------

function getUID() {
    var uid = utils.uid();
    return utilsCrypto.md5(uid);
}

function resetCursorIndex(collection) {
    setCursorIndex(collection, -1);
}

function setCursorIndex(collection, value) {
    collection._cursorIndex = value;
}

function getCursorIndex(collection) {
    return collection._cursorIndex;
}

function loadSync(collection) {
    try {
        var file = collection._path,
            text = utilsFs.readTextSync(file);

        if (utils.hasText(text)) {
            collection._rows = JSON.parse(text);
        }
    } catch (err) {
        utils.error(collection,
            utils.format('ERROR: "' + err.toString() + '" LOADING: "{0}"', file));
    }
}

function loadAsync(collection, callback) {
    var file = collection._path;
    utilsFs.readTextAsync(file, function (err, data) {
        var error = null;
        if (!err) {
            try {
                if (utils.hasText(data)) {
                    collection._rows = JSON.parse(data);
                }
            } catch (e) {
                error = e;
            }
        } else {
            // file does not exists
            utilsFs.writeTextSync(file, '');
        }
        if (utils.isFunction(callback)) {
            callback(error, error ? null : collection);
        }
    });
}

function findByIdSync(collection, id) {
    var data = collection._rows;
    resetCursorIndex(collection);
    for (var i = 0; i < data.length; i++) {
        if (id === data[i][FIELD_ID]) {
            setCursorIndex(collection, i);
            return data[i];
        }
    }
    return null;
}

function findByIdAsync(collection, id, callback) {
    defer(function () {
        if (utils.isFunction(callback)) {
            callback(null, findByIdSync(collection, id));
        }
    });
}

function insertSync(collection, item) {
    var data = collection._rows;
    // check if item has _id field
    if (item.hasOwnProperty(FIELD_ID)) {
        var existing = findByIdSync(collection, item[FIELD_ID]);
        if (existing) {
            // update from existing
            item = utils.extend(item, existing);
            // remove existing
            removeSync(collection, existing, true);
        }
    } else {
        // assign id and insert
        item[FIELD_ID] = getUID();
    }
    // insert item
    data.push(item);
    // check maxSize
    if (collection._maxSize > 0 && data.length > collection._maxSize) {
        data.splice(0, 1);
    }
    collection.emit(EVENT_CHANGED, collection, item);
    return item;
}

function insertAsync(collection, item, callback) {
    defer(function () {
        if (utils.isFunction(callback)) {
            callback(null, insertSync(collection, item));
        }
    });
}

function removeSync(collection, item, silent) {
    if (item) {
        var i = getCursorIndex(collection);
        if (i > -1) {
            var data = collection._rows;
            data.splice(i, 1);
            if (!silent) {
                collection.emit(EVENT_CHANGED, collection, item);
            }
            // reset cursor
            resetCursorIndex(collection);
            return item;
        } else {
            // cursor index is not valorized. valorize and call remove again
            var existing = findByIdSync(collection, item[FIELD_ID]);
            return removeSync(collection, existing); // [RECOURSE] call again
        }
    }
    return null;
}

function removeAsync(collection, id, callback) {
    defer(function () {
        if (utils.isFunction(callback)) {
            callback(null, removeSync(collection, id));
        }
    });
}

// --------------------------------------------------------------------------------------------------------------
//                              exports
// --------------------------------------------------------------------------------------------------------------

exports.createCollection = function createCollection(options) {
    return new Collection(options);
};