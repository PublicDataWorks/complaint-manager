class Attachment {
    constructor(build) {
        this.id = build.id
        this.caseId = build.caseId
        this.key = build.key
    }

    static get Builder() {
        class Builder {
            defaultAttachment() {
                this.id = 17
                this.caseId = 17
                this.key = 'default_file.pdf'

                return this
            }

            withId(id) {
                this.id = id
                return this;
            }

            withCaseId(caseId) {
                this.caseId = caseId
                return this;
            }

            withKey(key) {
                this.key = key
                return this;
            }

            build() {
                return new Attachment(this)
            }
        }

        return Builder
    }
}

export default Attachment