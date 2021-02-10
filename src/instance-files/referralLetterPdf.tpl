<html>
  <head>
      <link rel="stylesheet" type="text/css" href="pdf.css">
  </head>
  <body>
    <div id="pageHeader-first">
      <div style="text-align: center;">
        <img style="max-width: 223px" src="file:/app/src/instance-files/images/header_text.png" />
      </div>
      <div style="text-align: center; margin-top: 8px">
        <img style="max-width: 42px" src="file:/app/src/instance-files/images/icon.ico" />
      </div>
    </div>
    <div id="pageHeader" style="font-size:8.5pt; color: #7F7F7F;">
      {{{recipient}}}<br/>
      {{{formatLongDate currentDate}}}<br/>
      Page \{{page}}
    </div>

    <div id="pageFooter" style="text-align: center; margin-top: 16px">
            <span  style="display:inline-block; margin: 6px 16px 0 0">
                <img style="max-width: 30px" src="file:/app/src/instance-files/images/icon.ico" />
            </span>
      <span style="display:inline-block; font-size:7pt; color: #7F7F7F;">
                INDEPENDENT POLICE MONITOR <br />
                2714 Canal Street, Suite 201 | NEW ORLEANS, LOUISIANA | 70119 <br />
                Phone (504) 309-9799| Fax (504) 309-7345
            </span>
      <span  style="display:inline-block; width: 46px">&nbsp;</span>
    </div>
    <p style="color: #7F7F7F;">
      SUSAN HUTSON
      <br>
      INDEPENDENT POLICE MONITOR
    </p>
    <p><br></p>
    {{{formatLongDate currentDate}}}
    <p><br></p>
    {{{renderHtml recipient}}}</br>
    {{{renderHtml (newLineToLineBreak recipientAddress)}}}
    <p><br></p>
    <p><strong>RE: {{{ generateSubjectLine caseReference pibCaseNumber}}}</strong></p>
    <p><br></p>
    <p>Dear {{{recipient}}}:</p>
    <p><br></p>
    {{{renderHtml letterBody}}}
    <p><br></p>
    Sincerely,
    <p><br></p>
    {{{generateSignature sender includeSignature}}}
    <p><br></p>
    {{{renderHtml (newLineToLineBreak sender)}}}
    {{#if transcribedBy}}
    <p><br></p>
    Transcribed by: {{transcribedBy}}
    {{/if}}
  </body>
</html>