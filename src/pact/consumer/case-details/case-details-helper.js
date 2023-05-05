import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { like, eachLike } from "@pact-foundation/pact/src/dsl/matchers";
import CaseDetails from "../../../client/policeDataManager/cases/CaseDetails/CaseDetails";
import SharedSnackbarContainer from "../../../client/policeDataManager/shared/components/SharedSnackbarContainer";
import createConfiguredStore from "../../../client/createConfiguredStore";
import {
  CIVILIAN_INITIATED,
  CONFIGS,
  GET_COMPLAINT_TYPES_SUCCEEDED,
  GET_CONFIGS_SUCCEEDED,
  GET_FEATURES_SUCCEEDED,
  GET_PERSON_TYPES,
  RANK_INITIATED,
  USER_PERMISSIONS,
  SHOW_FORM
} from "../../../sharedUtilities/constants";

const { PD } = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

export const CIVILIAN_COMPLAINANT = "civilianComplainant";
export const CIVILIAN_WITNESS = "civilianWitness";
export const CIVILIAN_ACCUSED = "civilianAccused";
export const OFFICER_COMPLAINANT = "officerComplainant";
export const OFFICER_WITNESS = "officerWitness";
export const OFFICER_ACCUSED = "officerAccused";
export const NOPD_COMPLAINANT = "nopdComplainant";
export const NOPD_WITNESS = "nopdWitness";
export const NOPD_ACCUSED = "nopdAccused";
export const NO_CASE_TAGS = "noCaseTags";
export const GENERATE_LETTER_BUTTON = "hasGenerateLetterButton";
export const COMPLAINT_TYPES = "hasComplaintTypes";
export const PERSON_IN_CUSTODY = "personInCustody";
export const CHOOSE_PERSON_TYPE = "choosePersonType";
export const CHANGES_SEARCHABLE_DATA = "changesSearchableData";
const personTypes = [
  {
    key: "OFFICER",
    description: "Officer",
    employeeDescription: "Officer",
    isEmployee: true,
    abbreviation: "O",
    legend: "Officer (O)",
    dialogAction: "/redirect",
    isDefault: false
  },
  {
    key: "OTHER",
    description: "not an officer",
    abbreviation: "OTH",
    legend: "not an officer (OTH)",
    dialogAction: SHOW_FORM,
    isDefault: true,
    subTypes: ["Other1", "Other2", "Other3"]
  },
  {
    key: "EMPLOYEE",
    description: "Employed Person",
    employeeDescription: "Non-Officer",
    isEmployee: true,
    abbreviation: "EMP",
    legend: "Employed Person (EMP)",
    dialogAction: "/redirect",
    isDefault: false
  },
  {
    key: "ONEMORE",
    description: "one more type",
    abbreviation: "OM",
    legend: "one more type (ONEMORE)",
    dialogAction: SHOW_FORM,
    isDefault: false
  },
  {
    key: "ELVIS",
    description: "Elvis Presley",
    abbreviation: "?:",
    legend: "Elvis Presley (?:)",
    dialogAction: SHOW_FORM,
    isDefault: false
  }
];

