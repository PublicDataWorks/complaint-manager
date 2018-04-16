export default function getFirstCivilian(civilians) {
    const complainant = civilians.find(civilian => civilian.roleOnCase === 'Complainant')
    const witness = civilians.find(civilian => civilian.roleOnCase === 'Witness')

    return complainant || witness || {}
}