import { useState, useEffect } from "react";
import Canvas from "../art/Canvas";

export default function Home() {
  const [newImg, setNewImg] = useState(null); //uploaded image's information.
  const [imgUrl, setImgUrl] = useState(null); //uploaded image's url.

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

  return (
    <div>
      <h3>Upload a picture and turn it into ASCII art!</h3>
      <input type="file" name="image" accept="image/*" className="upload-image"
        onChange={(event) => handleImgUpload(event)}
      />
      <br/>
      {newImg && imgUrl && (
        <>
          <br/>
          <div className="img-preview">
            <div>Image Preview:</div>
            <br/>
            <img src={imgUrl} alt={newImg.name} />
          </div>
        </>
      )}

      <Canvas imgUrl={imgUrl} />
    </div>
  );
}
