const scrollToFirstError = (errors) => {
    const firstError = Object.keys(errors)[0];
    document.querySelector(`[name="${firstError}"]`).focus();
};

export default scrollToFirstError;