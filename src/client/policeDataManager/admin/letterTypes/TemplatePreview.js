import React, { useState } from "react";
import { Button, CircularProgress } from "@material-ui/core";
import axios from "axios";
import PDFDocument from "../../shared/components/PDFDocument";

const TemplatePreview = ({ template, bodyTemplate, type }) => {
  const [preview, setPreview] = useState();

  return (
    <section>
      <Button
        variant="contained"
        onClick={() => {
          setPreview(false);
          axios
            .post(
              "/api/example-letter-preview",
              { template, bodyTemplate, type },
              { responseType: "arraybuffer" }
            )
            .then(response => {
              setPreview(response.data);
            })
            .catch(error => console.error(error));
        }}
        color="primary"
      >
        Preview
      </Button>
      {preview && (
        <section data-testid="template-preview" style={{ padding: "10px" }}>
          <PDFDocument pdfFile={preview} />
        </section>
      )}
      {preview === false  && <CircularProgress size={25} data-testid="spinner" />}
    </section>
  );
};

export default TemplatePreview;
