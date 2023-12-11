import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Answers(props) {
    const [answerHTMLList, setAnswerHTMLList] = useState([]);
    const question = props.question;
	const [sStart, setSStart] = useState(0);
	const [cStart, setCStart] = useState(0);
	const [tagsHTML, setTagsHTML] = useState([]);
	const [commentHTMLList, setCommentHTMLList] = useState([]);
	// const [ansComHTMLList, setAnsComHTMLList] = useState([]);
	const [error, setError] = useState({
		cText: '',
	});
	const [ansComponentsState, setAnsComponentsState] = useState([]);

	const changeSStart = (num) => {
		setSStart(sStart + num);
	}

	const changeCStart = (num) => {
		setCStart(cStart + num);
	}

	const handleCommentSubmit = async (event, type, qid, aid, index) => {
		event.preventDefault();

		// console.log(index);

		const formData = new FormData(event.target);
		const cText = formData.get("commentText");

		const newError = {
			cText: '',
		}
		if(!cText) {
			newError.cText = "Do not leave comment box empty!";
		} else if(cText.length > 140) {
			newError.cText = "More than 140 characters!";
		} else {
			let updatedAccInfo = (await axios.get(`http://localhost:8000/accountinfo`, { withCredentials: true })).data;
			props.setUser(updatedAccInfo);
			// console.log(updatedAccInfo);

			// if(updatedAccInfo.reputation < 50) {
			// 	newError.cText = "Insufficient reputation to make comment!";
			// }
		}

		if(!aid){
			setError(newError);
		} else {
			updateError(index, newError);
		}

		if(Object.values(newError).every(field => field === '')) {
			if(type === "question") {
				axios.post(`http://localhost:8000/postcomment/${type}/`, {qid: qid, text: cText}, { withCredentials: true })
				.then(res => {
					// console.log(res.data);
					props.handleQuestionChange(res.data);
					event.target.elements.commentText.value = '';
				})
				.catch(err => {
					console.log(err);
				})
			} else if(type === "answer") {
				// console.log(type);
				axios.post(`http://localhost:8000/postcomment/${type}/`, {qid: qid, aid: aid, text: cText}, { withCredentials: true })
				.then(res => {
					props.handleQuestionChange(res.data);
					event.target.elements.commentText.value = '';
				})
				.catch(err => {
					console.log(err);
				})
			}
			
		}
	}

	const updateCounter = (index, num) => {
		setAnsComponentsState(prevState => {
		  const updatedStates = [...prevState];
		  updatedStates[index] = { ...updatedStates[index], counter: updatedStates[index].counter + num };
		  return updatedStates;
		});
	  };
	
	  // Update the error for a specific ansComponent
	  const updateError = (index, newError) => {
		setAnsComponentsState(prevState => {
		  const updatedStates = [...prevState];
		  updatedStates[index] = { ...updatedStates[index], error: newError };
		  return updatedStates;
		});
	  };

	// console.log(props.user);

    useEffect(() => {
        const ansList = [];
        const promise = question.answers.map((answerid) => {
            return axios.get(`http://localhost:8000/answer/${answerid}`, { withCredentials: true })
                .then((res) => {
					ansList.push(res.data);
                    // const answer = res.data;
                    
                    // return axios.get(`http://localhost:8000/comments/answer/${answer._id}`, { withCredentials: true })
                    //     .then((commentRes) => {
                    //         answer.comments = commentRes.data;
                    //         ansList.push(res.data);
                    //     })
                })
                .catch((err) => {
                    console.log(err);
                })
        });
        Promise.all(promise).then(() => {
            ansList.sort((a, b) => new Date(b.ans_date_time) - new Date(a.ans_date_time));

			const initialState = ansList.map(data => ({
				data,
				counter: 0,
				error: { cText: '' },
			}));
		  
			// Set the initial state
			setAnsComponentsState(initialState);

			// console.log(initialState);
			// console.log(ansComponentsState);

            const ansHTMLList = ansList.map((ans, index) => {
            	return <AnsComponent 
					ans={ans} 
					key={ans._id} 
					user={props.user} 
					handleCommentSubmit={(event, type, qid, aid) => handleCommentSubmit(event, type, qid, aid, index)}
					question={question}
					// error={error}
					// setAnsComHTMLList={setAnsComHTMLList}
					// ansComHTMLList={ansComHTMLList}

					counter={initialState[index].counter}
          			error={initialState[index].error}
					onUpdateCounter={(num) => updateCounter(index, num)}
					// onUpdateError={newError => updateError(index, newError)}
				/>
            });
            setAnswerHTMLList(ansHTMLList);
			// console.log(answerHTMLList);
        });

		// console.log(ansList);

		// const initialState = ansList.map(data => ({
		// 	data,
		// 	counter: 0,
		// 	error: { cText: '' },
		// }));
	  
		// // Set the initial state
		// setAnsComponentsState(initialState);

		// const ansHTMLList = ansList.map((ans, index) => {
		// 	return <AnsComponent 
		// 		ans={ans} 
		// 		key={ans._id} 
		// 		user={props.user} 
		// 		handleCommentSubmit={handleCommentSubmit}
		// 		question={question}
		// 		// error={error}
		// 		setAnsComHTMLList={setAnsComHTMLList}
		// 		ansComHTMLList={ansComHTMLList}

		// 		counter={ansComponentsState.counter}
		// 		  error={ansComponentsState.error}
		// 		onUpdateCounter={(num) => updateCounter(index, num)}
		// 		onUpdateError={newError => updateError(index, newError)}
		// 	/>
		// });

		// setAnswerHTMLList(ansHTMLList);

		const newTagsHTML = []
		// console.log(question.tags);
		question.tags.forEach((tag) => {
			newTagsHTML.push(
				<TagComponent
					tag={tag}
					key={tag._id}
				/>);
		});
		// console.log(newTagsHTML);
		setTagsHTML(newTagsHTML);

		const newCommentHTML = [];
		question.comments.forEach(comment => {
			newCommentHTML.push(
				<CommentComponent
					key={comment._id}
					comment={comment}
					user={props.user}
				/>
			);
		});
		setCommentHTMLList(newCommentHTML);
    }, [question]);

	useEffect(() => {
		// console.log(ansComponentsState);
		if(ansComponentsState.length != 0) {
			const updatedAnswerList = answerHTMLList.map((answer, index) => {
				return (
					<AnsComponent 
						ans={answer.props.ans} 
						key={answer.key} 
						user={answer.props.user}
						handleCommentSubmit={answer.props.handleCommentSubmit}
						question={answer.props.question}
						// error={answer.props.error}
						// setAnsComHTMLList={answer.props.setAnsComHTMLList}
						// ansComHTMLList={answer.props.ansComHTMLList}
	
						counter={ansComponentsState[index].counter}
						error={ansComponentsState[index].error}
						onUpdateCounter={answer.props.onUpdateCounter}
						// onUpdateError={answer.props.onUpdateError}
						/>
				);
			});
		
			setAnswerHTMLList(updatedAnswerList);
		}
	}, [ansComponentsState]);

    useEffect(() => {
		const interval = setInterval(() => {
		const updatedAnswerList = answerHTMLList.map(answer => {
			return (
				<AnsComponent 
					ans={answer.props.ans} 
					key={answer.key} 
					user={answer.props.user}
					handleCommentSubmit={answer.props.handleCommentSubmit}
					question={answer.props.question}
					// error={answer.props.error}
					// setAnsComHTMLList={answer.props.setAnsComHTMLList}
					// ansComHTMLList={answer.props.ansComHTMLList}

					counter={answer.props.counter}
          			error={answer.props.error}
					onUpdateCounter={answer.props.onUpdateCounter}
					// onUpdateError={answer.props.onUpdateError}
					/>
			);
		});
	
		setAnswerHTMLList(updatedAnswerList);

		const updatedCommentList = commentHTMLList.map(comment => {
			return (
				<CommentComponent 
				key={comment.key}
				comment={comment.props.comment}
				user={comment.props.user}
				/>
			);
		});

		setCommentHTMLList(updatedCommentList);
		}, 1000);
	
		return () => clearInterval(interval);
	  }, [answerHTMLList, commentHTMLList]);

    const textHTML = displayLinkInText(question.text)

	// console.log(question);

    return (
        <div id="right_bar">
            <div id="qtopbar">
                <h2 id="ansNum">{question.answers.length + " answers"}</h2>
                <h2 id="qLabel">{question.title}</h2>
                {props.user ? <button type="button" id="askbutton"
                onClick={() => props.handlePageSwap("askquestion")}
                >Ask Question</button> : <></>}
            </div>
            <div id="qSecondBar">
                <h2>{question.views + " views"}</h2>
                <p id="qDescription">
                    {textHTML}
                </p>
                <div id="userPostTime">
                    <p>
                        <span style={{ color: 'rgb(185, 20, 103)' }}>{question.asked_by}</span>
                        {" asked " + getTimeDisplay(new Date(question.ask_date_time), new Date())}
                    </p>
                </div>
            </div>
			<div id="qThirdBar">
				{props.user ? <div className="vote_buttons">
					<button type="button"
					id="upvote_button"
					// onClick={}
					>Upvote</button>
					<button type="button"
					id="downvote_button"
					// onClick={}
					>Downvote</button>
				</div> : <></>}
				<h2>{question.votes + " votes"}</h2>
				<div className="tags">
					{tagsHTML}
				</div>
			</div>
			<div className="commentbox">
				{commentHTMLList.slice(cStart, cStart + 3)}
			</div>
			{props.user ? <div className="commentbox">
				<form className="commentForm" onSubmit={(event) => handleCommentSubmit(event, "question", question._id, false)}>
					<textarea name="commentText" className="commentTextArea" placeholder='Add a comment with no more than 140 characters'></textarea>
					{error.cText && <div className="error-message">{error.cText}</div>}
					<input className="comment_button" type="submit" value="Post Comment"/>
				</form>
			</div> : <></>}
			<div className="navigateElements">
				{cStart > 0 ? <button type="button"
				onClick={() => changeCStart(-3)}
				>Prev</button> : <></>}
				{cStart < (commentHTMLList.length - 3) ? <button type="button" 
				onClick={() => changeCStart(3)}
				>Next</button> : <></>}
			</div>
			<div id="answer-container">
            	{answerHTMLList.slice(sStart, sStart + 5)}
			</div>
            {props.user ? <button id="answerButton"
            onClick={() => props.handlePageSwap("answerform")}
            >Answer Question</button> : <></>}
			<div className="navigateElements">
				{sStart > 0 ? <button type="button"
				onClick={() => changeSStart(-5)}
				>Prev</button> : <></>}
				{sStart < (answerHTMLList.length - 5) ? <button type="button" 
				onClick={() => changeSStart(5)}
				>Next</button> : <></>}
			</div>
        </div>
    );
}

