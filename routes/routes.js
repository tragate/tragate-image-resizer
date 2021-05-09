var resizer = require('../lib/resizer.js');
var config = require('../lib/config.js')();
var s3Wrapper = require('../lib/s3-wrapper.js');
var multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage })
var appRouter = function (app) {
    app.get('/', (req, res) => {
        res.send('OK');
    });

    app.post('/image-resize', upload.single('image'), (req, res) => {
        resizer.resize(req.file.buffer, config).then(function (buffer) {
            if (!buffer) {
                console.info('File is already in the expected size');
            } else {
                s3Wrapper.upload({
                    Bucket: req.query.bucketName,
                    Key: req.query.key,
                    Body: buffer,
                    ContentType: 'image/jpg',
                    ACL: 'public-read'
                }).then(function (data) {
                    console.info('Image uploaded!');
                    res.send('OK')
                }).catch(function (err) {
                    console.error(err);
                });
            }
        }).catch(function (err) {
            res.send(err);
        });
    })
};

module.exports = appRouter;