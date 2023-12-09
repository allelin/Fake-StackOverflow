import { useState } from "react";
import axios from "axios";

export default function AskQuestion(props) {
	const [error, setError] = useState({
		qTitle: '',
		qText: '',
		qSummary: '',
		qTags: '',
		username: '',
	})

	const handleSubmit = (event) => {
		event.preventDefault();

		const formData = new FormData(event.target);
		const qTitle = formData.get("qTitle").trim();
		const qText = formData.get("qText").trim();
		const qSummary = formData.get("qSummary").trim();
		const username = formData.get("username").trim();
		const tagArr = formData.get("qTags").trim().split(" ").filter(Boolean).map(tagName => tagName.toLowerCase());

		const newError = {
			qTitle: '',
			qText: '',
			qSummary: '',
			qTags: '',
			username: '',
		}

		if(!qTitle) {
			newError.qTitle = "Question Title required!";
		} else if(qTitle.length > 100) {
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
		}

		if(!username) {
			newError.username = "Username required!";
		}

		setError(newError);

		if(Object.values(newError).every(field => field === '')) {
			const newQuestion = {
				title: qTitle,
				text: qText,
				summary: qSummary,
				tags: tagArr,
				username: username
			}

			axios.post(`http://localhost:8000/postquestion`, newQuestion)
			.then(res => {
				props.handlePageSwap("home");
				props.handleSortChange("newest");
			})
		}
	}
	return (
		<div id="right_bar">
			<form id="newQuestionForm" 
			onSubmit={handleSubmit}
			>
				<h2>Question Title*</h2>
				<p>Limit title to 100 characters or less</p>
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
				<h2>Username*</h2>
				<br />
				<input type="text" name="username" className="wordbox" placeholder="Nathan Smith" 
				/>
				{error.username && <div className="error-message">{error.username}</div>}
				<div id="bottom">
					<input id="post_question_button" type="submit" value="Post Question"/>
					<p style={{color: 'red'}}>* indicates mandatory fields</p>
				</div>
			</form>
		</div>
	);
}