function AnsComponent(props) {
    const ans = props.ans;
    const textHTML = displayLinkInText(ans.text);

	const newCommentHTML = [];
	ans.comments.forEach(comment => {
		newCommentHTML.push(
			<CommentComponent
				key={comment._id}
				comment={comment}
				user={props.user}
			/>
		);
	});
	// props.setAnsComHTMLList(newCommentHTML);

	// console.log(props.error);

    return (
		<div >
			<div className="ansDiv">
				{props.user ? <div className="vote_buttons">
						<button type="button"
						id="upvote_button"
						// onClick={}
						>Upvote</button>
						<button type="button"
						id="downvote_button"
						// onClick={}
						>Downvote</button>
				</div> : <></>}
				<h3>{ans.votes + " votes"}</h3>
				<p className="ansDesc">{textHTML}</p>
				<div className="ansAuthor">
					<p>
						<span style={{ color: 'aquamarine' }}>{ans.ans_by}</span>
						{" answered " + getTimeDisplay(new Date(ans.ans_date_time), new Date())}
					</p>
				</div>
			</div>
			<div className="commentbox">
				{newCommentHTML.slice(props.counter, props.counter + 3)}
			</div>
			{props.user ? <div className="commentbox">
				<form className="commentForm" onSubmit={(event) => props.handleCommentSubmit(event, "answer", props.question._id, ans._id)}>
					<textarea name="commentText" className="commentTextArea" placeholder='Add a comment with no more than 140 characters'></textarea>
					{props.error.cText && <div className="error-message">{props.error.cText}</div>}
					<input className="comment_button" type="submit" value="Post Comment"/>
				</form>
			</div> : <></>}
			<div className="navigateElements">
				{props.counter > 0 ? <button type="button"
				onClick={() => props.onUpdateCounter(-3)}
				>Prev</button> : <></>}
				{props.counter < (newCommentHTML.length - 3) ? <button type="button" 
				onClick={() => props.onUpdateCounter(3)}
				>Next</button> : <></>}
			</div>
		</div>
    );
}

