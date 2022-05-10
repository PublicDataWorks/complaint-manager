import {
  getAccusedOfficerData,
  getAllegationData,
  getComplainantData,
  getFormattedDate,
  getIncidentInfoData,
  getWitnessData
} from "./CaseDetailDataHelpers";

const {
  PERSON_TYPE,
  FIRST_CONTACTED_ORGANIZATION,
  CIVILIAN_WITHIN_PD_NAME,
  BUREAU_ACRONYM
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

const pbCaseNumberText = `${BUREAU_ACRONYM} Case Number`;

describe("caseDetailDataHelpers", function () {
  describe("incident info", function () {
    test("it returns correct incident info", () => {
      const incidentDate = "2014-12-12";
      const firstContactDate = "2015-01-01";
      const caseDetail = {
        incidentDate: incidentDate,
        firstContactDate: firstContactDate,
        incidentTime: "10:00:00",
        incidentTimezone: "CST",
        incidentLocation: {
          streetAddress: "100 Small Lake Road",
          city: "Skokie",
          state: "IL",
          zipCode: "10000"
        },
        caseDistrict: {
          id: "some id",
          name: "some district"
        },
        pibCaseNumber: "2018-0002-CC"
      };

      const incidentInfoData = getIncidentInfoData(caseDetail);
      const formattedIncidentDate = getFormattedDate(incidentDate);
      const formattedFirstContactDate = getFormattedDate(firstContactDate);

      expect(incidentInfoData).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            "Incident Date": formattedIncidentDate,
            [FIRST_CONTACTED_ORGANIZATION]: formattedFirstContactDate,
            "Incident Time": "10:00 AM CST",
            "Incident Location": "100 Small Lake Road, Skokie, IL, 10000",
            District: "some district",
            pbCaseNumberText: "2018-0002-CC"
          })
        ])
      );
    });

    test("it returns correct incident info when no incident location", () => {
      const incidentDate = "2014-12-12";
      const firstContactDate = "2015-01-01";
      const caseDetail = {
        incidentDate: incidentDate,
        firstContactDate: firstContactDate,
        incidentTime: "10:00:00",
        incidentTimezone: "CST",
        incidentLocation: {
          streetAddress: "",
          city: "",
          state: "",
          zipCode: ""
        },
        caseDistrict: {
          id: "some id",
          name: "some district"
        },
        pibCaseNumber: "2013-0004-CC"
      };

      const incidentInfoData = getIncidentInfoData(caseDetail);
      const formattedIncidentDate = getFormattedDate(incidentDate);
      const formattedFirstContactDate = getFormattedDate(firstContactDate);

      expect(incidentInfoData).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            "Incident Date": formattedIncidentDate,
            [FIRST_CONTACTED_ORGANIZATION]: formattedFirstContactDate,
            "Incident Time": "10:00 AM CST",
            "Incident Location": null,
            District: "some district",
            pbCaseNumberText: "2013-0004-CC"
          })
        ])
      );
    });

    test("it returns correct incident info when no district", () => {
      const incidentDate = "2014-12-12";
      const firstContactDate = "2015-01-01";
      const caseDetail = {
        incidentDate: incidentDate,
        firstContactDate: firstContactDate,
        incidentTime: "10:00:00",
        incidentTimezone: "CST",
        incidentLocation: {
          streetAddress: "100 Small Lake Road",
          city: "Skokie",
          state: "IL",
          zipCode: "10000"
        },
        caseDistrict: null,
        pibCaseNumber: "2013-0004-CC"
      };

      const incidentInfoData = getIncidentInfoData(caseDetail);
      const formattedIncidentDate = getFormattedDate(incidentDate);
      const formattedFirstContactDate = getFormattedDate(firstContactDate);

      expect(incidentInfoData).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            "Incident Date": formattedIncidentDate,
            [FIRST_CONTACTED_ORGANIZATION]: formattedFirstContactDate,
            "Incident Time": "10:00 AM CST",
            "Incident Location": "100 Small Lake Road, Skokie, IL, 10000",
            District: null,
            pbCaseNumberText: "2013-0004-CC"
          })
        ])
      );
    });
  });

  describe("complainant data", function () {
    test("returns correct complainant data when single civilian complainant no address", () => {
      const birthDate = "1990-09-09";

      const caseDetail = {
        complainantCivilians: [
          {
            fullName: "Civilian Joe",
            raceEthnicity: { name: "some race" },
            genderIdentity: { name: "some gender" },
            birthDate: birthDate,
            address: {
              streetAddress: "",
              city: "",
              state: "",
              zipCode: ""
            },
            phoneNumber: "1234567890",
            email: "test@test.com"
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
            Address: null,
            "Cell Phone": "(123) 456-7890",
            Email: "test@test.com"
          })
        ])
      );
    });

    test("returns correct complainant data when single civilian complainant", () => {
      const birthDate = "1990-09-09";

      const caseDetail = {
        complainantCivilians: [
          {
            fullName: "Civilian Joe",
            raceEthnicity: { name: "some race" },
            genderIdentity: { name: "some gender" },
            birthDate: birthDate,
            address: {
              streetAddress: "123 some street drive",
              city: "some city",
              state: "some state",
              zipCode: "10000"
            },
            phoneNumber: "1234567890",
            email: "test@test.com"
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
            Address: "123 some street drive, some city, some state, 10000",
            "Cell Phone": "(123) 456-7890",
            Email: "test@test.com"
          })
        ])
      );
    });

    test("returns correct complainant data when single civilian complainant is anonymous", () => {
      const birthDate = "1990-09-09";

      const caseDetail = {
        complainantCivilians: [
          {
            fullName: "Civilian Joe",
            isAnonymous: true,
            raceEthnicity: { name: "some race" },
            genderIdentity: { name: "some gender" },
            birthDate: birthDate,
            address: {
              streetAddress: "123 some street drive",
              city: "some city",
              state: "some state",
              zipCode: "10000"
            },
            phoneNumber: "1234567890",
            email: "test@test.com"
          }
        ],
        complainantOfficers: []
      };

      const complainantData = getComplainantData(caseDetail);
      const formattedBirthDate = getFormattedDate(birthDate);

      expect(complainantData).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            "Civilian Name": "(AC) Civilian Joe",
            Race: "some race",
            "Gender Identity": "some gender",
            DOB: formattedBirthDate,
            Address: "123 some street drive, some city, some state, 10000",
            "Cell Phone": "(123) 456-7890",
            Email: "test@test.com"
          })
        ])
      );
    });

    test("returns correct complainant data when multiple civilian complainants with one as anonymous", () => {
      const birthDate = "1990-09-09";
      const birthDate2 = "1991-09-09";
      const birthDate3 = "1992-09-09";

      const caseDetail = {
        complainantCivilians: [
          {
            fullName: "Civilian Joe",
            raceEthnicity: { name: "some race" },
            genderIdentity: { name: "some gender" },
            birthDate: birthDate,
            address: {
              streetAddress: "123 some street drive",
              city: "some city",
              state: "some state",
              zipCode: "10000"
            },
            phoneNumber: "1234567890",
            email: "test@test.com"
          },
          {
            fullName: "Civilian Joe2",
            raceEthnicity: { name: "some race" },
            genderIdentity: { name: "some gender" },
            birthDate: birthDate2,
            address: {
              streetAddress: "123 some street road",
              city: "some city",
              state: "some state",
              zipCode: "10001"
            },
            phoneNumber: "0987654321",
            email: "test2@test.com"
          },
          {
            fullName: "Civilian Joe3",
            isAnonymous: true,
            raceEthnicity: { name: "some race" },
            genderIdentity: { name: "some gender" },
            birthDate: birthDate3,
            address: {
              streetAddress: "123 some street ave",
              city: "some city",
              state: "some state",
              zipCode: "10002"
            },
            phoneNumber: "1111111111",
            email: "test3@test.com"
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
            Address: "123 some street drive, some city, some state, 10000",
            "Cell Phone": "(123) 456-7890",
            Email: "test@test.com"
          }),
          expect.objectContaining({
            "Civilian Name": "Civilian Joe2",
            Race: "some race",
            "Gender Identity": "some gender",
            DOB: formattedBirthDate2,
            Address: "123 some street road, some city, some state, 10001",
            "Cell Phone": "(098) 765-4321",
            Email: "test2@test.com"
          }),
          expect.objectContaining({
            "Civilian Name": "(AC) Civilian Joe3",
            Race: "some race",
            "Gender Identity": "some gender",
            DOB: formattedBirthDate3,
            Address: "123 some street ave, some city, some state, 10002",
            "Cell Phone": "(111) 111-1111",
            Email: "test3@test.com"
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
            ID: "#12345",
            District: "some district"
          })
        ])
      );
    });

    test("returns correct complainant data when single known officer complainant AND anonymous", () => {
      const caseDetail = {
        complainantCivilians: [],
        complainantOfficers: [
          {
            isUnknownOfficer: false,
            isAnonymous: true,
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
            "Officer Name": "(AC) officer joe",
            ID: "#12345",
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
            "Officer Name": "Unknown"
          })
        ])
      );
    });

    test("returns correct complainant data when single civilian within PD", () => {
      const caseDetail = {
        complainantCivilians: [],
        complainantOfficers: [
          {
            isUnknownOfficer: false,
            fullName: "complainant joe",
            windowsUsername: 12345,
            district: "some district",
            caseEmployeeType: PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription
          }
        ]
      };

      const complainantData = getComplainantData(caseDetail);

      expect(complainantData).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            [CIVILIAN_WITHIN_PD_NAME]: "complainant joe",
            ID: "#12345",
            District: "some district"
          })
        ])
      );
    });

    test("returns correct complainant data when single civilian within PD AND anonymous", () => {
      const caseDetail = {
        complainantCivilians: [],
        complainantOfficers: [
          {
            isUnknownOfficer: false,
            isAnonymous: true,
            fullName: "complainant joe",
            windowsUsername: 12345,
            district: "some district",
            caseEmployeeType: PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription
          }
        ]
      };

      const complainantData = getComplainantData(caseDetail);

      expect(complainantData).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            [CIVILIAN_WITHIN_PD_NAME]: "(AC) complainant joe",
            ID: "#12345",
            District: "some district"
          })
        ])
      );
    });

    test("returns correct complainant data when multiple civilians, known and unknown officers with some as anonymous", () => {
      const birthDate = "1990-09-09";
      const birthDate2 = "1991-09-09";
      const birthDate3 = "1992-09-09";

      const caseDetail = {
        complainantCivilians: [
          {
            fullName: "Civilian Joe",
            raceEthnicity: { name: "some race" },
            genderIdentity: { name: "some gender" },
            birthDate: birthDate,
            address: {
              streetAddress: "123 some street drive",
              city: "some city",
              state: "some state",
              zipCode: "10000"
            },
            phoneNumber: "1234567890",
            email: "test@test.com"
          },
          {
            fullName: "Civilian Joe2",
            isAnonymous: true,
            raceEthnicity: { name: "some race" },
            genderIdentity: { name: "some gender" },
            birthDate: birthDate2,
            address: {
              streetAddress: "123 some street road",
              city: "some city",
              state: "some state",
              zipCode: "10001"
            },
            phoneNumber: "0987654321",
            email: "test2@test.com"
          },
          {
            fullName: "Civilian Joe3",
            raceEthnicity: { name: "some race" },
            genderIdentity: { name: "some gender" },
            birthDate: birthDate3,
            address: {
              streetAddress: "123 some street ave",
              city: "some city",
              state: "some state",
              zipCode: "10002"
            },
            phoneNumber: "1111111111",
            email: "test3@test.com"
          }
        ],
        complainantOfficers: [
          {
            isUnknownOfficer: false,
            isAnonymous: true,
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
            Address: "123 some street drive, some city, some state, 10000",
            "Cell Phone": "(123) 456-7890",
            Email: "test@test.com"
          }),
          expect.objectContaining({
            "Civilian Name": "(AC) Civilian Joe2",
            Race: "some race",
            "Gender Identity": "some gender",
            DOB: formattedBirthDate2,
            Address: "123 some street road, some city, some state, 10001",
            "Cell Phone": "(098) 765-4321",
            Email: "test2@test.com"
          }),
          expect.objectContaining({
            "Civilian Name": "Civilian Joe3",
            Race: "some race",
            "Gender Identity": "some gender",
            DOB: formattedBirthDate3,
            Address: "123 some street ave, some city, some state, 10002",
            "Cell Phone": "(111) 111-1111",
            Email: "test3@test.com"
          }),
          expect.objectContaining({
            "Officer Name": "(AC) officer joe",
            ID: "#12345",
            District: "some district"
          }),
          expect.objectContaining({ "Officer Name": "Unknown" })
        ])
      );
    });

    describe("witness data", function () {
      test("returns correct witness data when no witnesses", () => {
        const caseDetail = {
          witnessCivilians: [],
          witnessOfficers: []
        };

        const witnessData = getWitnessData(caseDetail);

        expect(witnessData).toEqual(["No witnesses have been added"]);
      });

      test("returns correct witness data when single civilian witness", () => {
        const caseDetail = {
          witnessCivilians: [
            {
              fullName: "Witness Joe",
              email: "email@email.com",
              phoneNumber: "0000000000"
            }
          ],
          witnessOfficers: []
        };

        const witnessData = getWitnessData(caseDetail);

        expect(witnessData).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              "Civilian Name": "Witness Joe",
              "Cell Phone": "(000) 000-0000",
              "Email Address": "email@email.com"
            })
          ])
        );
      });

      test("returns correct witness data when single civilian witness is anonymous", () => {
        const caseDetail = {
          witnessCivilians: [
            {
              fullName: "Witness Joe",
              isAnonymous: true,
              email: "email@email.com",
              phoneNumber: "0000000000"
            }
          ],
          witnessOfficers: []
        };

        const witnessData = getWitnessData(caseDetail);

        expect(witnessData).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              "Civilian Name": "(AC) Witness Joe",
              "Cell Phone": "(000) 000-0000",
              "Email Address": "email@email.com"
            })
          ])
        );
      });

      test("returns correct witness data when multiple civilian witnesses and one is anonymous", () => {
        const caseDetail = {
          witnessCivilians: [
            {
              fullName: "Witness Joe",
              email: "email@email.com",
              phoneNumber: "0000000000"
            },
            {
              fullName: "Another Witness",
              isAnonymous: true,
              email: "another@email.com",
              phoneNumber: "1111111111"
            },
            {
              fullName: "Final Witness",
              email: "final@email.com",
              phoneNumber: "2222222222"
            }
          ],
          witnessOfficers: []
        };

        const witnessData = getWitnessData(caseDetail);

        expect(witnessData).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              "Civilian Name": "Witness Joe",
              "Cell Phone": "(000) 000-0000",
              "Email Address": "email@email.com"
            }),
            expect.objectContaining({
              "Civilian Name": "(AC) Another Witness",
              "Cell Phone": "(111) 111-1111",
              "Email Address": "another@email.com"
            }),
            expect.objectContaining({
              "Civilian Name": "Final Witness",
              "Cell Phone": "(222) 222-2222",
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
              district: "some district",
              caseEmployeeType: PERSON_TYPE.KNOWN_OFFICER.employeeDescription
            }
          ]
        };

        const witnessData = getWitnessData(caseDetail);

        expect(witnessData).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              "Officer Name": "witness officer joe",
              ID: "#12345",
              District: "some district"
            })
          ])
        );
      });

      test("returns correct witness data when single known officer witness is anonymous", () => {
        const caseDetail = {
          witnessCivilians: [],
          witnessOfficers: [
            {
              isUnknownOfficer: false,
              isAnonymous: true,
              fullName: "witness officer joe",
              windowsUsername: 12345,
              district: "some district",
              caseEmployeeType: PERSON_TYPE.KNOWN_OFFICER.employeeDescription
            }
          ]
        };

        const witnessData = getWitnessData(caseDetail);

        expect(witnessData).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              "Officer Name": "(AC) witness officer joe",
              ID: "#12345",
              District: "some district"
            })
          ])
        );
      });

      test("returns correct witness data when single civilian within PD", () => {
        const caseDetail = {
          witnessCivilians: [],
          witnessOfficers: [
            {
              isUnknownOfficer: false,
              fullName: "witness joe",
              windowsUsername: 12345,
              district: "some district",
              caseEmployeeType:
                PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription
            }
          ]
        };

        const witnessData = getWitnessData(caseDetail);

        expect(witnessData).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              [CIVILIAN_WITHIN_PD_NAME]: "witness joe",
              ID: "#12345",
              District: "some district"
            })
          ])
        );
      });

      test("returns correct witness data when single civilian within PD is anonymous", () => {
        const caseDetail = {
          witnessCivilians: [],
          witnessOfficers: [
            {
              isUnknownOfficer: false,
              isAnonymous: true,
              fullName: "witness joe",
              windowsUsername: 12345,
              district: "some district",
              caseEmployeeType:
                PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription
            }
          ]
        };

        const witnessData = getWitnessData(caseDetail);

        expect(witnessData).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              [CIVILIAN_WITHIN_PD_NAME]: "(AC) witness joe",
              ID: "#12345",
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
              "Officer Name": "Unknown"
            })
          ])
        );
      });

      test("returns correct witness data when multiple civilians, known and unknown officers, and with some as anonymous", () => {
        const caseDetail = {
          witnessCivilians: [
            {
              fullName: "Witness Joe",
              email: "email@email.com",
              phoneNumber: "0000000000"
            },
            {
              fullName: "Another Witness",
              email: "another@email.com",
              phoneNumber: "1111111111"
            },
            {
              fullName: "Final Witness",
              isAnonymous: true,
              email: "final@email.com",
              phoneNumber: "2222222222"
            }
          ],
          witnessOfficers: [
            {
              isUnknownOfficer: false,
              fullName: "witness officer joe",
              isAnonymous: true,
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
              "Cell Phone": "(000) 000-0000",
              "Email Address": "email@email.com"
            }),
            expect.objectContaining({
              "Civilian Name": "Another Witness",
              "Cell Phone": "(111) 111-1111",
              "Email Address": "another@email.com"
            }),
            expect.objectContaining({
              "Civilian Name": "(AC) Final Witness",
              "Cell Phone": "(222) 222-2222",
              "Email Address": "final@email.com"
            }),
            expect.objectContaining({
              "Officer Name": "(AC) witness officer joe",
              ID: "#12345",
              District: "some district"
            }),
            expect.objectContaining({ "Officer Name": "Unknown" })
          ])
        );
      });
    });

    describe("accused officer data", function () {
      test("returns correct accused officer data when single known officer", () => {
        const officer = {
          isUnknownOfficer: false,
          fullName: "some name",
          windowsUsername: "some id",
          district: "some district",
          caseEmployeeType: PERSON_TYPE.KNOWN_OFFICER.employeeDescription
        };

        const accusedOfficerData = getAccusedOfficerData(officer);

        expect(accusedOfficerData).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              "Officer Name": "some name",
              ID: "#some id",
              District: "some district"
            })
          ])
        );
      });

      test("returns correct accused officer data when single unknown officer", () => {
        const officer = {
          isUnknownOfficer: true,
          caseEmployeeType: PERSON_TYPE.UNKNOWN_OFFICER.employeeDescription
        };

        const accusedOfficerData = getAccusedOfficerData(officer);

        expect(accusedOfficerData).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              "Officer Name": "Unknown"
            })
          ])
        );
      });

      test("returns correct accused data when single civilian within PD", () => {
        const officer = {
          isUnknownOfficer: false,
          fullName: "some name",
          windowsUsername: "some id",
          district: "some district",
          caseEmployeeType: PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription
        };

        const accusedOfficerData = getAccusedOfficerData(officer);

        expect(accusedOfficerData).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              [CIVILIAN_WITHIN_PD_NAME]: "some name",
              ID: "#some id",
              District: "some district"
            })
          ])
        );
      });
    });

    describe("allegation data", function () {
      test("returns correct allegation data when single officer with no allegations", () => {
        const officer = {
          isUnknownOfficer: false,
          fullName: "some name",
          windowsUsername: "some id",
          district: "some district",
          allegations: []
        };

        const allegationData = getAllegationData(officer);

        expect(allegationData).toEqual([]);
      });

      test("returns correct allegation data when single officer with one allegation", () => {
        const officer = {
          isUnknownOfficer: false,
          fullName: "some name",
          windowsUsername: "some id",
          district: "some district",
          allegations: [
            {
              details: "some details",
              severity: "some severity",
              allegation: {
                rule: "some rule",
                paragraph: "some paragraph",
                directive: "some directive"
              }
            }
          ]
        };

        const allegationData = getAllegationData(officer);

        expect(allegationData).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              Rule: "some rule",
              Paragraph: "some paragraph",
              Directive: "some directive",
              Severity: "some severity",
              "Allegation Details": "some details"
            })
          ])
        );
      });

      test("returns correct allegation data when single officer with multiple allegations", () => {
        const officer = {
          isUnknownOfficer: false,
          fullName: "some name",
          windowsUsername: "some id",
          district: "some district",
          allegations: [
            {
              details: "some details",
              severity: "some severity",
              allegation: {
                rule: "some rule",
                paragraph: "some paragraph",
                directive: "some directive"
              }
            },
            {
              details: "some details2",
              severity: "some severity2",
              allegation: {
                rule: "some rule2",
                paragraph: "some paragraph2",
                directive: "some directive2"
              }
            },
            {
              details: "some details3",
              severity: "some severity3",
              allegation: {
                rule: "some rule3",
                paragraph: "some paragraph3",
                directive: "some directive3"
              }
            }
          ]
        };

        const allegationData = getAllegationData(officer);

        expect(allegationData).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              Rule: "some rule",
              Paragraph: "some paragraph",
              Directive: "some directive",
              Severity: "some severity",
              "Allegation Details": "some details"
            }),
            expect.objectContaining({
              Rule: "some rule2",
              Paragraph: "some paragraph2",
              Directive: "some directive2",
              Severity: "some severity2",
              "Allegation Details": "some details2"
            }),
            expect.objectContaining({
              Rule: "some rule3",
              Paragraph: "some paragraph3",
              Directive: "some directive3",
              Severity: "some severity3",
              "Allegation Details": "some details3"
            })
          ])
        );
      });
    });
  });
});
