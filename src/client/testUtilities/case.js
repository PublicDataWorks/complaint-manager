import Civilian from "./civilian";

class Case {
    constructor(build) {
        this.id = build.id
        this.civilians = build.civilians
        this.complainantType = build.complainantType
        this.status = build.status
        this.createdAt = build.createdAt
        this.firstContactDate = build.firstContactDate
    }

    static get Builder() {
        class Builder {
            defaultCase() {
                this.id = 17
                this.civilians = [new Civilian.Builder().defaultCivilian().build()]
                this.status = 'Initial'
                this.createdAt = new Date(2015, 8, 13).toISOString()
                this.firstContactDate = "2017-12-25T00:00:00.000Z"
                return this;
            }

            withId(id) {
                this.id = id
                return this;
            }

            withCivilians(civilians) {
                this.civilians = civilians
                return this;
            }

            withComplainantType(complainantType) {
                this.complainantType = complainantType
                return this;
            }

            withStatus(status) {
                this.status = status
                return this;
            }

            withCreatedAt(createdAt) {
                this.createdAt = createdAt
                return this;
            }

            withFirstContactDate(firstContactDate) {
                this.firstContactDate = firstContactDate
                return this;
            }

            build() {
                return new Case(this)
            }
        }

        return Builder;

    }
}

export default Case