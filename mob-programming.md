# Mob Programming

## Concepts

Inspired by [Remote Mob Programming](https://drive.google.com/file/d/1PtqHeslDyzanGdf9aPvVOSj3mXGBYUVH/edit).

During the Mob Programming session there are two roles and the rest of the group:
* **Facilitator**: Person who is facilitating the session.
* **Typist**: Person who is coding.
* **Mob**: People who are participating in the discussion and waiting for their turn 
to be a typist. 

Everyone should participate in the discussion and rotate as a typist.

To facilitate the quick change of typist, we are using the concept of 
[Git Handover](https://docs.google.com/document/d/1EEXIIAtC0iVibVW01My5UocekOZKI-4TopjcnhnN_9U/edit#heading=h.pmizjeohkm9w), where it is not necessary 
that the code is ready or that the tests are green to send the code to the remote repository.
To run Git Handover we are using the [mob-session.sh](mob-session.sh) script.

## How it works?
##### Facilitator Responsibilities
* Ask for the audience the next steps, make them get into one agreement and guide the typist. 
* Guide the group in the solution asking questions and making suggestions.
* Reinforce the typist to not code by themself, but only what was agreed.
* Create a list of participants to rotate as next typist and share with the entire group.
* Control the time to change the typist.
* Keep track of who wants to speak and encourage everyone to speak.

##### typist Responsibilities
* Write the code on their machine.
* Wait for the entire group to agree on the solution before writing the code.

##### Mob Responsibilities
* Discuss the idea being coded and guide the typist in creating the code.

##### General Tips
* The facilitator can start as the first typist while still facilitating the discussion.
* When rotating, start the timer when the next typist has all the code in their machine.
* Use chat/visual signs to see who wants to speak.

## Coding
It's up to the participants where exactly they want to start.
The facilitator can check for practices like TDD, maintaining package separation,
moving through the app, etc.

During the development the facilitator may need to pause the mob session to talk 
more about topics, try to give enough information to move forward with enough 
understanding of what's going on and put them in the parking lot.