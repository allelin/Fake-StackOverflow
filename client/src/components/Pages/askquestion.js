import { useState, useEffect} from "react";
import axios from "axios";

export default function AskQuestion(props) {
	const [error, setError] = useState({
		qTitle: '',
		qText: '',
		qSummary: '',
		qTags: '',
	});

	const handleSubmit = async (event) => {
		event.preventDefault();

		const formData = new FormData(event.target);
		const qTitle = formData.get("qTitle").trim();
		const qText = formData.get("qText").trim();
		const qSummary = formData.get("qSummary").trim();
		const tagArr = formData.get("qTags").trim().split(" ").filter(Boolean).map(tagName => tagName.toLowerCase());

		const newError = {
			qTitle: '',
			qText: '',
			qSummary: '',
			qTags: '',
		}

		if(!qTitle) {
			newError.qTitle = "Question Title required!";
		} else if(qTitle.length > 50) {
			newError.qTitle = "Question Title must be less than 100 words!";
		}

		if(!qSummary) {
			newError.qSummary = "Question Summary required!";
		} 
		if(qSummary.length > 140) {
			newError.qSummary = "Question Summary must be less than 140 words!";
		} 
		// else {
		// 	const hyperlinkFormat = /\[([^\]]*)\]\(([^)]*)\)/g;
		// 	const matches = qSummary.matchAll(hyperlinkFormat);
		// 	for (const match of matches) {
		// 		if (match[1] === "" || match[2] === "" || (!match[2].startsWith("https://") && !match[2].startsWith("http://"))) {
		// 			newError.qSummary = "Invalid hyperlink format. Please use [text](https://google.com) format for hyperlinks.";
		// 			break;
		// 		}
		// 	}
		// }



		if(!qText) {
			newError.qText = "Question Text required!";
		} else {
			const hyperlinkFormat = /\[([^\]]*)\]\(([^)]*)\)/g;
		
			const matches = qText.matchAll(hyperlinkFormat);
			for (const match of matches) {
				if (match[1] === "" || match[2] === "" || (!match[2].startsWith("https://") && !match[2].startsWith("http://"))) {
					newError.qText = "Invalid hyperlink format. Please use [text](https://google.com) format for hyperlinks.";
					break;
				}
			}
		}

		if(tagArr.length === 0) {
			newError.qTags = "At least 1 Tag Required!";
		} else if(tagArr.length > 5){
			newError.qTags = "More than 5 Tags!";
		} else if(!(tagArr.every(tag => tag.length < 11))) {
			newError.qTags = "Not all tags are of max length of 10!";
		} else {
			let res = await axios.post(`http://localhost:8000/verifytags`, {tags: tagArr}, { withCredentials: true });
			let updatedAccInfo = (await axios.get(`http://localhost:8000/accountinfo`)).data;
			props.setUser(updatedAccInfo);
			// console.log(res);
			if(res.data.length != tagArr.length && updatedAccInfo.reputation < 50) {
				newError.qTags = "Insufficient reputation to create new tags";
			}
		}


		setError(newError);

		if(Object.values(newError).every(field => field === '')) {
			const newQuestion = {
				title: qTitle,
				text: qText,
				summary: qSummary,
				tags: tagArr,
				// username: props.user.username,
				// email: props.user.email
			}

			// axios.post(`http://localhost:8000/postquestion`, newQuestion, { withCredentials: true })
			// .then(res => {
			// 	props.handlePageSwap("home");
			// 	props.handleSortChange("newest");
			// })
			// .catch(err => {
			// 	// console.log(error.response.status);
			// 	if(err.response.status === 403) {
			// 		newError.qTags = err.response.data;
			// 		// console.log(error.response.data);
			// 		setError(newError);
			// 		console.log(error);
			// 	}
			// })

			try {
				const res = await axios.post(`http://localhost:8000/postquestion`, newQuestion, { withCredentials: true });
				props.handlePageSwap("home");
				props.handleSortChange("newest");
			} catch (err) {
				// if (err.response && err.response.status === 403) {
				// 	newError.qTags = err.response.data;
				// 	setError(newError);
				console.log(error);
				// }
			}
		}
	}
	return (
		<div id="right_bar">
			<form id="newQuestionForm" 
			onSubmit={handleSubmit}
			>
				<h2>Question Title*</h2>
				<p>Limit title to 50 characters or less</p>
				<input type="text" name="qTitle" className="wordbox" 
				placeholder="How can I change an element's class with JavaScript?" 
				/>
				{error.qTitle && <div className="error-message">{error.qTitle}</div>}
				<h2>Question Summary*</h2>
				<p>Limit summary to 140 characters or less</p>
				<input type="text" name="qSummary" className="wordbox" placeholder="I want to change the class of an element when I click on it. How can I do this?" />
				{error.qSummary && <div className="error-message">{error.qSummary}</div>}
				<h2>Question Text*</h2>
				<p>Add details</p>
				<textarea name="qText" className="wordarea" placeholder="How can I change the class of an HTML element in response to an onclick or any other events using JavaScript?" 
				></textarea>
				{error.qText && <div className="error-message">{error.qText}</div>}
				<h2>Tags*</h2>
				<p>Add keywords separated by whitespace, no more than 5 tags of max length 10</p>
				<input type="text" name="qTags" className="wordbox" placeholder="javascript html dom" 
				/>
				{error.qTags && <div className="error-message">{error.qTags}</div>}
				<div id="bottom">
					<input id="post_question_button" type="submit" value="Post Question"/>
					<p style={{color: 'red'}}>* indicates mandatory fields</p>
				</div>
			</form>
		</div>
	);
}