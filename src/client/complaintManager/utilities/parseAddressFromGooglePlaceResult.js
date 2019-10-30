import _ from "lodash";

const getComponentOnType = (address, desired_types) => {
  const addressComponents = address.address_components;

  const componentMatchesAllTypes = addressComponent => {
    return desired_types.every(type => addressComponent.types.includes(type));
  };

  return _.find(addressComponents, componentMatchesAllTypes);
};

const getLatLng = address => {
  let lat = null,
    lng = null;
  if (address.geometry) {
    lat = address.geometry.location.lat();
    lng = address.geometry.location.lng();
  }
  return { lat, lng };
};

const parseAddressFromGooglePlaceResult = address => {
  const streetNumberComponent = getComponentOnType(address, ["street_number"]);
  const streetNumber = streetNumberComponent
    ? streetNumberComponent.long_name
    : "";
  const streetNameComponent = getComponentOnType(address, ["route"]);
  const streetName = streetNameComponent ? streetNameComponent.short_name : "";
  const streetAddress = `${streetNumber} ${streetName}`.trim();

  const cityComponent = getComponentOnType(address, ["locality"]);
  const city = cityComponent ? cityComponent.long_name : "";

  const stateComponent = getComponentOnType(address, [
    "administrative_area_level_1"
  ]);
  const state = stateComponent ? stateComponent.short_name : "";

  const zipCodeComponent = getComponentOnType(address, ["postal_code"]);
  const zipCode = zipCodeComponent ? zipCodeComponent.short_name : "";

  const countryComponent = getComponentOnType(address, ["country"]);
  const country = countryComponent ? countryComponent.short_name : "";

  const intersectionComponent = getComponentOnType(address, ["intersection"]);
  const intersection = intersectionComponent
    ? intersectionComponent.short_name
    : "";

  const placeId = address.place_id ? address.place_id : null;
  const lat = getLatLng(address).lat;
  const lng = getLatLng(address).lng;
  return {
    streetAddress,
    intersection,
    city,
    state,
    zipCode,
    country,
    placeId,
    lat,
    lng
  };
};
export default parseAddressFromGooglePlaceResult;
