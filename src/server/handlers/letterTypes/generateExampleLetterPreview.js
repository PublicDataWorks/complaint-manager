import asyncMiddleware from "../asyncMiddleware";
import Handlebars from "handlebars";
import models from "../../policeDataManager/models";
import generatePdfBuffer from "../cases/referralLetters/sharedLetterUtilities/generatePdfBuffer";
import { retrieveLetterImage } from "../cases/referralLetters/retrieveLetterImage";
require("../../handlebarHelpers");

const EXAMPLE_DATA = {
  currentDate: Date.now(),
  recipientFirstName: "Ron",
  recipientLastName: "Swanson",
  senderName: "Sender of the Letter",
  primaryComplainant: {
    id: 2,
    firstName: "Ron",
    middleInitial: "U",
    lastName: "Swanson",
    suffix: "I",
    birthDate: null,
    roleOnCase: "Complainant",
    phoneNumber: "9938822990",
    email: "ron@parksandrec.com",
    additionalInfo: "I trust this man",
    isAnonymous: true,
    caseId: 2,
    raceEthnicityId: 17,
    genderIdentityId: 1,
    civilianTitleId: 4,
    address: {
      id: 1,
      addressableId: 2,
      addressableType: "civilian",
      streetAddress: "123 W Main St",
      intersection: null,
      streetAddress2: "Apt. 2008",
      city: "Lewisville",
      state: "TX",
      zipCode: "75057",
      country: "US",
      lat: 33.0465621,
      lng: -96.9947912,
      placeId: "ChIJVe2z8hEuTIYR7lx85CX5YTQ",
      additionalLocationInfo: null
    },
    raceEthnicity: {
      id: 17,
      name: "White"
    },
    genderIdentity: {
      id: 1,
      name: "Male",
      createdAt: "2022-10-31T20:25:31.670Z",
      updatedAt: "2022-10-31T20:25:31.670Z"
    }
  },
  caseReferencePrefix: "AC",
  caseReference: "AC2022-0002",
  id: 2,
  complaintType: "Civilian Initiated",
  statusId: 3,
  year: 2022,
  caseNumber: 2,
  firstContactDate: "2022-11-02",
  incidentDate: null,
  intakeSourceId: 1,
  districtId: 4,
  incidentTime: "19:46:00",
  incidentTimezone: "ADT",
  narrativeSummary: "An incident",
  narrativeDetails:
    "<p>An incident occurred which was at best incidental.  This is my narrative summary of the incident</p>",
  pibCaseNumber: "98790689876",
  createdBy: "noipm.infrastructure@gmail.com",
  assignedTo: "noipm.infrastructure@gmail.com",
  howDidYouHearAboutUsSourceId: 1,
  caseClassifications: [
    {
      id: 2,
      caseId: 2,
      classificationId: 1,
      classification: {
        name: "Violence",
        message: "He done violence"
      }
    },
    {
      id: 3,
      caseId: 2,
      classificationId: 2,
      classification: {
        name: "Retaliation",
        message: "He done retaliated"
      }
    }
  ],
  intakeSource: {
    id: 1,
    name: "Email"
  },
  howDidYouHearAboutUsSource: {
    id: 1,
    name: "Facebook"
  },
  caseDistrict: {
    id: 4,
    name: "4th District"
  },
  complainantCivilians: [
    {
      fullName: "Ron U. Swanson I",
      id: 2,
      firstName: "Ron",
      middleInitial: "U",
      lastName: "Swanson",
      suffix: "I",
      birthDate: null,
      roleOnCase: "Complainant",
      phoneNumber: "9938822990",
      email: "ron@parksandrec.com",
      additionalInfo: "I trust this man",
      isAnonymous: true,
      deletedAt: null,
      caseId: 2,
      raceEthnicityId: 17,
      genderIdentityId: 1,
      civilianTitleId: 4,
      address: {
        id: 1,
        addressableId: 2,
        addressableType: "civilian",
        streetAddress: "123 W Main St",
        intersection: null,
        streetAddress2: "Apt. 2008",
        city: "Lewisville",
        state: "TX",
        zipCode: "75057",
        country: "US",
        lat: 33.0465621,
        lng: -96.9947912,
        placeId: "ChIJVe2z8hEuTIYR7lx85CX5YTQ",
        additionalLocationInfo: null
      },
      raceEthnicity: {
        id: 17,
        name: "White"
      },
      genderIdentity: {
        id: 1,
        name: "Male",
        createdAt: "2022-10-31T20:25:31.670Z",
        updatedAt: "2022-10-31T20:25:31.670Z"
      }
    }
  ],
  witnessCivilians: [
    {
      fullName: "Tom G. Haverford Jr",
      id: 3,
      firstName: "Tom",
      middleInitial: "G",
      lastName: "Haverford",
      suffix: "Jr",
      birthDate: "1995-06-06",
      roleOnCase: "Witness",
      phoneNumber: "3322344555",
      email: null,
      additionalInfo: null,
      isAnonymous: false,
      deletedAt: null,
      caseId: 2,
      raceEthnicityId: 3,
      genderIdentityId: 1,
      civilianTitleId: 4,
      address: null,
      raceEthnicity: {
        id: 3,
        name: "Asian Indian"
      },
      genderIdentity: {
        id: 1,
        name: "Male"
      }
    }
  ],
  attachments: [],
  incidentLocation: {
    id: 2,
    addressableId: 2,
    addressableType: "cases",
    streetAddress: "8798 Beartooth Dr",
    intersection: "",
    streetAddress2: "Unit B",
    city: "Frisco",
    state: "TX",
    zipCode: "75036",
    country: "US",
    lat: 33.1516434,
    lng: -96.8763585,
    placeId: "ChIJmUL_E9M7TIYRS55lKG4hSC0",
    additionalLocationInfo: "In the Alley"
  },
  accusedOfficers: [
    {
      fullName: "Mike H Bins",
      isUnknownOfficer: false,
      supervisorFullName: "Jayson T Padberg",
      age: NaN,
      id: 2,
      officerId: 5721,
      firstName: "Mike",
      middleName: "H",
      lastName: "Bins",
      phoneNumber: null,
      email: null,
      windowsUsername: 18651,
      supervisorFirstName: "Jayson",
      supervisorMiddleName: "T",
      supervisorLastName: "Padberg",
      supervisorWindowsUsername: 9973,
      supervisorOfficerNumber: 2672,
      employeeType: "Commissioned",
      caseEmployeeType: "Officer",
      district: "3rd District",
      bureau: "FOB - Field Operations Bureau",
      rank: "POLICE OFFICER 3",
      dob: null,
      endDate: null,
      hireDate: "2007-06-10",
      sex: "M",
      race: "White",
      workStatus: "Active",
      notes: "This officer was positively identified by security cam footage",
      roleOnCase: "Accused",
      isAnonymous: false,
      deletedAt: null,
      caseId: 2,
      allegations: [
        {
          id: 1,
          details: "The officer beat me with no provocation",
          caseOfficerId: 2,
          severity: "Medium",
          allegationId: 1,
          allegation: {
            rule: "RULE 1",
            paragraph: "PARAGRAPH 1",
            directive: "DIRECTIVE 1"
          }
        }
      ],
      letterOfficer: {
        id: 1,
        caseOfficerId: 2,
        numHistoricalHighAllegations: 1,
        numHistoricalMedAllegations: 2,
        numHistoricalLowAllegations: 0,
        historicalBehaviorNotes: "History of behavior",
        recommendedActionNotes: "I recommend action",
        officerHistoryOptionId: 1,
        referralLetterOfficerHistoryNotes: [
          {
            id: 1,
            referralLetterOfficerId: 1,
            pibCaseNumber: "098399",
            details: "This is history"
          }
        ],
        referralLetterOfficerRecommendedActions: [
          {
            referralLetterOfficerId: 1,
            recommendedActionId: 1,
            recommendedAction: {
              description: "Do things"
            }
          }
        ]
      }
    }
  ],
  complainantOfficers: [],
  witnessOfficers: [],
  referralLetter: {
    id: 2,
    caseId: 2,
    includeRetaliationConcerns: true,
    recipient: "Deputy Superintendent Irvin Burrell",
    recipientAddress:
      "Public Integrity Bureau\n" +
      "Police Department\n" +
      "1237 Main St.\n" +
      "Greenville, NM 70112",
    sender: "Nina Ambroise\nIndependent Police Monitor\n",
    transcribedBy: null,
    editedLetterHtml: null,
    finalPdfFilename: null
  },
  status: { id: 3, name: "Letter in Progress", orderKey: 2 }
};

