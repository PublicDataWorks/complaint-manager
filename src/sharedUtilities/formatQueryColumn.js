const formatQueryColumn = (column, columnValue) => {
  if (typeof columnValue === "number") {
    return `${column}=${columnValue}`;
  }
  if (Boolean(columnValue)) {
    return `${column}='${columnValue}'`;
  }

  return `${column}=null`;
};

module.exports = formatQueryColumn;
