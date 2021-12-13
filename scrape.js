const puppeteer = require("puppeteer");

const scrapeMovie = async function ({ browser, url, movieName, selector }) {
  // console.log(url, movieName, selector);
  const page = await browser.newPage();
  await page.goto(url);

  // const findSpiderAgs = function (seconds) {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(async () => {
  //       const movieList = await page.evaluate(() => {
  //         return Array.from(
  //           document.querySelectorAll(".col-md-3.movieDivId"),
  //           (movie) => movie.title
  //         );
  //       });

  //       const result = movieList.filter((movie) =>
  //         movie.toLowerCase().includes("akha")
  //       );
  //       resolve(result);
  //     }, seconds * 1000);
  //   });
  // };

  const findMovie = function (seconds) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const movieList = await page.evaluate((selector) => {
          return Array.from(
            document.querySelectorAll(selector),
            (movie) => movie.title
          );
        }, selector);

        // console.log(movieList);
        const result = movieList.filter((movie) =>
          movie.toLowerCase().includes(movieName)
        );
        resolve(result);
      }, seconds * 1000);
    });
  };

  // const resultAgs = await findSpiderAgs(2);

  const result = await findMovie(2);
  // console.log(result);

  // await browser.close();
  return result[0] ? true : false;
};

const getResult = async () => {
  const browser = await puppeteer.launch();
  const movieName = "spider";

  const resultJazz = await scrapeMovie({
    browser,
    url: "https://www.jazzcinemas.com/",
    movieName,
    selector: ".nowshowing h5",
  });
  console.log(resultJazz);

  const resultAgs = await scrapeMovie({
    browser,
    url: "https://www.agscinemas.com/",
    movieName,
    selector: ".col-md-3.movieDivId",
  });
  console.log(resultAgs);

  browser.close();
};

(() => {
  console.log("scraping...");
  console.log(
    `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
  );
  getResult();
  setInterval(() => {
    console.log("scraping...");
    console.log(
      `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
    );
    getResult();
  }, 1 * 60 * 1000);
})();

// scrapeMovie("https://www.jazzcinemas.com/");
// scrapeMovie("https://www.agscinemas.com/");
// scrapeMovie("https://mark4.netlify.app/");
// scrapeMovie("https://news.ycombinator.com/");
