<div>
  <p>
    This is to inform you pursuant to New Orleans City Code Section 2-1121 (the Police Monitors Ordinance) that the
    Office of the Independent Police Monitor (OIPM) has received a complaint of misconduct by an NOPD employee(s).
    The complainant relayed the following information to our office:
  </p>
  <p><br></p>
  <p><br></p>
  <p class="ql-align-center"><strong><u>Complaint Information</u></strong></p>
  <p><br></p>
  <p><strong><u>OIPM Complaint #:</u></strong> {{caseReference}}</p>
  {{#if (isPresent firstContactDate)}}
    <p>Date filed with OIPM: {{{formatShortDate firstContactDate}}}</p>
  {{/if}}
  {{#if (isPresent pibCaseNumber)}}
    <p>PIB Case Number: {{pibCaseNumber}}</p>
  {{/if}}
  <p><br></p>

  <p><strong><u>Complainant Information</u></strong></p>
  {{#each complainantCivilians}}
    {{#if (isGreaterThan (addNumbers ../complainantCivilians.length ../complainantOfficers.length) 1)}}
      Complainant #{{addNumbers @index 1}}
      <br>
    {{/if}}
    {{#if isAnonymous}}
      Anonymous Complainant
      <br>
    {{else}}
      {{#if (isPresent fullName)}}
        <p>Name: {{fullName}}</p>
      {{/if}}
      {{#if (isPresent raceEthnicity)}}
        <p>Race: {{raceEthnicity.name}}</p>
      {{/if}}
      {{#if (isPresent genderIdentity)}}
        <p>Sex: {{genderIdentity.name}}</p>
      {{/if}}
      {{#if (isPresent birthDate)}}
        <p>Date of Birth: {{{formatShortDate birthDate}}}</p>
      {{/if}}
      {{#if (isPresent (formatAddress address))}}
        <p>Address: {{{formatAddress address}}}</p>
      {{/if}}
      {{#if (isPresent phoneNumber)}}
        <p>Phone: {{{formatPhoneNumber phoneNumber}}}</p>
      {{/if}}
      {{#if (isPresent email)}}
        <p>Email: {{email}}</p>
      {{/if}}
    {{/if}}
    <p><br></p>
  {{/each}}
  {{#each complainantOfficers}}
    {{#if (isGreaterThan (addNumbers ../complainantCivilians.length ../complainantOfficers.length) 1)}}
      Complainant #{{addNumbers (addNumbers @index 1) ../complainantCivilians.length}}
      <br>
    {{/if}}
    {{#if isAnonymous}}
      Anonymous Complainant
      <br>
    {{else}}
      {{#if (isPresent fullName)}}
        <p>Name: {{fullName}}</p>
      {{/if}}
      {{#if (isPresent rank)}}
        <p>Rank: {{rank}}</p>
      {{/if}}
      {{#if (isPresent windowsUsername)}}
        <p>Employee ID: #{{windowsUsername}}</p>
      {{/if}}
      {{#if (isPresent race)}}
        <p>Race: {{race}}</p>
      {{/if}}
      {{#if (isPresent sex)}}
        <p>Sex: {{sex}}</p>
      {{/if}}
      {{#if (isPresent dob)}}
        <p>Date of Birth: {{{formatShortDate dob}}}</p>
      {{/if}}
      {{#if (isPresent supervisorFullName)}}
        <p>Supervisor (Employee ID): {{supervisorFullName}} (#{{supervisorWindowsUsername}})</p>
      {{/if}}
      {{#if (isPresent employeeType)}}
        <p>Employee Type: {{employeeType}}</p>
      {{/if}}
      {{#if (isPresent district)}}
        <p>District: {{district}}</p>
      {{/if}}
      {{#if (isPresent bureau)}}
        <p>Bureau: {{bureau}}</p>
      {{/if}}
      {{#if (isPresent workStatus)}}
        <p>Status: {{workStatus}}</p>
      {{/if}}
      {{#if (isPresent endDate)}}
        <p>End of Employment: {{{formatShortDate endDate}}}</p>
      {{/if}}
    {{/if}}
    <p><br></p>
  {{/each}}

  <p><strong><u>Subject NOPD Employee(s) Information</u></strong></p>
  {{#each accusedOfficers}}
    {{#if (isPresent fullName)}}
      <p>Name: {{fullName}}</p>
    {{/if}}
    {{#if (isPresent rank)}}
      <p>Rank: {{rank}}</p>
    {{/if}}
    {{#if (isPresent windowsUsername)}}
      <p>Employee ID: #{{windowsUsername}}</p>
    {{/if}}
    {{#if (isPresent race)}}
      <p>Race: {{race}}</p>
    {{/if}}
    {{#if (isPresent sex)}}
      <p>Sex: {{sex}}</p>
    {{/if}}
    {{#if (isPresent dob)}}
      <p>Date of Birth: {{{formatShortDate dob}}}</p>
    {{/if}}
    {{#if (isPresent supervisorFullName)}}
      <p>Supervisor (Employee ID): {{supervisorFullName}} (#{{supervisorWindowsUsername}})</p>
    {{/if}}
    {{#if (isPresent employeeType)}}
      <p>Employee Type: {{employeeType}}</p>
    {{/if}}
    {{#if (isPresent district)}}
      <p>District: {{district}}</p>
    {{/if}}
    {{#if (isPresent bureau)}}
      <p>Bureau: {{bureau}}</p>
    {{/if}}
    {{#if (isPresent workStatus)}}
      <p>Status: {{workStatus}}</p>
    {{/if}}
    {{#if (isPresent endDate)}}
      <p>End of Employment: {{{formatShortDate endDate}}}</p>
    {{/if}}
    <p><br></p>
  {{/each}}

  {{#if (atLeastOneInputDefined witnessCivilians witnessOfficers)}}
    <p><strong><u>Witnesses</u></strong></p>
  {{/if}}
  {{#each witnessCivilians}}
    {{#if (isGreaterThan (addNumbers ../witnessCivilians.length ../witnessOfficers.length) 1)}}
      Witness #{{addNumbers @index 1}}
      <br>
    {{/if}}
    {{#if isAnonymous}}
      Anonymous Witness
      <br>
    {{else}}
      {{#if (isPresent fullName)}}
        <p>Name: {{fullName}}</p>
      {{/if}}
      {{#if (isPresent phoneNumber)}}
        <p>Phone: {{{formatPhoneNumber phoneNumber}}}</p>
      {{/if}}
      {{#if (isPresent email)}}
        <p>Email: {{email}}</p>
      {{/if}}
      <p><br></p>
    {{/if}}
    <p><br></p>
  {{/each}}
  {{#each witnessOfficers}}
    {{#if (isGreaterThan (addNumbers ../witnessCivilians.length ../witnessOfficers.length) 1)}}
      Witness #{{addNumbers (addNumbers @index 1) ../witnessCivilians.length}}
      <br>
    {{/if}}
    {{#if isAnonymous}}
      Anonymous Witness
      <br>
    {{else}}
      {{#if (isPresent fullName)}}
        <p>Name: {{fullName}}</p>
      {{/if}}
      {{#if (isPresent rank)}}
        <p>Rank: {{rank}}</p>
      {{/if}}
      {{#if (isPresent windowsUsername)}}
        <p>Employee ID: #{{windowsUsername}}</p>
      {{/if}}
      {{#if (isPresent race)}}
        <p>Race: {{race}}</p>
      {{/if}}
      {{#if (isPresent sex)}}
        <p>Sex: {{sex}}</p>
      {{/if}}
      {{#if (isPresent dob)}}
        <p>Date of Birth: {{{formatShortDate dob}}}</p>
      {{/if}}
      {{#if (isPresent supervisorFullName)}}
        <p>Supervisor (Employee ID): {{supervisorFullName}} (#{{supervisorWindowsUsername}})</p>
      {{/if}}
      {{#if (isPresent employeeType)}}
        <p>Employee Type: {{employeeType}}</p>
      {{/if}}
      {{#if (isPresent district)}}
        <p>District: {{district}}</p>
      {{/if}}
      {{#if (isPresent bureau)}}
        <p>Bureau: {{bureau}}</p>
      {{/if}}
      {{#if (isPresent workStatus)}}
        <p>Status: {{workStatus}}</p>
      {{/if}}
      {{#if (isPresent endDate)}}
        <p>End of Employment: {{{formatShortDate endDate}}}</p>
      {{/if}}
    {{/if}}
    <p><br></p>
  {{/each}}

  <p><strong><u>Incident</u></strong></p>
  {{#if (isPresent incidentDate)}}
    <p>Date: {{{formatShortDate incidentDate}}}</p>
  {{/if}}
  {{#if (isPresent (formatAddress incidentLocation))}}
    <p>Location: {{{formatAddress incidentLocation}}}</p>
  {{/if}}
  {{#if (isPresent incidentTime)}}
    <p>Time: {{{formatTime incidentDate incidentTime}}}</p>
  {{/if}}

  <p><br></p>
  <p><br></p>
  <p class="ql-align-center"><strong><u>Initial Allegations/Concerns/Issues</u></strong></p>
  <p><br></p>
  {{#each accusedOfficers}}
    Complainant alleges the following occurred
    {{#if (isPresent ../incidentDate)}} on {{{formatShortDate ../incidentDate}}},{{/if}}
    during the complainant’s interaction with {{rank}} {{fullName}}. If proven, the accused officer may have violated
    NOPD policy, rules, or procedure when:
    <ol>
      {{#each allegations}}
        <li>{{this.details}}</li>
        <i>{{allegation.rule}}: {{allegation.paragraph}}: {{allegation.directive}}</i>
      {{/each}}
    </ol>
    <p><br></p>
  {{/each}}
  <p class="ql-align-center"><strong><u>Details of Complainant’s Account</u></strong></p>
  <p><br></p>
  <p class="preserve-white-space">{{narrativeDetails}}</p>
  <p><br></p>
  <p><br></p>

  {{#if (showOfficerHistoryHeader accusedOfficers)}}
    <p class="ql-align-center"><strong><u>Complaint History</u></strong></p>
    <p><br></p>
  {{/if}}
  {{#each accusedOfficers}}
    {{#if letterOfficer}}
      {{#if (isEqual fullName "Unknown Officer")}}
        <p>
          The OIPM is unable to review <strong>{{fullName~}}’s</strong> disciplinary history as they are unable to be
          identified at this time.
        </p>
        <br />
      {{/if}}
      {{#if (isEqual letterOfficer.officerHistoryOptionId 1)}}
        <p>
          The OIPM reviewed <strong>{{rank}} {{fullName~}}’s</strong> history for the last five years and has determined
          there is no significant / noteworthy complaints.
        </p>
        <br />
      {{/if}}
      {{#if (isEqual letterOfficer.officerHistoryOptionId 2)}}
        <p>
          The OIPM reviewed <strong>{{rank}} {{fullName~}}’s</strong> history for the last five years and has determined
          the officer is still
          considered a recruit and does not have any significant/noteworthy complaints.
        </p>
        <br />
      {{/if}}
      {{#if (isEqual letterOfficer.officerHistoryOptionId 3)}}
        <p>
          The OIPM was unable to review <strong>{{rank}} {{fullName~}}’s</strong> history for the last five years
          because there was no officer
          disciplinary history available in the NOPD IAPro.
        </p>
        <br />
      {{/if}}
      {{#if (isEqual letterOfficer.officerHistoryOptionId 4)}}
        <p>
          The OIPM has reviewed <strong>{{rank}} {{fullName~}}'s</strong> disciplinary history for the last five years
          and has determined that the
          subject employee has the following significant/noteworthy number of complaints:</p>
        <ul>
          {{#if (sumAllegations letterOfficer)}}
            <li>
              {{{sumAllegations letterOfficer}}} total complaints including
              {{#if letterOfficer.numHistoricalHighAllegations}}
                {{letterOfficer.numHistoricalHighAllegations}} HIGH RISK allegations
                {{~#if letterOfficer.numHistoricalMedAllegations}}, {{~/if~}}
              {{/if}}
              {{#if letterOfficer.numHistoricalMedAllegations}}
                {{letterOfficer.numHistoricalMedAllegations}} MEDIUM RISK allegations
                {{~#if letterOfficer.numHistoricalLowAllegations}}, {{~/if~}}
              {{/if}}
              {{#if letterOfficer.numHistoricalLowAllegations}}
                {{letterOfficer.numHistoricalLowAllegations}} LOW RISK allegations
                {{~/if~}}.
            </li>
          {{/if}}
          {{#if (isPresent letterOfficer.historicalBehaviorNotes)}}
            <li>
              {{{renderHtml letterOfficer.historicalBehaviorNotes}}}
            </li>
          {{/if}}
          {{#each letterOfficer.referralLetterOfficerHistoryNotes}}
            <li>
              {{pibCaseNumber~}}
              {{#if pibCaseNumber~}}
                {{#if details~}}: {{/if}}
              {{/if}}
              {{{renderHtml details}}}
            </li>
          {{/each}}
        </ul>
        <p><br></p>
      {{/if}}
    {{/if}}
  {{/each}}

  {{#if (showRecommendedActions accusedOfficers)}}
    <p class="ql-align-center"><strong><u>Request for Review and Intervention</u></strong></p>
    <p><br></p>
    {{#each accusedOfficers}}
      {{#if letterOfficer}}
        {{#if letterOfficer.referralLetterOfficerRecommendedActions}}
          <p>In light of the seriousness of the allegations and/or <strong>{{rank}} {{fullName~}}'s</strong> complaint
            history, the OIPM requests that,
            pending the completion of this investigation, PIB review this officer’s history to ascertain if the accused
            officer should:</p>
          <ul>
            {{#each letterOfficer.referralLetterOfficerRecommendedActions}}
              <li>{{recommendedAction.description}}</li>
            {{/each}}
          </ul>
        {{/if}}
        {{#if (isPresent letterOfficer.recommendedActionNotes)}}
          <p class="preserve-white-space">{{letterOfficer.recommendedActionNotes}}</p>
          <p><br></p>
        {{/if}}
      {{/if}}
    {{/each}}
    <p><br></p>
  {{/if}}


  {{#if referralLetter.includeRetaliationConcerns}}
    <p class="ql-align-center"><strong><u>Retaliation Concerns and Request for Notice to Officer(s)</u></strong></p>
    <p><br></p>
    <p>Based on the information provided by the complainant, the OIPM is concerned about retaliation against the
      complainant.
      We request that once the accused officer(s) is made aware of this complaint that they be admonished in writing by
      their
      commanding officer(s) about retaliating against the Complainant, or from having others do so.</p>
    <p><br></p>
    <p><br></p>
  {{/if}}


  {{#if referralLetter.referralLetterIaproCorrections}}
    <p class="ql-align-center"><strong><u>IAPro Corrections</u></strong></p>
    {{#each referralLetter.referralLetterIaproCorrections}}
      <ul>
        <li>
          <p class="preserve-white-space">{{details}}</p>
        </li>
      </ul>
    {{/each}}
    <p><br></p>
  {{/if}}

  {{#if classification}}
    <p class="ql-align-center"><strong><u>Classification Recommendation</u></strong></p>
    <p><br></p>
    <p>The OIPM recommends that this complaint be classified as {{classification.initialism}}.</p>
    <p><br></p>
    <p><br></p>
  {{/if}}

  <p>I appreciate your prompt attention to this matter.
    Please acknowledge receipt of this complaint and provide the OIPM with a PIB #.
    Please contact Stella Cziment or Abe Lowe IV if you have any questions regarding this complaint.
  </p>
  <p><br></p>

</div>