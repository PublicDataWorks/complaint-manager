import comparePdf from "compare-pdf";

export const compareLetter = async file => {
  const compareConfig = {
    paths: {
      actualPdfRootFolder: process.cwd() + "/src/testPDFs",
      baselinePdfRootFolder: `${process.env.REACT_APP_INSTANCE_FILES_DIR}/tests/basePDFs`,
      actualPngRootFolder: process.cwd() + "/src/testPDFs/actualPNGs",
      baselinePngRootFolder: process.cwd() + "/src/testPDFs/basePNGs",
      diffPngRootFolder: process.cwd() + "/src/testPDFs/diffPNGs"
    },
    settings: {
      density: 100,
      quality: 70,
      tolerance: 0,
      threshold: 0.05,
      cleanPngPaths: false,
      matchPageCount: true
    }
  };

  return await new comparePdf(compareConfig)
    .actualPdfFile(file)
    .baselinePdfFile(file)
    .compare();
};
