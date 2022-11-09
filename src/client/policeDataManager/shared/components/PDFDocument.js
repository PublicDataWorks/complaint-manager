import React, { useState } from "react";
import PropTypes from "prop-types";
import { Document, Page, pdfjs } from "react-pdf";
import { withStyles } from "@material-ui/styles";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

const styles = theme => ({
  pageStyling: {
    borderBottom: `${theme?.palette?.secondary?.main || "black"} 1px dotted`,
    "&:last-child": { borderBottom: "none" }
  }
});

const PDFDocument = props => {
  const [numberOfPages, setNumberOfPages] = useState();
  const [loadedPages, setLoadedPages] = useState();

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumberOfPages(numPages);
    props.setNumPages(numPages);
    setLoadedPages(0);
    props.setLoadedPages(0);
  };

  const renderPages = () => {
    return Array.from(new Array(numberOfPages), (el, index) => (
      <Page
        key={`page_${index + 1}`}
        pageNumber={index + 1}
        scale={1.3}
        onLoadSuccess={() => {
          setLoadedPages(loadedPages + 1);
          props.setLoadedPages(loadedPages + 1);
        }}
        className={props.classes.pageStyling}
      />
    ));
  };

  return (
    <Document
      file={props.pdfFile}
      onLoadSuccess={onDocumentLoadSuccess}
      noData=""
    >
      {renderPages()}
    </Document>
  );
};

PDFDocument.defaultProps = {
  setLoadedPages: () => {},
  setNumPages: () => {}
};

PDFDocument.propTypes = {
  classes: PropTypes.shape({ pageStyling: PropTypes.string }), // provided by withStyles
  pdfFile: PropTypes.any, // the file in bytes I believe
  setLoadedPages: PropTypes.func, // function to tell the parent component how many pages are loaded
  setNumPages: PropTypes.func // function to tell the parent component how many pages there are in the document
};

export default withStyles(styles, { withTheme: true })(PDFDocument);
