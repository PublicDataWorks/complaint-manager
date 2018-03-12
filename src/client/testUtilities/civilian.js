//TODO Should we use a Civilian class in our app code?
import Address from "./Address";

class Civilian {
    constructor(build) {
        this.id = build.id
        this.firstName = build.firstName
        this.lastName = build.lastName
        this.roleOnCase = build.roleOnCase
        this.phoneNumber = build.phoneNumber
        this.birthDate = build.birthDate
        this.email = build.email
        this.raceEthnicity = build.raceEthnicity
        this.genderIdentity = build.genderIdentity
        this.address = build.address
    }

    //TODO: Builders are not usually part of the class that they're building.  The class is usually a domain object used in the app, not just tests.  Should this be refactored?
    static get Builder() {
        class Builder {
            defaultCivilian() {
                this.id = 17
                this.firstName = 'Chuck'
                this.lastName = 'Berry'
                this.roleOnCase = 'Primary Complainant'
                this.phoneNumber = '1234567890'
                this.email = 'cberry@cberry.com'
                this.birthDate = '1994-04-24'
                this.genderIdentity = 'Female'
                this.raceEthnicity = 'Korean'
                this.address = new Address.Builder().defaultAddress().withCivilianId(this.id).build()
                return this;
            }

            withNoAddress() {
                this.address = {
                    id: 1235432,
                    civilianId: this.address.civilianId,
                    streetAddress: '',
                    streetAddress2: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: ''
                }
                return this
            }

            withAddress(address) {
                this.address = address
                return this;
            }

            withId(id) {
                this.id = id
                this.address.civilianId = id
                return this;
            }

            withFirstName(firstName) {
                this.firstName = firstName
                return this;
            }

            withLastName(lastName) {
                this.lastName = lastName
                return this;
            }

            withRoleOnCase(roleOnCase) {
                this.roleOnCase = roleOnCase
                return this;
            }

            withPhoneNumber(phoneNumber) {
                this.phoneNumber = phoneNumber
                return this;
            }

            withBirthDate(birthDate) {
                this.birthDate = birthDate
                return this;
            }

            withEmail(email) {
                this.email = email
                return this;
            }

            withRaceEthnicity(raceEthnicity) {
                this.raceEthnicity = raceEthnicity
                return this;
            }

            withGenderIdentity(genderIdentity) {
                this.genderIdentity = genderIdentity
                return this;
            }

            build() {
                return new Civilian(this)
            }
        }

        return Builder;

    }
}

export default Civilian