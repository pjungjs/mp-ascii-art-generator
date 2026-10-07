import { useState, useEffect, useRef } from "react";

const asciiGraySequence = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. ';
const asciiGrayLength = asciiGraySequence.length;

//the ascii art is never wider than this many characters, so big photos do not freeze the page.
const MAX_COLUMNS = 200;
//a character is about 0.6 times as wide as it is tall, so rows are scaled by it to keep the image's proportions.
const CHAR_ASPECT_RATIO = 0.6;

function convertToGrayScales(context, width, height) {
  const imageData = context.getImageData(0, 0, width, height);

  const grayScales = [];

  for (let i = 0 ; i < imageData.data.length ; i += 4) {
    //get each pixels in the imageData.data. It is a one-dimensional array.
    //each pixel being splitted into its four components: Red, Green, Blue, and Alpha (for transparency).
    //get only RGB values and convert them to grayscale, then move up 4 indexes to repeate the process.
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];

    const grayScale = toGrayScale(r, g, b);

    //chained assignment:
    imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = grayScale;
    

    grayScales.push(grayScale);
  }

  context.putImageData(imageData, 0, 0);

  return grayScales;
};

//the formula for GrayScale adapted to the Human eyes.
function toGrayScale(r, g, b) {
  return 0.21 * r + 0.72 * g + 0.07 * b;
}

//to convert the gray image to an ascii art
function convertToAscii(grayScales, width) {
  return grayScales.reduce((accumulator, currentValue, index) => {
    let nextChars = getCharacterForGrayScale(currentValue);
    if ((index + 1) % width === 0) {
      nextChars += '\n';
    }
    return accumulator + nextChars;
  }, '');
}

//to translate the each pixel given to an ascii character.
function getCharacterForGrayScale(grayScale) {
  return asciiGraySequence[Math.ceil((asciiGrayLength - 1) * grayScale / 255)];
}

function Canvas({ newImg }) {
  const [asciiArt, setAsciiArt] = useState(""); //converted to Ascii art (string).

  const canvasRef = useRef();

  //only runs when a new image is uploaded.
  useEffect(() => {
    if (!newImg) {
      setAsciiArt("");
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { willReadFrequently: true });

    //ignore the result if another image was uploaded before this one finished loading.
    let cancelled = false;

    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new Image();
      image.onload = () => {
        if (cancelled) return;

        //shrink the image to one pixel per character (never enlarge it).
        const columns = Math.min(image.width, MAX_COLUMNS);
        const rows = Math.max(1, Math.round(image.height * (columns / image.width) * CHAR_ASPECT_RATIO));
        canvas.width = columns;
        canvas.height = rows;

        //transparent pixels would be read as black, so paint a white background first.
        context.fillStyle = "#fff";
        context.fillRect(0, 0, columns, rows);
        context.drawImage(image, 0, 0, columns, rows);
        const grayScales = convertToGrayScales(context, columns, rows);

        setAsciiArt(convertToAscii(grayScales, columns));
      }
      //e.g.: the file is not a valid image.
      image.onerror = () => {
        if (!cancelled) alert("That file could not be read as an image. Please try another one.");
      }
      image.src = event.target.result;
    }
    reader.readAsDataURL(newImg);

    //e.g.: the file was not found or not readable.
    reader.onerror = () => {
      console.log(`file "${newImg.name}" error: ${reader.error}`);
      return alert("Something went wrong! Please try again later.");
    }

    return () => {
      cancelled = true;
    };
  }, [newImg]);

  return (
    <>
      <br/>
      <div className="preview">
        <canvas
          ref={canvasRef}
          style={{ display: "none" }}
        />
      </div>
      <div className="art">
        {/* "pre" tag represents preformatted text which is to be presented exactly as written in the HTML file. */}
        <pre>{asciiArt}</pre>
      </div>
      <br/>
      <br/>
    </>
  );
};

export default Canvas;