export const setUpCaseDetailsPage = async (provider, ...options) => {
  let getCaseState = "Case exists";
  if (options.includes(CIVILIAN_COMPLAINANT)) {
    getCaseState += ": with civilian complainant";
  }
  if (options.includes(CIVILIAN_WITNESS)) {
    getCaseState += ": with civilian witness";
  }
  if (options.includes(CIVILIAN_ACCUSED)) {
    getCaseState += ": with civilian accused";
  }
  if (
    options.includes(OFFICER_COMPLAINANT) ||
    options.includes(NOPD_COMPLAINANT)
  ) {
    getCaseState += ": with officer complainant";
  }
  if (options.includes(OFFICER_WITNESS) || options.includes(NOPD_WITNESS)) {
    getCaseState += ": with officer witness";
  }
  if (options.includes(OFFICER_ACCUSED) || options.includes(NOPD_ACCUSED)) {
    getCaseState += ": case has accused officer with allegations";
  }
  if (options.includes(PERSON_IN_CUSTODY)) {
    getCaseState += ": with person in custody complainant";
  }

  await provider.addInteraction({
    state: getCaseState,
    uponReceiving: "get case",
    withRequest: {
      method: "GET",
      path: "/api/cases/1"
    },
    willRespondWith: {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: like({
        nextStatus: "Forwarded to Agency",
        caseReferencePrefix: "AC",
        caseReference: "AC2022-0001",
        id: 1,
        complaintType: "Civilian Initiated",
        status: "Ready for Review",
        year: 2022,
        caseNumber: 1,
        firstContactDate: "2022-08-22",
        intakeSourceId: 3,
        createdBy: "noipm.infrastructure@gmail.com",
        assignedTo: "noipm.infrastructure@gmail.com",
        createdAt: "2022-08-22T15:55:45.879Z",
        updatedAt: "2022-08-22T15:56:27.641Z",
        intakeSource: {
          id: 3,
          name: "In Person",
          createdAt: "2022-08-19T16:45:01.760Z",
          updatedAt: "2022-08-19T16:45:01.760Z"
        },
        complainantCivilians: options.includes(CIVILIAN_COMPLAINANT)
          ? eachLike({
              fullName: "Bob Loblaw",
              id: 1,
              firstName: "Bob",
              lastName: "Loblaw",
              roleOnCase: "Complainant",
              email: "realemail@email.com",
              isAnonymous: false,
              caseId: 1
            })
          : [],
        witnessCivilians: options.includes(CIVILIAN_WITNESS)
          ? eachLike({
              fullName: "Bob Loblaw",
              id: 2,
              firstName: "Bob",
              lastName: "Loblaw",
              roleOnCase: "Witness",
              email: "realemail@email.com",
              isAnonymous: false,
              caseId: 1
            })
          : [],
        accusedCivilians: options.includes(CIVILIAN_ACCUSED)
          ? eachLike({
              fullName: "Bob Loblaw",
              id: 2,
              firstName: "Bob",
              lastName: "Loblaw",
              roleOnCase: "Accused",
              email: "realemail@email.com",
              isAnonymous: false,
              caseId: 1
            })
          : [],
        complainantInmates: options.includes(PERSON_IN_CUSTODY)
          ? eachLike({
              id: 1,
              inmateId: "A8013888",
              roleOnCase: "Complainant",
              isAnonymous: false,
              createdAt: "2023-03-13T18:56:28.650Z",
              updatedAt: "2023-03-13T18:56:28.650Z",
              caseId: 1,
              inmate: {
                fullName: "Linda Ali",
                inmateId: "A8013888",
                firstName: "Linda",
                lastName: "Ali",
                region: "MAUI",
                facility: "KCF",
                locationSub1: "DORM 5",
                housing: "KCF",
                currentLocation: "MAUI",
                status: "PROBATION",
                custodyStatus: "PAROLE VIOLATION",
                securityClassification: "COMMUNITY",
                gender: "MALE",
                primaryEthnicity: "FILIPINO",
                race: "ASIAN or PACIFIC ISLANDER",
                muster: "MAUI",
                indigent: true,
                classificationDate: "2022-06-29",
                bookingStartDate: "2022-09-27",
                tentativeReleaseDate: "2023-02-22",
                bookingEndDate: "2023-02-28",
                actualReleaseDate: "2023-02-28",
                weekender: false,
                dateOfBirth: "1968-07-20",
                age: 54,
                countryOfBirth: "USA",
                language: "ENGLISH",
                sentenceLength: "0 years, 5 months, 0 weeks, 4 days",
                onCount: true,
                createdAt: "2023-02-16T17:32:40.969Z",
                updatedAt: "2023-02-16T17:32:40.969Z"
              }
            })
          : [],
        complainantOfficers: options.includes(OFFICER_COMPLAINANT)
          ? eachLike({
              fullName: "Joel Y Gottlieb",
              isUnknownOfficer: false,
              supervisorFullName: "Lula X Hoppe",
              id: 1,
              officerId: 5453,
              firstName: "Joel",
              middleName: "Y",
              lastName: "Gottlieb",
              windowsUsername: 18682,
              supervisorFirstName: "Lula",
              supervisorMiddleName: "X",
              supervisorLastName: "Hoppe",
              supervisorWindowsUsername: 9922,
              supervisorOfficerNumber: 2561,
              employeeType: "Commissioned",
              caseEmployeeType: "Officer",
              district: "6th District",
              bureau: "FOB - Field Operations Bureau",
              rank: "POLICE OFFICER 4",
              hireDate: "2007-06-24",
              sex: "M",
              race: "White",
              workStatus: "Active",
              notes: "",
              roleOnCase: "Complainant",
              isAnonymous: false,
              createdAt: "2022-10-21T18:55:46.053Z",
              updatedAt: "2022-10-21T18:55:46.053Z",
              caseId: 1,
              personTypeDetails: personTypes[0]
            })
          : options.includes(NOPD_COMPLAINANT)
          ? eachLike({
              fullName: "Janelle K Erdman",
              isUnknownOfficer: false,
              supervisorFullName: "Florine W Weimann",
              age: 66,
              id: 1,
              officerId: 5165,
              firstName: "Janelle",
              middleName: "K",
              lastName: "Erdman",
              windowsUsername: 12183,
              supervisorFirstName: "Florine",
              supervisorMiddleName: "W",
              supervisorLastName: "Weimann",
              supervisorWindowsUsername: 6419,
              supervisorOfficerNumber: 356,
              employeeType: "Non-Commissioned",
              caseEmployeeType: "Non-Officer",
              bureau: "FOB - Field Operations Bureau",
              rank: "POLICE DISPATCHER",
              hireDate: "2000-06-04",
              sex: "F",
              race: "Black / African American",
              workStatus: "Terminated",
              notes: "",
              roleOnCase: "Complainant",
              isAnonymous: false,
              createdAt: "2022-11-14T20:06:12.888Z",
              updatedAt: "2022-11-14T20:06:12.888Z",
              caseId: 1,
              personTypeDetails: personTypes[2]
            })
          : [],
        attachments: [],
        accusedOfficers: options.includes(OFFICER_ACCUSED)
          ? eachLike({
              fullName: "Joel Y Gottlieb",
              isUnknownOfficer: false,
              supervisorFullName: "Lula X Hoppe",
              id: 1,
              officerId: 5453,
              firstName: "Joel",
              middleName: "Y",
              lastName: "Gottlieb",
              windowsUsername: 18682,
              supervisorFirstName: "Lula",
              supervisorMiddleName: "X",
              supervisorLastName: "Hoppe",
              supervisorWindowsUsername: 9922,
              supervisorOfficerNumber: 2561,
              employeeType: "Commissioned",
              caseEmployeeType: "Officer",
              district: "6th District",
              bureau: "FOB - Field Operations Bureau",
              rank: "POLICE OFFICER 4",
              hireDate: "2007-06-24",
              sex: "M",
              race: "White",
              workStatus: "Active",
              notes: "",
              roleOnCase: "Accused",
              isAnonymous: false,
              createdAt: "2022-10-21T18:55:46.053Z",
              updatedAt: "2022-10-21T18:55:46.053Z",
              caseId: 1,
              allegations: [],
              personTypeDetails: personTypes[0]
            })
          : options.includes(NOPD_ACCUSED)
          ? eachLike({
              fullName: "Janelle K Erdman",
              isUnknownOfficer: false,
              supervisorFullName: "Florine W Weimann",
              age: 66,
              id: 1,
              officerId: 5165,
              firstName: "Janelle",
              middleName: "K",
              lastName: "Erdman",
              windowsUsername: 12183,
              supervisorFirstName: "Florine",
              supervisorMiddleName: "W",
              supervisorLastName: "Weimann",
              supervisorWindowsUsername: 6419,
              supervisorOfficerNumber: 356,
              employeeType: "Non-Commissioned",
              caseEmployeeType: "Non-Officer",
              bureau: "FOB - Field Operations Bureau",
              rank: "POLICE DISPATCHER",
              hireDate: "2000-06-04",
              sex: "F",
              race: "Black / African American",
              workStatus: "Terminated",
              notes: "",
              roleOnCase: "Accused",
              isAnonymous: false,
              createdAt: "2022-11-14T20:06:12.888Z",
              updatedAt: "2022-11-14T20:06:12.888Z",
              caseId: 1,
              allegations: [],
              personTypeDetails: personTypes[2]
            })
          : [],
        witnessOfficers: options.includes(OFFICER_WITNESS)
          ? eachLike({
              fullName: "Joel Y Gottlieb",
              isUnknownOfficer: false,
              supervisorFullName: "Lula X Hoppe",
              id: 1,
              officerId: 5453,
              firstName: "Joel",
              middleName: "Y",
              lastName: "Gottlieb",
              windowsUsername: 18682,
              supervisorFirstName: "Lula",
              supervisorMiddleName: "X",
              supervisorLastName: "Hoppe",
              supervisorWindowsUsername: 9922,
              supervisorOfficerNumber: 2561,
              employeeType: "Commissioned",
              caseEmployeeType: "Officer",
              district: "6th District",
              bureau: "FOB - Field Operations Bureau",
              rank: "POLICE OFFICER 4",
              hireDate: "2007-06-24",
              sex: "M",
              race: "White",
              workStatus: "Active",
              notes: "",
              roleOnCase: "Witness",
              isAnonymous: false,
              createdAt: "2022-10-21T18:55:46.053Z",
              updatedAt: "2022-10-21T18:55:46.053Z",
              caseId: 1,
              personTypeDetails: personTypes[0]
            })
          : options.includes(NOPD_WITNESS)
          ? eachLike({
              fullName: "Janelle K Erdman",
              isUnknownOfficer: false,
              supervisorFullName: "Florine W Weimann",
              age: 66,
              id: 1,
              officerId: 5165,
              firstName: "Janelle",
              middleName: "K",
              lastName: "Erdman",
              windowsUsername: 12183,
              supervisorFirstName: "Florine",
              supervisorMiddleName: "W",
              supervisorLastName: "Weimann",
              supervisorWindowsUsername: 6419,
              supervisorOfficerNumber: 356,
              employeeType: "Non-Commissioned",
              caseEmployeeType: "Non-Officer",
              bureau: "FOB - Field Operations Bureau",
              rank: "POLICE DISPATCHER",
              hireDate: "2000-06-04",
              sex: "F",
              race: "Black / African American",
              workStatus: "Terminated",
              notes: "",
              roleOnCase: "Witness",
              isAnonymous: false,
              createdAt: "2022-11-14T20:06:12.888Z",
              updatedAt: "2022-11-14T20:06:12.888Z",
              caseId: 1,
              personTypeDetails: personTypes[2]
            })
          : [],
        pdfAvailable: false,
        isArchived: false
      })
    }
  });

  await provider.addInteraction({
    state: "letter is ready for review",
    uponReceiving: "get letter review status",
    withRequest: {
      method: "GET",
      path: "/api/cases/1/referral-letter/edit-status"
    },
    willRespondWith: {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: like({
        editStatus: "Generated"
      })
    }
  });

  await provider.addInteraction({
    state: "race ethnicities exist",
    uponReceiving: "get race ethnicities",
    withRequest: {
      method: "GET",
      path: "/api/race-ethnicities"
    },
    willRespondWith: {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: eachLike(["American Indian or Alaska Native", 2])
    }
  });

  await provider.addInteraction({
    state: "districts exist",
    uponReceiving: "get districts",
    withRequest: {
      method: "GET",
      path: "/api/districts"
    },
    willRespondWith: {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: eachLike(["1st District", 1])
    }
  });

  await provider.addInteraction({
    state: "civilian-titles exist",
    uponReceiving: "get civilian-titles",
    withRequest: {
      method: "GET",
      path: "/api/civilian-titles"
    },
    willRespondWith: {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: eachLike(["Dr.", 2])
    }
  });

  await provider.addInteraction({
    state: "users exist in the store",
    uponReceiving: "get users",
    withRequest: {
      method: "GET",
      path: "/api/users"
    },
    willRespondWith: {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: eachLike({
        email: "anna.banana@gmail.com",
        name: "Anna Banana"
      })
    }
  });

  if (options.includes(NO_CASE_TAGS)) {
    await provider.addInteraction({
      state: "Case exists",
      uponReceiving: "get case tags for case with no case tags",
      withRequest: {
        method: "GET",
        path: "/api/case-tags"
      },
      withRequest: {
        method: "GET",
        path: "/api/cases/1/case-tags"
      },
      willRespondWith: {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: []
      }
    });
  } else {
    await provider.addInteraction({
      state: "case has a case tag",
      uponReceiving: "get case tags",
      withRequest: {
        method: "GET",
        path: "/api/cases/1/case-tags"
      },
      willRespondWith: {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: eachLike({
          id: 1,
          caseId: 1,
          tagId: 284,
          tag: {
            id: 284,
            name: "mardi gras"
          }
        })
      }
    });
  }

  if (options.includes(CHANGES_SEARCHABLE_DATA)) {
    await provider.addInteraction({
      state: "app is running",
      uponReceiving: "update search index",
      withRequest: {
        method: "POST",
        path: "/api/search-index"
      },
      willRespondWith: {
        status: 202
      }
    });
  }

  await provider.addInteraction({
    state: "intake sources exist",
    uponReceiving: "get intake sources",
    withRequest: {
      method: "GET",
      path: "/api/intake-sources"
    },
    willRespondWith: {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: eachLike(["Email", 1])
    }
  });

  await provider.addInteraction({
    state: "case statuses exist",
    uponReceiving: "get case statuses",
    withRequest: {
      method: "GET",
      path: "/api/case-statuses"
    },
    willRespondWith: {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: eachLike({
        id: 1,
        name: "Initial",
        orderKey: 0
      })
    }
  });

  await provider.addInteraction({
    state: "how did you hear about us sources exist",
    uponReceiving: "get how did you hear about us sources",
    withRequest: {
      method: "GET",
      path: "/api/how-did-you-hear-about-us-sources"
    },
    willRespondWith: {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: eachLike(["Facebook", 1])
    }
  });

  await provider.addInteraction({
    state: "tags exist",
    uponReceiving: "get tags",
    withRequest: {
      method: "GET",
      path: "/api/tags"
    },
    willRespondWith: {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: eachLike({
        name: "mardi gras",
        id: 1
      })
    }
  });

  await provider.addInteraction({
    state: "case note actions exist",
    uponReceiving: "get case note actions",
    withRequest: {
      method: "GET",
      path: "/api/case-note-actions"
    },
    willRespondWith: {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: eachLike(["Case briefing from NOPD", 1])
    }
  });

  await provider.addInteraction({
    state: "case has a case note",
    uponReceiving: "get case notes",
    withRequest: {
      method: "GET",
      path: "/api/cases/1/case-notes"
    },
    willRespondWith: {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: eachLike({
        id: 1,
        actionTakenAt: "2022-08-22T15:56:00.000Z",
        notes: "test",
        createdAt: "2022-08-22T15:58:21.394Z",
        updatedAt: "2022-08-22T15:58:21.394Z",
        actionId: 8,
        caseId: 1,
        caseNoteActionId: 8,
        caseNoteAction: {
          id: 8,
          name: "Memo to file",
          createdAt: "2022-08-19T16:45:03.710Z",
          updatedAt: "2022-08-19T16:45:03.710Z"
        },
        author: {
          name: "NOIPM Infra",
          email: "noipm.infrastructure@gmail.com"
        }
      })
    }
  });

  await provider.addInteraction({
    state: "gender identities exist",
    uponReceiving: "get gender idenities",
    withRequest: {
      method: "GET",
      path: "/api/gender-identities"
    },
    willRespondWith: {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: eachLike(["Male", 1])
    }
  });

  let store = createConfiguredStore();
  store.dispatch({
    type: GET_CONFIGS_SUCCEEDED,
    payload: { [CONFIGS.PD]: PD }
  });

  store.dispatch({
    type: GET_FEATURES_SUCCEEDED,
    features: {
      generateLetterButton: options.includes(GENERATE_LETTER_BUTTON),
      chooseComplaintType: options.includes(COMPLAINT_TYPES),
      allowAllTypesToBeAccused: options.includes(CIVILIAN_ACCUSED),
      choosePersonTypeInAddDialog: options.includes(CHOOSE_PERSON_TYPE)
    }
  });

  store.dispatch({
    type: GET_PERSON_TYPES,
    payload: personTypes
  });

  if (options.includes(COMPLAINT_TYPES)) {
    store.dispatch({
      type: GET_COMPLAINT_TYPES_SUCCEEDED,
      payload: [{ name: RANK_INITIATED }, { name: CIVILIAN_INITIATED }]
    });
  }

  if (options.includes(GENERATE_LETTER_BUTTON)) {
    store.dispatch({
      type: "AUTH_SUCCESS",
      userInfo: {
        permissions: [USER_PERMISSIONS.SETUP_LETTER]
      }
    });

    await provider.addInteraction({
      state: "Letter types exist",
      uponReceiving: "get letter types",
      withRequest: {
        method: "GET",
        path: "/api/letter-types"
      },
      willRespondWith: {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: eachLike({
          id: 1,
          type: "COMPLAINANT",
          template: "template",
          requiresApproval: false,
          hasEditPage: false,
          defaultSender: {
            id: 1,
            name: "Jon Doe",
            signatureFile: "JD.png",
            nickname: "jondoe@org.gov",
            title: "Independent Police Monitor",
            phone: "555-309-9799"
          },
          requiredStatus: "Initial"
        })
      }
    });
  } else {
    store.dispatch({
      type: "AUTH_SUCCESS",
      userInfo: {
        permissions: [
          USER_PERMISSIONS.CREATE_CASE_NOTE,
          USER_PERMISSIONS.EDIT_CASE,
          USER_PERMISSIONS.ADD_TAG_TO_CASE
        ]
      }
    });
  }

  let dispatchSpy = jest.spyOn(store, "dispatch");

  const { container, unmount } = render(
    <Provider store={store}>
      <Router>
        <CaseDetails match={{ params: { id: "1" } }} />
        <SharedSnackbarContainer />
      </Router>
    </Provider>
  );

  return { dispatchSpy, container, unmount };
};
