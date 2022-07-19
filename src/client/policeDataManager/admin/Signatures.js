import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CardContent,
  Divider,
  Typography,
  withStyles
} from "@material-ui/core";
import DetailsCard from "../shared/components/DetailsCard";
import LinkButton from "../shared/components/LinkButton";
import styles from "../cases/CaseDetails/caseDetailsStyles";
import DetailsCardDisplay from "../shared/components/DetailsCard/DetailsCardDisplay";
import AddSignatureDialog from "./AddSignatureDialog";
import UpdateSignatureDialog from "./UpdateSignatureDialog";
import { PrimaryButton } from "../shared/components/StyledButtons";

const formatImageString = string => {
  if (string.length % 4 === 0) {
    return string;
  } else {
    return string.substring(0, string.length - (string.length % 4));
  }
};

const Signatures = props => {
  const [signers, setSigners] = useState([]);
  const [signatures, setSignatures] = useState({});
  const [signerDialog, setSignerDialog] = useState(); // undefined: dialog dormant, "new": add new signer, {stuff}: edit existing signer
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
    <section style={{ margin: "10px 3px" }}>
      <DetailsCard title="Signatures">
        <CardContent style={{ padding: "0", width: "100%" }}>
          {signers.length ? (
            signers.map(signer => (
              <React.Fragment key={signer.id}>
                <section
                  className={props.classes.detailsLastRow}
                  style={{ padding: "5px 30px" }}
                >
                  <DetailsCardDisplay
                    caption="Name"
                    message={signer.name}
                    width="200px"
                  />
                  <DetailsCardDisplay
                    caption="Role"
                    message={signer.title}
                    width="200px"
                  />
                  <DetailsCardDisplay
                    caption="Phone Number"
                    message={signer.phone}
                    width="200px"
                  />
                  <DetailsCardDisplay caption="Signature" width="200px">
                    {signatures[signer.id] ? (
                      <img
                        alt={`The signature of ${signer.name}`}
                        src={`data:${signatures[signer.id].type};base64,${
                          signatures[signer.id].image
                        }`}
                        style={{ maxHeight: "4.5em", maxWidth: "200px" }}
                      />
                    ) : (
                      ""
                    )}
                  </DetailsCardDisplay>
                  <section
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center"
                    }}
                  >
                    <PrimaryButton onClick={() => setSignerDialog(signer)}>
                      Edit
                    </PrimaryButton>
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
            onClick={() => setSignerDialog("new")}
            data-testid="addSignature"
          >
            + Add Signature
          </LinkButton>
        </CardContent>
      </DetailsCard>
      {signerDialog === "new" ? (
        <AddSignatureDialog
          classes={{}}
          exit={isThereNewData => {
            if (isThereNewData) {
              setLoadSigners(true);
            }
            setSignerDialog(undefined);
          }}
          signers={signers}
        />
      ) : (
        ""
      )}
      {!!signerDialog?.name ? (
        <UpdateSignatureDialog
          classes={{}}
          exit={isThereNewData => {
            if (isThereNewData) {
              setLoadSigners(true);
            }
            setSignerDialog(undefined);
          }}
          signer={signerDialog}
        />
      ) : (
        ""
      )}
    </section>
  );
};

export default withStyles(styles, { withTheme: true })(Signatures);
