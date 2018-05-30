import formatQueryColumn from "./formatQueryColumn";

describe("formatQueryColumn", function() {
  test("should format a integer column", () => {
    const formattedColumn = formatQueryColumn("test", 1);
    expect(formattedColumn).toEqual("test=1");
  });
  test("should format a date column", () => {
    const dateValue = new Date().toISOString();
    const formattedColumn = formatQueryColumn("test", dateValue);
    expect(formattedColumn).toEqual(`test='${dateValue}'`);
  });
  test("should format a null value", () => {
    const formattedColumn = formatQueryColumn("test", null);
    expect(formattedColumn).toEqual("test=null");
  });
  test("should format a string value", () => {
    const formattedColumn = formatQueryColumn("test", "string");
    expect(formattedColumn).toEqual("test='string'");
  });
  test("should format an empty string value", () => {
    const formattedColumn = formatQueryColumn("test", "");
    expect(formattedColumn).toEqual("test=null");
  });
});
