import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./firebase";
import firebase from "firebase";
import "./Post.css";
import MenuIcon from "@material-ui/icons/Menu";
import DeleteIcon from "@material-ui/icons/Delete";

const Post = ({
  postId,
  user,
  avatar,
  username,
  postname,
  imagePost,
  caption
}) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection(postname)
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(
            snapshot.docs.map((doc) => ({ id: doc.id, comment: doc.data() }))
          );
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    //adding comments
    event.preventDefault();
    if (user) {
      db.collection(postname).doc(postId).collection("comments").add({
        text: comment,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
    setComment("");
  };

  const deletePostHandler = (id) => {
    if (user.displayName === username) {
      db.collection(postname)
        .doc(postId)
        .delete()
        .then(() => {
          console.log("Post successfully deleted!");
        })
        .catch((error) => {
          console.error("Error removing post: ", error);
        });
    }
  };
  const deleteCommentHandler = (id) => {
    db.collection(postname)
      .doc(postId)
      .collection("comments")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };
  return (
    <div className="post">
      <div className="post_header">
        <div
          className="avatar-name"
          style={{
            display: "flex",
            alignItems: "center"
          }}
        >
          <Avatar className="post_avatar" src={avatar} />
          <h3> {username}</h3>
        </div>
        <MenuIcon
          onClick={() => {
            deletePostHandler(postId);
          }}
        />
      </div>
      <div className="image_and_caption">
        <img className="post_image" src={imagePost} alt="imagePost" />
        <p className="caption">
          <strong>{username}</strong> {caption}
        </p>
      </div>

      <div className="post_comment">
        {user ? (
          comments.map(({ id, comment }) => (
            <div key={id} className="comment">
              <p className="comment-text" key={id}>
                <strong>{comment.username}</strong> {comment.text}
              </p>
              {user.displayName === comment.username ? (
                <h5 className="cross" onClick={() => deleteCommentHandler(id)}>
                  <DeleteIcon />
                </h5>
              ) : (
                <></>
              )}
            </div>
          ))
        ) : (
          <p>
            <strong>To post a comment you need to log in first</strong>
          </p>
        )}
      </div>
      <div disabled={!user}>
        <form className="post_commentBox">
          <input
            type="text"
            className="post_input"
            placeholder="add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            disabled={!comment}
            className="post_button"
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;
