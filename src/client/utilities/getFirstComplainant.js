export default function getFirstComplainant(civilians) {
    return civilians.find(civilian => civilian.roleOnCase === 'Complainant')
}