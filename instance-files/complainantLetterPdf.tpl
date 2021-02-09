<html>
    <head>
        <link rel="stylesheet" type="text/css" href="pdf.css"/>
    </head>
    <body>
        <div id="pageHeader-first">
            <div style="text-align: center;">
                <img style="max-width: 223px" src="file:/app/instance-files/images/header_text.png" />
            </div>
            <div style="text-align: center; margin-top: 8px">
                <img style="max-width: 42px" src="file:/app/instance-files/images/icon.ico" />
            </div>
        </div>
        <div id="pageHeader" style="font-size:8.5pt; color: #7F7F7F;">
            {{recipientFirstName}}<br/>
            {{{formatLongDate currentDate}}}<br/>
            Page \{{page}}
        </div>

        <div id="pageFooter" style="text-align: center; margin-top: 16px">
            <span  style="display:inline-block; margin: 6px 16px 0 0">
                <img style="max-width: 30px" src="file:/app/instance-files/images/icon.ico" />
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
            <br/>
            INDEPENDENT POLICE MONITOR
        </p>
        <p><br/></p>
        <p>
        {{{formatLongDate currentDate}}}
        </p>
        <p><br/></p>
        {{#if (isCivilianComplainant complainantPersonType)}}
        <p>
            {{recipientFirstName}} {{recipientLastName}}
                {{#if (isPresent (formatAddress complainantAddress))}}
                <p>{{{formatAddress complainantAddress}}}</p>
                {{/if}}
            {{#if (isPresent complainantEmail)}}
                <p>{{complainantEmail}}</p>
            {{/if}}
        </p>
        {{/if}}
        <p><br/></p>
        <p>Re: OIPM Complaint# {{caseReference}}</p>
        <p><br/></p>
        <p>Dear {{title}} {{recipientFirstName}} {{recipientLastName}}</p>
        <p><br/></p>
        <p>
            On {{{formatLongDate firstContactDate}}}, you contacted the Office of the Independent Police Monitor
            (OIPM) alleging possible misconduct by an officer of the New Orleans Police
            Department (NOPD or Department) for possible violations of several NOPD rules. As a
            result of your contact with us, OIPM No. {{caseReference}} was generated.
        </p>
        <p><br/></p>
        <p>
            Among other things, the OIPM takes complaints and examines the NOPD’s internal investigations system by conducting independent reviews of completed investigations into allegations of misconduct to determine whether they have been conducted appropriately. The OIPM does not conduct separate or new investigations.
        </p>

        <p><br/></p>
        <p>We forwarded the information you provided us to the NOPD’s Public Integrity Bureau
            (PIB) as an inquiry and asked that the matter be reviewed for possible violations of the
            NOPD rules and regulations. You may be contacted by a representative of PIB or by an
            NOPD supervisor regarding this matter.</p>
        <p><br/></p>
        <p>Please take into consideration that facts and/or allegations from your complaint may be
            used in future OIPM reports. If facts and/or allegations are used in future OIPM
            reports, names of witnesses, law enforcement, and complainants may be included. Once
            the review of your investigation has been completed, all or parts of the complaint may
            become public records.</p>
        <p><br/></p>
        <p>Enclosed you will find a copy of the OIPM letter to PIB and some information about
            our office. If you have any questions regarding the status of the information you
            provided, please contact us at (504) 309-9799 or via email at
            policemonitor@nolaipm.gov. Please refer to your OIPM No. {{caseReference}} when you
            contact our office.</p>
        <p><br/></p>
        <p><br/></p>
        <p><br/></p>
        <p><br/></p>
        <p><br/></p>
        <p>
        Abe Lowe IV,
            <p><br/></p>
            <p><br/></p>
        Complaint Intake Specialist
        </p>
    </body>
</html>
