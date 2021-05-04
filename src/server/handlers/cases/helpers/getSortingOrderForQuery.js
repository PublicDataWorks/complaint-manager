import models from "../../../policeDataManager/models";
import {
  ASCENDING,
  DESCENDING,
  SORT_CASES_BY
} from "../../../../sharedUtilities/constants";
import { caseInsensitiveSort } from "../../sequelizeHelpers";

export const getSortingOrderForQuery = (sortBy, sortDirection) => {
  const model = models.sortable_cases_view;
  switch (sortBy) {
    case SORT_CASES_BY.PRIMARY_COMPLAINANT:
      if (sortDirection === ASCENDING) {
        return [
          ["complainantPersonType", DESCENDING],
          [
            caseInsensitiveSort("complainantLastName", model),
            `${ASCENDING} NULLS FIRST`
          ],
          [
            caseInsensitiveSort("complainantFirstName", model),
            `${ASCENDING} NULLS FIRST`
          ],
          [
            caseInsensitiveSort("complainantMiddleName", model),
            `${ASCENDING} NULLS FIRST`
          ]
        ];
      } else {
        return [
          ["complainantPersonType", ASCENDING],
          [
            caseInsensitiveSort("complainantLastName", model),
            `${DESCENDING} NULLS LAST`
          ],
          [
            caseInsensitiveSort("complainantFirstName", model),
            `${DESCENDING} NULLS LAST`
          ],
          [
            caseInsensitiveSort("complainantMiddleName", model),
            `${DESCENDING} NULLS LAST`
          ]
        ];
      }
    case SORT_CASES_BY.PRIMARY_ACCUSED_OFFICER:
      if (sortDirection === ASCENDING) {
        return [
          ["accusedPersonType", DESCENDING],
          [
            caseInsensitiveSort("accusedLastName", model),
            `${ASCENDING} NULLS FIRST`
          ],
          [
            caseInsensitiveSort("accusedFirstName", model),
            `${ASCENDING} NULLS FIRST`
          ],
          [
            caseInsensitiveSort("accusedMiddleName", model),
            `${ASCENDING} NULLS FIRST`
          ]
        ];
      } else {
        return [
          ["accusedPersonType", ASCENDING],
          [
            caseInsensitiveSort("accusedLastName", model),
            `${DESCENDING} NULLS LAST`
          ],
          [
            caseInsensitiveSort("accusedFirstName", model),
            `${DESCENDING} NULLS LAST`
          ],
          [
            caseInsensitiveSort("accusedMiddleName", model),
            `${DESCENDING} NULLS LAST`
          ]
        ];
      }

    case SORT_CASES_BY.FIRST_CONTACT_DATE:
    case SORT_CASES_BY.STATUS:
    case SORT_CASES_BY.TAGS:
    case SORT_CASES_BY.ASSIGNED_TO:
      return [[sortBy, sortDirection]];
    case SORT_CASES_BY.CASE_REFERENCE:
      return [
        ["year", sortDirection],
        ["caseNumber", sortDirection]
      ];
    default:
      return [
        ["year", DESCENDING],
        ["caseNumber", DESCENDING]
      ];
  }
};

export default getSortingOrderForQuery;
