class Civilian {
    constructor(build) {
        this.id = build.id 
        this.firstName = build.firstName 
        this.lastName = build.lastName 
        this.roleOnCase = build.roleOnCase 
        this.phoneNumber = build.phoneNumber 
        this.email = build.email 
    }

    static get Builder() {
        class Builder {
            defaultCivilian() {
                this.id = 17
                this.firstName = 'Chuck'
                this.lastName = 'Berry'
                this.roleOnCase = 'Primary Complainant'
                this.phoneNumber = '1234567890'
                this.email = 'cberry@cberry.com'
                return this;
            }

            withId(id) {
                this.id = id
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

            withEmail(email) {
                this.email = email
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