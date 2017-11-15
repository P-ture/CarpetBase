# CarpetBase

## Getting Started

Most of the up and running for development consists of `npm install` followed by `npm run watch`. Database migrations are also a part of the build process. However, there is a set of environment variables required for the app:

* `CARPETBASE_PW`: Default password for the `admin` account (can be anything you wish).
* `CARPETBASE_DB`: Connection string for the MariaDB database credentials.
* `CARPETBASE_SECRET`: Secret used for signing the JWT (can be anything you wish).
* `CARPETBASE_SMTP_KEY`: API key for [Mailgun](https://www.mailgun.com) which is used to send e-mails via their SMTP.
* `CARPETBASE_EMAIL`: E-mail address that will be used to send e-mails to &ndash; must be whitelisted in Mailgun.

## Components

Each component can have a the following additional non-standard `static` properties/functions:

* `fetchData`: Yields a `Promise` which is used to populate the Redux store with data;
* `requiresAuth` Boolean of whether or not the page requires JWT authentication.
* `cssDocuments` An array of CSS documents to load for a particular route.
