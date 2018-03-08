const differentiateFileName = require("./differentiateFileName")

test('should replace filename with dateTimeStamp', () => {
    const prefix = 'dog_nose'
    const extension = '.jpeg'
    const fileName = prefix + extension

    const date = new Date().getTime().toString()

    const result = differentiateFileName(fileName, date)
    const expected = prefix.concat('-', date, extension)

    expect(result).toEqual(expected)
})

test('should replace filename with multiple dots', () => {
    const prefix = 'dog.nose.is.so.bopable'
    const extension = '.jpeg'
    const fileName = prefix + extension

    const date = new Date().getTime().toString()

    const result = differentiateFileName(fileName, date)
    const expected = prefix.concat('-', date, extension)

    expect(result).toEqual(expected)
})

test('should handle blank strings', () => {
    const blankFile = ""
    const date = new Date().getTime().toString()

    const result = differentiateFileName(blankFile, date)

    expect(result).toEqual(blankFile)
})

test('should handle undefined filenames', () => {
    const blankFile = undefined
    const date = new Date().getTime().toString()

    const result = differentiateFileName(blankFile, date)

    expect(result).toEqual(blankFile)
})

