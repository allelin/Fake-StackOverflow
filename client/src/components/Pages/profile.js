
import { useEffect } from 'react';
import axios from 'axios';

export default function Profile(props) {
    const date = new Date(props.user.acc_date_created);
    const formattedDate = date.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    console.log(props.user);

    useEffect(() => {
        axios.get(`http://localhost:8000/accountinfo`, { withCredentials: true })
            .then(res => {
                const userData = res.data;
                props.setUser(userData);
            });
    }, []);
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
                        {props.user.questions.slice().reverse().map((question) => {
                            return (<li key={question._id}>
                                <p>{question.title}</p>
                                <div>
                                    <div
                                    // onClick={() => props.handleQuestionChange()}
                                    >Edit</div>
                                    <div
                                    // onClick={() => props.handleQuestionDelete(question._id)}
                                    >Delete</div>
                                </div>
                            </li>)
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
                <div className="profile-tags">
                    <h2>My Tags</h2>
                    <ul>
                        {props.user.tags.map((tag) => {
                            return <li key={tag._id}>{tag}</li>
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
}


