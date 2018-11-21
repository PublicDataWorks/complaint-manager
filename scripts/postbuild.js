//The react-pdf library uses pdfjs. Pdfjs is requiring files in a way that is not compatible with webpack 4.2
const fs = require("fs");
fs.createReadStream("node_modules/pdfjs-dist/build/pdf.worker.js").pipe(
  fs.createWriteStream("build/pdf.worker.js")
);
