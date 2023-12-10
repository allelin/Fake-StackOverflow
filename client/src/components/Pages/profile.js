
import React from 'react';

export default function Profile(props) {
    const date = new Date(props.user.acc_date_created);
    const formattedDate = date.toLocaleString();
    console.log(props.user);
    return (
        <div className="profile-page">
            <h1>Profile Page</h1>
            <div className="profile-inner">
                <div className="profile-stats">
                    <h2> Name: {props.user.username}</h2>
                    {/* <p> Email: {props.user.email}</p> */}
                    <p> Member since: {formattedDate}</p>
                    <p> Reputation: {props.user.reputation}</p>
                </div>
                <div className="profile-questions">
                    <h2>My Questions</h2>
                    <ul>
                        {props.user.questions.map((question) => {
                            return <li key={question._id}>{question.title}</li>
                        })}
                    </ul>
                </div>
                <div className="profile-answers">
                    <h2>My Answers</h2>
                    <ul>
                        {props.user.answers.map((answer) => {
                            return <li key={answer._id}>{answer.text}</li>
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}

