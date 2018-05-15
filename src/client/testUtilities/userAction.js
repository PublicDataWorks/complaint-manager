class UserAction {
    constructor(build) {
        this.caseId = build.caseId
        this.id = build.id;
        this.user = build.user;
        this.action = build.action;
        this.actionTakenAt = build.actionTakenAt
        this.notes = build.notes
    }

    static get Builder() {
        class Builder {
            defaultUserAction() {
                this.id = undefined
                this.caseId = undefined
                this.user = 'tuser'
                this.action = 'did stuff'
                this.actionTakenAt = new Date().toISOString()
                this.notes = 'i wrote notes'
                return this;
            }

            withCaseId (caseId) {
                this.caseId = caseId
                return this
            }

            withId(id){
                this.id = id;
                return this
            }

            withUser(user){
                this.user = user;
                return this
            }

            withAction(action){
                this.action = action;
                return this
            }

            withActionTakenAt(actionTakenAt){
                this.actionTakenAt = actionTakenAt;
                return this
            }

            withNotes(notes){
                this.notes = notes;
                return this
            }

            build() {
                return new UserAction(this)
            }
        }

        return Builder;

    }
}

export default UserAction