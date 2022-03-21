# EC Backup (easy-backup)

If you need a system easy to use that provides you a periodic (or at specific time) backup. This is your package.

## Requirements

Right now this package is tested only on Ubuntu 20.04 LTS and you need to have the following packages in order to work:

- zip: `sudo apt install zip`
- [Mongo Database Tools](https://docs.mongodb.com/database-tools/installation/installation/) (only in case that your backup is from MongoDB)
  - Tested version: `100.5.2`

## Config

Configuration is split in 3 steps:

- **Backup engine**: what kind of data source we will backup
  - `mongo`: backup your database from MongoDB
  - `file`: choose files from your system to backup
- **Notificator**: how do you want to be notified
  - `telegram`: uses a channel and a bot to notify all your backups
  - `console`: just print to console
- **Uploader**: where we put your fresh backup
  - `gcp`: Google Cloud Storage
  - `file`: drop it somewhere in your system (_soon_)

### Skeleton

Use following examples (backup engines, notificator, uploader) to make your own config file, here is the skeleton:

```json
{
   "cron": "* * * * * *", // Cron schedule expression (https://crontab.guru)
   "outputDir": "/tmp", // Temporary folder to store your backup until upload
   "engine": { ... }// Backup engine config,
   "notificator": { ... }// Notificator config,
   "uploader": { ... }// Uploader config
}
```

### Backup engines

#### mongo

```json
{
  "type": "mongo",
  "databaseHost": "", // Host name of your MongoDB
  "databasePort": 27017, // [Optional] Database port. Defaults to 27017
  "databaseName": "",
  "username": "" // [Optional] In case that your DDBB needs auth
  "password": "" // [Optional]
}
```

#### file

```json
{
  "type": "file",
  "path": "" // Path to drop out the zipped backup
}
```

### Notificator

#### Telegram

```json
{
  "type": "telegram",
  "chatId": "", // ID of the chat where you want to be notified
  "botToken": "" // Token ID (without "bot" prefix in case that have) (https://core.telegram.org/bots)
}
```

Note: You can obtain the chatId from this URL: [https://api.telegram.org/bot<putYourToken>/getUpdates](https://api.telegram.org/bot<putYourToken>/getUpdates). Substitute `<putYourToken>` with your bot token

#### Console

```json
{
  "type": "console"
}
```

### Uploader

#### Google Cloud Storage

```json
{
  "type": "gcp",
  "storageKeyPath": "", // JSON Key file that authenticate your program on GCP
  "backupsFolderPath": "", // [Optional] Name of the folder inside the bucket to put the backup. Defaults to "backups"
  "bucketName": "",
  "projectId": ""
}
```