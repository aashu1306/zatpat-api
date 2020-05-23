const multer = require('multer')

module.exports.rawFormData = () => {
    let formData = multer()
    return formData.none()
}
module.exports.fileFormData = (path, fieldName) => {
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path)
        },
        filename: function (req, file, cb) {
            let ext = file.originalname.split('.')[1]
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`)
        }
    })
    let formData = multer({ storage: storage })
    return formData.single(fieldName)
}