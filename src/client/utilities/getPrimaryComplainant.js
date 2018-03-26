const getPrimaryComplainant = (civilians) => (
    civilians.find(civilian => civilian.roleOnCase === 'Complainant')
)

export default getPrimaryComplainant