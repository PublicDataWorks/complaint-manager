import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CardContent,
  Divider,
  Typography,
  withStyles
} from "@material-ui/core";
import BaseCaseDetailsCard from "../cases/CaseDetails/BaseCaseDetailsCard";
import StyledInfoDisplay from "../shared/components/StyledInfoDisplay";
import styles from "../cases/CaseDetails/caseDetailsStyles";
import TextTruncate from "../shared/components/TextTruncate";

const Signatures = props => {
  const [signers, setSigners] = useState([]);

  useEffect(() => {
    try {
      axios.get("/api/signers").then(result => {
        setSigners(result.data);
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <BaseCaseDetailsCard title="Signatures">
      <CardContent style={{ padding: "0" }}>
        {signers.length ? (
          signers.map(signer => (
            <>
              <div
                key={signer.id}
                className={props.classes.detailsLastRow}
                style={{ padding: "5px 30px" }}
              >
                <StyledInfoDisplay>
                  <Typography variant="caption">Name</Typography>
                  <TextTruncate message={signer.name} />
                </StyledInfoDisplay>
                <StyledInfoDisplay>
                  <Typography variant="caption">Role</Typography>
                  <TextTruncate message={signer.title} />
                </StyledInfoDisplay>
                <StyledInfoDisplay>
                  <Typography variant="caption">Phone Number</Typography>
                  <TextTruncate message={signer.phone} />
                </StyledInfoDisplay>
                <StyledInfoDisplay>
                  <Typography variant="caption">Signature</Typography>
                  <TextTruncate message="TODO" />
                </StyledInfoDisplay>
              </div>
              <Divider />
            </>
          ))
        ) : (
          <Typography style={{ margin: "16px 24px" }}>
            No Signatures have been added
          </Typography>
        )}
      </CardContent>
    </BaseCaseDetailsCard>
  );
};

export default withStyles(styles, { withTheme: true })(Signatures);
