import React,{useState,useEffect} from 'react';

const DocTitleOne = (props) => {
	const [count,setCount] = useState(0)

	useEffect(()=>{
		document.title = `Count - ${count}`
	})
  return (
    <div>
    	<button onClick={setCount(count+1)}>Count - {count}</button>
    </div>
  )
}

export default DocTitleOne;