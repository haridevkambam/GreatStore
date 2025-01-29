import cron from "cron";
import https from "https";

const URL = "https://greatstore.onrender.com"

const job = new cron.CronJob('*/14 * * * *', function() {
    https.get(URL, (res) => {
        if(res.statusCode === 200) {
            console.log("GET request sent successfully");
        }
        else {
            console.log("GET request failed", res.statusCode);
        }
    }).on("error", (err) => {
        console.log("Error in GET request", err);
    })
})

export default job;