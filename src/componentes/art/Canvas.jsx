import { useState, useEffect, useMemo } from "react";

const asciiGraySequence = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. ';
const asciiGrayLength = asciiGraySequence.length;

//the ascii art is never wider than this many characters, so big photos do not freeze the page.
const MAX_COLUMNS = 200;
//a character is about 0.6 times as wide as it is tall, so rows are scaled by it to keep the image's proportions.
const CHAR_ASPECT_RATIO = 0.6;

//the formula for GrayScale adapted to the Human eyes.
function toGrayScale(r, g, b) {
  return 0.21 * r + 0.72 * g + 0.07 * b;
}

//to translate the each pixel given to an ascii character.
function getCharacterForGrayScale(grayScale) {
  return asciiGraySequence[Math.ceil((asciiGrayLength - 1) * grayScale / 255)];
}

//shrinks the image to one pixel per character on an offscreen canvas and converts it to an ascii art (string).
function convertToAscii(image, columns) {
  const rows = Math.max(1, Math.round(image.height * (columns / image.width) * CHAR_ASPECT_RATIO));

  const canvas = document.createElement("canvas");
  canvas.width = columns;
  canvas.height = rows;
  const context = canvas.getContext('2d', { willReadFrequently: true });

  //transparent pixels would be read as black, so paint a white background first.
  context.fillStyle = "#fff";
  context.fillRect(0, 0, columns, rows);
  context.drawImage(image, 0, 0, columns, rows);

  //imageData.data is a one-dimensional array: each pixel is split into its four components: Red, Green, Blue, and Alpha.
  const { data } = context.getImageData(0, 0, columns, rows);

  const lines = [];
  for (let y = 0; y < rows; y++) {
    let line = "";
    for (let x = 0; x < columns; x++) {
      const i = (y * columns + x) * 4;
      line += getCharacterForGrayScale(toGrayScale(data[i], data[i + 1], data[i + 2]));
    }
    lines.push(line);
  }

  return lines.join("\n");
}

function Canvas({ imgUrl }) {
  const [image, setImage] = useState(null); //the decoded image. it is only decoded once per upload.
  const [error, setError] = useState("");

  //decode the image once when a new one is uploaded.
  useEffect(() => {
    setImage(null);
    setError("");
    if (!imgUrl) return;

    //ignore the result if another image was uploaded before this one finished loading.
    let cancelled = false;

    const img = new Image();
    img.onload = () => {
      if (!cancelled) setImage(img);
    };
    //e.g.: the file is not a valid image.
    img.onerror = () => {
      if (!cancelled) setError("That file could not be read as an image. Please try another one.");
    };
    img.src = imgUrl;

    return () => {
      cancelled = true;
    };
  }, [imgUrl]);

  //never enlarge the image: a small picture has fewer characters available.
  const columns = image ? Math.min(image.width, MAX_COLUMNS) : MAX_COLUMNS;
  const asciiArt = useMemo(() => (image ? convertToAscii(image, columns) : ""), [image, columns]);

  return (
    <>
      <br/>
      {error && <p className="error" role="alert">{error}</p>}
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
