import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
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
import ConfirmationDialog from "../shared/components/ConfirmationDialog";
import AddSignatureDialog from "./AddSignatureDialog";
import UpdateSignatureDialog from "./UpdateSignatureDialog";
import { PrimaryButton } from "../shared/components/StyledButtons";
import {
  snackbarError,
  snackbarSuccess
} from "../actionCreators/snackBarActionCreators";

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
  const [signer, setDialog] = useState(null);

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
                    <PrimaryButton onClick={() => setSignerDialog(signer)}>
                      Edit
                    </PrimaryButton>
                    <PrimaryButton
                      onClick={() => setDialog(signer)}
                      //disabled
                      style={{
                        marginLeft: 20,
                        backgroundColor: "#F6F6F6",
                        color: "#404040"
                      }}
                    >
                      Remove
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
      {signer ? (
        <ConfirmationDialog
          cancelText="Cancel"
          confirmText="Delete"
          onConfirm={async () => {
            await axios
              .delete(`api/signers/${signer.id}`)
              .then(() => {
                props.snackbarSuccess("Signer successfully deleted");
              })
              .catch(err => props.snackbarError(err.message));
            setDialog(null);
            setLoadSigners(true);
          }}
          onCancel={() => setDialog(null)}
          title="Remove Signature"
        >
          This action will permanently delete this signature. Are you sure you
          want to continue?
        </ConfirmationDialog>
      ) : (
        ""
      )}
    </section>
  );
};

export default connect(undefined, {
  snackbarSuccess,
  snackbarError
})(withStyles(styles, { withTheme: true })(Signatures));
