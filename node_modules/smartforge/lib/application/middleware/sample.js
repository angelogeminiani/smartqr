/*!
 * SmartForge - sample
 * Copyright(c) 2011 Gian Angelo Geminiani
 * MIT Licensed
 */


module.exports = function sample(){
    return function sample(req, res, next){
        console.log('This middleware do nothing. Please, remove from production middleware array.');
        next();
    };
};