function TagComponent(props) {
	const tag = props.tag;

	return (
		<p className="tags">{tag.name}</p>
	);
}

function CommentComponent(props) {
	const comment = props.comment;

	return (
		<div className="comment">
			{props.user ? <div className="vote_buttons">
					<button type="button"
					id="upvote_button"
					// onClick={}
					>Upvote</button>
			</div> : <></>}
			<h3>{comment.votes + " votes"}</h3>
			<p className="comDesc">{comment.text}</p>
			<div className="comAuthor">
                <p>
                    <span style={{ color: 'blueviolet' }}>{comment.comment_by}</span>
                    {" commented " + getTimeDisplay(new Date(comment.comment_date_time), new Date())}
                </p>
            </div>
		</div>
	);
}

function displayLinkInText(text) {
    const hyperlinkFormat = /(\[[^\]]*\]\([^)]*\))/;
    const textHTML = [];

    const splitbyLink = text.split(hyperlinkFormat);
    splitbyLink.forEach((substr, index) => {
        if (substr.startsWith("[") && substr.endsWith(")")) {
            const match = substr.match(/\[([^\]]*)\]\(([^)]*)\)/);
            textHTML.push(<a href={match[2]} target="_blank" rel="noopener noreferrer" key={index}>{match[1]}</a>);
        } else {
            textHTML.push(substr);
        }
    });

    return textHTML;
}

