import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "../../cases/CaseDetails/caseDetailsStyles";
import { CardContent, withStyles } from "@material-ui/core";
import LetterTypeDisplay from "./LetterTypeDisplay";
import DetailsCard from "../../shared/components/DetailsCard";
import LinkButton from "../../shared/components/LinkButton";
import { SET_LETTER_TYPE_TO_ADD } from "../../../../sharedUtilities/constants";

const LetterTypes = props => {
  const [letterTypes, setLetterTypes] = useState([]);
  const [loadLetterTypes, setLoadLetterTypes] = useState(true);

  useEffect(() => {
    if (loadLetterTypes) {
      axios
        .get("/api/letter-types")
        .then(result => {
          setLetterTypes(result.data);
        })
        .catch(error => {
          console.error(error);
        });

      setLoadLetterTypes(false);
    }
  }, [loadLetterTypes]);

  return (
    <section style={{ minWidth: "50em", padding: "5px" }}>
      <DetailsCard title="Letters" data-testid="letterTypesSection">
        <CardContent style={{ padding: "0" }}>
          {letterTypes.length
            ? letterTypes.map(letterType => (
                <LetterTypeDisplay
                  key={letterType.id}
                  letterType={letterType}
                  setLoadLetterTypes={setLoadLetterTypes}
                />
              ))
            : "There are no Letters"}
        </CardContent>
        <Link to="/admin-portal/letter-type">
          <LinkButton
            style={{
              marginLeft: "8px",
              marginTop: "8px",
              marginBottom: "8px"
            }}
            data-testid="addLetterType"
          >
            + Add Letter Type
          </LinkButton>
        </Link>
      </DetailsCard>
    </section>
  );
};

export default withStyles(styles, { withTheme: true })(LetterTypes);
