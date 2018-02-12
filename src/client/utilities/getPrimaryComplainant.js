const getPrimaryComplainant = (civilians) => (
    civilians.find(civilian => civilian.roleOnCase === 'Primary Complainant')
)

export default getPrimaryComplainant