function differentiateFileName(fileName, differentiator) {
    if (Boolean(fileName)) {
        let fileExtRegex = /(?:\.([^.]+))?$/
        let fileExtension = fileExtRegex.exec(fileName)[0]

        let firstPart = fileName.replace(fileExtension, '')

        return firstPart.concat('-', differentiator, fileExtension)
    } else {
        return fileName
    }
}

module.exports = differentiateFileName