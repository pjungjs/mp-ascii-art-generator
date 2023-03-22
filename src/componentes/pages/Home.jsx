import { useState } from "react";
import Canvas from "../art/Canvas";

export default function Home() {
  const [newImg, setNewImg] = useState(null); //uploaded image's information.
  const [imgUrl, setImgUrl] = useState(null); //uploaded image's url.

  function handleImgUpload(event) {
    //"event.target.files" is an array with an object containing the uploaded file information.
    const file = event.target.files[0];
    setNewImg(file);
    
    //.createObjectURL() method creates a DOMString containing a URL representing the object given in the parameter.
    setImgUrl(URL.createObjectURL(file));
  }

  return (
    <div>
      <h3>Upload a picture and turn it into ASCII art!</h3>
      <input type="file" name="image" accept="image/" className="upload-image"
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

      <Canvas newImg={newImg} />
    </div>
  );
}
