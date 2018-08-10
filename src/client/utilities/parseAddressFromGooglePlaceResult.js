import _ from "lodash";

const getComponentOnType = (address, desired_types) => {
  const addressComponents = address.address_components;

  const componentMatchesAllTypes = addressComponent => {
    return desired_types.every(type => addressComponent.types.includes(type));
  };

  return _.find(addressComponents, componentMatchesAllTypes);
};

const addIntersectionToAddressIfPresent = (name, address) => {
  let intersection = "";
  if (
    address.streetAddress === "" &&
    name &&
    (name.includes("&") || name.includes("and")) &&
    name !== address.city &&
    name !== address.state &&
    name !== address.country
  ) {
    intersection = name;
  }

  return {
    ...address,
    intersection
  };
};

const parseAddressFromGooglePlaceResult = address => {
  const streetNumberComponent = getComponentOnType(address, ["street_number"]);
  const streetNumber = streetNumberComponent
    ? streetNumberComponent.long_name
    : "";
  const streetNameComponent = getComponentOnType(address, ["route"]);
  const streetName = streetNameComponent ? streetNameComponent.short_name : "";
  const streetAddress = `${streetNumber} ${streetName}`.trim();

  const cityComponent = getComponentOnType(address, ["locality", "political"]);
  const city = cityComponent ? cityComponent.long_name : "";

  const stateComponent = getComponentOnType(address, [
    "administrative_area_level_1",
    "political"
  ]);
  const state = stateComponent ? stateComponent.short_name : "";

  const zipCodeComponent = getComponentOnType(address, ["postal_code"]);
  const zipCode = zipCodeComponent ? zipCodeComponent.short_name : "";

  const countryComponent = getComponentOnType(address, [
    "country",
    "political"
  ]);
  const country = countryComponent ? countryComponent.short_name : "";

  const parsedAddress = {
    streetAddress,
    city,
    state,
    zipCode,
    country
  };

  return addIntersectionToAddressIfPresent(address.name, parsedAddress);
};
export default parseAddressFromGooglePlaceResult;
