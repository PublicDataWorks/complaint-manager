const {
  parseSearchTerm,
  buildQueryString,
  removeTags
} = require("./searchUtilities");

describe("parseSearchTerm", () => {
  test("should return undefined if input is undefined", () => {
    expect(parseSearchTerm()).toBeUndefined();
    expect(parseSearchTerm(null)).toBeUndefined();
  });

  test("should return unchanged term when term has no spaces", () => {
    expect(parseSearchTerm("Seizure")).toEqual("Seizure");
    expect(parseSearchTerm("HeLlO!!")).toEqual("HeLlO!!");
  });

  test('should replace all spaces with " <<SPACE>> "', () => {
    expect(parseSearchTerm(" Search")).toEqual(" <<SPACE>> Search");
    expect(parseSearchTerm("Search ")).toEqual("Search <<SPACE>> ");
    expect(parseSearchTerm("Search and Seizure")).toEqual(
      "Search <<SPACE>> and <<SPACE>> Seizure"
    );
    expect(parseSearchTerm("Search      and       Seizure")).toEqual(
      "Search <<SPACE>> and <<SPACE>> Seizure"
    );
  });
});

describe("buildQueryString", () => {
  test("should asterisk all words if no operators, parens, or quotes", () => {
    expect(
      buildQueryString("I like tea and cakes for tea and cake time")
    ).toEqual("*I* *like* *tea* *and* *cakes* *for* *tea* *and* *cake* *time*");
  });

  test("should not asterisk operators", () => {
    expect(
      buildQueryString("I like tea AND cakes for tea OR cake time")
    ).toEqual("*I* *like* *tea* AND *cakes* *for* *tea* OR *cake* *time*");
  });

  test("should not asterisk quotes", () => {
    expect(
      buildQueryString('I "like tea" AND cakes for tea OR "cake time"')
    ).toEqual(
      '*I* "*like* *<<SPACE>>* *tea*" AND *cakes* *for* *tea* OR "*cake* *<<SPACE>>* *time*"'
    );
  });

  test("should add parens around NOT and next term", () => {
    expect(buildQueryString("NOT safe")).toEqual("(NOT *safe*)");
    expect(buildQueryString("NOT safe AND definitely NOT SAFe")).toEqual(
      "(NOT *safe*) AND *definitely* (NOT *SAFe*)"
    );
  });

  test("should not asterisk parens or a NOT just inside of parens", () => {
    expect(
      buildQueryString("I like (tea AND cakes for) (NOT tea OR cake) time")
    ).toEqual(
      "*I* *like* (*tea* AND *cakes* *for*) ((NOT *tea*) OR *cake*) *time*"
    );
  });

  test("should preprocess a declared search field to add .\\* but not prepend with *", () => {
    expect(buildQueryString("tag:Tofu accused:(Night OR Ansel) Fred")).toEqual(
      "tag.\\*:*Tofu* accused.\\*:(*Night* OR *Ansel*) *Fred*"
    );
  });

  test("should add asterisks around terms even when stuck between a colon and a parenthesis", () => {
    expect(
      buildQueryString("Tofu OR (complainant:Nigh AND complainant:Wat)")
    ).toEqual("*Tofu* OR (complainant.\\*:*Nigh* AND complainant.\\*:*Wat*)");
  });

  test('should replace (" with ("*', () => {
    expect(buildQueryString('("searchy")')).toEqual('("*searchy*")');
  });
});

describe("removeTags", () => {
  test("should remove tags", () => {
    expect(removeTags("I like tea and cakes")).toEqual("I like tea and cakes");
    expect(removeTags("<u>I like</u> tea and cakes")).toEqual(
      "I like tea and cakes"
    );
    expect(removeTags("I like <a href='#>tea and cakes</a>")).toEqual(
      "I like tea and cakes"
    );
    expect(removeTags("<b><u>I like</u> tea and cakes</b>")).toEqual(
      "I like tea and cakes"
    );
  });

  test("should add a space when replacing p and br tags", () => {
    expect(removeTags("<p>I</p>Am<br>So<br /><p>Tired</p>")).toEqual(
      " I Am So  Tired "
    );
  });
});
