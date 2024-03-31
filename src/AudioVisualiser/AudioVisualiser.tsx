import { useEffect } from "react";
import "./AudioVisualiser.css";
import React from "react";
type AudioVisualiserProps = {
  data: FileList | [];
  type?: "circular" | "blocks";
  liquidStyle?: boolean;
  color?: "white" | "random";
  customColor?: string;
  fftSize?: 64 | 128 | 512 | 1024;
  height?: number;
  width?: number;
};
const AudioVisualiser = ({
  data,
  type = "blocks",
  liquidStyle = false,
  color = "random",
  customColor,
  fftSize = 512,
  height = window?.innerHeight / 2,
  width = window?.innerWidth,
}: AudioVisualiserProps) => {
  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas?.getContext("2d");
    if (data[0]) {
      const files = data?.[0];
      const audioContext = new AudioContext();
      const oldAudio = document.getElementById("audio") as HTMLAudioElement;

      // Remove event listener from old audio element
      const clonedAudio = oldAudio.cloneNode(true) as HTMLAudioElement;
      oldAudio.parentNode?.replaceChild(clonedAudio, oldAudio);

      const audio = document.getElementById("audio") as HTMLAudioElement;
      audio.src = URL.createObjectURL(files);
      audio.load();
      audio.play();

      let audioSrc: MediaElementAudioSourceNode | null = null;
      let analyser: AnalyserNode | null = null;

      if (!audioSrc) {
        audioSrc = audioContext.createMediaElementSource(audio);
        analyser = audioContext.createAnalyser();
        audioSrc.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = fftSize;
      }

      const bufferLength = analyser?.frequencyBinCount || 0;
      const dataArray = new Uint8Array(bufferLength);
      const barW = canvas.width;

      let barHeight: number;
      let x = 0;

      // eslint-disable-next-line no-inner-declarations
      function animate() {
        x = 0;
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        if (analyser) analyser.getByteFrequencyData(dataArray);
        if (type === "circular") {
          const barWidth = barW / bufferLength;

          drawCircleVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
        } else {
          const barWidth = barW / 2 / bufferLength;

          drawBlockVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
        }
        requestAnimationFrame(animate);
      }
      animate();

      // eslint-disable-next-line no-inner-declarations
      function drawCircleVisualiser(
        bufferLength: number,
        x: number,
        barWidth: number,
        barHeight: number,
        dataArray: Uint8Array | number[]
      ) {
        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] * 1.5;
          if (ctx) {
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((i * (Math.PI * 10)) / bufferLength);
            if (customColor) {
              ctx.fillStyle = customColor;
            } else if (color === "random") {
              const c = Math.random();
              const r = i * c * 4;
              const g = i * c * 1;
              const b = i * c * 2;
              ctx.fillStyle = `rgb(${r},${g},${b})`;
            } else if (color === "white") {
              ctx.fillStyle = color;
            }
            ctx.fillRect(0, 0, barWidth, barHeight);
            x += barWidth;
            ctx.restore();
          }
        }
      }

      // eslint-disable-next-line no-inner-declarations
      function drawBlockVisualiser(
        bufferLength: number,
        x: number,
        barWidth: number,
        barHeight: number,
        dataArray: Uint8Array | number[]
      ) {
        for (let i = 0; i < bufferLength - 2; i++) {
          if (ctx) {
            barHeight = dataArray[i] * 1.25;
            if (customColor) {
              ctx.fillStyle = customColor;
            } else if (color === "random") {
              const c = Math.random();
              const r = i * c * 4;
              const g = i * c * 1;
              const b = i * c * 2;
              ctx.fillStyle = `rgb(${r},${g},${b})`;
            } else if (color === "white") {
              ctx.fillStyle = color;
            }
            ctx.fillRect(
              canvas.width / 2 - x,
              canvas.height - barHeight,
              barWidth,
              barHeight
            );
            x += barWidth;
          }
        }
        for (let i = 2; i < bufferLength; i++) {
          if (ctx) {
            barHeight = dataArray[i] * 1.25;
            if (customColor) {
              ctx.fillStyle = customColor;
            } else if (color === "random") {
              const c = Math.random();
              const r = i * c * 4;
              const g = i * c * 1;
              const b = i * c * 2;
              ctx.fillStyle = `rgb(${r},${g},${b})`;
            } else if (color === "white") {
              ctx.fillStyle = color;
            }
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth;
          }
        }
      }
    }
  }, [data, type, fftSize, color, customColor, height, width]);

  return (
    <>
      <canvas
        id="canvas"
        className={liquidStyle ? "liquidStyle" : "canvas"}
      ></canvas>
    </>
  );
};

export default AudioVisualiser;
