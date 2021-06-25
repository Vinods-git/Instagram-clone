import React, {useState,useEffect} from 'react';
import Post from './Post';
import './App.css';
import {db,auth} from './firebase';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {Button,Input} from '@material-ui/core'; 
import ImageUpload from './ImageUpload';
 import InstagramEmbed from 'react-instagram-embed';
function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

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

const App = (props) => {
  const [posts,setPosts] = useState([]);
  const [username,setUsername] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [user, setUser] = useState(null);

     useEffect(()=>{
      const unsubscribe = auth.onAuthStateChanged((authUser)=>{
          
        //User has logged in
        if(authUser){
          console.log('inside authUser');
          console.log(authUser);
          setUser(authUser);
          
        }
        else{
          //if Logged out..
          console.log('User logged out')
          setUser(null)
        }

      })
      //returns some cleanup action
      return unsubscribe();
    },[user,username]);

      useEffect(()=>{
    //retrieving data from firebase database...
    db.collection('post').onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc=>({id:doc.id,
        post:doc.data()})
        ))})},[])

  const signUp = (event)=>{
    // signing up setting up user
      event.preventDefault()
      auth.createUserWithEmailAndPassword(email,password)
      .then((authUser)=>{
        setUser(authUser)
        return authUser.user.updateProfile({
        displayName:username
      })})
      .catch((error)=>alert(error.message))
      
        console.log(`Sign Up ${user}`)

      setOpen(false)
  }
   const signIn = (event)=>{
    //signing In setting user...
      event.preventDefault()
      auth.signInWithEmailAndPassword(email,password)
      .then(authUser =>{
        setUser(authUser)
      })
      .catch((error)=>alert(error.message))
      
      console.log(`Sign In ${user}`)
      setOpenSignIn(false)

  }

 const signOut =()=>{auth.signOut();
    setUser(null)
      console.log(`Sign Out ${user}`)
      

  }

  return (

    <div className="app"> 
   
    <div className = "app_header" >
    <img src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
    alt = "" className = "logo_image"
     / >

      {
      //sign buttons
      user?<Button onClick={signOut}>Sign Out</Button>
    :<div><Button onClick={()=>setOpen(true)}>Sign Up</Button>
    <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button></div>
  }
  </div>

      <div className='app_post'>{posts.map(({id,post})=>(<Post key = {id} 
      postId={id} user={user} avatar={post.avatar} username=
        {post.username}imagePost={post.imagePost} caption={post.comment}
        />))
    }</div>

    

<Modal open = {open} onClose = {()=>setOpen(false)}>
<div style={modalStyle} className={classes.paper} >
< img src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
alt = ""
className = "modal_logo_image" / >
<form className='signup_form'> 
<Input type="text" value={username} placeholder='Username' onChange={e=>setUsername(e.target.value)}/>
<Input type="text" value={email} placeholder='Email' onChange={e=>setEmail(e.target.value)}/>
<Input type="password" value={password} placeholder='Password' onChange={e=>setPassword(e.target.value)}/>
<Button type='submit' onClick={signUp} >Sign Up</Button>
</form>
</div>
</Modal> 

<Modal open = {openSignIn}
  onClose = {()=>setOpenSignIn(false)}>
<div style={modalStyle} className={classes.paper} >

<img src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
alt = ""
className = "modal_logo_image" / >
<form className='signIn_form'> 
<Input type="text" value={email} placeholder='Email' onChange={e=>setEmail(e.target.value)}/>
<Input type="password" value={password} placeholder='Password' onChange={e=>setPassword(e.target.value)}/>
<Button type='submit' onClick={signIn} >Sign In</Button>
</form>


</div>
  </Modal>

   {user?.displayName?
      (<div><ImageUpload username={user.displayName}/></div>):
      (<div><h3>Sorry you need to log in !</h3></div>)}

  </div>
  )
}

export default App;