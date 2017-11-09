# CarpetBase

## Getting Started

Most of the up and running for development consists of `npm install` followed by `npm run watch`. Database migrations are also a part of the build process. However, there is a set of environment variables required for the app:

* `CARPETBASE_PW`: Default password for the `admin` account (can be anything you wish).
* `CARPETBASE_DB`: Connection string for the MariaDB database credentials.
* `CARPETBASE_SECRET`: Secret used for signing the JWT (can be anything you wish).
