import styles from "../../globalStyling/styles";
import { Card, CardContent, Typography } from "@material-ui/core";
import React, { Fragment } from "react";

const CaseDetailCard = props => {
  const cardData = props.cardData;

  return (
    <Card
      style={{
        backgroundColor: "white",
        width: "60%",
        margin: "0 0 32px 0"
      }}
    >
      <CardContent style={{ paddingBottom: "8px" }}>
        <Typography style={styles.section}>{props.cardTitle}</Typography>
        {cardData.map(data => {
          if (data) {
            return (
              <Fragment key={cardData.indexOf(data)}>
                <br />
                {Object.keys(data).map(key => {
                  return (
                    <Typography key={Object.keys(data).indexOf(key)}>
                      {key}: {data[key] ? data[key] : "N/A"}
                    </Typography>
                  );
                })}
              </Fragment>
            );
          } else return null;
        })}
      </CardContent>
    </Card>
  );
};

export default CaseDetailCard;
