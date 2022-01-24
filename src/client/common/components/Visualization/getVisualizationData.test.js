import axios from "axios";
import {
  DATE_RANGE_TYPE,
  QUERY_TYPES
} from "../../../../sharedUtilities/constants";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import * as countTop10Tags from "./Transformers/countTop10Tags";
import * as countComplaintsByIntakeSource from "./Transformers/countComplaintsByIntakeSource";
import * as countComplaintsByComplainantType from "./Transformers/countComplaintsByComplainantType";
import * as countComplaintsByComplainantTypePast12Months from "./Transformers/countComplaintsByComplainantTypePast12Months";
import { getVisualizationData } from "./getVisualizationData";

jest.mock("axios");
jest.mock("./Transformers/countComplaintsByIntakeSource", () => ({
  transformData: jest.fn(data => data)
}));
jest.mock("./Transformers/countComplaintsByComplainantType", () => ({
  transformData: jest.fn(data => data)
}));
jest.mock(
  "./Transformers/countComplaintsByComplainantTypePast12Months",
  () => ({
    transformData: jest.fn(data => data)
  })
);
jest.mock("./Transformers/countTop10Tags", () => ({
  transformData: jest.fn(data => data)
}));

describe("getVisualizationData", () => {
  test("should call countComplaintsByIntakeSource transformer", async () => {
    // Arrange
    const queryType = "countComplaintsByIntakeSource";
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
    expect(countComplaintsByIntakeSource.transformData).toHaveBeenCalled();
  });

  test("should call countComplaintsByComplainantType transformer", async () => {
    // Arrange
    const queryType = "countComplaintsByComplainantType";
    axios.get.mockResolvedValue({});

    // Act
    await getVisualizationData({
      queryType: "countComplaintsByComplainantType",
      queryOptions: {
        dateRangeType: DATE_RANGE_TYPE.YTD
      }
    });

    // Assert
    expect(axios.get).toHaveBeenCalledWith(
      `/api/data?queryType=${queryType}&dateRangeType=${DATE_RANGE_TYPE.YTD}`
    );
    expect(countComplaintsByComplainantType.transformData).toHaveBeenCalled();
  });

  test("should call countComplaintsByComplainantTypePast12Months transformer", async () => {
    // Arrange
    axios.get.mockResolvedValue({});

    // Act
    await getVisualizationData({
      queryType: QUERY_TYPES.COUNT_MONTHLY_COMPLAINTS_BY_COMPLAINANT_TYPE
    });

    // Assert
    expect(
      countComplaintsByComplainantTypePast12Months.transformData
    ).toHaveBeenCalled();
  });
  test("should call countTop10Tags transformer", async () => {
    // Arrange
    axios.get.mockResolvedValue({});

    // Act
    await getVisualizationData({ queryType: "countTop10Tags" });

    // Assert
    expect(countTop10Tags.transformData).toHaveBeenCalled();
  });

  test("should throw error if query type is unsupported", async () => {
    // Act
    await expect(
      getVisualizationData({ queryType: "unsupportedQueryType" })
    ).rejects.toThrow(BAD_REQUEST_ERRORS.DATA_QUERY_TYPE_NOT_SUPPORTED);
  });
});
