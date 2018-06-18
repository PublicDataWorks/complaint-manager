import sortBy from "./sortBy";
import {CASE_STATUS, COMPLAINANT, WITNESS} from "../../sharedUtilities/constants";

describe("sorting", () => {
  let unsortedCases;
  beforeEach(() => {
    unsortedCases = [
      {
        id: 2,
        status: CASE_STATUS.INITIAL,
        complainantCivilians: [
          {
            lastName: "austin",
            roleOnCase: COMPLAINANT
          }
        ],
        assignedTo: "abcUser"
      },
      {
        id: 1,
        status: CASE_STATUS.ACTIVE,
        complainantCivilians: [
          {
            lastName: "Zeke",
            roleOnCase: COMPLAINANT
          }
        ],
        assignedTo: "DceUser"
      },
      {
        id: 3,
        status: CASE_STATUS.ACTIVE,
        complainantCivilians: [
          {
            lastName: "Aaron",
            roleOnCase: WITNESS
          }
        ],
        assignedTo: "DceUser"
      }
    ];
  });

  test("should sort by status asc", () => {
    const expectedSortedCases = [
      {
        id: 2,
        status: CASE_STATUS.INITIAL,
        complainantCivilians: [
          {
            lastName: "austin",
            roleOnCase: COMPLAINANT
          }
        ],
        assignedTo: "abcUser"
      },
      {
        id: 1,
        status: CASE_STATUS.ACTIVE,
        complainantCivilians: [
          {
            lastName: "Zeke",
            roleOnCase: COMPLAINANT
          }
        ],
        assignedTo: "DceUser"
      },
      {
        id: 3,
        status: CASE_STATUS.ACTIVE,
        complainantCivilians: [
          {
            lastName: "Aaron",
            roleOnCase: WITNESS
          }
        ],
        assignedTo: "DceUser"
      }
    ];

    const sortedCases = sortBy(unsortedCases, "status", "asc");

    expect(sortedCases).toEqual(expectedSortedCases);
  });

  test("should sort by status desc", () => {
    const expectedSortedCases = [
      {
        id: 3,
        status: CASE_STATUS.ACTIVE,
        complainantCivilians: [
          {
            lastName: "Aaron",
            roleOnCase: WITNESS
          }
        ],
        assignedTo: "DceUser"
      },
      {
        id: 1,
        status: CASE_STATUS.ACTIVE,
        complainantCivilians: [
          {
            lastName: "Zeke",
            roleOnCase: COMPLAINANT
          }
        ],
        assignedTo: "DceUser"
      },
      {
        id: 2,
        status: CASE_STATUS.INITIAL,
        complainantCivilians: [
          {
            lastName: "austin",
            roleOnCase: COMPLAINANT
          }
        ],
        assignedTo: "abcUser"
      }
    ];

    const sortedCases = sortBy(unsortedCases, "status", "desc");

    expect(sortedCases).toEqual(expectedSortedCases);
  });

  test("should sort by civilian last name ignoring case", () => {
    const expectedSortedCases = [
      {
        id: 3,
        status: CASE_STATUS.ACTIVE,
        complainantCivilians: [
          {
            lastName: "Aaron",
            roleOnCase: WITNESS
          }
        ],
        assignedTo: "DceUser"
      },
      {
        id: 2,
        status: CASE_STATUS.INITIAL,
        complainantCivilians: [
          {
            lastName: "austin",
            roleOnCase: COMPLAINANT
          }
        ],
        assignedTo: "abcUser"
      },
      {
        id: 1,
        status: CASE_STATUS.ACTIVE,
        complainantCivilians: [
          {
            lastName: "Zeke",
            roleOnCase: COMPLAINANT
          }
        ],
        assignedTo: "DceUser"
      }
    ];

    const sortedCases = sortBy(unsortedCases, "lastName", "asc");

    expect(sortedCases).toEqual(expectedSortedCases);
  });

  test("should sort by last name and handle cases with no complainantCivilians", () => {
    const unsorted = [
      {
        id: 1,
        status: CASE_STATUS.ACTIVE,
        complainantCivilians: [
          {
            lastName: "Zeke",
            roleOnCase: COMPLAINANT
          }
        ],
        assignedTo: "testUser"
      },
      {
        id: 2,
        status: CASE_STATUS.ACTIVE,
        complainantCivilians: [],
        assignedTo: "testUser"
      }
    ];

    const expected = [
      {
        id: 2,
        status: CASE_STATUS.ACTIVE,
        complainantCivilians: [],
        assignedTo: "testUser"
      },
      {
        id: 1,
        status: CASE_STATUS.ACTIVE,
        complainantCivilians: [
          {
            lastName: "Zeke",
            roleOnCase: COMPLAINANT
          }
        ],
        assignedTo: "testUser"
      }
    ];

    const sortedCases = sortBy(unsorted, "lastName", "asc");

    expect(sortedCases).toEqual(expected);
  });

  test("should sort by assigned to ignoring case", () => {
    const expectedSortedCases = [
      {
        id: 2,
        status: CASE_STATUS.INITIAL,
        complainantCivilians: [
          {
            lastName: "austin",
            roleOnCase: COMPLAINANT
          }
        ],
        assignedTo: "abcUser"
      },
      {
        id: 1,
        status: CASE_STATUS.ACTIVE,
        complainantCivilians: [
          {
            lastName: "Zeke",
            roleOnCase: COMPLAINANT
          }
        ],
        assignedTo: "DceUser"
      },
      {
        id: 3,
        status: CASE_STATUS.ACTIVE,
        complainantCivilians: [
          {
            lastName: "Aaron",
            roleOnCase: WITNESS
          }
        ],
        assignedTo: "DceUser"
      }
    ];

    const sortedCases = sortBy(unsortedCases, "assignedTo", "asc");

    expect(sortedCases).toEqual(expectedSortedCases);
  });

  test("should sort accusedOfficer by officer last name", () => {
    const unsortedCases = [
      {
        id: 2,
        status: CASE_STATUS.INITIAL,
        accusedOfficers: [
          {
            lastName: "Brown"
          }
        ],
        assignedTo: "abcUser"
      },
      {
        id: 1,
        status: CASE_STATUS.ACTIVE,
        accusedOfficers: [
          {
            lastName: "adams"
          }
        ],
        assignedTo: "adams"
      },
      {
        id: 3,
        status: CASE_STATUS.ACTIVE,
        accusedOfficers: [],
        assignedTo: "Johnson"
      }
    ];

    const expectedSortedCases = [
      {
        id: 3,
        status: CASE_STATUS.ACTIVE,
        accusedOfficers: [],
        assignedTo: "Johnson"
      },
      {
        id: 1,
        status: CASE_STATUS.ACTIVE,
        accusedOfficers: [
          {
            lastName: "adams"
          }
        ],
        assignedTo: "adams"
      },
      {
        id: 2,
        status: CASE_STATUS.INITIAL,
        accusedOfficers: [
          {
            lastName: "Brown"
          }
        ],
        assignedTo: "abcUser"
      }
    ];

    const sortedCases = sortBy(unsortedCases, "accusedOfficer", "asc");

    expect(sortedCases).toEqual(expectedSortedCases);
  });

  test("should sort accusedOfficer with unknown officers before known officers", () => {
    const unsortedCases = [
      {
        id: 1,
        status: CASE_STATUS.ACTIVE,
        accusedOfficers: [
          {
            isUnknownOfficer: true
          }
        ],
        assignedTo: "adams"
      },
      {
        id: 2,
        status: CASE_STATUS.INITIAL,
        accusedOfficers: [
          {
            isUnknownOfficer: false,
            lastName: "Brown"
          }
        ],
        assignedTo: "abcUser"
      },
      {
        id: 3,
        status: CASE_STATUS.ACTIVE,
        accusedOfficers: [],
        assignedTo: "Johnson"
      }
    ];
    const sortedCases = sortBy(unsortedCases, "accusedOfficer", "asc");

    expect(sortedCases.map(sortedCase => sortedCase.id)).toEqual([3, 1, 2]);
  });
});
