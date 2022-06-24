import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CardContent,
  Divider,
  Typography,
  withStyles
} from "@material-ui/core";
import DetailsCard from "../shared/components/DetailsCard";
import StyledInfoDisplay from "../shared/components/StyledInfoDisplay";
import styles from "../cases/CaseDetails/caseDetailsStyles";
import DetailsCardDisplay from "../shared/components/DetailsCard/DetailsCardDisplay";

const Signatures = props => {
  const [signers, setSigners] = useState([]);
  const [signatures, setSignatures] = useState({});

  useEffect(() => {
    axios
      .get("/api/signers")
      .then(result => {
        setSigners(result.data);
        result.data.forEach(processSigner);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const processSigner = signer => {
    if (signer?.links.length) {
      const signatureLink = signer.links.find(link => link.rel === "signature");
      if (signatureLink) {
        retrieveSignature(signatureLink, signer.id);
      }
    }
  };

  const retrieveSignature = (signatureLink, signerId) => {
    axios
      .get(signatureLink.href)
      .then(result => {
        setSignatures(previousSignatures => ({
          ...previousSignatures,
          [signerId]: result.data
        }));
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <DetailsCard title="Signatures">
      <CardContent style={{ padding: "0" }}>
        {signers.length ? (
          signers.map(signer => (
            <React.Fragment key={signer.id}>
              <div
                className={props.classes.detailsLastRow}
                style={{ padding: "5px 30px" }}
              >
                <DetailsCardDisplay caption="Name" message={signer.name} />
                <DetailsCardDisplay caption="Role" message={signer.title} />
                <DetailsCardDisplay
                  caption="Phone Number"
                  message={signer.phone}
                />
                <StyledInfoDisplay>
                  <Typography variant="caption">Signature</Typography>
                  {signatures[signer.id] ? (
                    <img
                      alt={`The signature of ${signer.name}`}
                      src={`data:image/png;base64,${signatures[signer.id]}`}
                      style={{ height: "4.5em" }}
                    />
                  ) : (
                    ""
                  )}
                </StyledInfoDisplay>
              </div>
              <Divider />
            </React.Fragment>
          ))
        ) : (
          <Typography style={{ margin: "16px 24px" }}>
            No Signatures have been added
          </Typography>
        )}
      </CardContent>
    </DetailsCard>
  );
};

export default withStyles(styles, { withTheme: true })(Signatures);
