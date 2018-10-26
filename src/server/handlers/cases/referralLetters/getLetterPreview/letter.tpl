<each>
  <p><strong>RE: Complaint Referral; IPM Complaint {{caseId}}</strong></p>
  <p><br></p>
  <p>Dear Deputy Superintendent Westbrook:</p>
  <p><br></p>
  <p>
      This is to inform you pursuant to New Orleans City Code Section 2-1121 (the Police Monitors Ordinance) that the
      Office of the Independent Police Monitor (IPM) has received a complaint of misconduct by an NOPD employee(s).
      The complainant related the following information to our office:
  </p>
  <p><br></p>
  <p><br></p>
  <p class="ql-align-center"><strong><u>Complaint Information</u></strong></p>
  <p><br></p>
  <p><strong><u>IPM Complaint #:</u></strong> {{caseId}}</p>
  <p>Date filed with IPM: {{{formatDate incidentDate}}}</p>
  <p><br></p>

  <p><strong><u>Complainant Information</u></strong></p>
  {{#each complainantCivilians}}
    {{#if (isPresent fullName)}}<p>Name: {{fullName}}</p>{{/if}}
    {{#if (isPresent raceEthnicity)}}<p>Race: {{raceEthnicity}}</p>{{/if}}
    {{#if (isPresent genderIdentity)}}<p>Sex: {{genderIdentity}}</p>{{/if}}
    {{#if (isPresent birthDate)}}<p>Date of Birth: {{{formatDate birthDate}}}</p>{{/if}}
    {{#if (isPresent (formatAddress address))}}<p>Address: {{{formatAddress address}}}</p>{{/if}}
    {{#if (isPresent phoneNumber)}}<p>Phone: {{{formatPhoneNumber phoneNumber}}}</p>{{/if}}
    {{#if (isPresent email)}}<p>Email: {{email}}</p>{{/if}}
    <p><br></p>
  {{/each}}
  {{#each complainantOfficers}}
    {{#if (isPresent fullName)}}<p>Name: {{fullName}}</p>{{/if}}
    {{#if (isPresent rank)}}<p>Rank: {{rank}}</p>{{/if}}
    {{#if (isPresent windowsUsername)}}<p>Employee ID: #{{windowsUsername}}</p>{{/if}}
    {{#if (isPresent race)}}<p>Race: {{race}}</p>{{/if}}
    {{#if (isPresent sex)}}<p>Sex: {{sex}}</p>{{/if}}
    {{#if (isPresent dob)}}<p>Date of Birth: {{{formatDate dob}}}</p>{{/if}}
    {{#if (isPresent supervisorFullName)}}<p>Supervisor (Employee ID): {{supervisorFullName}} (#{{supervisorWindowsUsername}})</p>{{/if}}
    {{#if (isPresent employeeType)}}<p>Employee Type: {{employeeType}}</p>{{/if}}
    {{#if (isPresent district)}}<p>District: {{district}}</p>{{/if}}
    {{#if (isPresent bureau)}}<p>Bureau: {{bureau}}</p>{{/if}}
    {{#if (isPresent workStatus)}}<p>Status: {{workStatus}}</p>{{/if}}
    {{#if (isPresent endDate)}}<p>End of Employment: {{{formatDate endDate}}}</p>{{/if}}
    <p><br></p>
  {{/each}}
  <p><br></p>

  <p><strong><u>Subject NOPD Employee(s) Information</u></strong></p>
  {{#each accusedOfficers}}
    {{#if (isPresent fullName)}}<p>Name: {{fullName}}</p>{{/if}}
    {{#if (isPresent rank)}}<p>Rank: {{rank}}</p>{{/if}}
    {{#if (isPresent windowsUsername)}}<p>Employee ID: #{{windowsUsername}}</p>{{/if}}
    {{#if (isPresent race)}}<p>Race: {{race}}</p>{{/if}}
    {{#if (isPresent sex)}}<p>Sex: {{sex}}</p>{{/if}}
    {{#if (isPresent dob)}}<p>Date of Birth: {{{formatDate dob}}}</p>{{/if}}
    {{#if (isPresent supervisorFullName)}}<p>Supervisor (Employee ID): {{supervisorFullName}} (#{{supervisorWindowsUsername}})</p>{{/if}}
    {{#if (isPresent employeeType)}}<p>Employee Type: {{employeeType}}</p>{{/if}}
    {{#if (isPresent district)}}<p>District: {{district}}</p>{{/if}}
    {{#if (isPresent bureau)}}<p>Bureau: {{bureau}}</p>{{/if}}
    {{#if (isPresent workStatus)}}<p>Status: {{workStatus}}</p>{{/if}}
    {{#if (isPresent endDate)}}<p>End of Employment: {{{formatDate endDate}}}</p>{{/if}}
    <p><br></p>
  {{/each}}

  {{#if witnessCivilians}}
    <p><br></p>
    <p><strong><u>Witnesses</u></strong></p>
  {{/if}}
  {{#each witnessCivilians}}
    {{#if (isPresent fullName)}}<p>Name: {{fullName}}</p>{{/if}}
    {{#if (isPresent phoneNumber)}}<p>Phone: {{{formatPhoneNumber phoneNumber}}}</p>{{/if}}
    {{#if (isPresent email)}}<p>Email: {{email}}</p>{{/if}}
    <p><br></p>
  {{/each}}
  {{#each witnessOfficers}}
    {{#if (isPresent fullName)}}<p>Name: {{fullName}}</p>{{/if}}
    {{#if (isPresent rank)}}<p>Rank: {{rank}}</p>{{/if}}
    {{#if (isPresent windowsUsername)}}<p>Employee ID: #{{windowsUsername}}</p>{{/if}}
    {{#if (isPresent race)}}<p>Race: {{race}}</p>{{/if}}
    {{#if (isPresent sex)}}<p>Sex: {{sex}}</p>{{/if}}
    {{#if (isPresent dob)}}<p>Date of Birth: {{{formatDate dob}}}</p>{{/if}}
    {{#if (isPresent supervisorFullName)}}<p>Supervisor (Employee ID): {{supervisorFullName}} (#{{supervisorWindowsUsername}})</p>{{/if}}
    {{#if (isPresent employeeType)}}<p>Employee Type: {{employeeType}}</p>{{/if}}
    {{#if (isPresent district)}}<p>District: {{district}}</p>{{/if}}
    {{#if (isPresent bureau)}}<p>Bureau: {{bureau}}</p>{{/if}}
    {{#if (isPresent workStatus)}}<p>Status: {{workStatus}}</p>{{/if}}
    {{#if (isPresent endDate)}}<p>End of Employment: {{{formatDate endDate}}}</p>{{/if}}
    <p><br></p>
  {{/each}}
  <p><br></p>
  <p><strong><u>Incident</u></strong></p>
  {{#if (isPresent incidentDate)}}<p>Date: {{{formatDate incidentDate}}}</p>{{/if}}
  {{#if (isPresent (formatAddress incidentLocation))}}<p>Location: {{{formatAddress incidentLocation}}}</p>{{/if}}
  {{#if (isPresent incidentTime)}}<p>Time: {{{formatTime incidentDate incidentTime}}}</p>{{/if}}

  <p><br></p>
  <p><br></p>
  <p class="ql-align-center"><strong><u>Initial Allegations/Concerns/Issues</u></strong></p>
  <p><br></p>
  {{#each accusedOfficers}}
    {{rank}} {{fullName}} is accused of the following violations:
      <ul>
        {{#each allegations}}
          <li>{{allegation.rule}}: {{allegation.paragraph}}: {{allegation.directive}}</li>
        {{/each}}
      </ul>
      <p><br></p>
  {{/each}}
  <p><br></p>
  <p class="preserve-white-space"><strong><u>Summary:</u></strong> {{narrativeSummary}}</p>
  <p><br></p>
  <p class="preserve-white-space"><strong><u>Detail:</u></strong> {{narrativeDetails}}</p>

  {{#if (showOfficerHistoryHeader accusedOfficers)}}
    <p><br></p>
    <p><br></p>
    <p class="ql-align-center"><strong><u>Complaint History</u></strong></p>
  {{/if}}
  {{#each accusedOfficers}}
    {{#if (showOfficerHistory referralLetterOfficer)}}
      <p>
        The IPM has reviewed <strong>{{rank}} {{fullName~}}'s</strong> disciplinary history for the last five years and has determined that the
        subject employee has the following significant/noteworthy number of complaints:</p>
      <ul>
        {{#if (sumAllegations referralLetterOfficer)}}
          <li>
            {{{sumAllegations referralLetterOfficer}}} total complaints including
            {{#if referralLetterOfficer.numHistoricalHighAllegations}}
              {{referralLetterOfficer.numHistoricalHighAllegations}} HIGH RISK allegations
              {{~#if referralLetterOfficer.numHistoricalMedAllegations}}, {{/if}}
            {{/if}}
            {{#if referralLetterOfficer.numHistoricalMedAllegations}}
              {{referralLetterOfficer.numHistoricalMedAllegations}} MEDIUM RISK allegations
              {{~#if referralLetterOfficer.numHistoricalLowAllegations}}, {{/if}}
            {{/if}}
            {{#if referralLetterOfficer.numHistoricalLowAllegations}}
              {{referralLetterOfficer.numHistoricalLowAllegations}} LOW RISK allegations
            {{~/if~}}.
          </li>
        {{/if}}
        {{#if (isPresent referralLetterOfficer.historicalBehaviorNotes)}}
        <li>
          {{{renderHtml referralLetterOfficer.historicalBehaviorNotes}}}
        </li>
        {{/if}}
        {{#each referralLetterOfficer.referralLetterOfficerHistoryNotes}}
        <li>
          {{pibCaseNumber~}}
          {{#if pibCaseNumber~}}
          {{#if details~}}: {{/if}}
          {{/if}}
          {{{renderHtml details}}}
        </li>
        {{/each}}
      </ul>
    {{/if}}
    <p><br></p>
  {{/each}}
  <p><br></p>
  <p class="ql-align-center"><strong><u>Request for Review and Intervention</u></strong></p>
  <p><br></p>
  {{#each accusedOfficers}}
    {{#if referralLetterOfficer.referralLetterOfficerRecommendedActions}}
      <p>In light of the seriousness of the allegations and/or <strong>{{rank}} {{fullName~}}'s</strong> complaint history, the IPM requests that,
      pending the completion of this investigation, PIB review this officer’s history to ascertain if the accused officer should:</p>
      <ul>
        {{#each referralLetterOfficer.referralLetterOfficerRecommendedActions}}
          <li>{{recommendedAction.description}}</li>
        {{/each}}
      </ul>
      <p class="preserve-white-space">{{referralLetterOfficer.recommendedActionNotes}}</p>
    {{/if}}
    <p><br></p>
    <p><br></p>
  {{/each}}

  {{#if referralLetter.includeRetaliationConcerns}}
    <p class="ql-align-center"><strong><u>Retaliation Concerns and Request for Notice to Officer(s)</u></strong></p>
    <p><br></p>
    <p>Based on the information provided by the complainant, the OIPM is concerned about retaliation against the complainant.
      We request that once the accused officer(s) is made aware of this complaint that they be admonished in writing by their
      commanding officer(s) about retaliating against the Complainant, or from having others do so.</p>
  {{/if}}
  <p><br></p>
  <p><br></p>

  {{#if referralLetter.referralLetterIAProCorrections}}
    <p class="ql-align-center"><strong><u>IAPro Corrections</u></strong></p>
    {{#each referralLetter.referralLetterIAProCorrections}}
      <ul>
        <li>
          <p class="preserve-white-space">{{details}}</p>
        </li>
      </ul>
    {{/each}}
    <p><br></p>
    <p><br></p>
  {{/if}}

  <p>I appreciate your prompt attention to this matter. Please contact me if you have any questions.</p>
  <p><br></p>

</div>