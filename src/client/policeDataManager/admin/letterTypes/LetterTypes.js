import React from "react";
import { withRouter } from "react-router";
import styles from "../../cases/CaseDetails/caseDetailsStyles";
import { CardContent, Typography, withStyles } from "@material-ui/core";
import LetterTypeDisplay from "./LetterTypeDisplay";
import DetailsCard from "../../shared/components/DetailsCard";
import LinkButton from "../../shared/components/LinkButton";
import useGetServiceData from "../../../common/hooks/useGetServiceData";

const LetterTypes = props => {
  const [letterTypes, reloadLetterTypes] = useGetServiceData(
    "/api/letter-types",
    []
  );

  return (
    <section style={{ minWidth: "50em", padding: "5px" }}>
      <DetailsCard title="Letters" data-testid="letterTypesSection">
        <section style={{ padding: "16px 16px 24px" }}>
          <CardContent style={{ margin: "0", padding: "0" }}>
            {letterTypes.length ? (
              letterTypes.map(letterType => (
                <LetterTypeDisplay
                  key={letterType.id}
                  letterType={letterType}
                  reloadLetterTypes={reloadLetterTypes}
                />
              ))
            ) : (
              <Typography style={{ margin: "20px 16px" }}>
                No Letters have been added
              </Typography>
            )}
          </CardContent>
          <LinkButton
            style={{
              marginLeft: "8px",
              marginTop: "8px",
              marginBottom: "8px"
            }}
            data-testid="addLetterType"
            onClick={() => props.history.push("/admin-portal/letter-type")}
          >
            + Add Letter Type
          </LinkButton>
        </section>
      </DetailsCard>
    </section>
  );
};

export default withStyles(styles, { withTheme: true })(withRouter(LetterTypes));
