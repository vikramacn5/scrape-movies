const googleTTS = require("google-tts-api"); // CommonJS

const url = googleTTS.getAudioUrl("Error in booking", {
  lang: "en",
  slow: false,
  host: "https://translate.google.com",
});
console.log(url);
