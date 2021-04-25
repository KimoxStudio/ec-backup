# MongoDB ➡️ Google Cloud Storage (for now)

## What kind of problem resolves?

In case that you have MongoDB, Google Cloud Storage as your main cloud storage system, and you want automatic backups, this is your place.

## How to use

It's pretty simple

- Clone this repository into some static place in order to execute the cron
  - `git clone git@github.com:KimoxStudio/mongo-to-gcs-backup.git`
- Add the environment variables needed to work
  - see section below and `.env.example` file for more info
- Install dependencies with `yarn`
- Then `yarn pm2`
  - This will generate a daemon that execute cron in background

## Features

- Cron
- Send telegram notifications in case of success or error
- Fully configurable

## TODO

- Add user and password mongodb auth
- Add other cloud providers (¿S3?)
- Add other notification providers (¿Slack?)

### Environment variables

#### `GCP_STORAGE_KEY_PATH`

This key will authenticate the process against Google Cloud Storage to upload the backup

#### `GCP_BACKUPS_FOLDER_PATH`

Directory where backups will be placed into GCP.

Default: `backups`

#### `GCP_BUCKET_NAME`

Name of the bucket where backups will be upload

#### `GCP_PROJECT_ID`

ID of your Google Cloud Project

#### `DATABASE_NAME`

Database name where to extract backup

#### `DATABASE_HOST`

Host name of your MongoDB

#### `CRON_SCHEDULE_TIME`

Cron schedule time configuration. Here you can config your own: [crontab.guru](https://crontab.guru/#59_23_*_*_*)

Default: `59 23 * * *`

#### `TELEGRAM_BOT_TOKEN`

Token of your telegram bot. Here you can obtain your own [https://core.telegram.org/bots](https://core.telegram.org/bots)

#### `TELEGRAM_CHAT_ID`

Chat ID where the message will be sent. To get this value you have to make a GET request to this URL: [https://api.telegram.org/bot<putYourToken>/getUpdates](https://api.telegram.org/bot<putYourToken>/getUpdates)

Substitute `<putYourToken>` with your bot token
