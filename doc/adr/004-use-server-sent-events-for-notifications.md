# 4. Use Server-Sent Events (SSE) for Push Notifications

Date: 2020-06-03

## Status

Accepted

## Context

We need a way to push messages from backend to React frontend in order to support notification functionality. 

We are looking for something that is relatively easy to setup. We would like the technology to handle disconnects and simplify retires. We want to ensure the security of any solution we select.       

## Decision

We decided to use [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events). 

## Consequences

We were able to implement a mechanism for sending real-time notifications to the React frontend using Server-Sent Events. We made our solution generic so that we can use this technology for other backend communication with the client like Broadcast Messages, etc.

One of the challenges we are currently facing with Server-Sent Events is the TCP connection limit that most browsers implements per origin. With the SSE solution we have an open connection for every tab/window where the frontend is loaded. This quickly adds up to the six (6) connection limit that most browsers enforce. 