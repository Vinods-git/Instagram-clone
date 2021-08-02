import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import './App.css';
import Post from './Post';
import ImageUpload from './ImageUpload';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Input from '@material-ui/core/Input';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const App1 = (props) => {
  const [posts, setPosts] = useState([]);
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [openSignIn, setOpenSignIn] = React.useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
       // console.log(authUser);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, [user, open, openSignIn]);

  const sign_up = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((err) => {
        alert(err.message);
      });
    setOpen(false);
  };

  const sign_in = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((authUser) => {
        setUser(authUser);
      })
      .catch((err) => {
        alert(err.message);
      });
    setOpenSignIn(false);
  };

  const sign_out = (event) => {
    event.preventDefault();
    auth.signOut();
  };

  const sign_up_body = (
    <div style={modalStyle} className={classes.paper}>
      <center>
        <img
          className='logo_image'
          src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
          alt='Logo'
        />
      </center>
      <form className='form'>
        <Input
          id='username'
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}></Input>
        <Input
          id='email'
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}></Input>
        <Input
          id='password'
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}></Input>
        <Button type='submit' onClick={sign_up}>
          Register
        </Button>
      </form>
    </div>
  );
  const sign_in_body = (
    <div style={modalStyle} className={classes.paper}>
      <center>
        <img
          className='logo_image'
          src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
          alt='Logo'
        />
      </center>
      <form className='form'>
        <Input
          id='email'
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}></Input>
        <Input
          id='password'
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}></Input>
        <Button type='submit' onClick={sign_in}>
          sign in
        </Button>
      </form>
    </div>
  );

  useEffect(() => {
    db.collection('post')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  return (
    <div className='app'>
      <Modal open={open} onClose={() => setOpen(false)}>
        {sign_up_body}
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        {sign_in_body}
      </Modal>

      <div className='app_header'>
        <img
          className='logo_image'
          src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
          alt='Logo'
        />
        {user ? (
          <Button onClick={sign_out}>Sign out</Button>
        ) : (
          <div>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
            <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
          </div>
        )}
      </div>

      <div>
        {posts.map(({ post, id }) => (
          <Post
            key={id}
            postId={id}
            user={user}
            username={post.username}
            imagePost={post.imagePost}
            caption={post.caption}
          />
        ))}
      </div>

      <div className='image_uploader'>
        {user?.displayName ? (
          <ImageUpload username={user.displayName} />
        ) : (
          <h3>Sorry you need to login</h3>
        )}
      </div>
    </div>
  );
};

export default App1;
