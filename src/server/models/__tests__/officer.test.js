import models from "../index"
import moment from "moment";

describe("officers", () => {
    describe("fullName", () => {
        test("fullName should be constructed of first, middle, and last", () => {
            const officer = models.officer.build({firstName: "Johann", middleName: "Sebastian", lastName: "Bach"});
            expect(officer.fullName).toEqual("Johann Sebastian Bach");
        });

        test("fullName should only include one space when no middle name", () => {
            const officer = models.officer.build({firstName: "Johann", middleName: "", lastName: "Bach"});
            expect(officer.fullName).toEqual("Johann Bach");
        });
    });
    describe("age", () => {
        test("age should be calculated as today minus dob, without fractions", () => {
            const dob = moment().subtract(45, 'years').subtract(9, 'months');
            const officer = models.officer.build({dob: dob});
            expect(officer.age).toEqual(45);
        });
    });
    describe("district", () => {
        test("district should display in numeric format", () => {
            const officer = models.officer.build({district: 'First District'});
            expect(officer.district).toEqual('1st District');
        });
        test("district should be blank if blank", () => {
            const officer = models.officer.build({district: ''});
            expect(officer.district).toEqual('');
        });
    });
});