"use strict";

const LETTER_TYPES_HAWAII =
  defaultSender => `INSERT INTO public.letter_types ("type",default_sender,created_at,updated_at,"template",editable_template,required_status,requires_approval,has_edit_page,default_recipient,default_recipient_address) VALUES
('Access to Court Missed Evals Response',${defaultSender},NULL,NULL,'
<html>
<head>
<style>* { font-size: 8.5pt; } p { margin: 0; } .preserve-white-space { white-space: pre-wrap; } .ql-align-center { text-align: center; }</style> 
</head>
<body>
<div id="pageHeader-first"><div style="text-align: center;"> {{{header}}} </div></div>
<div id="pageHeader" style="font-size:8.5pt; color: #7F7F7F;">{{recipient}}<br/> {{{formatLongDate currentDate}}}<br/> Page {{page}}</div>
<div id="pageFooter" style="text-align: center; margin-top: 16px">
<span style="display:inline-block; margin: 6px 16px 0 0"><p>{{{smallIcon}}}</p></span>
<span style="display:inline-block; font-size:7pt; color: #7F7F7F;"><p>Page {{page}} of {{pages}}</p></span>
<span style="display:inline-block; width: 46px">&nbsp;</span>
</div>
<p><br></p><p><br></p><p>{{{formatLongDate currentDate}}}</p><p><br></p><p>{{{renderHtml recipient}}}</p><p>{{primaryComplainant.dataValues.inmate.dataValues.inmateId}}</p><p>{{primaryComplainant.dataValues.inmate.facility}}</p><p>{{{renderHtml (newLineToLineBreak recipientAddress)}}}</p><p><br></p><p>RE: Complaint submitted to the Hawaii Correctional System Oversight Commission</p><p><br></p><p>Dear {{{recipient}}},</p><p><br></p><p>The Hawaii Correctional System Oversight Commission received your letter dated {{{formatLongDate firstContactDate}}} regarding {{complaintType.name}}. We reviewed the documents you sent and logged your complaint in our system.&nbsp;&nbsp;</p><p><br></p><p>{{renderHtml letterBody}}</p><p>{{{signature}}}</p><p><br></p><p><br></p><p><br></p><p>{{{renderHtml (newLineToLineBreak sender)}}}</p>
</body>
</html>
','<p>The Commission is mandated to oversee the state''s correctional system. As part of our work, we collect information from different sources, including from people in custody, and identify patterns and system-wide issues. We outline our findings and recommendations through comprehensive public reports and policy recommendations to the Department of Corrections and Rehabilitation, Legislature, Governor, and community. Please know the information you provided is valuable and will be considered in our oversight of Hawaii''s correctional system.&nbsp;</p><p>&nbsp;</p><p>Due to limited capacity, we cannot investigate individual complaints at this time, however, we recognize the importance of attending court hearings, evaluations, and judicial processes in general. Therefore, we notified the Department of Corrections and Rehabilitation of this issue to ensure greater accountability and prevention of missed hearings in the future.</p><p>&nbsp;</p><p>We deeply appreciate you writing to our office as we continue to grow and build corrections oversight in the State of Hawai''i.&nbsp;&nbsp;</p><p><br></p><p>Mahalo,&nbsp;</p>',NULL,false,true,'{primaryComplainant}','{primaryComplainantAddress}'),
('ADA Response',${defaultSender},NULL,NULL,'
<html>
<head>
<style>* { font-size: 8.5pt; } p { margin: 0; } .preserve-white-space { white-space: pre-wrap; } .ql-align-center { text-align: center; }</style> 
</head>
<body>
<div id="pageHeader-first"><div style="text-align: center;"> {{{header}}} </div></div>
<div id="pageHeader" style="font-size:8.5pt; color: #7F7F7F;">{{recipient}}<br/> {{{formatLongDate currentDate}}}<br/> Page {{page}}</div>
<div id="pageFooter" style="text-align: center; margin-top: 16px">
<span style="display:inline-block; margin: 6px 16px 0 0"><p>{{{smallIcon}}}</p></span>
<span style="display:inline-block; font-size:7pt; color: #7F7F7F;"><p>Page {{page}} of {{pages}}</p></span>
<span style="display:inline-block; width: 46px">&nbsp;</span>
</div>
<p><br></p><p><br></p><p>{{{formatLongDate currentDate}}}</p><p><br></p><p>{{{renderHtml recipient}}}</p><p>{{primaryComplainant.dataValues.inmate.dataValues.inmateId}}</p><p>{{primaryComplainant.dataValues.inmate.facility}}</p><p>{{{renderHtml (newLineToLineBreak recipientAddress)}}}</p><p><br></p><p>RE: Complaint submitted to the Hawaii Correctional System Oversight Commission</p><p><br></p><p>Dear {{{recipient}}},</p><p><br></p><p class="ql-align-justify">The Hawaii Correctional System Oversight Commission received your letter dated {{{formatLongDate firstContactDate}}} regarding {{complaintType.name}}. We reviewed the documents you sent and logged your complaint in our system.&nbsp;</p><p class="ql-align-justify"><br></p><p class="ql-align-justify">{{renderHtml letterBody}}</p><p>{{{signature}}}</p><p><br></p><p>{{{renderHtml (newLineToLineBreak sender)}}}</p>
</body>
</html>
','<p class="ql-align-justify">Unfortunately, due to limited staff and capacity, we cannot investigate individual complaints at this time. The Commission is mandated to oversee the state''s correctional system. As part of our work, we collect information from different sources, including from people in custody, and identify patterns and system-wide issues. We outline our findings and recommendations through comprehensive public reports and policy recommendations to the Department of Corrections and Rehabilitation (DPS), Legislature, Governor, and community. Please know the information you provided is valuable and will be included in our oversight of Hawaii''s correctional system.</p><p class="ql-align-justify"><br></p><p class="ql-align-justify">We recommend you review the DPS Policy and Procedures Manual, Chapter 14, COR.14.27, <em>Disabilities</em>. You can request a time slot in the facility''s law library kiosk to review DPS policies. Additionally, we recommend submitting a grievance (DPS Policy and Procedure Manual, Chapter 12, COR.12.03, <em>Grievance Program</em>) if you have not done so already. The intention of the grievance process is to provide an administrative means for prompt and fair resolution of problems and concerns as required by the Prison Litigation Reform Act (PRLA). Also, <em>PSD Form 8772</em>, <em>Notice of Rights for Inmates with Disabilities</em>, should be displayed in all housing units, the law library, education, and all common areas. This form includes information on the rights of people with disabilities, access to services and accommodations, how to request a modification of accommodation, filing a grievance, and statewide and facility ADA Coordinators. You can ask staff for <em>PSD Form 8773</em> for accommodation/modification and <em>PSD Form 8774</em> for an Accommodation/Modification Status Report.</p><p class="ql-align-justify"><br></p><p class="ql-align-justify">We deeply appreciate you writing to our office as we continue to grow and build corrections oversight in the State of Hawai''i.&nbsp;&nbsp;</p><p class="ql-align-justify"><br></p><p>Mahalo,&nbsp;</p>',NULL,false,true,'{primaryComplainant}','{primaryComplainantAddress}'),
('Property Response',${defaultSender},NULL,'2023-11-09 11:09:28.54-07','
<html>
 <head>
   <style>* {font-size: 8.5pt;}p {margin: 0;}.preserve-white-space {white-space: pre-wrap;}.ql-align-center {text-align: center;}</style>
 </head>
 <body>
   <div id="pageHeader-first"><p class="ql-align-center">{{{header}}}</p></div>
   <div id="pageHeader" style="font-size:8.5pt; color: #7F7F7F;"><p>{{{header}}}</p></div>
   <div id="pageFooter" style="text-align: center; margin-top: 16px">
     <span style="display:inline-block; margin: 6px 16px 0 0"><p>{{{smallIcon}}}</p></span>
     <span style="display:inline-block; font-size:7pt; color: #7F7F7F;"><p><em>Page \{{page}} of \{{pages}}</em></p></span>
     <span style="display:inline-block; width: 46px">&nbsp;</span>
   </div>
   <p><br></p><p><br></p><p>{{{formatLongDate currentDate}}}</p><p><br></p><p>{{{renderHtml recipient}}}</p><p>{{primaryComplainant.dataValues.inmate.dataValues.inmateId}}</p><p>{{primaryComplainant.dataValues.inmate.facility}}</p><p>{{{renderHtml (newLineToLineBreak recipientAddress)}}}</p><p><br></p><p>RE: Complaint submitted to the Hawaii Correctional System Oversight Commission</p><p><br></p><p>Dear {{{recipient}}},</p><p><br></p><p>The Hawaii Correctional System Oversight Commission received your letter dated {{{formatLongDate firstContactDate}}} regarding {{complaintType.name}}. We reviewed the documents you sent and logged your complaint in our system.&nbsp;&nbsp;</p><p><br></p><p>{{renderHtml letterBody}}</p><p>{{{signature}}}</p><p><br></p><p><br></p><p><br></p><p>{{{renderHtml (newLineToLineBreak sender)}}}</p>
 </body>
</html>
','<p class="ql-align-justify">Unfortunately, due to limited staff and capacity, we cannot investigate individual complaints at this time. The Commission is mandated to oversee the state''s correctional system. As part of our work, we collect information from different sources, including from people in custody, and identify patterns and system-wide issues. We outline our findings and recommendations through comprehensive public reports and policy recommendations to the Department of Corrections and Rehabilitation, Legislature, Governor, and community.&nbsp;Please know the information you provided is valuable and will be included in our oversight of Hawaii''s correctional system.</p><p><br></p><p class="ql-align-justify">Given this particular issue, we recommend you review the Department of Corrections and Rehabilitation Policy and Procedures Manual, Chapter 17, <em>Clothing and Property Control</em>, specifically COR.17.01, <em>Personal Property, Confiscation and Disposition of</em>, COR.17.02, <em>Personal Property</em>, COR.17.03, <em>Clothing</em>, and COR.17.04, <em>Personal Hygiene</em>. You can review Department of Corrections and Rehabilitation policies by requesting a time slot in the facility''s law library, and the policies are available on the law library kiosk. Additionally, we recommend submitting a grievance (DPS Policy and Procedure Manual, Chapter 12, COR.12.03, <em>Grievance Program</em>) on this issue if you have not done so already. The intention of the grievance process is to provide people in custody an administrative means for prompt and fair resolution of problems and concerns as required by the Prison Litigation Reform Act (PRLA).</p><p><br></p><p class="ql-align-justify">We deeply appreciate you writing to our office as we continue to grow and build corrections oversight in the State of Hawai''i.&nbsp;&nbsp;&nbsp;</p><p><br></p><p>Mahalo,</p>',NULL,false,true,'{primaryComplainant}','{primaryComplainantAddress}'),
('Mail Response',${defaultSender},NULL,'2023-11-09 11:09:50.875-07','
<html>
 <head>
   <style>* {font-size: 8.5pt;}p {margin: 0;}.preserve-white-space {white-space: pre-wrap;}.ql-align-center {text-align: center;}</style>
 </head>
 <body>
   <div id="pageHeader-first"><p class="ql-align-center">{{{header}}}</p></div>
   <div id="pageHeader" style="font-size:8.5pt; color: #7F7F7F;"><p>{{{header}}}</p></div>
   <div id="pageFooter" style="text-align: center; margin-top: 16px">
     <span style="display:inline-block; margin: 6px 16px 0 0"><p>{{{smallIcon}}}</p></span>
     <span style="display:inline-block; font-size:7pt; color: #7F7F7F;"><p><em>Page \{{page}} of \{{pages}}</em></p></span>
     <span style="display:inline-block; width: 46px">&nbsp;</span>
   </div>
   <p><br></p><p><br></p><p>{{{formatLongDate currentDate}}}</p><p><br></p><p>{{{renderHtml recipient}}}</p><p>{{primaryComplainant.dataValues.inmate.dataValues.inmateId}}</p><p>{{primaryComplainant.dataValues.inmate.facility}}</p><p>{{{renderHtml (newLineToLineBreak recipientAddress)}}}</p><p><br></p><p>RE: Complaint submitted to the Hawaii Correctional System Oversight Commission</p><p><br></p><p>Dear {{{recipient}}},</p><p><br></p><p>The Hawaii Correctional System Oversight Commission received your letter dated {{{formatLongDate firstContactDate}}} regarding {{complaintType.name}}. We reviewed the documents you sent and logged your complaint in our system.&nbsp;&nbsp;</p><p><br></p><p>{{renderHtml letterBody}}</p><p>{{{signature}}}</p><p><br></p><p><br></p><p><br></p><p>{{{renderHtml (newLineToLineBreak sender)}}}</p>
 </body>
</html>
','<p class="ql-align-justify">Unfortunately, due to limited staff and capacity, we cannot investigate individual complaints at this time. The Commission is mandated to oversee the state''s correctional system. As part of our work, we collect information from different sources, including from people in custody, and identify patterns and system-wide issues. We outline our findings and recommendations through comprehensive public reports and policy recommendations to the Department of Corrections and Rehabilitation, Legislature, Governor, and community.&nbsp;Please know the information you provided is valuable and will be included in our oversight of Hawaii''s correctional system.</p><p><br></p><p class="ql-align-justify">Given this particular issue, we recommend you review the Department of Corrections and Rehabilitation Policy and Procedures Manual, Chapter 15, <em>Communication, Mail, and Visiting</em>, specifically COR.15.02, <em>Correspondence</em>. You can review Department of Corrections and Rehabilitation policies by requesting a time slot in the facility''s law library, and the policies are available on the law library kiosk. Additionally, we recommend submitting a grievance (DPS Policy and Procedure Manual, Chapter 12, COR.12.03, <em>Grievance Program</em>) on this issue if you have not done so already. The intention of the grievance process is to provide people in custody an administrative means for prompt and fair resolution of problems and concerns as required by the Prison Litigation Reform Act (PRLA).</p><p><br></p><p class="ql-align-justify">We deeply appreciate you writing to our office as we continue to grow and build corrections oversight in the State of Hawai''i.&nbsp;&nbsp;&nbsp;</p><p><br></p><p>Mahalo,</p>',NULL,false,true,'{primaryComplainant}','{primaryComplainantAddress}'),
('Food Response',${defaultSender},NULL,NULL,'
<html>
<head>
<style>* { font-size: 8.5pt; } p { margin: 0; } .preserve-white-space { white-space: pre-wrap; } .ql-align-center { text-align: center; }</style> 
</head>
<body>
<div id="pageHeader-first"><p class="ql-align-center">{{{header}}}</p></div>
<div id="pageHeader" style="font-size:8.5pt; color: #7F7F7F;"><p><br></p></div>
<div id="pageFooter" style="text-align: center; margin-top: 16px">
<span style="display:inline-block; margin: 6px 16px 0 0"><p>{{{smallIcon}}}</p></span>
<span style="display:inline-block; font-size:7pt; color: #7F7F7F;"><p><br></p></span>
<span style="display:inline-block; width: 46px">&nbsp;</span>
</div>
<p><br></p><p><br></p><p>{{{formatLongDate currentDate}}}</p><p><br></p><p>{{{renderHtml recipient}}}</p><p>{{primaryComplainant.dataValues.inmate.dataValues.inmateId}}</p><p>{{primaryComplainant.dataValues.inmate.facility}}</p><p>{{{renderHtml (newLineToLineBreak recipientAddress)}}}</p><p><br></p><p>RE: Complaint submitted to the Hawaii Correctional System Oversight Commission</p><p><br></p><p>Dear {{{recipient}}},</p><p><br></p><p>The Hawaii Correctional System Oversight Commission received your letter dated {{{formatLongDate firstContactDate}}} regarding {{complaintType.name}}. We reviewed the documents you sent and logged your complaint in our system.&nbsp;&nbsp;</p><p><br></p><p>{{renderHtml letterBody}}</p><p>{{{signature}}}</p><p><br></p><p><br></p><p><br></p><p>{{{renderHtml (newLineToLineBreak sender)}}}</p>
</body>
</html>
','<p class="ql-align-justify">Unfortunately, due to limited staff and capacity, we cannot investigate individual complaints at this time. The Commission is mandated to oversee the state''s correctional system. As part of our work, we collect information from different sources, including from people in custody, and identify patterns and system-wide issues. We outline our findings and recommendations through comprehensive public reports and policy recommendations to the Department of Corrections and Rehabilitation, Legislature, Governor, and community.&nbsp;Please know the information you provided is valuable and will be included in our oversight of Hawaii''s correctional system.</p><p><br></p><p class="ql-align-justify">Given this particular issue, we recommend you review the Department of Corrections and Rehabilitation Policy and Procedures Manual, Chapter 9,<em> Food Services</em>, specifically COR.09.01, <em>Meal Service and Special Diets</em>. You can review Department of Corrections and Rehabilitation policies by requesting a time slot in the facility''s law library, and the policies are available on the law library kiosk. Additionally, we recommend submitting a grievance (DPS Policy and Procedure Manual, Chapter 12, COR.12.03, <em>Grievance Program</em>) on this issue if you have not done so already. The intention of the grievance process is to provide people in custody an administrative means for prompt and fair resolution of problems and concerns as required by the Prison Litigation Reform Act (PRLA).</p><p><br></p><p><br></p><p class="ql-align-justify">We deeply appreciate you writing to our office as we continue to grow and build corrections oversight in the State of Hawai''i.&nbsp;</p><p><br></p><p>Mahalo,&nbsp;</p>',NULL,false,true,'{primaryComplainant}','{primaryComplainantAddress}'),
('Library Response',${defaultSender},NULL,NULL,'
<html>
<head>
<style>* {
font-size: 8.5pt;
}

p {
margin: 0;
}

.preserve-white-space {
white-space: pre-wrap;
}

.ql-align-center {
text-align: center;
}</style>
</head>
<body>
<div id="pageHeader-first"><p class="ql-align-center">{{{header}}}</p></div>
<div id="pageHeader" style="font-size:8.5pt; color: #7F7F7F;"><p>{{{header}}}</p></div>
<div id="pageFooter" style="text-align: center; margin-top: 16px">
<span style="display:inline-block; margin: 6px 16px 0 0"><p>{{{smallIcon}}}</p></span>
<span style="display:inline-block; font-size:7pt; color: #7F7F7F;"><p><br></p></span>
<span style="display:inline-block; width: 46px">&nbsp;</span>
</div>
<p><br></p><p><br></p><p>{{{formatLongDate currentDate}}}</p><p><br></p><p>{{{renderHtml recipient}}}</p><p>{{primaryComplainant.dataValues.inmate.dataValues.inmateId}}</p><p>{{primaryComplainant.dataValues.inmate.facility}}</p><p>{{{renderHtml (newLineToLineBreak recipientAddress)}}}</p><p><br></p><p>RE: Complaint submitted to the Hawaii Correctional System Oversight Commission</p><p><br></p><p>Dear {{{recipient}}},</p><p><br></p><p>The Hawaii Correctional System Oversight Commission received your letter dated {{{formatLongDate firstContactDate}}} regarding {{complaintType.name}}. We reviewed the documents you sent and logged your complaint in our system.&nbsp;&nbsp;</p><p><br></p><p>{{renderHtml letterBody}}</p><p>{{{signature}}}</p><p><br></p><p><br></p><p><br></p><p>{{{renderHtml (newLineToLineBreak sender)}}}</p>
</body>
</html>
','<p class="ql-align-justify">Unfortunately, due to limited staff and capacity, we cannot investigate individual complaints at this time. The Commission is mandated to oversee the state''s correctional system. As part of our work, we collect information from different sources, including from people in custody, and identify patterns and system-wide issues. We outline our findings and recommendations through comprehensive public reports and policy recommendations to the Department of Corrections and Rehabilitation, Legislature, Governor, and community.&nbsp; Please know the information you provided is valuable and will be included in our oversight of Hawaii''s correctional system.</p><p><br></p><p class="ql-align-justify">Given this particular issue, we recommend you review the Department of Corrections and Rehabilitation Policy and Procedures Manual, Chapter 14, <em>Programs, Activities, and Services, S</em>ection<em> </em>14.16,<em> Library Services</em>. You can review Department of Corrections and Rehabilitation policies by requesting a time slot in the facility''s law library, and the policies are available on the law library kiosk. Additionally, we recommend submitting a grievance (DPS Policy and Procedure Manual, Chapter 12, COR.12.03, <em>Grievance Program</em>) on this issue if you have not done so already. The intention of the grievance process is to provide people in custody an administrative means for prompt and fair resolution of problems and concerns as required by the Prison Litigation Reform Act (PRLA).</p><p><br></p><p class="ql-align-justify">We deeply appreciate you writing to our office as we continue to grow and build corrections oversight in the State of Hawai''i.&nbsp;&nbsp;&nbsp;</p><p><br></p><p>Mahalo,</p>',NULL,false,true,'{primaryComplainant}','{primaryComplainantAddress}'),
('Medical Response',${defaultSender},NULL,'2023-11-09 11:09:07.891-07','
<html>
 <head>
   <style>* {font-size: 8.5pt;}p {margin: 0;}.preserve-white-space {white-space: pre-wrap;}.ql-align-center {text-align: center;}</style>
 </head>
 <body>
   <div id="pageHeader-first"><p class="ql-align-center">{{{header}}}</p></div>
   <div id="pageHeader" style="font-size:8.5pt; color: #7F7F7F;"><p>{{{header}}}</p></div>
   <div id="pageFooter" style="text-align: center; margin-top: 16px">
     <span style="display:inline-block; margin: 6px 16px 0 0"><p>{{{smallIcon}}}</p></span>
     <span style="display:inline-block; font-size:7pt; color: #7F7F7F;"><p><em>Page \{{page}} of \{{pages}}</em></p></span>
     <span style="display:inline-block; width: 46px">&nbsp;</span>
   </div>
   <p><br></p><p><br></p><p>{{{formatLongDate currentDate}}}</p><p><br></p><p>{{{renderHtml recipient}}}</p><p>{{primaryComplainant.dataValues.inmate.dataValues.inmateId}}</p><p>{{primaryComplainant.dataValues.inmate.facility}}</p><p>{{{renderHtml (newLineToLineBreak recipientAddress)}}}</p><p><br></p><p>RE: Complaint submitted to the Hawaii Correctional System Oversight Commission</p><p><br></p><p>Dear {{{recipient}}},</p><p><br></p><p>The Hawaii Correctional System Oversight Commission received your letter dated {{{formatLongDate firstContactDate}}} regarding {{complaintType.name}}. We reviewed the documents you sent and logged your complaint in our system.&nbsp;&nbsp;</p><p><br></p><p>{{renderHtml letterBody}}</p><p>{{{signature}}}</p><p><br></p><p><br></p><p><br></p><p>{{{renderHtml (newLineToLineBreak sender)}}}</p>
 </body>
</html>
','<p class="ql-align-justify">Unfortunately, due to limited staff and capacity, we cannot investigate individual complaints at this time. The Commission is mandated to oversee the state''s correctional system. As part of our work, we collect information from different sources, including from people in custody, and identify patterns and system-wide issues. We outline our findings and recommendations through comprehensive public reports and policy recommendations to the Department of Corrections and Rehabilitation, Legislature, Governor, and community.&nbsp;Please know the information you provided is valuable and will be included in our oversight of Hawaii''s correctional system.&nbsp;</p><p><br></p><p class="ql-align-justify">Given this particular issue, we recommend you review the Department of Corrections and Rehabilitation Policy and Procedures Manual, Chapter 10, <em>Medical and Health Care Services</em>, specifically, COR.10.1A.01, COR.10.1A.05 and COR.10.1A.11, which outline the grievance mechanism for health complaints. You can review Department of Corrections and Rehabilitation policies by requesting a time slot in the facility''s law library, the policies are available on the law library kiosk. Additionally, we recommend submitting a grievance (DPS Policy and Procedure Manual, Chapter 12, COR.12.03, <em>Grievance Program</em>) on this issue if you have not done so already. The intention of the grievance process is to provide people in custody an administrative means for prompt and fair resolution of problems and concerns as required by the Prison Litigation Reform Act (PRLA).</p><p><br></p><p class="ql-align-justify">We deeply appreciate you writing to our office as we continue to grow and build corrections oversight in the State of Hawai''i.&nbsp;&nbsp;&nbsp;</p><p><br></p><p><br></p><p>Mahalo,</p>',NULL,false,true,'{primaryComplainant}','{primaryComplainantAddress}'),
('Security Classification Response',${defaultSender},NULL,'2023-11-09 11:13:18.973-07','
<html>
 <head>
   <style>* {font-size: 8.5pt;}p {margin: 0;}.preserve-white-space {white-space: pre-wrap;}.ql-align-center {text-align: center;}</style>
 </head>
 <body>
   <div id="pageHeader-first"><p class="ql-align-center">{{{header}}}</p></div>
   <div id="pageHeader" style="font-size:8.5pt; color: #7F7F7F;"><p>{{{header}}}</p></div>
   <div id="pageFooter" style="text-align: center; margin-top: 16px">
     <span style="display:inline-block; margin: 6px 16px 0 0"><p>{{{smallIcon}}}</p></span>
     <span style="display:inline-block; font-size:7pt; color: #7F7F7F;"><p><em>Page \{{page}} of \{{pages}}</em></p></span>
     <span style="display:inline-block; width: 46px">&nbsp;</span>
   </div>
   <p><br></p><p><br></p><p>{{{formatLongDate currentDate}}}</p><p><br></p><p>{{{renderHtml recipient}}}</p><p>{{primaryComplainant.dataValues.inmate.dataValues.inmateId}}</p><p>{{primaryComplainant.dataValues.inmate.facility}}</p><p>{{{renderHtml (newLineToLineBreak recipientAddress)}}}</p><p><br></p><p>RE: Complaint submitted to the Hawaii Correctional System Oversight Commission</p><p><br></p><p>Dear {{{recipient}}},</p><p><br></p><p>The Hawaii Correctional System Oversight Commission received your letter dated {{{formatLongDate firstContactDate}}} regarding {{complaintType.name}}. We reviewed the documents you sent and logged your complaint in our system.&nbsp;&nbsp;</p><p><br></p><p>{{renderHtml letterBody}}</p><p>{{{signature}}}</p><p><br></p><p><br></p><p><br></p><p>{{{renderHtml (newLineToLineBreak sender)}}}</p>
 </body>
</html>
','<p class="ql-align-justify">Unfortunately, due to limited staff and capacity, we cannot investigate individual complaints at this time. The Commission is mandated to oversee the state''s correctional system. As part of our work, we collect information from different sources, including from people in custody, and identify patterns and system-wide issues. We outline our findings and recommendations through comprehensive public reports and policy recommendations to the Department of Corrections and Rehabilitation, Legislature, Governor, and community.&nbsp;Please know the information you provided is valuable and will be included in our oversight of Hawaii''s correctional system.</p><p><br></p><p class="ql-align-justify">Given this particular issue, we recommend you review the Department of Corrections and Rehabilitation Policy and Procedures Manual, Chapter 18, <em>Classification</em>, specifically COR.18.01, <em>Classification System </em>and the entirety of Chapter 18. You can review Department of Corrections and Rehabilitation policies by requesting a time slot in the facility''s law library, and the policies are available on the law library kiosk. Additionally, we recommend submitting a grievance (DPS Policy and Procedure Manual, Chapter 12, COR.12.03, <em>Grievance Program</em>) on this issue if you have not done so already. The intention of the grievance process is to provide people in custody an administrative means for prompt and fair resolution of problems and concerns as required by the Prison Litigation Reform Act (PRLA).</p><p><br></p><p class="ql-align-justify">We deeply appreciate you writing to our office as we continue to grow and build corrections oversight in the State of Hawai''i.&nbsp;&nbsp;&nbsp;</p><p><br></p><p>Mahalo,</p>',NULL,false,true,'{primaryComplainant}','{primaryComplainantAddress}'),
('Parole Response',${defaultSender},NULL,'2023-11-09 11:14:12.485-07','
<html>
 <head>
   <style>* {font-size: 8.5pt;}p {margin: 0;}.preserve-white-space {white-space: pre-wrap;}.ql-align-center {text-align: center;}</style>
 </head>
 <body>
   <div id="pageHeader-first"><p class="ql-align-center">{{{header}}}</p></div>
   <div id="pageHeader" style="font-size:8.5pt; color: #7F7F7F;"><p>{{{header}}}</p></div>
   <div id="pageFooter" style="text-align: center; margin-top: 16px">
     <span style="display:inline-block; margin: 6px 16px 0 0"><p>{{{smallIcon}}}</p></span>
     <span style="display:inline-block; font-size:7pt; color: #7F7F7F;"><p><em>Page \{{page}} of \{{pages}}</em></p></span>
     <span style="display:inline-block; width: 46px">&nbsp;</span>
   </div>
   <p><br></p><p><br></p><p>{{{formatLongDate currentDate}}}</p><p><br></p><p>{{{renderHtml recipient}}}</p><p>{{primaryComplainant.dataValues.inmate.dataValues.inmateId}}</p><p>{{primaryComplainant.dataValues.inmate.facility}}</p><p>{{{renderHtml (newLineToLineBreak recipientAddress)}}}</p><p><br></p><p>RE: Complaint submitted to the Hawaii Correctional System Oversight Commission</p><p><br></p><p>Dear {{{recipient}}},</p><p><br></p><p>The Hawaii Correctional System Oversight Commission received your letter dated {{{formatLongDate firstContactDate}}} regarding {{complaintType.name}}. We reviewed the documents you sent and logged your complaint in our system.&nbsp;&nbsp;</p><p><br></p><p>{{renderHtml letterBody}}</p><p>{{{signature}}}</p><p><br></p><p><br></p><p><br></p><p>{{{renderHtml (newLineToLineBreak sender)}}}</p>
 </body>
</html>
','<p class="ql-align-justify">Hawaii Revised Statutes Chapter 353 Corrections, Part II. Paroles and Pardons, _353-61 through _353-72, grants the Parole Board complete discretion in making parole-release decisions. Neither the Hawaii Legislature, the Ombudsman, nor our office has the authority to change the Parole Board''s decision. Parole has the power to grant parole, revoke or suspend parole, discharge individuals from parole, impose alternative program participation and conditions of release requirements, grant or deny reduction of minimums, and more.&nbsp;</p><p><br></p><p class="ql-align-justify">Although we cannot investigate individual complaints as they relate to parole and we do not have the authority to change individual outcomes, we are conducting system-wide oversight of parole and do have the ability to make recommendations to the DPS, the Hawaii Paroling Authority, and the Hawaii State Legislature regarding reentry and parole services. The information you provided is valuable and will be included in our systemic oversight of parole and Hawaii''s correctional system.&nbsp;&nbsp;</p><p class="ql-align-justify">&nbsp;&nbsp;</p><p class="ql-align-justify">We recommend you review the Hawaii Paroling Authority (HPA) Parole Handbook and Administrative Rules. You can review both by requesting a time slot in the facility''s law library, the HPA Handbook and Rules are available on the law library kiosk.&nbsp;</p><p><br></p><p class="ql-align-justify">We deeply appreciate you writing to our office as we continue to grow and build corrections oversight in the State of Hawai''i.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p><br></p><p>Mahalo,</p>',NULL,false,true,'{primaryComplainant}','{primaryComplainantAddress}');
INSERT INTO public.letter_types ("type",default_sender,created_at,updated_at,"template",editable_template,required_status,requires_approval,has_edit_page,default_recipient,default_recipient_address) VALUES
('PREA Response',${defaultSender},NULL,'2023-11-09 11:15:14.048-07','
<html>
 <head>
   <style>* { font-size: 8.5pt; } p { margin: 0; } .preserve-white-space { white-space: pre-wrap; } .ql-align-center { text-align: center; }</style> 
 </head>
 <body>
   <div id="pageHeader-first"><p class="ql-align-center">{{{header}}}</p></div>
   <div id="pageHeader" style="font-size:8.5pt; color: #7F7F7F;"><p>{{{header}}}</p></div>
   <div id="pageFooter" style="text-align: center; margin-top: 16px">
     <span style="display:inline-block; margin: 6px 16px 0 0"><p>{{{smallIcon}}}</p></span>
     <span style="display:inline-block; font-size:7pt; color: #7F7F7F;"><p><em>Page \{{page}} of \{{pages}}</em></p></span>
     <span style="display:inline-block; width: 46px">&nbsp;</span>
   </div>
   <p><br></p><p><br></p><p>{{{formatLongDate currentDate}}}</p><p><br></p><p>{{{renderHtml recipient}}}</p><p>{{primaryComplainant.dataValues.inmate.dataValues.inmateId}}</p><p>{{primaryComplainant.dataValues.inmate.facility}}</p><p>{{{renderHtml (newLineToLineBreak recipientAddress)}}}</p><p><br></p><p>RE: Complaint submitted to the Hawaii Correctional System Oversight Commission</p><p><br></p><p>Dear {{{recipient}}},</p><p><br></p><p>The Hawaii Correctional System Oversight Commission received your letter dated {{{formatLongDate firstContactDate}}} regarding {{complaintType.name}}. We reviewed the documents you sent and logged your complaint in our system.&nbsp;&nbsp;</p><p><br></p><p>{{renderHtml letterBody}}</p><p>{{{signature}}}</p><p><br></p><p><br></p><p><br></p><p>{{{renderHtml (newLineToLineBreak sender)}}}</p>
 </body>
</html>
','<p class="ql-align-justify">Due to the nature of this complaint, we sent your information and details of your allegation to the Department of Corrections and Rehabilitation Prison Rape Elimination Act (PREA) Coordinator to ensure a PREA investigation is initiated and completed. PREA is a federal law which seeks to eliminate and prevent sexual abuse in institutional settings such as jails and prisons.&nbsp;PREA requires the Department of Corrections and Rehabilitation to have a method to receive and investigate complaints of sexual abuse. This is also in accordance with the Department of Corrections and Rehabilitation Policy and Procedures Manual, Chapter 10, COR.10.1B.05, Procedures in the Event of Physical or Sexual Assault.</p><p><br></p><p class="ql-align-justify">The Commission is mandated to oversee the state''s correctional system. As part of our work, we collect information from different sources, including from people in custody, and identify patterns and system-wide issues. We outline our findings and recommendations through comprehensive public reports and policy recommendations to the Department of Corrections and Rehabilitation, Legislature, Governor, and community.&nbsp;Please know the information you provided is valuable and will be considered in our oversight of Hawaii''s correctional system.</p><p><br></p><p class="ql-align-justify">We deeply appreciate you writing to our office as we continue to grow and build corrections oversight in the State of Hawai''i.&nbsp;&nbsp;&nbsp;</p><p><br></p><p>Mahalo,&nbsp;</p>',NULL,false,true,'{primaryComplainant}','{primaryComplainantAddress}'),
('Misconduct Facility Adjudication Response',${defaultSender},NULL,'2023-11-09 11:09:39.322-07','
<html>
 <head>
   <style>* {font-size: 8.5pt;}p {margin: 0;}.preserve-white-space {white-space: pre-wrap;}.ql-align-center {text-align: center;}</style>
 </head>
 <body>
   <div id="pageHeader-first"><p class="ql-align-center">{{{header}}}</p></div>
   <div id="pageHeader" style="font-size:8.5pt; color: #7F7F7F;"><p>{{{header}}}</p></div>
   <div id="pageFooter" style="text-align: center; margin-top: 16px">
     <span style="display:inline-block; margin: 6px 16px 0 0"><p>{{{smallIcon}}}</p></span>
     <span style="display:inline-block; font-size:7pt; color: #7F7F7F;"><p><em>Page \{{page}} of \{{pages}}</em></p></span>
     <span style="display:inline-block; width: 46px">&nbsp;</span>
   </div>
   <p><br></p><p><br></p><p>{{{formatLongDate currentDate}}}</p><p><br></p><p>{{{renderHtml recipient}}}</p><p>{{primaryComplainant.dataValues.inmate.dataValues.inmateId}}</p><p>{{primaryComplainant.dataValues.inmate.facility}}</p><p>{{{renderHtml (newLineToLineBreak recipientAddress)}}}</p><p><br></p><p>RE: Complaint submitted to the Hawaii Correctional System Oversight Commission</p><p><br></p><p>Dear {{{recipient}}},</p><p><br></p><p>The Hawaii Correctional System Oversight Commission received your letter dated {{{formatLongDate firstContactDate}}} regarding {{complaintType.name}}. We reviewed the documents you sent and logged your complaint in our system.&nbsp;&nbsp;</p><p><br></p><p>{{renderHtml letterBody}}</p><p>{{{signature}}}</p><p><br></p><p><br></p><p><br></p><p>{{{renderHtml (newLineToLineBreak sender)}}}</p>
 </body>
</html>
','<p class="ql-align-justify">Unfortunately, due to limited staff and capacity, we cannot investigate individual complaints at this time. The Commission is mandated to oversee the state''s correctional system. As part of our work, we collect information from different sources, including from people in custody, and identify patterns and system-wide issues. We outline our findings and recommendations through comprehensive public reports and policy recommendations to the Department of Corrections and Rehabilitation, Legislature, Governor, and community.&nbsp;Please know the information you provided is valuable and will be included in our oversight of Hawaii''s correctional system.</p><p><br></p><p class="ql-align-justify">Given this particular issue, we recommend you review Chapter 13 of the Department of Corrections and Rehabilitation Policies and Procedures Manual, specifically, COR.13.03, which outlines misconduct violations, sanction, and procedures and includes a facility adjustment hearing process form. You can review Department of Corrections and Rehabilitation policies by requesting a time slot in the facility''s law library, and the policies are available on the law library kiosk. Additionally, we recommend submitting a grievance (DPS Policy and Procedure Manual, Chapter 12, COR.12.03, <em>Grievance Program</em>) on this issue if you have not done so already. The intention of the grievance process is to provide people in custody an administrative means for prompt and fair resolution of problems and concerns as required by the Prison Litigation Reform Act (PRLA).</p><p class="ql-align-justify">We deeply appreciate you writing to our office as we continue to grow and build corrections oversight in the State of Hawai''i.&nbsp;&nbsp;&nbsp;</p><p><br></p><p>Mahalo,</p>',NULL,false,true,'{primaryComplainant}','{primaryComplainantAddress}'),
('Visitation Response',${defaultSender},NULL,'2023-11-09 11:08:44.095-07','
<html>
 <head>
           <style>* {font-size: 8.5pt;}p {margin: 0;}.preserve-white-space {white-space: pre-wrap;}.ql-align-center {text-align: center;}</style>      
 </head>
 <body>
   <div id="pageHeader-first"><p class="ql-align-center">{{{header}}}</p></div>
   <div id="pageHeader" style="font-size:8.5pt; color: #7F7F7F;"><p>{{{header}}}</p></div>
   <div id="pageFooter" style="text-align: center; margin-top: 16px">
     <span style="display:inline-block; margin: 6px 16px 0 0"><p>{{{smallIcon}}}</p></span>
     <span style="display:inline-block; font-size:7pt; color: #7F7F7F;"><p>Page \{{page}} of \{{pages}}</p></span>
     <span style="display:inline-block; width: 46px">&nbsp;</span>
   </div>
   <p><br></p><p><br></p><p>{{{formatLongDate currentDate}}}</p><p><br></p><p>{{{renderHtml recipient}}}</p><p>{{primaryComplainant.dataValues.inmate.dataValues.inmateId}}</p><p>{{primaryComplainant.dataValues.inmate.facility}}</p><p>{{{renderHtml (newLineToLineBreak recipientAddress)}}}</p><p><br></p><p>RE: Complaint submitted to the Hawaii Correctional System Oversight Commission</p><p><br></p><p>Dear {{{recipient}}},</p><p><br></p><p>The Hawaii Correctional System Oversight Commission received your letter dated {{{formatLongDate firstContactDate}}} regarding {{complaintType.name}}. We reviewed the documents you sent and logged your complaint in our system.&nbsp;&nbsp;</p><p><br></p><p>{{renderHtml letterBody}}</p><p>{{{signature}}}</p><p><br></p><p><br></p><p><br></p><p>{{{renderHtml (newLineToLineBreak sender)}}}</p>
 </body>
</html>
','<p class="ql-align-justify">Unfortunately, due to limited staff and capacity, we cannot investigate individual complaints at this time. The Commission is mandated to oversee the state''s correctional system. As part of our work, we collect information from different sources, including from people in custody, and identify patterns and system-wide issues. We outline our findings and recommendations through comprehensive public reports and policy recommendations to the Department of Corrections and Rehabilitation, Legislature, Governor, and community.&nbsp;Please know the information you provided is valuable and will be included in our oversight of Hawaii''s correctional system.</p><p><br></p><p class="ql-align-justify">Given this particular issue, we recommend you review the Department of Corrections and Rehabilitation Policy and Procedures Manual, Chapter 15, <em>Communication, Mail, and Visiting</em>, specifically COR.15.04, <em>Visitation</em>. You can review Department of Corrections and Rehabilitation policies by requesting a time slot in the facility''s law library, and the policies are available on the law library kiosk. Additionally, we recommend submitting a grievance (DPS Policy and Procedure Manual, Chapter 12, COR.12.03, <em>Grievance Program</em>) on this issue if you have not done so already. The intention of the grievance process is to provide people in custody an administrative means for prompt and fair resolution of problems and concerns as required by the Prison Litigation Reform Act (PRLA).</p><p><br></p><p class="ql-align-justify">We deeply appreciate you writing to our office as we continue to grow and build corrections oversight in the State of Hawai''i.&nbsp;&nbsp;&nbsp;</p><p><br></p><p>Mahalo,</p>',NULL,false,true,'{primaryComplainant}','{primaryComplainantAddress}'),
('Probation Response',${defaultSender},NULL,'2023-11-09 11:13:48.58-07','
<html>
 <head>
   <style>* {font-size: 8.5pt;}p {margin: 0;}.preserve-white-space {white-space: pre-wrap;}.ql-align-center {text-align: center;}</style>
 </head>
 <body>
   <div id="pageHeader-first"><p class="ql-align-center">{{{header}}}</p></div>
   <div id="pageHeader" style="font-size:8.5pt; color: #7F7F7F;"><p>{{{header}}}</p></div>
   <div id="pageFooter" style="text-align: center; margin-top: 16px">
     <span style="display:inline-block; margin: 6px 16px 0 0"><p>{{{smallIcon}}}</p></span>
     <span style="display:inline-block; font-size:7pt; color: #7F7F7F;"><p><em>Page \{{page}} of \{{pages}}</em></p></span>
     <span style="display:inline-block; width: 46px">&nbsp;</span>
   </div>
   <p><br></p><p><br></p><p>{{{formatLongDate currentDate}}}</p><p><br></p><p>{{{renderHtml recipient}}}</p><p>{{primaryComplainant.dataValues.inmate.dataValues.inmateId}}</p><p>{{primaryComplainant.dataValues.inmate.facility}}</p><p>{{{renderHtml (newLineToLineBreak recipientAddress)}}}</p><p><br></p><p>RE: Complaint submitted to the Hawaii Correctional System Oversight Commission</p><p><br></p><p>Dear {{{recipient}}},</p><p><br></p><p>The Hawaii Correctional System Oversight Commission received your letter dated {{{formatLongDate firstContactDate}}} regarding {{complaintType.name}}. We reviewed the documents you sent and logged your complaint in our system.&nbsp;&nbsp;</p><p><br></p><p>{{renderHtml letterBody}}</p><p>{{{signature}}}</p><p><br></p><p><br></p><p><br></p><p>{{{renderHtml (newLineToLineBreak sender)}}}</p>
 </body>
</html>
','<p class="ql-align-justify">Unfortunately, due to limited staff and capacity, we cannot investigate individual complaints at this time. The Commission is mandated to oversee the state''s correctional system. As part of our work, we collect information from different sources, including from people in custody, and identify patterns and systemic issues. We outline our findings and recommendations through public reports and policy recommendations to the Department of Corrections and Rehabilitation (DPS), Legislature, Governor, and community.&nbsp;&nbsp;</p><p class="ql-align-justify">&nbsp;&nbsp;</p><p class="ql-align-justify">Hawaii Revised Statutes, Title 37. Hawaii Penal Code, Chapter 706 <em>Disposition of Convicted Defendants</em>, _706-620 through _706-631, outlines probation, including the requirements, terms, conditions, revocation, modification, discharge, and more. You can review this statute by requesting a time slot in the facility''s law library. Hawaii Revised Statutes are available on the law library kiosk.</p><p><br></p><p class="ql-align-justify">We deeply appreciate you writing to our office as we continue to grow and build corrections oversight in the State of Hawai''i.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p><br></p><p>Mahalo,</p>',NULL,false,true,'{primaryComplainant}','{primaryComplainantAddress}'),
('Staff Misconduct Excessive Force Response',${defaultSender},NULL,'2023-11-09 11:14:42.035-07','
<html>
 <head>
   <style>* {font-size: 8.5pt;}p {margin: 0;}.preserve-white-space {white-space: pre-wrap;}.ql-align-center {text-align: center;}</style>
 </head>
 <body>
   <div id="pageHeader-first"><p class="ql-align-center">{{{header}}}</p></div>
   <div id="pageHeader" style="font-size:8.5pt; color: #7F7F7F;"><p>{{{header}}}</p></div>
   <div id="pageFooter" style="text-align: center; margin-top: 16px">
     <span style="display:inline-block; margin: 6px 16px 0 0"><p>{{{smallIcon}}}</p></span>
     <span style="display:inline-block; font-size:7pt; color: #7F7F7F;"><p><em>Page \{{page}} of \{{pages}}</em></p></span>
     <span style="display:inline-block; width: 46px">&nbsp;</span>
   </div>
   <p><br></p><p><br></p><p>{{{formatLongDate currentDate}}}</p><p><br></p><p>{{{renderHtml recipient}}}</p><p>{{primaryComplainant.dataValues.inmate.dataValues.inmateId}}</p><p>{{primaryComplainant.dataValues.inmate.facility}}</p><p>{{{renderHtml (newLineToLineBreak recipientAddress)}}}</p><p><br></p><p>RE: Complaint submitted to the Hawaii Correctional System Oversight Commission</p><p><br></p><p>Dear {{{recipient}}},</p><p><br></p><p>The Hawaii Correctional System Oversight Commission received your letter dated {{{formatLongDate firstContactDate}}} regarding {{complaintType.name}}. We reviewed the documents you sent and logged your complaint in our system.&nbsp;&nbsp;</p><p><br></p><p>{{renderHtml letterBody}}</p><p>{{{signature}}}</p><p><br></p><p><br></p><p><br></p><p>{{{renderHtml (newLineToLineBreak sender)}}}</p>
 </body>
</html>
','<p class="ql-align-justify">Unfortunately, due to limited staff and capacity, we cannot investigate individual complaints at this time. The Commission is mandated to oversee the state''s correctional system. As part of our work, we collect information from different sources, including from people in custody, and identify patterns and system-wide issues. We outline our findings and recommendations through comprehensive public reports and policy recommendations to the Department of Corrections and Rehabilitation, Legislature, Governor, and community. . Please know the information you provided is valuable and will be included in our oversight of Hawaii''s correctional system.</p><p><br></p><p class="ql-align-justify">Given this particular issue, we recommend you review the Department of Corrections and Rehabilitation Policy and Procedures Manual, Chapter 12, COR.12.01, <em>Right to Safe Custody</em>. You can review Department of Corrections and Rehabilitation policies by requesting a time slot in the facility''s law library, and the policies are available on the law library kiosk. Additionally, we recommend submitting a grievance (DPS Policy and Procedure Manual, Chapter 12, COR.12.03, Grievance Program) on this issue if you have not done so already. The intention of the grievance process is to provide people in custody an administrative means for prompt and fair resolution of problems and concerns as required by the Prison Litigation Reform Act (PRLA).&nbsp;</p><p><br></p><p class="ql-align-justify">We deeply appreciate you writing to our office as we continue to grow and build corrections oversight in the State of Hawai''i.&nbsp;&nbsp;&nbsp;</p><p><br></p><p>Mahalo,</p>',NULL,false,true,'{primaryComplainant}','{primaryComplainantAddress}'),
('Living Conditions Overcrowding Response',${defaultSender},NULL,'2023-11-09 11:15:33.928-07','
<html>
 <head>
   <style>* {font-size: 8.5pt;}p {margin: 0;}.preserve-white-space {white-space: pre-wrap;}.ql-align-center {text-align: center;}</style>
 </head>
 <body>
   <div id="pageHeader-first"><p class="ql-align-center">{{{header}}}</p></div>
   <div id="pageHeader" style="font-size:8.5pt; color: #7F7F7F;"><p>{{{header}}}</p></div>
   <div id="pageFooter" style="text-align: center; margin-top: 16px">
     <span style="display:inline-block; margin: 6px 16px 0 0"><p>{{{smallIcon}}}</p></span>
     <span style="display:inline-block; font-size:7pt; color: #7F7F7F;"><p><em>Page \{{page}} of \{{pages}}</em></p></span>
     <span style="display:inline-block; width: 46px">&nbsp;</span>
   </div>
   <p><br></p><p><br></p><p>{{{formatLongDate currentDate}}}</p><p><br></p><p>{{{renderHtml recipient}}}</p><p>{{primaryComplainant.dataValues.inmate.dataValues.inmateId}}</p><p>{{primaryComplainant.dataValues.inmate.facility}}</p><p>{{{renderHtml (newLineToLineBreak recipientAddress)}}}</p><p><br></p><p>RE: Complaint submitted to the Hawaii Correctional System Oversight Commission</p><p><br></p><p>Dear {{{recipient}}},</p><p><br></p><p>The Hawaii Correctional System Oversight Commission received your letter dated {{{formatLongDate firstContactDate}}} regarding {{complaintType.name}}. We reviewed the documents you sent and logged your complaint in our system.&nbsp;&nbsp;</p><p><br></p><p>{{renderHtml letterBody}}</p><p>{{{signature}}}</p><p><br></p><p><br></p><p><br></p><p>{{{renderHtml (newLineToLineBreak sender)}}}</p>
 </body>
</html>
','<p class="ql-align-justify">Unfortunately, due to limited staff and capacity, we cannot investigate individual complaints at this time. The Commission is mandated to oversee the state''s correctional system. As part of our work, we collect information from different sources, including from people in custody, and identify patterns and system-wide issues. We outline our findings and recommendations through comprehensive public reports and policy recommendations to the Department of Corrections and Rehabilitation, Legislature, Governor, and community.&nbsp;Please know the information you provided is valuable and will be included in our oversight of Hawaii''s correctional system.</p><p class="ql-align-justify">&nbsp;</p><p class="ql-align-justify">Given this particular issue, we recommend you review the Department of Corrections and Rehabilitation Policy and Procedures Manual, Chapter 7, <em>Safety and Sanitation</em>. This chapter outlines the regulations set for living conditions. You can review Department of Corrections and Rehabilitation policies by requesting a time slot in the facility''s law library, the policies are available on the law library kiosk. Additionally, we recommend submitting a grievance (DPS Policy and Procedure Manual, Chapter 12, COR.12.03, <em>Grievance Program</em>) on this issue if you have not done so already. The intention of the grievance process is to provide people in custody an administrative means for prompt and fair resolution of problems and concerns as required by the Prison Litigation Reform Act (PRLA).</p><p><br></p><p class="ql-align-justify">We deeply appreciate you writing to our office as we continue to grow and build corrections oversight in the State of Hawai''i.&nbsp;&nbsp;&nbsp;</p><p><br></p><p>Mahalo,&nbsp;</p>',NULL,false,true,'{primaryComplainant}','{primaryComplainantAddress}'),
('Programs Education Reentry Case Management Religious Needs Response',${defaultSender},NULL,'2023-11-09 11:14:53.05-07','
<html>
 <head>
   <style>* {font-size: 8.5pt;}p {margin: 0;}.preserve-white-space {white-space: pre-wrap;}.ql-align-center {text-align: center;}</style>
 </head>
 <body>
   <div id="pageHeader-first"><p class="ql-align-center">{{{header}}}</p></div>
   <div id="pageHeader" style="font-size:8.5pt; color: #7F7F7F;"><p>{{{header}}}</p></div>
   <div id="pageFooter" style="text-align: center; margin-top: 16px">
     <span style="display:inline-block; margin: 6px 16px 0 0"><p>{{{smallIcon}}}</p></span>
     <span style="display:inline-block; font-size:7pt; color: #7F7F7F;"><p><em>Page \{{page}} of \{{pages}}</em></p></span>
     <span style="display:inline-block; width: 46px">&nbsp;</span>
   </div>
   <p><br></p><p><br></p><p>{{{formatLongDate currentDate}}}</p><p><br></p><p>{{{renderHtml recipient}}}</p><p>{{primaryComplainant.dataValues.inmate.dataValues.inmateId}}</p><p>{{primaryComplainant.dataValues.inmate.facility}}</p><p>{{{renderHtml (newLineToLineBreak recipientAddress)}}}</p><p><br></p><p>RE: Complaint submitted to the Hawaii Correctional System Oversight Commission</p><p><br></p><p>Dear {{{recipient}}},</p><p><br></p><p>The Hawaii Correctional System Oversight Commission received your letter dated {{{formatLongDate firstContactDate}}} regarding {{complaintType.name}}. We reviewed the documents you sent and logged your complaint in our system.&nbsp;&nbsp;</p><p><br></p><p>{{renderHtml letterBody}}</p><p>{{{signature}}}</p><p><br></p><p><br></p><p><br></p><p>{{{renderHtml (newLineToLineBreak sender)}}}</p>
 </body>
</html>
','<p class="ql-align-justify">Unfortunately, due to limited staff and capacity, we cannot investigate individual complaints at this time. The Commission is mandated to oversee the state''s correctional system. As part of our work, we collect information from different sources, including from people in custody, and identify patterns and system-wide issues. We outline our findings and recommendations through comprehensive public reports and policy recommendations to the Department of Corrections and Rehabilitation, Legislature, Governor, and community.&nbsp;Please know the information you provided is valuable and will be included in our oversight of Hawaii''s correctional system.</p><p><br></p><p class="ql-align-justify">Given this particular issue, we recommend you review the Department of Corrections and Rehabilitation Policy and Procedures Manual, Chapter 14, <em>Programs, Activities, and Services</em>. For religious programs in particular, please see the Department of Corrections and Rehabilitation Policy and Procedures Manual, Chapter 12, COR.12.05. You can review Department of Corrections and Rehabilitation policies by requesting a time slot in the facility''s law library, and the policies are available on the law library kiosk. Additionally, we recommend submitting a grievance (DPS Policy and Procedure Manual, Chapter 12, COR.12.03, Grievance Program) on this issue if you have not done so already. The intention of the grievance process is to provide people in custody an administrative means for prompt and fair resolution of problems and concerns as required by the Prison Litigation Reform Act (PRLA).</p><p><br></p><p class="ql-align-justify">We deeply appreciate you writing to our office as we continue to grow and build corrections oversight in the State of Hawai''i.&nbsp;&nbsp;</p><p><br></p><p>Mahalo,</p>',NULL,false,true,'{primaryComplainant}','{primaryComplainantAddress}'),
('Form Response No Topic',${defaultSender},NULL,'2023-11-09 11:15:23.686-07','
<html>
 <head>
   <style>* { font-size: 8.5pt; } p { margin: 0; } .preserve-white-space { white-space: pre-wrap; } .ql-align-center { text-align: center; }</style> 
 </head>
 <body>
   <div id="pageHeader-first"><p class="ql-align-center">{{{header}}}</p></div>
   <div id="pageHeader" style="font-size:8.5pt; color: #7F7F7F;"><p>{{{header}}}</p></div>
   <div id="pageFooter" style="text-align: center; margin-top: 16px">
     <span style="display:inline-block; margin: 6px 16px 0 0"><p>{{{smallIcon}}}</p></span>
     <span style="display:inline-block; font-size:7pt; color: #7F7F7F;"><p><em>Page \{{page}} of \{{pages}}</em></p></span>
     <span style="display:inline-block; width: 46px">&nbsp;</span>
   </div>
   <p><br></p><p><br></p><p>{{{formatLongDate currentDate}}}</p><p><br></p><p>{{{renderHtml recipient}}}</p><p>{{primaryComplainant.dataValues.inmate.dataValues.inmateId}}</p><p>{{primaryComplainant.dataValues.inmate.facility}}</p><p>{{{renderHtml (newLineToLineBreak recipientAddress)}}}</p><p><br></p><p>RE: Complaint submitted to the Hawaii Correctional System Oversight Commission</p><p><br></p><p>Dear {{{recipient}}},</p><p><br></p><p>The Hawaii Correctional System Oversight Commission received your letter dated {{{formatLongDate firstContactDate}}} regarding {{complaintType.name}}. We reviewed the documents you sent and logged your complaint in our system.&nbsp;&nbsp;</p><p><br></p><p>{{renderHtml letterBody}}</p><p>{{{signature}}}</p><p><br></p><p><br></p><p><br></p><p>{{{renderHtml (newLineToLineBreak sender)}}}</p>
 </body>
</html>
','<p class="ql-align-justify">Unfortunately, due to limited staff and capacity, we cannot investigate individual complaints at this time. The Commission is mandated to oversee the state''s correctional system. As part of our work, we collect information from different sources, including from people in custody, and identify patterns and system-wide issues. We outline our findings and recommendations through comprehensive public reports and policy recommendations to the Department of Corrections and Rehabilitation, Legislature, Governor, and community.&nbsp;Please know the information you provided is valuable and will be included in our oversight of Hawaii''s correctional system.</p><p><br></p><p class="ql-align-justify">We recommend you review the Department of Corrections and Rehabilitation Policy and Procedures Manual on this topic. You can review Department of Corrections and Rehabilitation policies by requesting a time slot in the facility''s law library, and the policies are available on the law library kiosk. Additionally, we recommend submitting a grievance (DPS Policy and Procedure Manual, Chapter 12, COR.12.03, <em>Grievance Program</em>) on this issue if you have not done so already. The intention of the grievance process is to provide people in custody an administrative means for prompt and fair resolution of problems and concerns as required by the Prison Litigation Reform Act (PRLA).</p><p><br></p><p><br></p><p><br></p><p class="ql-align-justify">We deeply appreciate you writing to our office as we continue to grow and build corrections oversight in the State of Hawai''i.&nbsp;&nbsp;&nbsp;</p><p><br></p><p>Mahalo,&nbsp;</p>',NULL,false,true,'{primaryComplainant}','{primaryComplainantAddress}');
`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        if (process.env.ORG === "HAWAII") {
          const [result] = await queryInterface.sequelize.query(
            "SELECT id FROM signers LIMIT 1;",
            { transaction }
          );

          const defaultSenderId = result[0].id;

          await queryInterface.sequelize.query(
            LETTER_TYPES_HAWAII(defaultSenderId),
            {
              transaction
            }
          );
        }
      });
    } catch (error) {
      throw new Error(`Error while seeding of letter types ${error}`);
    }
  },

  down: async (queryInterface, Sequelize) => {}
};
