import axios from "axios";
import {
  DATE_RANGE_TYPE,
  QUERY_TYPES
} from "../../../../sharedUtilities/constants";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import { getVisualizationData } from "./getVisualizationData";
import { getQueryModelByQueryType } from "./models/queryModelFactory";

let mockTransformer = jest.fn();
jest.mock("axios");
jest.mock("./models/queryModelFactory", () => ({
  getQueryModelByQueryType: type =>
    type === "fail"
      ? null
      : {
          transformData: mockTransformer
        }
}));

describe("getVisualizationData", () => {
  test("should call transformer", async () => {
    // Arrange
    const queryType = "anyQueryType";
    axios.get.mockResolvedValue({});

    // Act
    await getVisualizationData({
      queryType,
      queryOptions: {
        dateRangeType: DATE_RANGE_TYPE.YTD
      }
    });

    // Assert
    expect(axios.get).toHaveBeenCalledWith(
      `/api/data?queryType=${queryType}&dateRangeType=${DATE_RANGE_TYPE.YTD}`
    );
    expect(mockTransformer).toHaveBeenCalled();
  });

  test("should throw exception if query type doesn't exist", async () => {
    // Arrange
    const queryType = "fail";
    axios.get.mockResolvedValue({});

    // Act
    await expect(
      async () =>
        await getVisualizationData({
          queryType,
          queryOptions: {
            dateRangeType: DATE_RANGE_TYPE.YTD
          }
        })
    ).rejects.toThrowError();

    // Assert
    expect(axios.get).toHaveBeenCalledWith(
      `/api/data?queryType=${queryType}&dateRangeType=${DATE_RANGE_TYPE.YTD}`
    );
  });
});
