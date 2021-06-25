import React,{useEffect,useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import {db} from './firebase';
import firebase from 'firebase'
import './Post.css'


const Post = ({postId,user,avatar,username,imagePost,caption}) => {
	const [comments,setComments] = useState([]);
	const [comment,setComment] = useState('');

	useEffect(()=>{
		let unsubscribe;
		if(postId){
			unsubscribe=db
			.collection('post')
			.doc(postId)
			.collection('comments')
			.orderBy('timestamp','desc')
			.onSnapshot((snapshot)=>{
				setComments(snapshot.docs.map(doc=>doc.data()))
			})
		}
		return ()=> {
			unsubscribe();
		}
	},[postId])

	const postComment=(event)=>{

		//adding comments
		event.preventDefault();
		db.collection('post').doc(postId).collection('comments').add({
			text:comment,
			username:user.displayName,
			timestamp:firebase.firestore.FieldValue.serverTimestamp()
		});
		setComment('');
}
	return ( <
		div className = "post" >
		<div className = "post_header">
		<Avatar className="post_avatar"  src={avatar}/>
		<h3> {username} </h3></div>
		<div className='image_and_caption'>
		<img className="post_image" src= {imagePost} alt='imagePost'/>
		<p className='caption'><strong>{username}</strong> {caption}</p>
		</div>


		<div className='post_comment'>
			{user?comments.map(comment=><p><strong>{comment.username}</strong> {comment.text}</p>):
			<p>{comments.map(comment=><p><strong>{comment.username}</strong> {comment.text}</p>)}
			<strong>To post a comment you need to log in first</strong></p>}
		</div>

		<form className='post_commentBox'>
			<input disabled={!user} type="text" className='post_input' placeholder='add a comment' value={comment}
			onChange={(e)=>setComment(e.target.value)}/>

			<button disabled={!comment} className='post_button' type='submit' onClick={postComment}>Post</button>

		</form>

		</div>
	)
}

export default Post;