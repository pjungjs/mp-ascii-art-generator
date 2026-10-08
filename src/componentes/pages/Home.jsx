import { useState, useEffect } from "react";
import Canvas from "../art/Canvas";
import homerExample from "../../assets/homer.png";

export default function Home() {
  const [newImg, setNewImg] = useState(null); //uploaded image's information.
  const [imgUrl, setImgUrl] = useState(null); //uploaded image's url.
  const [resetCount, setResetCount] = useState(0); //changing it re-creates the file input and the art settings.

  useEffect(() => {
    if (!newImg) {
      setImgUrl(null);
      return;
    }

    //.createObjectURL() method creates a DOMString containing a URL representing the object given in the parameter.
    const url = URL.createObjectURL(newImg);
    setImgUrl(url);

    //release the url when the image changes or the page unmounts, so it does not leak memory.
    return () => URL.revokeObjectURL(url);
  }, [newImg]);

  function handleImgUpload(event) {
    //"event.target.files" is an array with an object containing the uploaded file information.
    //no file selected (e.g.: the file dialog was cancelled): clear the previous image.
    setNewImg(event.target.files[0] || null);
  }

  //back to the start: no image, an empty file input, and the zoom and invert settings at their defaults.
  function handleReset() {
    setNewImg(null);
    setResetCount((count) => count + 1);
  }

  //load the example picture that comes with the website, the same way as an uploaded file.
  async function handleExample() {
    try {
      const response = await fetch(homerExample);
      const blob = await response.blob();
      setNewImg(new File([blob], "homer.png", { type: blob.type }));
    } catch (err) {
      console.log(`example error: ${err}`);
    }
  }

  return (
    <div className="home">
      <h3>Upload a picture and turn it into ASCII art!</h3>
      <div className="actions">
        {/* the native file input is hidden (but still reachable with the keyboard) and its label looks like a button. */}
        <label className="btn">
          Choose a picture
          <input key={resetCount} type="file" name="image" accept="image/*" className="visually-hidden"
            onChange={(event) => handleImgUpload(event)}
          />
        </label>
        <span className="or">or</span>
        <button type="button" className="secondary" onClick={handleExample}>
          Try an example
        </button>
        <button type="button" className="secondary reset" onClick={handleReset} disabled={!newImg}>
          Reset
        </button>
      </div>

      {newImg && imgUrl && (
        <div className="img-preview">
          <div>Image Preview: {newImg.name}</div>
          <img src={imgUrl} alt={newImg.name} />
        </div>
      )}

      <Canvas key={resetCount} imgUrl={imgUrl} />
    </div>
  );
}
