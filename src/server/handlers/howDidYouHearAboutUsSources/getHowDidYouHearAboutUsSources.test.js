import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../testHelpers/requestTestHelpers";
import models from "../../policeDataManager/models";
import getHowDidYouHearAboutUsSources from "./getHowDidYouHearAboutUsSources";

const httpMocks = require("node-mocks-http");

describe("getHowDidYouHearAboutUsSources", () => {
  let request, response, next;

  beforeEach(() => {
    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      nickname: "nickname"
    });

    response = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("returns list of how did you hear about us sources to populate dropdown sorted by alphabetical order", async () => {
    const token = buildTokenWithPermissions("", "tuser");

    const friendHowDidYouHearAboutUsSource = await models.how_did_you_hear_about_us_source.create(
      {
        name: "Friend"
      }
    );
    const outreachEventHowDidYouHearAboutUsSource = await models.how_did_you_hear_about_us_source.create(
      {
        name: "Outreach Event"
      }
    );
    const facebookHowDidYouHearAboutUsSource = await models.how_did_you_hear_about_us_source.create(
      {
        name: "Facebook"
      }
    )


    const expectedOrderedHowDidYouHearAboutUsSourceValues = [
      [
        facebookHowDidYouHearAboutUsSource.name,
        facebookHowDidYouHearAboutUsSource.id
      ],
      [
        friendHowDidYouHearAboutUsSource.name,
        friendHowDidYouHearAboutUsSource.id
      ],
      [
        outreachEventHowDidYouHearAboutUsSource.name,
        outreachEventHowDidYouHearAboutUsSource.id
      ]
    ];

    await getHowDidYouHearAboutUsSources(request, response, next);

    expect(response._getData()).toEqual(
      expectedOrderedHowDidYouHearAboutUsSourceValues
    );
  });
});
