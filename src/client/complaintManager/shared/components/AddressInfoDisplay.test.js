import React from "react";
import { mount } from "enzyme";
import AddressInfoDisplay from "./AddressInfoDisplay";
import Address from "../../testUtilities/Address";
import { containsText } from "../../../testHelpers";

describe("AddressInfoDisplay", () => {
  test("should display Address Info", () => {
    const address = new Address.Builder()
      .defaultAddress()
      .withStreetAddress("200 E Randolph")
      .withStreetAddress2("APT 2")
      .withAdditionalLocationInfo("In the parking lot")
      .build();

    const addressInfoWrapper = mount(
      <AddressInfoDisplay
        address={address}
        testLabel={"test"}
        label={"TEST LABEL"}
      />
    );

    containsText(addressInfoWrapper, '[data-testid="test"]', "200 E Randolph");
    containsText(addressInfoWrapper, '[data-testid="test"]', "APT 2");
    containsText(
      addressInfoWrapper,
      '[data-testid="testAdditionalLocationInfo"]',
      "In the parking lot"
    );
  });

  test("should display No Address Specified when no address is given", () => {
    const addressInfoWrapper = mount(
      <AddressInfoDisplay testLabel={"test"} label={"test address"} />
    );

    containsText(
      addressInfoWrapper,
      '[data-testid="test"]',
      "No address specified"
    );
  });

  test("should include line break when param is true", () => {
    const address = new Address.Builder()
      .defaultAddress()
      .withStreetAddress("200 E Randolph")
      .withIntersection("")
      .withStreetAddress2("")
      .withCity("Chicago")
      .build();
    const addressInfoWrapper = mount(
      <AddressInfoDisplay
        address={address}
        testLabel={"test"}
        label={"TEST LABEL"}
        useLineBreaks={true}
      />
    );
    const renderedAddressHTML = addressInfoWrapper
      .find('[data-testid="test"]')
      .last()
      .html();
    expect(renderedAddressHTML).toContain(
      "200 E Randolph<span><br></span>Chicago, IL 63456 Merica"
    );
  });

  test("should include line break when param is true and there is a street address 2", () => {
    const address = new Address.Builder()
      .defaultAddress()
      .withStreetAddress("200 E Randolph")
      .withIntersection("")
      .withStreetAddress2("Fl 2")
      .withCity("Chicago")
      .build();
    const addressInfoWrapper = mount(
      <AddressInfoDisplay
        address={address}
        testLabel={"test"}
        label={"TEST LABEL"}
        useLineBreaks={true}
      />
    );
    const renderedAddressHTML = addressInfoWrapper
      .find('[data-testid="test"]')
      .last()
      .html();
    expect(renderedAddressHTML).toContain(
      "200 E Randolph<span><br></span>Fl 2<span><br></span>Chicago, IL 63456 Merica"
    );
  });
});
