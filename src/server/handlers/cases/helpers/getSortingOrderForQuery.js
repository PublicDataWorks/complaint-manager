import models, { sequelize } from "../../../policeDataManager/models";
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
          [
            caseInsensitiveSort("complainantLastName", model),
            `${ASCENDING} NULLS LAST`
          ],
          [
            caseInsensitiveSort("complainantFirstName", model),
            `${ASCENDING} NULLS LAST`
          ],
          [
            caseInsensitiveSort("complainantMiddleName", model),
            `${ASCENDING} NULLS LAST`
          ],
          [
            "complainantPersonType", `${ASCENDING} NULLS LAST`
          ]
        ];
      } else {
        return [
          [
            caseInsensitiveSort("complainantLastName", model),
            `${DESCENDING} NULLS FIRST`
          ],
          [
            caseInsensitiveSort("complainantFirstName", model),
            `${DESCENDING} NULLS FIRST`
          ],
          [
            caseInsensitiveSort("complainantMiddleName", model),
            `${DESCENDING} NULLS FIRST`
          ],
          [
            "complainantPersonType", `${DESCENDING} NULLS FIRST`
          ]
        ];
      }
    case SORT_CASES_BY.ACCUSED_OFFICERS:
      if (sortDirection === ASCENDING) {
        return [
          [
            sequelize.fn(
              "lower",
              sequelize.json("accused_officers[0].accused_last_name")
            ),
            `${ASCENDING} NULLS LAST`
          ],
          [
            sequelize.fn(
              "lower",
              sequelize.json("accused_officers[0].accused_first_name")
            ),
            `${ASCENDING} NULLS LAST`
          ],
          [
            sequelize.fn(
              "lower",
              sequelize.json("accused_officers[0].accused_middle_name")
            ),
            `${ASCENDING} NULLS LAST`
          ],
          [
            sequelize.json("accused_officers[0].accused_person_type"),
            `${ASCENDING} NULLS LAST`
          ]
        ];
      } else {
        return [
          [
            sequelize.fn(
              "lower",
              sequelize.json("accused_officers[0].accused_last_name")
            ),
            `${DESCENDING} NULLS FIRST`
          ],
          [
            sequelize.fn(
              "lower",
              sequelize.json("accused_officers[0].accused_first_name")
            ),
            `${DESCENDING} NULLS FIRST`
          ],
          [
            sequelize.fn(
              "lower",
              sequelize.json("accused_officers[0].accused_middle_name")
            ),
            `${DESCENDING} NULLS FIRST`
          ],
          [
            sequelize.json("accused_officers[0].accused_person_type"),
            `${DESCENDING} NULLS FIRST`
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
