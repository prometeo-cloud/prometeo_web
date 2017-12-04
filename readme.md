Introduction
=

This is an early release Spring boot port of the PAMMM quickstart.  It replaces the Play server with Server with spring boot.  However, the architecture and code structure still holds (endpoint->domain->dal).  Further documentation will be added at a later date.

Getting Started
-

Instruction below are meant for developers (i.e. no packaging):

<h3>Prerequisite</h3>
You will need the following installed:

- maven
- DB (h2 or mysql)
- Java 8
- Intellij IDE

<h3>Running the App </h3>
- Start DB and run the DB scripts (default schema is PAMM - you will need to create this)
- Start Intellij and import the project as maven
- Run samm/SammApplication (in src/main/samm), the server should start on port 8080
 



 