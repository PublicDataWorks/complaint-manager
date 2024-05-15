import {
  mapOfficer,
  getAllegationData,
  getComplainantData,
  getFormattedDate,
  getIncidentInfoData,
  getWitnessData
} from "./CaseDetailDataHelpers";

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

      const incidentInfoData = getIncidentInfoData(
        caseDetail,
        "Oz, the great and powerful"
      );
      const formattedIncidentDate = getFormattedDate(incidentDate);
      const formattedFirstContactDate = getFormattedDate(firstContactDate);

      expect(incidentInfoData).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            "Incident Date": formattedIncidentDate,
            "First Contacted Oz, the great and powerful":
              formattedFirstContactDate,
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

      const incidentInfoData = getIncidentInfoData(
        caseDetail,
        "The Justice League"
      );
      const formattedIncidentDate = getFormattedDate(incidentDate);
      const formattedFirstContactDate = getFormattedDate(firstContactDate);

      expect(incidentInfoData).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            "Incident Date": formattedIncidentDate,
            "First Contacted The Justice League": formattedFirstContactDate,
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

      const incidentInfoData = getIncidentInfoData(caseDetail, "SGC");
      const formattedIncidentDate = getFormattedDate(incidentDate);
      const formattedFirstContactDate = getFormattedDate(firstContactDate);

      expect(incidentInfoData).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            "Incident Date": formattedIncidentDate,
            "First Contacted SGC": formattedFirstContactDate,
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
            "Civilian Name": "(ANON) Civilian Joe",
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
            "Civilian Name": "(ANON) Civilian Joe3",
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
            employeeId: 12345,
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
            employeeId: 12345,
            district: "some district"
          }
        ]
      };

      const complainantData = getComplainantData(caseDetail);

      expect(complainantData).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            "Officer Name": "(ANON) officer joe",
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
            employeeId: 12345,
            district: "some district",
            caseEmployeeType: "Civilian Within GCPD"
          }
        ]
      };

      const complainantData = getComplainantData(caseDetail, "GCPD");

      expect(complainantData).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            "Civilian (GCPD) Name": "complainant joe",
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
            employeeId: 12345,
            district: "some district",
            caseEmployeeType: "Civilian Within GCPD"
          }
        ]
      };

      const complainantData = getComplainantData(caseDetail, "GCPD");

      expect(complainantData).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            "Civilian (GCPD) Name": "(ANON) complainant joe",
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
            employeeId: 12345,
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
            "Civilian Name": "(ANON) Civilian Joe2",
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
            "Officer Name": "(ANON) officer joe",
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
              "Civilian Name": "(ANON) Witness Joe",
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
              "Civilian Name": "(ANON) Another Witness",
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
              employeeId: 12345,
              district: "some district",
              caseEmployeeType: "Known Officer"
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
              employeeId: 12345,
              district: "some district",
              caseEmployeeType: "Known Officer"
            }
          ]
        };

        const witnessData = getWitnessData(caseDetail);

        expect(witnessData).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              "Officer Name": "(ANON) witness officer joe",
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
              employeeId: 12345,
              district: "some district",
              caseEmployeeType: "Civilian Within GCPD"
            }
          ]
        };

        const witnessData = getWitnessData(caseDetail, "GCPD");

        expect(witnessData).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              [`Civilian (GCPD) Name`]: "witness joe",
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
              employeeId: 12345,
              district: "some district",
              caseEmployeeType: "Civilian Within GCPD"
            }
          ]
        };

        const witnessData = getWitnessData(caseDetail, "GCPD");

        expect(witnessData).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              [`Civilian (GCPD) Name`]: "(ANON) witness joe",
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
              employeeId: 12345,
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
              "Civilian Name": "(ANON) Final Witness",
              "Cell Phone": "(222) 222-2222",
              "Email Address": "final@email.com"
            }),
            expect.objectContaining({
              "Officer Name": "(ANON) witness officer joe",
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
          employeeId: "some id",
          district: "some district",
          caseEmployeeType: "Known Officer"
        };

        const accusedOfficerData = mapOfficer(officer);

        expect(accusedOfficerData).toEqual(
          expect.objectContaining({
            "Officer Name": "some name",
            ID: "#some id",
            District: "some district"
          })
        );
      });

      test("returns correct accused officer data when single unknown officer", () => {
        const officer = {
          isUnknownOfficer: true,
          caseEmployeeType: "Unknown Officer"
        };

        const accusedOfficerData = mapOfficer(officer);

        expect(accusedOfficerData).toEqual(
          expect.objectContaining({
            "Officer Name": "Unknown"
          })
        );
      });

      test("returns correct accused data when single civilian within PD", () => {
        const officer = {
          isUnknownOfficer: false,
          fullName: "some name",
          employeeId: "some id",
          district: "some district",
          caseEmployeeType: "Civilian Within GCPD"
        };

        const accusedOfficerData = mapOfficer(officer, "GCPD");

        expect(accusedOfficerData).toEqual(
          expect.objectContaining({
            [`Civilian (GCPD) Name`]: "some name",
            ID: "#some id",
            District: "some district"
          })
        );
      });
    });

    describe("allegation data", function () {
      test("returns correct allegation data when single officer with no allegations", () => {
        const officer = {
          isUnknownOfficer: false,
          fullName: "some name",
          employeeId: "some id",
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
          employeeId: "some id",
          district: "some district",
          allegations: [
            {
              directive: { name: "some directive" },
              details: "some details",
              severity: "some severity",
              allegation: {
                rule: "some rule",
                paragraph: "some paragraph"
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
          employeeId: "some id",
          district: "some district",
          allegations: [
            {
              details: "some details",
              severity: "some severity",
              directive: { name: "some directive" },
              allegation: {
                rule: "some rule",
                paragraph: "some paragraph"
              }
            },
            {
              details: "some details2",
              severity: "some severity2",
              ruleChapter: { name: "CHAPTER!!!!" },
              directive: { name: "some directive2" },
              allegation: {
                rule: "some rule2",
                paragraph: "some paragraph2"
              }
            },
            {
              details: "some details3",
              severity: "some severity3",
              directive: { name: "some directive3" },
              allegation: {
                rule: "some rule3",
                paragraph: "some paragraph3"
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
              "To Wit Chapter": "CHAPTER!!!!",
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
