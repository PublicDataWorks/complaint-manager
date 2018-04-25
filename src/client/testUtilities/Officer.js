class Officer {
    constructor(build) {
        this.id = build.id;
        this.officerNumber = build.officerNumber;
        this.firstName = build.firstName;
        this.middleName = build.middleName;
        this.lastName = build.lastName;
        this.rank = build.rank;
        this.race = build.race;
        this.gender = build.gender;
        this.dob = build.dob;
        this.bureau = build.bureau;
        this.district = build.district;
        this.workStatus = build.workStatus;
    }

    static get Builder() {
        class Builder {
            defaultOfficer() {
                this.id = 57;
                this.officerNumber = 200;
                this.firstName = 'Ugochi';
                this.middleName = 'Grant';
                this.lastName = 'Smith';
                this.rank = 'Police Commander';
                this.race = 'Cuban';
                this.gender = 'Female';
                this.dob = '1990-04-30';
                this.bureau = 'FOB - Field Operations Bureau';
                this.district = 'First District';
                this.workStatus = 'Active';
                return this;
            }

            withId(id) {
                this.id = id;
                return this
            }

            withFirstName(firstName) {
                this.firstName = firstName;
                return this;
            }

            withMiddleName(middleName) {
                this.middleName = middleName;
                return this;
            }

            withLastName(lastName) {
                this.lastName = lastName;
                return this;
            }

            withDistrict(district) {
                this.district = district;
                return this;
            }

            build() {
                return new Officer(this)
            }
        }

        return Builder;

    }
}

export default Officer