import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../cases/CaseDetails/caseDetailsStyles";
import { CardContent, withStyles } from "@material-ui/core";
import LetterTypeDisplay from "./LetterTypeDisplay";
import DetailsCard from "../../shared/components/DetailsCard";

const LetterTypes = () => {
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
      </DetailsCard>
    </section>
  );
};

export default withStyles(styles, { withTheme: true })(LetterTypes);
