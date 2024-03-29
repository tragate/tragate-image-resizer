var gm = require('gm').subClass({ imageMagick: true });
var Promise = require('es6-promise').Promise;

exports.resize = function (buffer, config) {
    return new Promise(function (resolve, reject) {
        gm(buffer).quality(65).background('white').flatten().setFormat('jpg').size({ bufferStream: true }, function (err, size) {
            if (err) {
                reject('gm.size method error: \n' + err);
            }
            
            if (Math.max(size.width, size.height) <= Math.max(config.width, config.height)) {
                this.toBuffer(function (err, buffer) {
                    if (err) {
                        reject('gm.buffer method error: \n' + err);
                    } else {
                        resolve(buffer);
                    }
                });
            } else {
                this.resize(config.width, config.height).toBuffer(function (err, buffer) {
                    if (err) {
                        reject('gm.resize method error: \n' + err);
                    } else {
                        resolve(buffer);
                    }
                });
            }
        });
    });
};
