// import { playAudioFile } from "audic";

// await playAudioFile("translate_tts.mp3");

// import Audic from "audic";

// const audic = new Audic("jazz.mp3");

// await audic.play();

const Audic = require("audic");

const audic = new Audic("ags.mp3");
audic.play();

setTimeout(() => {
  audic.destroy();
}, 10000);
