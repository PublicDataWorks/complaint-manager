import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../testHelpers/requestTestHelpers";
import models from "../../complaintManager/models";
import getHowDidYouHearAboutUsSources from "./getHowDidYouHearAboutUsSources";

const httpMocks = require("node-mocks-http");

jest.mock("../cases/export/jobQueue");

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
    const nopdHowDidYouHearAboutUsSource = await models.how_did_you_hear_about_us_source.create(
      {
        name: "NOPD"
      }
    );

    const expectedOrderedHowDidYouHearAboutUsSourceValues = [
      [
        friendHowDidYouHearAboutUsSource.name,
        friendHowDidYouHearAboutUsSource.id
      ],
      [nopdHowDidYouHearAboutUsSource.name, nopdHowDidYouHearAboutUsSource.id],
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
