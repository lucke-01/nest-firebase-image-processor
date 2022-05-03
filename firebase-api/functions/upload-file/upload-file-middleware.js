const bodyParser = require("body-parser");
const Busboy  = require("busboy");

/**
 * Alternative to multer and express-fileupload since they do not fit/work with google cloud functions
 * @param {*} path 
 * @param {*} app 
 */

module.exports = (path, app) => {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use((req, res, next) => {
        if (req.rawBody === undefined && req.method === 'POST' && req.headers['content-type'].startsWith('multipart/form-data')) {
            getRawBody(req, {
                length: req.headers['content-length'],
                limit: '10mb',
                encoding: contentType.parse(req).parameters.charset
            }, function (err, string) {
                if (err) return next(err)
                req.rawBody = string
                next()
            })
        } else {
            next()
        }
    })

    app.use((req, res, next) => {
        if (req.method === 'POST' && req.headers['content-type'].startsWith('multipart/form-data')) {
            const busboy = new Busboy({ headers: req.headers })
            let fileBuffer = Buffer.from('')
            req.files = {
                file: []
            }

            busboy.on('field', (fieldname, value) => {
                req.body[fieldname] = value
            })

            busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                file.on('data', (data) => {
                    fileBuffer = Buffer.concat([fileBuffer, data])
                })

                file.on('end', () => {
                    const file_object = {
                        fieldname,
                        'originalname': filename,
                        encoding,
                        mimetype,
                        buffer: fileBuffer
                    }

                    req.files.file.push(file_object)
                })
            })

            busboy.on('finish', () => {
                next()
            })


            busboy.end(req.rawBody)
            req.pipe(busboy)
        } else {
            next()
        }
    })
}