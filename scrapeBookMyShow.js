const puppeteer = require("puppeteer");
const Audic = require("audic");

const intervalId = setInterval(async () => {
  console.log("scraping...");
  console.log(
    `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
  );
  if ((await getResult()) === true) {
    clearInterval(intervalId);
  }
}, 1 * 60 * 1000);

const site =
  "https://in.bookmyshow.com/buytickets/beast-chennai/movie-chen-ET00311733-MT/20220413";
