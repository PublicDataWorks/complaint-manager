import styles from "../../globalStyling/styles";
import { Card, CardContent, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import _ from "lodash";
import TextTruncate from "../../shared/components/TextTruncate";

const CaseDetailCard = props => {
  const { cardData, cardTitle } = props;

  const renderComplainantWitnessOfficerData = () => {
    return cardData.map(data => {
      if (data) {
        return renderCardData(data);
      } else return null;
    });
  };

  const renderCardData = data => {
    return (
      <div data-test={"caseDetailCardItem"} key={cardData.indexOf(data)}>
        <br />
        {_.isObject(data) ? (
          Object.keys(data).map(key => {
            return (
              <Typography key={Object.keys(data).indexOf(key)}>
                {key}: {data[key] ? data[key] : "N/A"}
              </Typography>
            );
          })
        ) : (
          <Typography style={{ fontStyle: "italic" }}>{data}</Typography>
        )}
      </div>
    );
  };

  const renderNarrativeData = () => {
    return (
      <Fragment>
        <br />
        {cardData}
      </Fragment>
    );
  };

  const renderAllegationSection = () => {
    return (
      <Fragment>
        <br />
        <Typography style={styles.section}>{props.cardSecondTitle}</Typography>
        {props.allegations.map(allegation => {
          return renderAllegationData(allegation);
        })}
      </Fragment>
    );
  };

  const renderAllegationData = allegation => {
    return (
      <div
        data-test="caseDetailCardAllegation"
        key={props.allegations.indexOf(allegation)}
      >
        <br />
        {Object.keys(allegation).map(key => {
          return key === "Allegation Details" ? (
            <TextTruncate
              testLabel={"letterReviewAllegationDetails"}
              message={
                allegation[key] ? `${key}: ${allegation[key]}` : `${key}: N/A`
              }
            />
          ) : (
            <Typography key={Object.keys(allegation).indexOf(key)}>
              {key}: {allegation[key] ? allegation[key] : "N/A"}
            </Typography>
          );
        })}
      </div>
    );
  };

  return (
    <Card
      style={{
        backgroundColor: "white",
        width: "60%",
        margin: "0 0 32px 0"
      }}
    >
      <CardContent
        data-test={"caseDetailCard"}
        style={{ paddingBottom: "16px" }}
      >
        <Typography style={styles.section}>{cardTitle}</Typography>
        {_.isArray(cardData)
          ? renderComplainantWitnessOfficerData()
          : renderNarrativeData()}
        {props.cardSecondTitle ? renderAllegationSection() : null}
      </CardContent>
    </Card>
  );
};

export default CaseDetailCard;
