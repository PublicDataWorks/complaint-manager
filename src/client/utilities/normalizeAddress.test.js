import React from "react";
import normalizeAddress from "./normalizeAddress";

describe("normalizeAddress", () => {
  let address;
  beforeEach(() => {
    address = {
      streetAddress: "200 East Randolph Street",
      streetAddress2: "",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "US",
      additionalLocationInfo: "somewhere out there"
    };
  });

  test("should return same address", () => {
    const normalizedAddress = normalizeAddress(address);
    const expectedAddressObject = {
      streetAddress: "200 East Randolph Street",
      streetAddress2: "",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "US",
      additionalLocationInfo: "somewhere out there"
    };

    expect(normalizedAddress).toEqual(expectedAddressObject);
  });

  test("should return address with trimmed streetAddress2", () => {
    address.streetAddress2 = "Unit 123   ";
    const expectedAddressObject = {
      streetAddress: "200 East Randolph Street",
      streetAddress2: "Unit 123",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "US",
      additionalLocationInfo: "somewhere out there"
    };
    const normalizedAddress = normalizeAddress(address);
    expect(normalizedAddress).toEqual(expectedAddressObject);
  });

  test("should return trimmed streetAddress2", () => {
    address.streetAddress2 = "     ";
    const expectedAddressObject = {
      streetAddress: "200 East Randolph Street",
      streetAddress2: "",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "US",
      additionalLocationInfo: "somewhere out there"
    };
    const normalizedAddress = normalizeAddress(address);
    expect(normalizedAddress).toEqual(expectedAddressObject);
  });
});
