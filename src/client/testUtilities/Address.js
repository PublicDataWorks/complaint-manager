class Address {
  constructor(build) {
    this.id = build.id;
    this.addressableId = build.addressableId;
    this.addressableType = build.addressableType;
    this.streetAddress = build.streetAddress;
    this.streetAddress2 = build.streetAddress2;
    this.lat = build.lat;
    this.lng = build.lng;
    this.placeId = build.placeId;
    this.intersection = build.intersection;
    this.city = build.city;
    this.state = build.state;
    this.zipCode = build.zipCode;
    this.country = build.country;
  }

  static get Builder() {
    class Builder {
      defaultAddress() {
        this.id = 11111;
        this.addressableId = 17;
        this.addressableType = "cases";
        this.streetAddress = "123 Main St";
        this.streetAddress2 = "Fl 2";
        this.lat = 20.976;
        this.lng = 90.655;
        this.placeId = "IC9382LXIAJ";
        this.intersection = "Mayo St & Mustard Ave";
        this.city = "Sandwich";
        this.state = "IL";
        this.zipCode = "63456";
        this.country = "Merica";

        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }

      withNoAddressable() {
        this.addressableId = undefined;
        this.addressableType = undefined;
        return this;
      }

      withAddressableType(addressableType) {
        this.addressableType = addressableType;
        return this;
      }

      withAddressableId(addressableId) {
        this.addressableId = addressableId;
        return this;
      }

      withStreetAddress(streetAddress) {
        this.streetAddress = streetAddress;
        return this;
      }

      withStreetAddress2(streetAddress2) {
        this.streetAddress2 = streetAddress2;
        return this;
      }

      withLat(lat) {
        this.lat = lat;
        return this;
      }

      withLng(lng) {
        this.lng = lng;
        return this;
      }

      withPlaceId(placeId) {
        this.placeId = placeId;
        return this;
      }

      withIntersection(intersection) {
        this.intersection = intersection;
        return this;
      }

      withCity(city) {
        this.city = city;
        return this;
      }

      withState(state) {
        this.state = state;
        return this;
      }

      withZipCode(zipCode) {
        this.zipCode = zipCode;
        return this;
      }

      withCountry(country) {
        this.country = country;
        return this;
      }

      build() {
        return new Address(this);
      }
    }

    return Builder;
  }
}

export default Address;
