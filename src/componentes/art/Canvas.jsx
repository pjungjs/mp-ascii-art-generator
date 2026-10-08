import { useState, useEffect, useMemo, useDeferredValue } from "react";

const asciiGraySequence = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. ';
const asciiGrayLength = asciiGraySequence.length;

//zoom = how many characters wide the ascii art is. more characters means more detail.
const MIN_ZOOM = 40;
const MAX_ZOOM = 800;
const ZOOM_STEP = 10;
const DEFAULT_ZOOM = 150;

//a character cell (the letter plus the spacing of its line) is about 0.5 times as wide as it is tall in most editors and
//terminals, so rows are scaled by it to keep the image's proportions when the text is pasted there.
const CHAR_ASPECT_RATIO = 0.5;

//the formula for GrayScale adapted to the Human eyes.
function toGrayScale(r, g, b) {
  return 0.21 * r + 0.72 * g + 0.07 * b;
}

//to translate the each pixel given to an ascii character.
//the list goes from dense characters (dark) to light ones (bright). inverted flips it, for light text on a dark background.
function getCharacterForGrayScale(grayScale, inverted) {
  const index = Math.ceil((asciiGrayLength - 1) * grayScale / 255);
  return asciiGraySequence[inverted ? asciiGrayLength - 1 - index : index];
}

//shrinks the image to one pixel per character on an offscreen canvas and converts it to an ascii art (string).
function convertToAscii(image, columns, inverted) {
  const rows = Math.max(1, Math.round(image.height * (columns / image.width) * CHAR_ASPECT_RATIO));

  const canvas = document.createElement("canvas");
  canvas.width = columns;
  canvas.height = rows;
  const context = canvas.getContext('2d', { willReadFrequently: true });

  //transparent pixels would be read as black, so paint the frame's background color first.
  context.fillStyle = inverted ? "#000" : "#fff";
  context.fillRect(0, 0, columns, rows);
  context.drawImage(image, 0, 0, columns, rows);

  //imageData.data is a one-dimensional array: each pixel is split into its four components: Red, Green, Blue, and Alpha.
  const { data } = context.getImageData(0, 0, columns, rows);

  const lines = [];
  for (let y = 0; y < rows; y++) {
    let line = "";
    for (let x = 0; x < columns; x++) {
      const i = (y * columns + x) * 4;
      line += getCharacterForGrayScale(toGrayScale(data[i], data[i + 1], data[i + 2]), inverted);
    }
    lines.push(line);
  }

  return lines.join("\n");
}

function Canvas({ imgUrl }) {
  const [image, setImage] = useState(null); //the decoded image. it is only decoded once per upload.
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [inverted, setInverted] = useState(false); //light text on a dark frame, for pictures with dark backgrounds.
  const [copyStatus, setCopyStatus] = useState("");

  //keeps the slider smooth: the ascii art catches up when the browser is free.
  const deferredZoom = useDeferredValue(zoom);

  //decode the image once when a new one is uploaded. moving the slider only redraws it.
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
  //the slider stops at the picture's own width: more characters than pixels would add no detail.
  const maxZoom = image ? Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, image.width)) : MAX_ZOOM;
  const columns = image ? Math.min(deferredZoom, image.width) : deferredZoom;
  const asciiArt = useMemo(() => (image ? convertToAscii(image, columns, inverted) : ""), [image, columns, inverted]);

  //clear the "Copied!" message after a moment.
  useEffect(() => {
    if (!copyStatus) return;
    const timer = setTimeout(() => setCopyStatus(""), 2000);
    return () => clearTimeout(timer);
  }, [copyStatus]);

  async function handleCopy() {
    try {
      //trailing spaces are invisible and some apps mangle them, so drop them from the copied text.
      const text = asciiArt.split("\n").map((line) => line.trimEnd()).join("\n");
      await navigator.clipboard.writeText(text);
      setCopyStatus("Copied!");
    } catch (err) {
      console.log(`copy error: ${err}`);
      setCopyStatus("Copy failed");
    }
  }

  return (
    <section className="ascii-section">
      <div className="controls">
        <label htmlFor="zoom">
          Zoom <span className="zoom-value">({image ? Math.min(zoom, image.width) : zoom} characters wide)</span>
        </label>
        <input
          id="zoom"
          type="range"
          min={MIN_ZOOM}
          max={maxZoom}
          step={ZOOM_STEP}
          value={zoom}
          disabled={!image}
          onChange={(event) => setZoom(Number(event.target.value))}
        />
        <label className="invert-toggle">
          <input
            type="checkbox"
            checked={inverted}
            disabled={!image}
            onChange={(event) => setInverted(event.target.checked)}
          />
          Invert (for dark backgrounds)
        </label>
        <button type="button" onClick={handleCopy} disabled={!asciiArt}>
          {copyStatus || "Copy ASCII text"}
        </button>
      </div>

      {error && <p className="error" role="alert">{error}</p>}

      <div className={inverted ? "art-frame inverted" : "art-frame"}>
        {/* "pre" tag represents preformatted text which is to be presented exactly as written in the HTML file. */}
        {asciiArt
          ? <pre style={{ "--cols": columns }}>{asciiArt}</pre>
          : <p className="placeholder">Your ASCII art will appear here.</p>}
      </div>

      <p className="tip">
        Pasting tip: use a monospace font with line wrapping turned off (a code editor works well, and in chat apps
        put the art inside a <code>```</code> code block). If the lines wrap, lower the zoom.
      </p>
    </section>
  );
};

export default Canvas;
