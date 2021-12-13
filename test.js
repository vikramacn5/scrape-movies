import * as googleTTS from "google-tts-api"; // CommonJS

const url = googleTTS.getAudioUrl("Booking started in AGS", {
  lang: "en",
  slow: false,
  host: "https://translate.google.com",
});
console.log(url);
