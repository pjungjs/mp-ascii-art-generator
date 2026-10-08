export default function How() {
  return (
    <div className="page">
      <h2>How it works</h2>
      <p>
        Everything happens in your browser. Your picture is never uploaded anywhere.
      </p>
      <ol>
        <li>
          <strong>Decode the picture into pixels.</strong> A JPEG or PNG file is not a grid of colors,
          it is compressed data. When you pick a file, the browser's built-in image decoder unpacks it
          into a grid of pixels, each one stored as four numbers from 0 to 255: red, green, blue and
          alpha (transparency). The page draws the picture onto a hidden <code>&lt;canvas&gt;</code> and
          asks it for its pixels with <code>getImageData</code>, which returns one long list: the four
          numbers of the first pixel, then the four of the second, and so on.
        </li>
        <li>
          <strong>Shrink it. The zoom decides how many characters there are.</strong> One pixel becomes
          one character, so the number of characters is the number of pixels we keep. The zoom slider
          is that number of columns: at 150, the hidden canvas is made 150 pixels wide and the picture
          is drawn onto it, and the browser averages the original pixels down to fit. A bigger zoom
          means a bigger canvas, so more pixels, more characters and more detail. The height follows
          the picture's proportions, scaled by 0.5 because a character is about twice as tall as it is
          wide. A picture can never have more columns than its own width.
        </li>
        <li>
          <strong>Turn each pixel into a brightness.</strong> The three color values are mixed into one
          gray value from 0 (black) to 255 (white): 0.21 × red + 0.72 × green + 0.07 × blue. Green
          counts the most because our eyes are most sensitive to it, so a pure green pixel is
          bright (about 184) and a pure blue one is dark (about 18). Transparent areas are painted
          with the frame's background color first.
        </li>
        <li>
          <strong>Pick a character for each brightness.</strong> The page has a list of 69 characters
          sorted by how much ink they use, from heavy ones like <code>$ @ B %</code> to light ones
          like <code>. :</code> and finally a space. The brightness (0 to 255) is scaled to a position
          in that list, so black gets <code>$</code>, white gets a space, and grays land in between.
          Dark areas look dense and bright areas look empty, which suits dark text on a light frame.
          For pictures with a dark background, "Invert" flips the list and the frame colors: bright
          pixels get the heavy characters, and the art becomes light text on a dark frame.
        </li>
        <li>
          <strong>Lay it out and copy it.</strong> The characters are joined row by row with line breaks
          and shown in a fixed-width font. The copy button copies that plain text, so it looks right
          wherever the font is fixed-width and the lines don't wrap.
        </li>
      </ol>
    </div>
  );
}
