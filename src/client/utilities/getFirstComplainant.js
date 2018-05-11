export default function getFirstComplainant(collection) {
    return collection.find(element => element.roleOnCase === 'Complainant')
}