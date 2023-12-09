import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Answers(props) {
    const [answerHTMLList, setAnswerHTMLList] = useState([]);
    const question = props.question;
	const [sStart, setSStart] = useState(0);

	const changeSStart = (num) => {
		setSStart(sStart + num);
	}

    useEffect(() => {
        const ansList = [];
        const promise = question.answers.map((answerid) => {
            return axios.get(`http://localhost:8000/answer/${answerid}`, { withCredentials: true })
                .then((res) => {
                    ansList.push(res.data);
                })
                .catch((err) => {
                    console.log(err);
                })
        });
        Promise.all(promise).then(() => {
            ansList.sort((a, b) => new Date(b.ans_date_time) - new Date(a.ans_date_time));
            const ansHTMLList = ansList.map((ans) => {
                return <AnsComponent ans={ans} key={ans._id} />
            });
            setAnswerHTMLList(ansHTMLList);
        });
    }, [question.answers]);

    useEffect(() => {
		const interval = setInterval(() => {
		  const updatedAnswerList = answerHTMLList.map(answer => {
			return (
			  < AnsComponent ans={answer.props.ans} key={answer.key} />
			);
		  });
	
		  setAnswerHTMLList(updatedAnswerList);
		}, 1000);
	
		return () => clearInterval(interval);
	  }, [answerHTMLList]);

    const textHTML = displayLinkInText(question.text)

    return (
        <div id="right_bar">
            <div id="qtopbar">
                <h2 id="ansNum">{question.answers.length + " answers"}</h2>
                <h2 id="qLabel">{question.title}</h2>
                <button type="button" id="askbutton"
                onClick={() => props.handlePageSwap("askquestion")}
                >Ask Question</button>
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
			<div id="answer-container">
            	{answerHTMLList.slice(sStart, sStart + 5)}
			</div>
            <button id="answerButton"
            onClick={() => props.handlePageSwap("answerform")}
            >Answer Question</button>
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
    return (
        <div className="ansDiv">
            <div className="ansDesc">
                <p>{textHTML}</p>
            </div>
            <div className="ansAuthor">
                <p>
                    <span style={{ color: 'aquamarine' }}>{ans.ans_by}</span>
                    {" answered " + getTimeDisplay(new Date(ans.ans_date_time), new Date())}
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