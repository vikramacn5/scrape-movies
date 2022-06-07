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

const isQrCodePage = async function (page) {
  await page.waitForSelector(SELECTORS.QRCODE_PAGE, { timeout: 0 });
  return false;
};

const isChatPage = async function (page) {
  await page.waitForFunction(SELECTORS.INSIDE_CHAT, { timeout: 0 });
  return true;
};

const authenticate = async function () {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir,
    args: [
      "--no-sandbox",
      // "--blink-settings=imagesEnabled=false"]
    ],
  });
  const page = await browser.newPage();

  // await page.setUserAgent(
  //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
  // );

  page.on("dialog", async (dialog) => {
    await dialog.accept();
  });

  await page.goto("https://web.whatsapp.com/");

  const isAuthenticated = await Promise.race([
    isQrCodePage(page),
    isChatPage(page),
  ]);

  // page.browser();

  await browser.close();

  if (isAuthenticated) {
    console.log("Logged in");
    return true;
  } else {
    console.log(
      "Please scan the QR code with your whatsapp app from your mobile to login"
    );

    let authBrowser;

    try {
      authBrowser = await puppeteer.launch({ headless: false, userDataDir });
      const authPage = await authBrowser.newPage();

      // await authPage.setUserAgent(
      //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
      // );

      await authPage.goto("https://web.whatsapp.com/");

      await authPage.waitForFunction(SELECTORS.INSIDE_CHAT, { timeout: 60000 });
      await authBrowser.close();
      console.log("Logged in");
      return true;
    } catch (err) {
      console.log(
        "Login failed \nPlease be faster next time while scanning.\n"
      );
      console.log("ERROR:", err.message);
      await authBrowser.close();
      return false;
    }
  }
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

// sendMessage(["+919677289976", "++919444152023"], "hello");

// (async () => {
//   if (await authenticate()) {
//     console.log("Logged in");
//     sendMessage(["+919677289976", "+919444152023"], "hello");
//   } else {
//     console.log("Login failed");
//   }
// })();

module.exports = {
  authenticate,
  sendMessage,
};

//--------------------------------------------------------//

// const delay = (sec) =>
//   new Promise((resolve, _) => setTimeout(() => resolve(), sec * 1000));

// const test1 = async function () {
//   await delay(2);
//   return "hi";
// };

// const test2 = async function () {
//   await delay(1);
//   return "bye";
// };

// (async () => {
//   const result = await Promise.race([test1(), test2()]);
//   console.log("😋😋😋😋😋", result);
// })();

//--------------------------------------------------------//
