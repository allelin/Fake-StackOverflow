
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile(props) {
    const date = new Date(props.user.acc_date_created);
    const formattedDate = date.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const [userList, setUserList] = useState([]);
    // console.log(props.user)	;
    const handleQuestionDelete = async (qid) => {
        try {
            const respond = await axios.get(`http://localhost:8000/deletequestion/${qid}`, { withCredentials: true });
            console.log(respond.data);
            props.setUser(respond.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        axios.get(`http://localhost:8000/accountinfo`, { withCredentials: true })
            .then(res => {
                const userData = res.data;
                props.setUser(userData);
            });
        axios.get(`http://localhost:8000/getallaccounts`, { withCredentials: true })
            .then(res => {
                const userList = res.data;
                setUserList(userList);
            })
    }, []);
    // console.log(props.user);

    return (
        <div className="profile-page">
            {props.user.accType == "Admin" ? <h1>Admin Profile</h1> : <h1>User Profile</h1>}
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
                        {/* {props.user.questions.slice().reverse().map((question) => { */}
                        {props.user.questions
                        .sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time))
                        .map((question) => {
                            return <li key={question._id}>
                                <p>{question.title}</p>
                                <div>
                                    <div className="edit-button"
                                    // onClick={() => props.handleQuestionChange()}
                                    >Edit</div>
                                    <div className="delete-button"
                                    onClick={() => handleQuestionDelete(question._id)}
                                    >Delete</div>
                                </div>
                            </li>
                        })}
                    </ul>
                </div>
                <div className="profile-answers">
                    <h2>My Answers</h2>
                    <ul>
                        {props.user.answers.map((answer) => {
                            return <li key={answer._id}>
                                <p>{answer.text}</p>
                                <div>
                                    <div className="edit-button"
                                    // onClick={() => props.handleQuestionChange()}
                                    >Edit</div>
                                    <div className="delete-button"
                                    // onClick={() => props.handleQuestionDelete(question._id)}
                                    >Delete</div>
                                </div>
                            </li>
                        })}
                    </ul>
                    {/* 
                    <ul>
                        {props.user.answers.map((answer) => {
                            return <li key={answer._id}>{answer.text}</li>
                        })}
                    </ul> */}
                </div>
                <div className="profile-tags">
                    <h2>My Tags</h2>
                    <ul>
                        {props.user.tags.map((tag) => {
                            return <li key={tag._id}>
                                <p>{tag.name}</p>
                                <div>
                                    <div className="edit-button"
                                    // onClick={() => props.handleQuestionChange()}
                                    >Edit</div>
                                    <div className="delete-button"
                                    // onClick={() => props.handleQuestionDelete(question._id)}
                                    >Delete</div>
                                </div>
                            </li>
                        })}
                    </ul>
                    {/* <ul>
                        {props.user.tags.map((tag) => {
                            return <li key={tag._id}>{tag.name}</li>
                        })}
                    </ul> */}
                </div>
            </div>
            {props.user.accType == "Admin" ?
                <div className='user-list'>
                    <h2>Users</h2>
                    <ul>
                        {userList.map((user) => {
                            return <li key={user._id}>
                                <div>{user.username}</div>
                                <div>
                                    <div className="delete-button"
                                    // onClick={() => props.handleQuestionDelete(question._id)}
                                    >Delete</div>
                                </div>
                            </li>
                        })}
                    </ul>
                </div> : <div></div>
            }
        </div>
    )
}


