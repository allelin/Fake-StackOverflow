import { useState } from 'react';
import axios from 'axios';

export default function EditTag(props) {
	const [error, setError] = useState({
        tagName: "",
    });

	const handleSubmit = async (event) => {
		try {
			event.preventDefault();

			const formData = new FormData(event.target);
        	const tagName = formData.get("tagName").trim();

			const newError = {
				tagName: "",
			};

			if(!tagName) {
				newError.tagName = "Tag name missing!";
			} else if(tagName.length > 10) {
				newError.tagName = "Length should be max 10!"
			}

			setError(newError);

			if(newError.tagName === "") {
				let res = await axios.post(`http://localhost:8000/updatetag`, {tagName: tagName, cid: props.edit._id}, { withCredentials: true });
				props.setEdit(null);
				props.handlePageSwap("profile");
			}
			
		} catch(err) {
			console.log(err);
		}
	}

	// const handleAnswerDelete = async (aid) => {
    //     try {
    //         const respond = await axios.get(`http://localhost:8000/deleteanswer/${aid}`, { withCredentials: true });
    //         // console.log(respond.data);
    //         props.setUser(respond.data);
	// 		props.setEdit(null);
	// 		props.handlePageSwap("profile");
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

	return(
		<div id="right_bar">
			<form id="edittagform" 
			onSubmit={handleSubmit}
			>
				<h2>Tag Name*</h2>
				<p>Limit title to 10 characters or less</p>
				<input type="text" name="tagName" className="wordbox" 
				placeholder="Input tagname" 
				defaultValue={props.edit.name}
				/>
				{error.tagName && <div className="error-message">{error.tagName}</div>}
				<div id="bottom">
					<input id="edit_tag_button" type="submit" value="Edit Tag"/>
					<button className="delete_button" type="button" 
					// onClick={() => handleAnswerDelete(props.edit._id)}
					>Delete Tag</button>
					<p style={{color: 'red'}}>* indicates mandatory fields</p>
				</div>
			</form>
		</div>
	);
}