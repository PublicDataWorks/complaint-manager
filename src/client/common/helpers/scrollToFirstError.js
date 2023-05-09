const scrollToFirstError = errors => {
  if (errors) {
    const firstError = Object.keys(errors)[0];
    document.querySelector(`[name="${firstError}"]`)?.focus();
  }
};

export const scrollToFirstErrorWithValue = errors => {
  if (errors) {
    const firstFieldError = Object.keys(errors)[0];
    const firstSubFieldError = Object.keys(Object.values(errors)[0])[0];

    const firstErrorName = firstFieldError + "." + firstSubFieldError;
    document.querySelector(`[name="${firstErrorName}"]`).focus();
  }
};

export default scrollToFirstError;
