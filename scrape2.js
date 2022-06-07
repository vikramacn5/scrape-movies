const puppeteer = require("puppeteer");
const Audic = require("audic");
const wbm = require("./wbm2");
const { spawn } = require("node:child_process");

//------------------- WHATSAPP SPECIFICS -----------------//
const notifyByWhatsApp = true;
const phones = ["+919677289976", "+918667250134"];

const sendWhatsappMessage = function (message) {
  const test = spawn("node", ["./sendMessage.js", phones.join(), message], {
    detached: true,
  });

  test.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });
  test.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
  });
  test.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
};
//------------------- WHATSAPP SPECIFICS -----------------//

const movieName = "vikram";

const jazz = {
  name: "jazz",
  url: "https://www.jazzcinemas.com/",
  selector: ".nowshowing h5",
  audioFile: "jazz.mp3",
};
const bookMyShowJazz = {
  name: "book my show Jazz",
  url: "https://in.bookmyshow.com/chennai/cinemas/luxe-cinemas-chennai/JACM/20220608",
  selector: ".nameSpan",
  audioFile: "jazz.mp3",
};
const ags = {};

const cinemas = [jazz, bookMyShowJazz];

const delay = (sec) =>
  new Promise((resolve, reject) => setTimeout(() => resolve(), sec * 1000));

const playAudio = async (audioFile) => {
  try {
    const audio = new Audic(audioFile);
    await audio.play();
  } catch (err) {
    throw new Error("Error with playing audio:", err.message);
  }
};

const scrapeMovie = async function (page, url, selector) {
  try {
    await page.goto(url);

    await delay(2);

    const movieList = await page.evaluate((selector) => {
      return Array.from(document.querySelectorAll(selector), (movie) =>
        movie.textContent.toLowerCase().trim()
      );
    }, selector);

    console.log(movieList);
    if (movieList.length <= 0) {
      throw new error("List empty");
    }
    return movieList;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getResult = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let result = false;

  for (const cinema of cinemas) {
    try {
      console.log("scraping", cinema.name);
      const moviesList = await scrapeMovie(page, cinema.url, cinema.selector);

      if (moviesList.includes(movieName)) {
        console.log(true, "Booking started in", cinema.name);
        result = true;
        await playAudio(cinema.audioFile);

        if (notifyByWhatsApp) {
          sendWhatsappMessage(
            `Booking for ${movieName} started in ${cinema.name}`
          );
        }

        break;
      } else {
        console.log(false);
      }
    } catch (err) {
      console.log(err.message);
      result = true;
      const errAudio = new Audic("error.mp3");
      await errAudio.play();
      break;
    }
  }

  // console.log("closing");
  await browser.close();
  return result;
};

// console.log(getResult());

const init = async function () {
  if (notifyByWhatsApp) {
    const isLoggedIn = await wbm.authenticate();
    if (!isLoggedIn) {
      return;
    }
  }
  const timeInterval = 1 * 60 * 1000;
  const scrapeInterval = setInterval(async () => {
    console.log("scraped at", new Date().toTimeString());
    if (await getResult()) {
      clearInterval(scrapeInterval);
    }
  }, timeInterval);
};

init();
