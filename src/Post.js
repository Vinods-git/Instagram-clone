import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';
import firebase from 'firebase';
import './Post.css';
import MenuIcon from '@material-ui/icons/Menu;

const Post = ({ postId, user, avatar, username, imagePost, caption }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection('post')
        .doc(postId)
        .collection('comments')
        .orderBy('timestamp', 'desc')
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
      db.collection('post').doc(postId).collection('comments').add({
        text: comment,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
    setComment('');
  };

  const deleteCommentHandler = (id) => {
    db.collection('post')
      .doc(postId)
      .collection('comments')
      .doc(id)
      .delete()
      .then(() => {
        console.log('Document successfully deleted!');
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
      });
  };
  return (
    <div className='post'>
      <div className='post_header'>
        <div
          className='avatar-name'
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
          <Avatar className='post_avatar' src={avatar} />
          <p> {username}</p>
        </div>
        <MenuIcon onClick={() => {}} />
      </div>
      <div className='image_and_caption'>
        <img className='post_image' src={imagePost} alt='imagePost' />
        <p className='caption'>
          <strong>{username}</strong> {caption}
        </p>
      </div>

      <div className='post_comment'>
        {user ? (
          comments.map(({ id, comment }) => (
            <div key={id} className='comment'>
              <p className='comment-text' key={id}>
                <strong>{comment.username}</strong> {comment.text}
              </p>
              <h5 className='cross' onClick={() => deleteCommentHandler(id)}>
                x
              </h5>
            </div>
          ))
        ) : (
          <p>
            <strong>To post a comment you need to log in first</strong>
          </p>
        )}
      </div>
      <div disabled={!user}>
        <form className='post_commentBox'>
          <input
            type='text'
            className='post_input'
            placeholder='add a comment'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            disabled={!comment}
            className='post_button'
            type='submit'
            onClick={postComment}>
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;
