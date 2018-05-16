class Address {
  constructor(build) {
    this.id = build.id;
    this.streetAddress = build.streetAddress;
    this.streetAddress2 = build.streetAddress2;
    this.city = build.city;
    this.state = build.state;
    this.zipCode = build.zipCode;
    this.country = build.country;
  }

  static get Builder() {
    class Builder {
      defaultAddress() {
        this.id = 11111;
        this.streetAddress = "123 Main St";
        this.streetAddress2 = "Fl 2";
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

      withStreetAddress(streetAddress) {
        this.streetAddress = streetAddress;
        return this;
      }

      withStreetAddress2(streetAddress2) {
        this.streetAddress2 = streetAddress2;
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
