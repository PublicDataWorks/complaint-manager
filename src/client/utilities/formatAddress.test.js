import {
  formatAddressAsString,
  formatAddressWithLineBreak
} from "./formatAddress";
import React from "react";
import { shallow } from "enzyme/build/index";

describe("format address", () => {
  describe("formatAddressAsString", () => {
    test("should return N/A if no null passed", () => {
      expect(formatAddressAsString(null)).toEqual("");
    });

    test("should return N/A if no address passed", () => {
      const noAddress = {
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
        country: ""
      };
      expect(formatAddressAsString(noAddress)).toEqual("");
    });

    test("should separate by commas each component passed", () => {
      const address = {
        streetAddress: "200 East Randolph Street",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        country: "US"
      };

      const expectedText = "200 East Randolph Street, Chicago, IL, 60601, US";

      expect(formatAddressAsString(address)).toEqual(expectedText);
    });

    test("should take into account missing country in between", () => {
      const address = {
        streetAddress: "200 East Randolph Street",
        city: "Chicago",
        state: "IL",
        zipCode: "60601"
      };

      const expectedText = "200 East Randolph Street, Chicago, IL, 60601";
      expect(formatAddressAsString(address)).toEqual(expectedText);
    });

    test("should take into account missing zipCode in between", () => {
      const address = {
        streetAddress: "200 East Randolph Street",
        city: "Chicago",
        state: "IL",
        country: "USA"
      };

      const expectedText = "200 East Randolph Street, Chicago, IL, USA";
      expect(formatAddressAsString(address)).toEqual(expectedText);
    });

    test("should take into account missing state in between", () => {
      const address = {
        streetAddress: "200 East Randolph Street",
        city: "Chicago",
        country: "USA",
        zipCode: "60601"
      };

      const expectedText = "200 East Randolph Street, Chicago, 60601, USA";
      expect(formatAddressAsString(address)).toEqual(expectedText);
    });

    test("should take into account missing city in between", () => {
      const address = {
        streetAddress: "200 East Randolph Street",
        state: "IL",
        country: "USA",
        zipCode: "60601"
      };

      const expectedText = "200 East Randolph Street, IL, 60601, USA";
      expect(formatAddressAsString(address)).toEqual(expectedText);
    });
    test("should take into account missing street address in between", () => {
      const address = {
        city: "Chicago",
        state: "IL",
        country: "USA",
        zipCode: "60601"
      };

      const expectedText = "Chicago, IL, 60601, USA";
      expect(formatAddressAsString(address)).toEqual(expectedText);
    });

    test("should display additional location info", () => {
      const address = {
        streetAddress: "200 East Randolph Street",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        country: "US",
        additionalLocationInfo: "somewhere out there"
      };

      const expectedText =
        "200 East Randolph Street, Chicago, IL, 60601, US (somewhere out there)";
      expect(formatAddressAsString(address)).toEqual(expectedText);
    });
  });

  describe("formatAddressWithLineBreak", () => {
    test("should put in line break between street and city", () => {
      const address = {
        streetAddress: "123 Main St",
        intersection: "",
        city: "Chicago",
        state: "IL",
        country: "USA",
        zipCode: "60601"
      };

      const expectedResult = (
        <span>
          123 Main St
          <span>
            <br />
          </span>
          Chicago, IL 60601 USA
        </span>
      );
      expect(shallow(formatAddressWithLineBreak(address, true)).html()).toEqual(
        shallow(expectedResult).html()
      );
    });

    test("should put in line break between intersection and city", () => {
      const address = {
        streetAddress: "",
        intersection: "Canal & Washington",
        city: "Chicago",
        state: "IL",
        country: "USA",
        zipCode: "60601"
      };

      const expectedResult = (
        <span>
          Canal & Washington
          <span>
            <br />
          </span>
          Chicago, IL 60601 USA
        </span>
      );
      expect(shallow(formatAddressWithLineBreak(address, true)).html()).toEqual(
        shallow(expectedResult).html()
      );
    });

    test("should not put in line break if no address or intersection", () => {
      const address = {
        streetAddress: "",
        intersection: "",
        city: "Chicago",
        state: "IL",
        country: "USA",
        zipCode: "60601"
      };

      const expectedResult = <span>Chicago, IL 60601 USA</span>;
      expect(shallow(formatAddressWithLineBreak(address, true)).html()).toEqual(
        shallow(expectedResult).html()
      );
    });

    test("should put addressLine2 when it exists before the city", () => {
      const address = {
        streetAddress: "100 Peach Street",
        streetAddress2: "Unit 123",
        intersection: "",
        city: "Chicago",
        state: "IL",
        country: "USA",
        zipCode: "60601"
      };

      const expectedResult = (
        <span>
          100 Peach Street
          <span>
            <br />
          </span>
          Unit 123
          <span>
            <br />
          </span>
          Chicago, IL 60601 USA
        </span>
      );

      expect(shallow(formatAddressWithLineBreak(address, true)).html()).toEqual(
        shallow(expectedResult).html()
      );
    });

    test("should not display addressLine2 if not present", () => {
      const address = {
        streetAddress: "100 Peach Street",
        streetAddress2: "",
        intersection: "",
        city: "Chicago",
        state: "IL",
        country: "USA",
        zipCode: "60601"
      };

      const expectedResult = (
        <span>
          100 Peach Street
          <span>
            <br />
          </span>
          Chicago, IL 60601 USA
        </span>
      );

      expect(shallow(formatAddressWithLineBreak(address, true)).html()).toEqual(
        shallow(expectedResult).html()
      );
    });
  });
});
