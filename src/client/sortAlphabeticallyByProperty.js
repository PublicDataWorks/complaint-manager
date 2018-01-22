const sortAlphabeticallyByProperty = (objects, key) => {

    if (!objects.every(object => object.hasOwnProperty(key))) {
        return objects
    }

    return objects.sort((obj1, obj2) => {
        const sanitizedValue1 = obj1[key].toString().toLowerCase();
        const sanitizedValue2 = obj2[key].toString().toLowerCase();

        if (sanitizedValue1 < sanitizedValue2) {
            return -1
        } else if (sanitizedValue1 > sanitizedValue2) {
            return 1
        } else {
            return 0
        }
    })
}

export default sortAlphabeticallyByProperty