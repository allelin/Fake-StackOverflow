import axios from 'axios'
import { useState, useEffect } from 'react';

export default function Home(props) {
	const [questionHTMLList, setQuestionHTMLList] = useState([]);
	const [qStart, setQStart] = useState(0);

	const handleAnswer = async (question) => {
		const qid = {
			id: question._id
		}

		try {
			const respond = await axios.post(`http://localhost:8000/question/updateviews`, qid, { withCredentials: true });
			props.handleQuestionChange(respond.data);
			props.handlePageSwap("answers");
		} catch (err) {
			console.log(err);
		}
	}

	const handleSortButtons = (sortName) => {
		props.handleSortChange(sortName);
		setQStart(0);
	}

	const changeQStart = (num) => {
		setQStart(qStart + num);
	}

	useEffect(() => {
		if(props.sort !== "search" && props.sort !== "tag") {
			axios.get(`http://localhost:8000/questions/${props.sort}`, { withCredentials: true })
			.then(res => {
				const questionsData = res.data;

				const questionList = questionsData.map(question => (
					<QuestionComponent
						question={question}
						key={question._id}
						handleAnswer={handleAnswer}
					/>
				));
				setQuestionHTMLList(questionList);
			});
		}
	}, [props.sort]);

	useEffect(() => {
		if(props.sort === "search") {
			axios.get(`http://localhost:8000/questions/${props.sort}?search=${(props.search.join(','))}`, { withCredentials: true })
			.then(res => {
				const questionsData = res.data;

				const questionList = questionsData.map(question => (
					<QuestionComponent 
						question={question} 
						key={question._id} 
						handleAnswer={handleAnswer}
						/>
					));
				setQuestionHTMLList(questionList);
			});
		}
	}, [props.search]);

	useEffect(() => {
		if(props.sort === "tag") {
			axios.get(`http://localhost:8000/questions/${props.sort}?tagName=${props.tag.name}`, { withCredentials: true })
			.then(res => {
				const questionsData = res.data;

				const questionList = questionsData.map(question => (
					<QuestionComponent 
						question={question} 
						key={question._id} 
						handleAnswer={handleAnswer}
						/>
					));
				setQuestionHTMLList(questionList);
			});
		}
	}, [props.tag]);

	useEffect(() => {
		const interval = setInterval(() => {
			const updatedQuestionList = questionHTMLList.map(question => {
				return (
					<QuestionComponent
						handleAnswer={handleAnswer}
						question={question.props.question}
						key={question.key}
					/>
				);
			});

			setQuestionHTMLList(updatedQuestionList);
		}, 1000);

		return () => clearInterval(interval);
	}, [questionHTMLList]);

	// console.log(qStart);
	// console.log(props.user);

	return (
		<div id="right_bar">
			<div id="topbar">
				<div><h2>{props.TopBarLabel}</h2></div>
				{props.user ? <button type="button" id="askbutton"
					onClick={() => props.handlePageSwap("askquestion")}
				>Ask Question</button> : <></>}
			</div>
			<div id="sort">
				<div id="numberOfQuestions">{questionHTMLList.length + " questions"}</div>
				<table>
					<tbody>
						<tr>
						<td><button type="button" id="newest_button" 
						onClick={() => handleSortButtons("newest")}
						>Newest</button></td>
						<td><button type="button" id="active_button" 
						onClick={() => handleSortButtons("active")}
						>Active</button></td>
						<td><button type="button" id="unanswered_button" 
						onClick={() => handleSortButtons("unanswered")}
						>Unanswered</button></td>
						</tr>
					</tbody>
				</table>
			</div>
			<div id="question-container">
				{questionHTMLList.length > 0 ? questionHTMLList.slice(qStart, qStart + 5) : <h2 id="noQText">No Questions Found</h2>}
			</div>
			<div className="navigateElements">
				{qStart > 0 ? <button type="button"
				onClick={() => changeQStart(-5)}
				>Prev</button> : <></>}
				{qStart < (questionHTMLList.length - 5) ? <button type="button" 
				onClick={() => changeQStart(5)}
				>Next</button> : <></>}
			</div>
		</div>
	);
}


function QuestionComponent(props) {
	const question = props.question;
	const tagsList = question.tags;
	const tagsHTML = []
	tagsList.forEach((tag) => {
		tagsHTML.push(
			<TagComponent
				tag={tag}
				key={tag._id}
			/>);
	});
	return (
		<div className="questionDiv">
			{/* Add upvote and downvote */}
			<div className="questionStats">
				<p>{question.votes + ' votes'} </p>
				<p>{question.answers.length + ' answers'}</p>
				<p>{question.views + ' views'}</p>
			</div>
			<div className="questionTitle">
				<div
					onClick={() => props.handleAnswer(question)}
				>{question.title}</div>
				{/* add summary */}
				<p id="question_summary">{question.summary}</p>
				<div className="tags">
					{tagsHTML}
				</div>
			</div>
			<div className="questionAuthor">
				<p>
					<span style={{ color: 'rgb(185, 20, 103)' }}>{question.asked_by}</span>
					{" asked " + getTimeDisplay(new Date(question.ask_date_time), new Date())}
				</p>
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