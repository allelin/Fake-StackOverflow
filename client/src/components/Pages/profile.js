
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile(props) {
    const date = new Date(props.user.acc_date_created);
    const formattedDate = date.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const [userList, setUserList] = useState([]);
    const [tags, setTags] = useState([]);
    const [rows, setRows] = useState([]);
    // console.log(props.user)	;
    const handleQuestionDelete = async (qid) => {
        try {
            const respond = await axios.get(`http://localhost:8000/deletequestion/${qid}`, { withCredentials: true });
            // console.log(respond.data);
            props.setUser(respond.data);
        } catch (err) {
            console.log(err);
        }
    }

    const handleAnswerDelete = async (aid) => {
        try {
            const respond = await axios.get(`http://localhost:8000/deleteanswer/${aid}`, { withCredentials: true });
            // console.log(respond.data);
            props.setUser(respond.data);
        } catch (err) {
            console.log(err);
        }
    }

    const handleTagDelete = async (tid, index) => {
        
    }

	const handleQuestionEdit = async (question) => {
		try {
			// console.log(question);
			// console.log(props.user);
			let q = (await axios.get(`http://localhost:8000/getquestion/${question._id}`, { withCredentials: true })).data;
			props.setEdit(q);
			props.handlePageSwap("askquestion");
		} catch(err) {
			console.log(err);
		}
	}

	const handleAnswerEdit = async (answer) => {
		try {
			// let q = (await axios.get(`http://localhost:8000/getanswer/${answer._id}`, { withCredentials: true })).data;
			props.setEdit(answer);
			props.handlePageSwap("answerform");
		} catch(err) {
			console.log(err);
		}
	}

	const handleTagEdit = async (tag) => {
		try {
			props.setEdit(tag);
			props.handlePageSwap("edittag");
		} catch(err) {
			console.log(err);
		}
	}

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

    useEffect(() => {
        axios.get(`http://localhost:8000/accountinfo`, { withCredentials: true })
            .then(res => {
                const userData = res.data;
				// console.log(userData);
                props.setUser(userData);
            });
        axios.get(`http://localhost:8000/getallaccounts`, { withCredentials: true })
            .then(res => {
                const userList = res.data;
                setUserList(userList);
            })

        axios.get(`http://localhost:8000/tags`, { withCredentials: true })
            .then(res => {
                const tagsList = res.data;

                const rows = [];
                let currentRow = [];

                tagsList.forEach((tag, index) => {
                    if (index > 0 && index % 3 === 0) {
                        rows.push(currentRow);
                        currentRow = [];
                    }

                    currentRow.push(tag);
                });

                if (currentRow.length > 0) {
                    rows.push(currentRow);
                }

                setRows(rows);
                setTags(tagsList);

            }
            )
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
                        {props.user.questions
                            .sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time))
                            .map((question) => {
                                return <li key={question._id}>
                                    <div className="qName"
									onClick={() => handleAnswer(question)}
									>{question.title}</div>
                                    <div>
                                        <div className="edit-button"
                                        onClick={() => handleQuestionEdit(question)}
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
                                    onClick={() => handleAnswerEdit(answer)}
                                    >Edit</div>
                                    <div className="delete-button"
                                        onClick={() => handleAnswerDelete(answer._id)}
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

                    <table id="tagsDiv">
                        <tbody>
                            {rows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((tag) => (
                                        // tag ? 
                                        <td key={tag.tag._id}>
                                            <div className="tagBox">
                                                <div className="tagName" onClick={() => {
                                                    props.handleTagFilterChange(tag.tag);
                                                    props.handleSortChange("tag");
                                                    props.handlePageSwap("home");
                                                }}>
                                                    {tag.tag.name}
                                                </div>
                                                <p className="numOfQuestions">
                                                    {tag.count === 1
                                                        ? tag.count + " question"
                                                        : tag.count + " questions"}
                                                </p>
                                                <div>
                                                    <div className="edit-button"
                                                    onClick={() => handleTagEdit(tag.tag)}
                                                    >Edit</div>
                                                    <div className="delete-button"
                                                    // onClick={() => handleTagDelete(tag.tag._id, tag.count)}
                                                    >Delete</div>
                                                </div>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* <ul>
                        {props.user.tags.map((tag, index) => {
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
                    </ul> */}
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


