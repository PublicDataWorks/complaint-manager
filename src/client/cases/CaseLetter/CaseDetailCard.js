import styles from "../../globalStyling/styles";
import { Card, CardContent, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import _ from "lodash";

const CaseDetailCard = props => {
  const { cardData, cardTitle } = props;

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
        style={{ paddingBottom: "8px" }}
      >
        <Typography style={styles.section}>{cardTitle}</Typography>
        {cardData.map(data => {
          if (data) {
            return (
              <div
                data-test={"caseDetailCardItem"}
                key={cardData.indexOf(data)}
              >
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
                  <Typography style={{ fontStyle: "italic" }}>
                    {data}
                  </Typography>
                )}
              </div>
            );
          } else return null;
        })}
        {props.cardSecondTitle ? (
          <Fragment>
            <br />
            <Typography style={styles.section}>
              {props.cardSecondTitle}
            </Typography>
            {props.allegations.map(allegation => {
              return (
                <div
                  data-test="caseDetailCardAllegation"
                  key={props.allegations.indexOf(allegation)}
                >
                  <br />
                  {Object.keys(allegation).map(key => {
                    return (
                      <Typography key={Object.keys(allegation).indexOf(key)}>
                        {key}: {allegation[key] ? allegation[key] : "N/A"}
                      </Typography>
                    );
                  })}
                </div>
              );
            })}
          </Fragment>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default CaseDetailCard;
