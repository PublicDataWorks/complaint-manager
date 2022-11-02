import {
  getFirstPageHeader,
  getFooterImage,
  getFooterText,
  getLetterContents,
  getSubsequentPageHeader,
  reassembleTemplate
} from "./letter-types-selectors";

describe("letter-types-selectors", () => {
  describe("reassembleTemplate", () => {
    test("should assemble all template data into a string", () => {
      const expected = `<html>
          <head>
            Hi, I'm the head
          </head>
          <body>
            <div id="pageHeader-first">Look for me on the first page</div>
            <div id="pageHeader""font-size:8.5pt; color: #7F7F7F;">look for me on the other pages</div>
            <div id="pageFooter" style="text-align: center; margin-top: 16px">
              <span style="display:inline-block; margin: 6px 16px 0 0">pretend I'm an image</span>
              <span style="display:inline-block; font-size:7pt; color: #7F7F7F;">This is the footer</span>
              <span style="display:inline-block; width: 46px">&nbsp;</span>
            </div>
            I want to abolish policing!
          </body>
        </html>`;
      expect(
        reassembleTemplate({
          ui: {
            editLetterType: {
              template:
                "<html>   <head>Hi, I'm the head</head>  <body></body>   </html>"
            }
          },
          form: {
            letterTypeForm: {
              values: {
                firstPageHeader: "Look for me on the first page",
                subsequentPageHeader: "look for me on the other pages",
                footerImage: "pretend I'm an image",
                footerText: "This is the footer",
                template: "I want to abolish policing!"
              }
            }
          }
        }).replaceAll(/\s/gi, "")
      ).toEqual(expected.replaceAll(/\s/gi, ""));
    });

    test("should not return first page header div if firstPageHeader is undefined", () => {
      const expected = `<html>
          <head>
            Hi, I'm the head
          </head>
          <body>
            <div id="pageHeader""font-size:8.5pt; color: #7F7F7F;">look for me on the other pages</div>
            <div id="pageFooter" style="text-align: center; margin-top: 16px">
              <span style="display:inline-block; margin: 6px 16px 0 0">pretend I'm an image</span>
              <span style="display:inline-block; font-size:7pt; color: #7F7F7F;">This is the footer</span>
              <span style="display:inline-block; width: 46px">&nbsp;</span>
            </div>
            I want to abolish policing!
          </body>
        </html>`;
      expect(
        reassembleTemplate({
          ui: {
            editLetterType: {
              template:
                "<html>   <head>Hi, I'm the head</head>  <body></body>   </html>"
            }
          },
          form: {
            letterTypeForm: {
              values: {
                subsequentPageHeader: "look for me on the other pages",
                footerImage: "pretend I'm an image",
                footerText: "This is the footer",
                template: "I want to abolish policing!"
              }
            }
          }
        }).replaceAll(/\s/gi, "")
      ).toEqual(expected.replaceAll(/\s/gi, ""));
    });

    test("should not return subsequent page header div if subsequentPageHeader is undefined", () => {
      const expected = `<html>
          <head>
            Hi, I'm the head
          </head>
          <body>
            <div id="pageHeader-first">Look for me on the first page</div>
            <div id="pageFooter" style="text-align: center; margin-top: 16px">
              <span style="display:inline-block; margin: 6px 16px 0 0">pretend I'm an image</span>
              <span style="display:inline-block; font-size:7pt; color: #7F7F7F;">This is the footer</span>
              <span style="display:inline-block; width: 46px">&nbsp;</span>
            </div>
            I want to abolish policing!
          </body>
        </html>`;
      expect(
        reassembleTemplate({
          ui: {
            editLetterType: {
              template:
                "<html>   <head>Hi, I'm the head</head>  <body></body>   </html>"
            }
          },
          form: {
            letterTypeForm: {
              values: {
                firstPageHeader: "Look for me on the first page",
                footerImage: "pretend I'm an image",
                footerText: "This is the footer",
                template: "I want to abolish policing!"
              }
            }
          }
        }).replaceAll(/\s/gi, "")
      ).toEqual(expected.replaceAll(/\s/gi, ""));
    });

    test("should not return footer image span if footerImage is undefined", () => {
      const expected = `<html>
          <head>
            Hi, I'm the head
          </head>
          <body>
            <div id="pageHeader-first">Look for me on the first page</div>
            <div id="pageHeader""font-size:8.5pt; color: #7F7F7F;">look for me on the other pages</div>
            <div id="pageFooter" style="text-align: center; margin-top: 16px">
              <span style="display:inline-block; font-size:7pt; color: #7F7F7F;">This is the footer</span>
              <span style="display:inline-block; width: 46px">&nbsp;</span>
            </div>
            I want to abolish policing!
          </body>
        </html>`;
      expect(
        reassembleTemplate({
          ui: {
            editLetterType: {
              template:
                "<html>   <head>Hi, I'm the head</head>  <body></body>   </html>"
            }
          },
          form: {
            letterTypeForm: {
              values: {
                firstPageHeader: "Look for me on the first page",
                subsequentPageHeader: "look for me on the other pages",
                footerText: "This is the footer",
                template: "I want to abolish policing!"
              }
            }
          }
        }).replaceAll(/\s/gi, "")
      ).toEqual(expected.replaceAll(/\s/gi, ""));
    });

    test("should not return footer text if footerText is undefined", () => {
      const expected = `<html>
          <head>
            Hi, I'm the head
          </head>
          <body>
            <div id="pageHeader-first">Look for me on the first page</div>
            <div id="pageHeader""font-size:8.5pt; color: #7F7F7F;">look for me on the other pages</div>
            <div id="pageFooter" style="text-align: center; margin-top: 16px">
              <span style="display:inline-block; margin: 6px 16px 0 0">pretend I'm an image</span>
              <span style="display:inline-block; width: 46px">&nbsp;</span>
            </div>
            I want to abolish policing!
          </body>
        </html>`;
      expect(
        reassembleTemplate({
          ui: {
            editLetterType: {
              template:
                "<html>   <head>Hi, I'm the head</head>  <body></body>   </html>"
            }
          },
          form: {
            letterTypeForm: {
              values: {
                firstPageHeader: "Look for me on the first page",
                subsequentPageHeader: "look for me on the other pages",
                footerImage: "pretend I'm an image",
                template: "I want to abolish policing!"
              }
            }
          }
        }).replaceAll(/\s/gi, "")
      ).toEqual(expected.replaceAll(/\s/gi, ""));
    });

    test("should not return footer div if both footerText and footerImage are undefined", () => {
      const expected = `<html>
          <head>
            Hi, I'm the head
          </head>
          <body>
            <div id="pageHeader-first">Look for me on the first page</div>
            <div id="pageHeader""font-size:8.5pt; color: #7F7F7F;">look for me on the other pages</div>
            I want to abolish policing!
          </body>
        </html>`;
      expect(
        reassembleTemplate({
          ui: {
            editLetterType: {
              template:
                "<html>   <head>Hi, I'm the head</head>  <body></body>   </html>"
            }
          },
          form: {
            letterTypeForm: {
              values: {
                firstPageHeader: "Look for me on the first page",
                subsequentPageHeader: "look for me on the other pages",
                template: "I want to abolish policing!"
              }
            }
          }
        }).replaceAll(/\s/gi, "")
      ).toEqual(expected.replaceAll(/\s/gi, ""));
    });

    test("should not show undefined if template is undefined", () => {
      const expected = `<html>
          <head>
            Hi, I'm the head
          </head>
          <body>
            <div id="pageHeader-first">Look for me on the first page</div>
            <div id="pageHeader""font-size:8.5pt; color: #7F7F7F;">look for me on the other pages</div>
            <div id="pageFooter" style="text-align: center; margin-top: 16px">
              <span style="display:inline-block; margin: 6px 16px 0 0">pretend I'm an image</span>
              <span style="display:inline-block; font-size:7pt; color: #7F7F7F;">This is the footer</span>
              <span style="display:inline-block; width: 46px">&nbsp;</span>
            </div>
          </body>
        </html>`;
      expect(
        reassembleTemplate({
          ui: {
            editLetterType: {
              template:
                "<html>   <head>Hi, I'm the head</head>  <body></body>   </html>"
            }
          },
          form: {
            letterTypeForm: {
              values: {
                firstPageHeader: "Look for me on the first page",
                subsequentPageHeader: "look for me on the other pages",
                footerImage: "pretend I'm an image",
                footerText: "This is the footer"
              }
            }
          }
        }).replaceAll(/\s/gi, "")
      ).toEqual(expected.replaceAll(/\s/gi, ""));
    });
  });

  describe("getFirstPageHeader", () => {
    test("should return first page header contents when all fields are populated", () => {
      let template = `<html>
            <head>   I'm a head    </head>
            <body>
                <div id="pageHeader-first">   I like tea and cakes for tea and cake time   </div>
                <div id="pageHeader">I don't show up on the first page    </div>
                <div id="pageFooter">
                    <span  style="display:inline-block; margin: 6px 16px 0 0">  
                              {{{smallIcon}}}            
                    </span>    
                    <span style="display:inline-block; font-size:7pt; color: #7F7F7F;">        
                        INDEPENDENT POLICE MONITOR <br />   
                        2714 Canal Street, Suite 201 | NEW ORLEANS, LOUISIANA | 70119 <br />           
                        Phone (504) 309-9799| Fax (504) 309-7345    
                    </span>       
                    <span  style="display:inline-block; width: 46px">&nbsp;</span>      
                </div>
                I'm the main contents of the letter!!! {{{something}}}
            </body>
        </html>`;
      expect(
        getFirstPageHeader({ ui: { editLetterType: { template } } })
      ).toEqual("I like tea and cakes for tea and cake time");
    });

    test("should return first page header contents when some fields are populated", () => {
      let template = `<html>
            <head>   I'm a head    </head>
            <body>
                <div id="pageHeader-first">   I like tea and cakes for tea and cake time   </div>
                <div id="pageFooter">
                    <span  style="display:inline-block; margin: 6px 16px 0 0">  
                              {{{smallIcon}}}            
                    </span>    
                    <span style="display:inline-block; font-size:7pt; color: #7F7F7F;">        
                        INDEPENDENT POLICE MONITOR <br />   
                        2714 Canal Street, Suite 201 | NEW ORLEANS, LOUISIANA | 70119 <br />           
                        Phone (504) 309-9799| Fax (504) 309-7345    
                    </span>       
                    <span  style="display:inline-block; width: 46px">&nbsp;</span>      
                </div>
            </body>
        </html>`;
      expect(
        getFirstPageHeader({ ui: { editLetterType: { template } } })
      ).toEqual("I like tea and cakes for tea and cake time");
    });

    test("should return first page header contents when only first page header is populated", () => {
      let template = `<html>
            <head>   I'm a head    </head>
            <body>
                <div id="pageHeader-first">   I like tea and cakes for tea and cake time   </div>
            </body>
        </html>`;
      expect(
        getFirstPageHeader({ ui: { editLetterType: { template } } })
      ).toEqual("I like tea and cakes for tea and cake time");
    });
  });

  describe("getSubsequentPageHeader", () => {
    test("should return subsequent page header contents when all fields are populated", () => {
      let template = `<html>
            <head>   I'm a head    </head>
            <body>
                <div id="pageHeader-first">   I like tea and cakes for tea and cake time   </div>
                <div id="pageHeader">I don't show up on the first page    </div>
                <div id="pageFooter">
                    <span  style="display:inline-block; margin: 6px 16px 0 0">  
                              {{{smallIcon}}}            
                    </span>    
                    <span style="display:inline-block; font-size:7pt; color: #7F7F7F;">        
                        INDEPENDENT POLICE MONITOR <br />   
                        2714 Canal Street, Suite 201 | NEW ORLEANS, LOUISIANA | 70119 <br />           
                        Phone (504) 309-9799| Fax (504) 309-7345    
                    </span>       
                    <span  style="display:inline-block; width: 46px">&nbsp;</span>      
                </div>
                I'm the main contents of the letter!!! {{{something}}}
            </body>
        </html>`;
      expect(
        getSubsequentPageHeader({ ui: { editLetterType: { template } } })
      ).toEqual("I don't show up on the first page");
    });

    test("should return subsequent page header contents when some fields are populated", () => {
      let template = `<html>
            <head>   I'm a head    </head>
            <body>
                <div id="pageHeader">I don't show up on the first page    </div>
                <div id="pageFooter">
                    <span  style="display:inline-block; margin: 6px 16px 0 0">  
                              {{{smallIcon}}}            
                    </span>    
                    <span style="display:inline-block; font-size:7pt; color: #7F7F7F;">        
                        INDEPENDENT POLICE MONITOR <br />   
                        2714 Canal Street, Suite 201 | NEW ORLEANS, LOUISIANA | 70119 <br />           
                        Phone (504) 309-9799| Fax (504) 309-7345    
                    </span>       
                    <span  style="display:inline-block; width: 46px">&nbsp;</span>      
                </div>
            </body>
        </html>`;
      expect(
        getSubsequentPageHeader({
          ui: { editLetterType: { template } }
        })
      ).toEqual("I don't show up on the first page");
    });

    test("should return subsequent page header contents when only subsequent page header is populated", () => {
      let template = `<html>
            <head>   I'm a head    </head>
            <body>
                <div id="pageHeader">I don't show up on the first page    </div>
            </body>
        </html>`;
      expect(
        getSubsequentPageHeader({ ui: { editLetterType: { template } } })
      ).toEqual("I don't show up on the first page");
    });
  });

  describe("getFooterImage", () => {
    test("should return footer image contents when all fields are populated", () => {
      let template = `<html>
            <head>   I'm a head    </head>
            <body>
                <div id="pageHeader-first">   I like tea and cakes for tea and cake time   </div>
                <div id="pageHeader">I don't show up on the first page    </div>
                <div id="pageFooter">
                    <span  style="display:inline-block; margin: 6px 16px 0 0">  
                              {{{smallIcon}}}            
                    </span>    
                    <span style="display:inline-block; font-size:7pt; color: #7F7F7F;">        
                        INDEPENDENT POLICE MONITOR <br />   
                        2714 Canal Street, Suite 201 | NEW ORLEANS, LOUISIANA | 70119 <br />           
                        Phone (504) 309-9799| Fax (504) 309-7345    
                    </span>       
                    <span  style="display:inline-block; width: 46px">&nbsp;</span>      
                </div>
                I'm the main contents of the letter!!! {{{something}}}
            </body>
        </html>`;
      expect(getFooterImage({ ui: { editLetterType: { template } } })).toEqual(
        "{{{smallIcon}}}"
      );
    });

    test("should return footer image contents when some fields are populated", () => {
      let template = `<html>
            <head>   I'm a head    </head>
            <body>
                <div id="pageHeader-first">   I like tea and cakes for tea and cake time   </div>
                <div id="pageFooter">
                    <span  style="display:inline-block; margin: 6px 16px 0 0">  
                              {{{smallIcon}}}            
                    </span>       
                    <span  style="display:inline-block; width: 46px">&nbsp;</span>      
                </div>
                I'm the main contents of the letter!!! {{{something}}}
            </body>
        </html>`;
      expect(getFooterImage({ ui: { editLetterType: { template } } })).toEqual(
        "{{{smallIcon}}}"
      );
    });

    test("should return footer image contents when only footer image is populated", () => {
      let template = `<html>
            <head>   I'm a head    </head>
            <body>
                <div id="pageFooter">
                    <span  style="display:inline-block; margin: 6px 16px 0 0">  
                              {{{smallIcon}}}            
                    </span>    
            </body>
        </html>`;
      expect(getFooterImage({ ui: { editLetterType: { template } } })).toEqual(
        "{{{smallIcon}}}"
      );
    });
  });

  describe("getFooterText", () => {
    test("should return footer text contents when all fields are populated", () => {
      let template = `<html>
            <head>   I'm a head    </head>
            <body>
                <div id="pageHeader-first">   I like tea and cakes for tea and cake time   </div>
                <div id="pageHeader">I don't show up on the first page    </div>
                <div id="pageFooter">
                    <span  style="display:inline-block; margin: 6px 16px 0 0">  
                              {{{smallIcon}}}            
                    </span>    
                    <span style="display:inline-block; font-size:7pt; color: #7F7F7F;">        
                        INDEPENDENT POLICE MONITOR <br />   
                        2714 Canal Street, Suite 201 | NEW ORLEANS, LOUISIANA | 70119 <br />           
                        Phone (504) 309-9799| Fax (504) 309-7345    
                    </span>       
                    <span  style="display:inline-block; width: 46px">&nbsp;</span>      
                </div>
                I'm the main contents of the letter!!! {{{something}}}
            </body>
        </html>`;
      expect(getFooterText({ ui: { editLetterType: { template } } })).toEqual(
        "INDEPENDENT POLICE MONITOR <br /> 2714 Canal Street, Suite 201 | NEW ORLEANS, LOUISIANA | 70119 <br /> Phone (504) 309-9799| Fax (504) 309-7345"
      );
    });

    test("should return footer text contents when some fields are populated", () => {
      let template = `<html>
            <head>   I'm a head    </head>
            <body>
                <div id="pageHeader">I don't show up on the first page    </div>
                <div id="pageFooter">
                    <span style="display:inline-block; font-size:7pt; color: #7F7F7F;">        
                        INDEPENDENT POLICE MONITOR <br />   
                        2714 Canal Street, Suite 201 | NEW ORLEANS, LOUISIANA | 70119 <br />           
                        Phone (504) 309-9799| Fax (504) 309-7345    
                    </span>       
                    <span  style="display:inline-block; width: 46px">&nbsp;</span>      
                </div>
            </body>
        </html>`;
      expect(getFooterText({ ui: { editLetterType: { template } } })).toEqual(
        "INDEPENDENT POLICE MONITOR <br /> 2714 Canal Street, Suite 201 | NEW ORLEANS, LOUISIANA | 70119 <br /> Phone (504) 309-9799| Fax (504) 309-7345"
      );
    });

    test("should return footer text contents when only footer text is populated", () => {
      let template = `<html>
            <head>   I'm a head    </head>
            <body>
                <div id="pageFooter">
                    <span style="display:inline-block; font-size:7pt; color: #7F7F7F;">        
                        INDEPENDENT POLICE MONITOR <br />   
                        2714 Canal Street, Suite 201 | NEW ORLEANS, LOUISIANA | 70119 <br />           
                        Phone (504) 309-9799| Fax (504) 309-7345    
                    </span>       
                    <span  style="display:inline-block; width: 46px">&nbsp;</span>      
                </div>
            </body>
        </html>`;
      expect(getFooterText({ ui: { editLetterType: { template } } })).toEqual(
        "INDEPENDENT POLICE MONITOR <br /> 2714 Canal Street, Suite 201 | NEW ORLEANS, LOUISIANA | 70119 <br /> Phone (504) 309-9799| Fax (504) 309-7345"
      );
    });
  });

  describe("getLetterContents", () => {
    test("should return letter contents when all fields are populated", () => {
      let template = `<html>
            <head>   I'm a head    </head>
            <body>
                <div id="pageHeader-first">   I like tea and cakes for tea and cake time   </div>
                <div id="pageHeader">I don't show up on the first page    </div>
                <div id="pageFooter">
                    <span  style="display:inline-block; margin: 6px 16px 0 0">  
                              {{{smallIcon}}}            
                    </span>    
                    <span style="display:inline-block; font-size:7pt; color: #7F7F7F;">        
                        INDEPENDENT POLICE MONITOR <br />   
                        2714 Canal Street, Suite 201 | NEW ORLEANS, LOUISIANA | 70119 <br />           
                        Phone (504) 309-9799| Fax (504) 309-7345    
                    </span>       
                    <span  style="display:inline-block; width: 46px">&nbsp;</span>      
                </div>
                I'm the main contents of the letter!!! {{{something}}}
            </body>
        </html>`;
      expect(
        getLetterContents({ ui: { editLetterType: { template } } })
      ).toEqual("I'm the main contents of the letter!!! {{{something}}}");
    });

    test("should return letter contents when some fields are populated", () => {
      let template = `<html>
            <head>   I'm a head    </head>
            <body>
                <div id="pageHeader">I don't show up on the first page    </div>
                I'm the main contents of the letter!!! {{{something}}}
            </body>
        </html>`;
      expect(
        getLetterContents({ ui: { editLetterType: { template } } })
      ).toEqual("I'm the main contents of the letter!!! {{{something}}}");
    });

    test("should return letter contents when only letter contents are populated", () => {
      let template = `<html>
            <head>   I'm a head    </head>
            <body>
                I'm the main contents of the letter!!! {{{something}}}
            </body>
        </html>`;
      expect(
        getLetterContents({ ui: { editLetterType: { template } } })
      ).toEqual("I'm the main contents of the letter!!! {{{something}}}");
    });
  });
});
