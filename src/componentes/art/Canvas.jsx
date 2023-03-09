import { useState, useEffect, useRef } from "react";

function Canvas({ newImg }) {
  const [imageWidth, setImageWidth] = useState(1); //uploaded image's width.
  const [imageHeight, setImageHeight] = useState(1); //uploaded image's height.
  const [asciiArt, setAsciiArt] = useState(""); //converted to Ascii art (string).
  const canvasRef = useRef();

  const asciiGraySequence = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. ';
  const asciiGrayLength = asciiGraySequence.length;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { willReadFrequently: true });

    if (newImg) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = new Image();
        image.onload = () => {
          setImageWidth(image.width);
          setImageHeight(image.height);

          context.drawImage(image, 0, 0, imageWidth, imageHeight);
          const grayScales = convertToGrayScales(context, imageWidth, imageHeight);

          drawAscii(grayScales, imageWidth);
        }
        image.src = event.target.result;
      }
      reader.readAsDataURL(newImg);
  
      //e.g.: the file was not found or not readable.
      reader.onerror = () => {
        console.log(`file "${newImg.name}" error: ${reader.error}`);
        return alert("Something went wrong! Please try again later.");
      }
    }
  });

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
      // //same as:
      // imageData.data[i] = grayScale;
      // imageData.data[i + 1] = grayScale;
      // imageData.data[i + 2] = grayScale;

      grayScales.push(grayScale);
    }

    context.putImageData(imageData, 0, 0);

    return  grayScales;
  };

  //the formula for GrayScale adapted to the Human eyes.
  function toGrayScale(r, g, b) {
    return 0.21 * r + 0.72 * g + 0.07 * b;
  }

  function drawAscii(grayScales, width) {
    const ascii = grayScales.reduce((accumulator, currentValue, index) => {
      let nextChars = getCharacterForGrayScale(currentValue);
      if ((index + 1) % width === 0) {
        nextChars += '\n';
      }
      return accumulator + nextChars;
    }, '');

    setAsciiArt(ascii);
  }
    
  function getCharacterForGrayScale(grayScale) {
    return asciiGraySequence[Math.ceil((asciiGrayLength - 1) * grayScale / 255)];
  }
console.log(typeof asciiArt)
  return (
    <>
      <div>
        <canvas
          className="canvas-preview"
          ref={canvasRef} 
          width={imageWidth}
          height={imageHeight}
          style={{ display: "none" }}
        />
      </div>
      <div>
        {/* "pre" tag represents preformatted text which is to be presented exactly as written in the HTML file. */}
        <pre className="ascii">{asciiArt}</pre>
      </div>
    </>
  );
};

export default Canvas;