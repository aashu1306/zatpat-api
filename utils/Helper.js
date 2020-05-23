const ucFirst = (string = "") => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
/**
 * Handle Global Error.
 * @param {Function} fn 
 */
module.exports.catchAsync = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(err => {
            console.log(err)
            next(err)
        })
    }
}

module.exports.getImagePath = (req, path) => {
    let hostUrl = req.protocol + "://" + req.headers.host
    let uriPath = path.replace('\\', '/').replace('/\/', '/').replace('public\/', '')
    return hostUrl + '/' + uriPath
}

module.exports.deSlugify = (string, char) => {
    let replaced = string.replace(new RegExp(char, "g"), ' ').split(' ').map(el => ucFirst(el)).join(' ')
    return replaced
}