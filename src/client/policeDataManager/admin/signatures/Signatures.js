import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import {
  CardContent,
  Divider,
  Typography,
  withStyles
} from "@material-ui/core";
import {
  PrimaryButton,
  SecondaryButton
} from "../../shared/components/StyledButtons";
import DetailsCard from "../../shared/components/DetailsCard";
import LinkButton from "../../shared/components/LinkButton";
import styles from "../../cases/CaseDetails/caseDetailsStyles";
import DetailsCardDisplay from "../../shared/components/DetailsCard/DetailsCardDisplay";
import DialogRenderer from "./DialogRenderer";

const formatImageString = string => {
  if (string.length % 4 === 0) {
    return string;
  } else {
    return string.substring(0, string.length - (string.length % 4));
  }
};

/* signer dialog state value schema
{
  type: String, (the type of dialog to use)
  signer: {} (the signer)
}
*/
const Signatures = props => {
  const [signers, setSigners] = useState([]);
  const [signatures, setSignatures] = useState({});
  const [signerDialog, setSignerDialog] = useState({});
  const [loadSigners, setLoadSigners] = useState(true);

  useEffect(() => {
    if (loadSigners) {
      axios
        .get("/api/signers")
        .then(result => {
          setSigners(result.data);
          result.data.forEach(processSigner);
        })
        .catch(error => {
          console.error(error);
        });

      setLoadSigners(false);
    }
  }, [loadSigners]);

  const processSigner = signer => {
    if (signer?.links.length) {
      const signatureLink = signer.links.find(link => link.rel === "signature");
      if (signatureLink) {
        retrieveSignature(signatureLink, signer.id);
      }
    }
  };

  const isSignerRemovable = signer => {
    if (signer?.links.length) {
      const deleteLink = signer.links.find(link => link.rel === "delete");
      if (deleteLink) {
        return true;
      }
    }
    return false;
  };

  const retrieveSignature = (signatureLink, signerId) => {
    axios
      .get(signatureLink.href)
      .then(result => {
        setSignatures(previousSignatures => ({
          ...previousSignatures,
          [signerId]: {
            image: formatImageString(result.data),
            type: result.headers["content-type"]
          }
        }));
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <section style={{ minWidth: "50em", padding: "5px" }}>
      <DetailsCard title="Signatures">
        <CardContent>
          {signers.length ? (
            signers.map(signer => (
              <React.Fragment key={signer.id}>
                <section
                  className={props.classes.detailsLastRow}
                  style={{ width: "100%" }}
                >
                  <section
                    className={props.classes.detailsLastRow}
                    style={{ width: "50%", margin: "20px" }}
                  >
                    <DetailsCardDisplay caption="Name" message={signer.name} />
                    <DetailsCardDisplay caption="Role" message={signer.title} />
                    <DetailsCardDisplay
                      caption="Phone Number"
                      message={signer.phone}
                    />
                    <DetailsCardDisplay caption="Signature">
                      {signatures[signer.id] ? (
                        <img
                          alt={`The signature of ${signer.name}`}
                          src={`data:${signatures[signer.id].type};base64,${
                            signatures[signer.id].image
                          }`}
                          style={{ maxHeight: "4.5em", maxWidth: "150px" }}
                        />
                      ) : (
                        ""
                      )}
                    </DetailsCardDisplay>
                  </section>
                  <section
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      width: "50%",
                      padding: "0 30px 10px 0"
                    }}
                  >
                    <PrimaryButton
                      onClick={() => setSignerDialog({ type: "edit", signer })}
                    >
                      Edit
                    </PrimaryButton>
                    <SecondaryButton
                      data-testid="remove-button"
                      onClick={() =>
                        setSignerDialog({ type: "delete", signer })
                      }
                      disabled={!isSignerRemovable(signer)}
                      style={{
                        marginLeft: 20
                      }}
                    >
                      Remove
                    </SecondaryButton>
                  </section>
                </section>
                <Divider />
              </React.Fragment>
            ))
          ) : (
            <Typography style={{ margin: "16px 24px" }}>
              No Signatures have been added
            </Typography>
          )}
          <LinkButton
            style={{
              marginLeft: "8px",
              marginTop: "8px",
              marginBottom: "8px"
            }}
            onClick={() => setSignerDialog({ type: "new" })}
            data-testid="addSignature"
          >
            + Add Signature
          </LinkButton>
        </CardContent>
      </DetailsCard>
      <DialogRenderer
        signers={signers}
        signerDialog={signerDialog}
        setSignerDialog={setSignerDialog}
        setLoadSigners={setLoadSigners}
      />
    </section>
  );
};

export default withStyles(styles, { withTheme: true })(Signatures);
