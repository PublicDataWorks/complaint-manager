# 8. Use ElasticSearch as our full-text search backend

Date: 2020-2-10

## Status

Accepted

## Context

We want to introduce search into our application so the users can find Complaints easily.

## Decision

ElasticSearch was an easy choice for our team because the client uses ElasticSearch on their other products. Also, after speaking to Andrew (Tech Principal at TW) who has years of experience in Search, he strongly recommended ES to us as well. We also liked the pricing on the managed cloud offerings from ES Cloud. Additionally, we had the another easy choice with the Node JS client offered by ElasticSearch as well.

Currently, we have decided to NOT make ElasticSearch our primary datastore and only use it as a tool to fulfill our search requirements. This will minimize the changes in the codebase and also us to learn more about ElasticSearch's capabilities before committing to it as our new datastore.

## Consequences

We were able to spin up an ES instance using Docker quickly and write up some scripts to build up an index from our Postgres DB. The current plan is to run this index building script at some frequency in the pipeline so as to minimize the changes to the codebase and avoid getting into Sequelize data change hooks (given also that our index should be quite small).