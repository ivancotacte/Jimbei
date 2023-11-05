const fs = require("fs");
const path = require("path");
const login = require("fca-project-orion");
const cronSchedules = require("./cron");
const config = require("./config");

const appStateFile = "./appstate.json";

const proxy = {
  protocol: "https",
  host: "158.62.27.226",
  port: 8191,
  type: "https",
  anonymityLevel: "elite",
  country: "PH",
  city: "Pasig",
  hostname: "158.62.27.226",
};

const local = {
  timezone: "Asia/Manila",
  region: "ph",
  headers: {
    "X-Facebook-Locale": "en_US",
    "X-Facebook-Timezone": "Asia/Manila",
    "X-Fb-Connection-Quality": "EXCELLENT",
  },
};

async function listen(orion) {
  try {
    const appStatePath = path.join(__dirname, appStateFile);
    const credentials = JSON.parse(fs.readFileSync(appStatePath, "utf8"));
    login(
      { appState: credentials, proxy: proxy, local: local },
      async (err, api) => {
        cronSchedules(api);

        try {
          if (err) return console.error(err);
          api.setOptions({
            forceLogin: true,
            listenEvents: true,
            autoMarkDelivery: false,
            autoMarkRead: false,
            logLevel: "silent",
            selfListen: true,
            online: true
          });
          api.listenMqtt((err, event) => {
            if (err) return console.error(err);
            orion(api, event);
          });
        } catch (err) {
          if (!!err.errorSummary) {
            console.log(err.errorSummary);
          } else {
            console.log(err);
          }
        }
      },
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = { listen };