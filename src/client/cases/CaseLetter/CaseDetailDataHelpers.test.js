import {
  getIncidentInfoData,
  getFormattedDate,
  getComplainantData,
  getWitnessData
} from "./CaseDetailDataHelpers";

describe("caseDetailDataHelpers", function() {
  describe("incident info", function() {
    test("it returns correct incident info", () => {
      const incidentDate = "2014-12-12";
      const firstContactDate = "2015-01-01";
      const caseDetail = {
        incidentDate: incidentDate,
        firstContactDate: firstContactDate,
        incidentTime: "10:00:00",
        incidentLocation: {
          streetAddress: "100 Small Lake Road",
          city: "Skokie",
          state: "IL",
          zipCode: "10000"
        },
        district: "some district"
      };

      const incidentInfoData = getIncidentInfoData(caseDetail);
      const formattedIncidentDate = getFormattedDate(incidentDate);
      const formattedFirstContactDate = getFormattedDate(firstContactDate);

      expect(incidentInfoData).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            "Incident Date": formattedIncidentDate,
            "First Contacted IPM": formattedFirstContactDate,
            "Incident Time": "10:00:00",
            "Incident Location": "100 Small Lake Road Skokie IL 10000",
            District: "some district"
          })
        ])
      );
    });
  });

  describe("complainant data", function() {
    test("returns correct complainant data when single civilian complainant", () => {
      const birthDate = "1990-09-09";

      const caseDetail = {
        complainantCivilians: [
          {
            fullName: "Civilian Joe",
            raceEthnicity: "some race",
            genderIdentity: "some gender",
            birthDate: birthDate,
            address: {
              streetAddress: "123 some street drive",
              city: "some city",
              state: "some state",
              zipCode: "10000"
            },
            phoneNumber: "1234567890"
          }
        ],
        complainantOfficers: []
      };

      const complainantData = getComplainantData(caseDetail);
      const formattedBirthDate = getFormattedDate(birthDate);

      expect(complainantData).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            "Civilian Name": "Civilian Joe",
            Race: "some race",
            "Gender Identity": "some gender",
            DOB: formattedBirthDate,
            Address: "123 some street drive some city some state 10000",
            "Cell Phone": "1234567890"
          })
        ])
      );
    });

    test("returns correct complainant data when multiple civilian complainants", () => {
      const birthDate = "1990-09-09";
      const birthDate2 = "1991-09-09";
      const birthDate3 = "1992-09-09";

      const caseDetail = {
        complainantCivilians: [
          {
            fullName: "Civilian Joe",
            raceEthnicity: "some race",
            genderIdentity: "some gender",
            birthDate: birthDate,
            address: {
              streetAddress: "123 some street drive",
              city: "some city",
              state: "some state",
              zipCode: "10000"
            },
            phoneNumber: "1234567890"
          },
          {
            fullName: "Civilian Joe2",
            raceEthnicity: "some race",
            genderIdentity: "some gender",
            birthDate: birthDate2,
            address: {
              streetAddress: "123 some street road",
              city: "some city",
              state: "some state",
              zipCode: "10001"
            },
            phoneNumber: "0987654321"
          },
          {
            fullName: "Civilian Joe3",
            raceEthnicity: "some race",
            genderIdentity: "some gender",
            birthDate: birthDate3,
            address: {
              streetAddress: "123 some street ave",
              city: "some city",
              state: "some state",
              zipCode: "10002"
            },
            phoneNumber: "1111111111"
          }
        ],
        complainantOfficers: []
      };

      const complainantData = getComplainantData(caseDetail);
      const formattedBirthDate = getFormattedDate(birthDate);
      const formattedBirthDate2 = getFormattedDate(birthDate2);
      const formattedBirthDate3 = getFormattedDate(birthDate3);

      expect(complainantData).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            "Civilian Name": "Civilian Joe",
            Race: "some race",
            "Gender Identity": "some gender",
            DOB: formattedBirthDate,
            Address: "123 some street drive some city some state 10000",
            "Cell Phone": "1234567890"
          }),
          expect.objectContaining({
            "Civilian Name": "Civilian Joe2",
            Race: "some race",
            "Gender Identity": "some gender",
            DOB: formattedBirthDate2,
            Address: "123 some street road some city some state 10001",
            "Cell Phone": "0987654321"
          }),
          expect.objectContaining({
            "Civilian Name": "Civilian Joe3",
            Race: "some race",
            "Gender Identity": "some gender",
            DOB: formattedBirthDate3,
            Address: "123 some street ave some city some state 10002",
            "Cell Phone": "1111111111"
          })
        ])
      );
    });

    test("returns correct complainant data when single known officer complainant", () => {
      const caseDetail = {
        complainantCivilians: [],
        complainantOfficers: [
          {
            isUnknownOfficer: false,
            fullName: "officer joe",
            windowsUsername: 12345,
            district: "some district"
          }
        ]
      };

      const complainantData = getComplainantData(caseDetail);

      expect(complainantData).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            "Officer Name": "officer joe",
            ID: 12345,
            District: "some district"
          })
        ])
      );
    });

    test("returns correct complainant data when single unknown officer complainant", () => {
      const caseDetail = {
        complainantCivilians: [],
        complainantOfficers: [
          {
            isUnknownOfficer: true,
            fullName: "Unknown Officer"
          }
        ]
      };

      const complainantData = getComplainantData(caseDetail);

      expect(complainantData).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            Name: "Unknown"
          })
        ])
      );
    });

    test("returns correct complainant data when multiple civilians, known and unknown officers", () => {
      const birthDate = "1990-09-09";
      const birthDate2 = "1991-09-09";
      const birthDate3 = "1992-09-09";

      const caseDetail = {
        complainantCivilians: [
          {
            fullName: "Civilian Joe",
            raceEthnicity: "some race",
            genderIdentity: "some gender",
            birthDate: birthDate,
            address: {
              streetAddress: "123 some street drive",
              city: "some city",
              state: "some state",
              zipCode: "10000"
            },
            phoneNumber: "1234567890"
          },
          {
            fullName: "Civilian Joe2",
            raceEthnicity: "some race",
            genderIdentity: "some gender",
            birthDate: birthDate2,
            address: {
              streetAddress: "123 some street road",
              city: "some city",
              state: "some state",
              zipCode: "10001"
            },
            phoneNumber: "0987654321"
          },
          {
            fullName: "Civilian Joe3",
            raceEthnicity: "some race",
            genderIdentity: "some gender",
            birthDate: birthDate3,
            address: {
              streetAddress: "123 some street ave",
              city: "some city",
              state: "some state",
              zipCode: "10002"
            },
            phoneNumber: "1111111111"
          }
        ],
        complainantOfficers: [
          {
            isUnknownOfficer: false,
            fullName: "officer joe",
            windowsUsername: 12345,
            district: "some district"
          },
          {
            isUnknownOfficer: true,
            fullName: "Unknown Officer"
          }
        ]
      };

      const complainantData = getComplainantData(caseDetail);
      const formattedBirthDate = getFormattedDate(birthDate);
      const formattedBirthDate2 = getFormattedDate(birthDate2);
      const formattedBirthDate3 = getFormattedDate(birthDate3);

      expect(complainantData).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            "Civilian Name": "Civilian Joe",
            Race: "some race",
            "Gender Identity": "some gender",
            DOB: formattedBirthDate,
            Address: "123 some street drive some city some state 10000",
            "Cell Phone": "1234567890"
          }),
          expect.objectContaining({
            "Civilian Name": "Civilian Joe2",
            Race: "some race",
            "Gender Identity": "some gender",
            DOB: formattedBirthDate2,
            Address: "123 some street road some city some state 10001",
            "Cell Phone": "0987654321"
          }),
          expect.objectContaining({
            "Civilian Name": "Civilian Joe3",
            Race: "some race",
            "Gender Identity": "some gender",
            DOB: formattedBirthDate3,
            Address: "123 some street ave some city some state 10002",
            "Cell Phone": "1111111111"
          }),
          expect.objectContaining({
            "Officer Name": "officer joe",
            ID: 12345,
            District: "some district"
          }),
          expect.objectContaining({ Name: "Unknown" })
        ])
      );
    });

    describe("witness data", function() {
      test("returns correct witness data when no witnesses", () => {
        const caseDetail = {
          witnessCivilians: [],
          witnessOfficers: []
        };

        const witnessData = getWitnessData(caseDetail);

        expect(witnessData).toEqual([]);
      });

      test("returns correct witness data when single civilian witness", () => {
        const caseDetail = {
          witnessCivilians: [
            {
              fullName: "Witness Joe",
              email: "email@email.com"
            }
          ],
          witnessOfficers: []
        };

        const witnessData = getWitnessData(caseDetail);

        expect(witnessData).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              "Civilian Name": "Witness Joe",
              "Email Address": "email@email.com"
            })
          ])
        );
      });

      test("returns correct witness data when multiple civilian witnesses", () => {
        const caseDetail = {
          witnessCivilians: [
            {
              fullName: "Witness Joe",
              email: "email@email.com"
            },
            {
              fullName: "Another Witness",
              email: "another@email.com"
            },
            {
              fullName: "Final Witness",
              email: "final@email.com"
            }
          ],
          witnessOfficers: []
        };

        const witnessData = getWitnessData(caseDetail);

        expect(witnessData).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              "Civilian Name": "Witness Joe",
              "Email Address": "email@email.com"
            }),
            expect.objectContaining({
              "Civilian Name": "Another Witness",
              "Email Address": "another@email.com"
            }),
            expect.objectContaining({
              "Civilian Name": "Final Witness",
              "Email Address": "final@email.com"
            })
          ])
        );
      });

      test("returns correct witness data when single known officer witness", () => {
        const caseDetail = {
          witnessCivilians: [],
          witnessOfficers: [
            {
              isUnknownOfficer: false,
              fullName: "witness officer joe",
              windowsUsername: 12345,
              district: "some district"
            }
          ]
        };

        const witnessData = getWitnessData(caseDetail);

        expect(witnessData).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              "Officer Name": "witness officer joe",
              ID: 12345,
              District: "some district"
            })
          ])
        );
      });

      test("returns correct witness data when single unknown officer witness", () => {
        const caseDetail = {
          witnessCivilians: [],
          witnessOfficers: [
            {
              isUnknownOfficer: true,
              fullName: "Unknown Officer"
            }
          ]
        };

        const witnessData = getWitnessData(caseDetail);

        expect(witnessData).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              Name: "Unknown"
            })
          ])
        );
      });

      test("returns correct witness data when multiple civilians, known and unknown officers", () => {
        const caseDetail = {
          witnessCivilians: [
            {
              fullName: "Witness Joe",
              email: "email@email.com"
            },
            {
              fullName: "Another Witness",
              email: "another@email.com"
            },
            {
              fullName: "Final Witness",
              email: "final@email.com"
            }
          ],
          witnessOfficers: [
            {
              isUnknownOfficer: false,
              fullName: "witness officer joe",
              windowsUsername: 12345,
              district: "some district"
            },
            {
              isUnknownOfficer: true,
              fullName: "Unknown Officer"
            }
          ]
        };

        const complainantData = getWitnessData(caseDetail);

        expect(complainantData).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              "Civilian Name": "Witness Joe",
              "Email Address": "email@email.com"
            }),
            expect.objectContaining({
              "Civilian Name": "Another Witness",
              "Email Address": "another@email.com"
            }),
            expect.objectContaining({
              "Civilian Name": "Final Witness",
              "Email Address": "final@email.com"
            }),
            expect.objectContaining({
              "Officer Name": "witness officer joe",
              ID: 12345,
              District: "some district"
            }),
            expect.objectContaining({ Name: "Unknown" })
          ])
        );
      });
    });
  });
});