const generateExampleLetterPreview = asyncMiddleware(
  async (request, response, next) => {
    const template = request.body.template;
    const bodyTemplate = request.body.bodyTemplate;
    let data = EXAMPLE_DATA;

    let images;
    if (request.body.type) {
      const type = await models.letter_types.findOne({
        where: { type: request.body.type },
        attributes: [],
        include: [
          {
            model: models.letterTypeLetterImage,
            as: "letterTypeLetterImage",
            attributes: ["name", "maxWidth"],
            include: [
              {
                model: models.letterImage,
                as: "letterImage",
                attributes: ["image"]
              }
            ]
          }
        ]
      });
      images = type.letterTypeLetterImage;
    } else {
      images = await models.letterTypeLetterImage.findAll({
        attributes: ["name", "maxWidth"],
        include: [
          {
            model: models.letterImage,
            as: "letterImage",
            attributes: ["image"]
          }
        ]
      });

      images = images.reduce((acc, image) => {
        if (acc.find(img => img.name === image.name)) {
          return acc;
        } else {
          return [...acc, image];
        }
      }, []);
    }

    await Promise.all(
      images.map(async image => {
        data[image.name] = await retrieveLetterImage(
          image.letterImage.image,
          `max-width: ${image.maxWidth}`
        );
      })
    );

    if (bodyTemplate) {
      const compiledBodyTemplate = Handlebars.compile(bodyTemplate);
      data.letterBody = compiledBodyTemplate(EXAMPLE_DATA);
    }

    const compiledTemplate = Handlebars.compile(template);
    const html = compiledTemplate(EXAMPLE_DATA);
    console.log(html.replaceAll(/<img[^>]*>/gi, "IMAGE!"));

    const pdf = await generatePdfBuffer(html);
    response
      .status(200)
      .header("Content-Length", Buffer.byteLength(pdf))
      .header("Content-Type", "application/pdf")
      .send(pdf);
  }
);

export default generateExampleLetterPreview;
