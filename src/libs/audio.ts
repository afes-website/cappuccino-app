import successMp3 from "assets/sounds/success.mp3";
import errorMp3 from "assets/sounds/error.mp3";

export const successAudio = new Audio(successMp3);
export const errorAudio = new Audio(errorMp3);

let initialized = false;

const init = (): void => {
  if (!initialized) {
    [successAudio, errorAudio].forEach((audio) => {
      audio.play();
      audio.pause();
    });
    initialized = true;
  }
};

document.documentElement.addEventListener("click", init);
