export const trimWhiteSpace = (value) => {
    return value && value.trim();
};

export const nullifyFieldUnlessValid = input => {
    const isWhiteSpace = input && input.trim() === ''

    return input === '' || isWhiteSpace ? null : input
}