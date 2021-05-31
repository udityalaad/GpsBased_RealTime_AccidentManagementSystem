var exec = require('cordova/exec');

module.exports = function() {
    exec(null, null, 'Exit', 'exit', []);
};