function getTimeDisplay(questionDate, currentDate) {
    const months = ["January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"];

    const secondsPassed = Math.floor((currentDate - questionDate) / 1000);

    if (secondsPassed < 60) {
        return `${secondsPassed} second${secondsPassed > 1 ? 's' : ''} ago`;
    }

    if (secondsPassed < 3600) {
        const minutesPassed = Math.floor(secondsPassed / 60);
        return `${minutesPassed} minute${minutesPassed > 1 ? 's' : ''} ago`;
    }

    if (secondsPassed < 86400) {
        const hoursPassed = Math.floor(secondsPassed / 3600);
        return `${hoursPassed} hour${hoursPassed > 1 ? 's' : ''} ago`;
    }

    if (isSameDay(questionDate, currentDate)) {
        return `Today at ${formatTime(questionDate)}`;
    }

    if (isSameYear(questionDate, currentDate)) {
        return `${formatDateWithoutYear(questionDate, months)} at ${formatTime(questionDate)}`;
    }

    return `${formatDateWithYear(questionDate, months)} at ${formatTime(questionDate)}`;
}

function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear();
}

function isSameYear(date1, date2) {
    return date1.getFullYear() === date2.getFullYear();
}

function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

function formatDateWithoutYear(date, months) {
    const month = date.getMonth();
    const day = date.getDate();
    return `${months[month]} ${day}`;
}

function formatDateWithYear(date, months) {
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    return `${months[month]} ${day}, ${year}`;
}