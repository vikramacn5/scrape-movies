// const puppeteer = require("puppeteer");

// const test = async function () {
//   try {
//     const browser = await puppeteer.launch({
//       headless: false,
//       executablePath:
//         "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
//     });
//     const page = await browser.newPage();

//     await page.goto("https://web.whatsapp.com");

//     // const firstResult = await page.waitForSelector("div[data-ref]", {
//     //   timeout: 60000,
//     // });
//     // console.log(firstResult);
//   } catch (err) {
//     console.error("error", err.message);
//   }

//   // await browser.close();
//   process.stdout.write("hi");
// };

// test();

const delay = (sec) =>
  new Promise((resolve, _) => setTimeout(() => resolve(), sec * 1000));

const wbm = require("./wbm");

(async () => {
  await wbm
    .start({ showBrowser: false })
    .then(async () => {
      const phones = ["+919677289976"];
      const message = "hello.";
      await wbm.send(phones, message);
      await delay(3);
      await wbm.end();
    })
    .catch((err) => console.log(err));
})();
