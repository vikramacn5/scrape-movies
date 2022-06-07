const puppeteer = require("puppeteer");

const delay = (sec) =>
  new Promise((resolve, _) => setTimeout(() => resolve(), sec * 1000));

const userDataDir = "C:\\Users\\vikram\\AppData\\Local\\Chromium\\User Data";

const SELECTORS = {
  LOADING: "progress",
  INSIDE_CHAT: "document.getElementsByClassName('two')[0]",
  QRCODE_PAGE: "body > div > div > .landing-wrapper",
  QRCODE_DATA: "div[data-ref]",
  QRCODE_DATA_ATTR: "data-ref",
  SEND_BUTTON: "div:nth-child(2) > button > span[data-icon='send']",
};

const sendMessage = async function (phones, message) {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir,
    args: [
      "--no-sandbox",
      // "--blink-settings=imagesEnabled=false"]
    ],
  });
  const page = await browser.newPage();
  page.on("dialog", async (dialog) => {
    await dialog.accept();
  });

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
  );

  for (const phone of phones) {
    try {
      await page.goto(
        `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
          message
        )}`
      );

      await page.waitForSelector(SELECTORS.LOADING, {
        hidden: true,
        timeout: 60000,
      });

      await delay(1);

      // await page.evaluate((SELECTORS) => {
      //   document.querySelector(SELECTORS.SEND_BUTTON).click();
      // }, SELECTORS);

      await page.screenshot({ path: "screenshot.png" });

      await page.waitForSelector(SELECTORS.SEND_BUTTON, { timeout: 5000 });

      await delay(1);

      await page.click(SELECTORS.SEND_BUTTON);
      // await page.keyboard.press("Enter");
      // await page.waitFor(1000);
      await delay(2);
      console.log(`${phone} Sent\n`);
    } catch (err) {
      console.log();
      console.log("ERROR: ", err.message);
      console.log(`${phone} failed\n`);
    }
  }

  await browser.close();
};

const phones = process.argv[2].split(",");
const message = process.argv.at(-1);

console.log(phones, message);

// (async () => {
//   // const browser = await puppeteer.launch({ headless: false });

//   setTimeout(async () => {
//     console.log("sending message...");
//     // await browser.close();
//   }, 10000);
// })();

sendMessage(phones, message);
