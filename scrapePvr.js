const puppeteer = require("puppeteer");
const Audic = require("audic");

const foundMovie = async () => {
  const movieName = "beast";
  let finalList;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.pvrcinemas.com/nowshowing");

  const getMovieList = () => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const list = await page.evaluate(async () => {
          const timeoutPromise = (time, codeToExecute) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                codeToExecute ? resolve(codeToExecute()) : resolve();
              }, time * 1000);
            });

          const openModal = async () => {
            document
              .querySelector(
                ".form-element.location-element .ui-button-icon-left"
              )
              .click();
            await timeoutPromise(1);
          };

          const selectCity = async () => {
            document
              .querySelector(".citiesbox")
              .querySelector(".nav")
              .querySelectorAll("p")[3]
              .click();

            await timeoutPromise(1);
          };
          if (
            !document.querySelector("body").classList.contains("modal-open")
          ) {
            await openModal();
            await selectCity();
          } else {
            await selectCity();
            await openModal();
            await selectCity();
          }

          const scrollToEnd = async function () {
            let initialPageHeight = document.body.scrollHeight;

            while (true) {
              window.scrollTo(0, document.body.scrollHeight);
              await timeoutPromise(2);
              const pageHeightAfterScroll = document.body.scrollHeight;
              if (initialPageHeight === pageHeightAfterScroll) {
                break;
              } else {
                initialPageHeight = pageHeightAfterScroll;
              }
            }
          };

          await scrollToEnd();
          const movieList = await timeoutPromise(1, () => {
            return Array.from(
              document.querySelectorAll(".m-title"),
              (movie) => movie.textContent
            );
          });
          return movieList;
        });

        console.log(list);
        if (!list.length) {
          reject(new Error("no result"));
        }
        finalList = list.filter(
          (movie) =>
            movie.toLowerCase().trim().includes(movieName) &&
            !movie.toLowerCase().trim().includes("beasts")
        );
        resolve(finalList);
      }, 6000);
    });
  };

  try {
    const movieList = await getMovieList();
    console.log("movieList", movieList);

    console.log(movieList.length > 0);

    if (movieList.length > 0) {
      const audic = new Audic("pvr.mp3");
      audic.play();
      await browser.close();
      return true;
    }
  } catch (err) {
    console.log("no result");
    const audic = new Audic("error.mp3");
    audic.play();
    await browser.close();
    return false;
  }

  await browser.close();
};

// foundMovie();

const intervalId = setInterval(async () => {
  console.log("scraping for PVR...");
  console.log(
    `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
  );
  if (await foundMovie()) {
    clearInterval(intervalId);
  }
}, 1 * 60 * 1000);
