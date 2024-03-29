import React, { useState } from "react";
import { db, storage } from "./firebase";
import firebase from "firebase";
import { Button } from "@material-ui/core";
import "./ImageUpload.css";
const ImageUpload = ({ username, postname }) => {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //progress function...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        //complete function ...
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            //post image inside db
            db.collection(postname).add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              comment: caption,
              avatar: url,
              imagePost: url,
              username: username
            });

            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="imageUpload">
      <progress className="imageUpload_progress" value={progress} max="100" />
      <input
        type="text"
        placeholder="Enter the caption"
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Upload Image</Button>
    </div>
  );
};

export default ImageUpload;
