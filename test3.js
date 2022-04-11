const promiseTest = function (number) {
  return new Promise((resolve, reject) => {
    if (number) {
      resolve(number);
    } else {
      reject(new Error("wrong number"));
    }
  });
};

(async () => {
  try {
    const result = await promiseTest(0);
    console.log(result);
  } catch (err) {
    console.log(err.message);
  }
})();
