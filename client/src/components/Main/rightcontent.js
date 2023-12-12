import { useState } from "react";
import AskQuestion from "../Pages/askquestion";
import Home from "../Pages/home";
import Tags from "../Pages/tags";
import Answers from "../Pages/answers";
import AnswerForm from "../Pages/answerform";
import Profile from "../Pages/profile";
import EditTag from "../Pages/edittag";


export default function RightContent(props) {
	const [question, setQuestion] = useState(null);
	const [tag, setTag] = useState(null);
	const [edit, setEdit] = useState(null);

	const handleQuestionChange = (q) => {
		setQuestion(q);
	}

	const handleTagFilterChange = (t) => {
		setTag(t);
	}

	let pageClass;
	switch (props.page) {
		case "home":
			pageClass = <Home 
			sort={props.sort}
			search={props.search} 
			handlePageSwap={props.handlePageSwap} 
			handleSortChange={props.handleSortChange} 
			handleQuestionChange={handleQuestionChange}
			tag={tag}
			TopBarLabel={props.TopBarLabel}
			user={props.user}
			/>
			break;
		case "askquestion":
			pageClass = <AskQuestion 
			handlePageSwap={props.handlePageSwap}
			handleSortChange={props.handleSortChange}
			user={props.user}
			setUser={props.setUser}
			edit={edit}
			setEdit={setEdit}
			/>
			break;
		case "tags":
			pageClass = <Tags
			handlePageSwap={props.handlePageSwap} 
			handleTagFilterChange={handleTagFilterChange}
			handleSortChange={props.handleSortChange}/>;
			break;
		case "answers":
			pageClass = <Answers
			handlePageSwap={props.handlePageSwap}
			question={question}
			user={props.user}
			setUser={props.setUser}
			handleQuestionChange={handleQuestionChange}
			/>;
			break;
		case "answerform":
			pageClass = <AnswerForm
			question={question}
			handlePageSwap={props.handlePageSwap}
			handleQuestionChange={handleQuestionChange}
			user={props.user}
			edit={edit}
			setEdit={setEdit}
			setUser={props.setUser}
			/>;
			break;
		case "profile":
			pageClass = <Profile
			user={props.user}
			setUser={props.setUser}
			handlePageSwap={props.handlePageSwap}
			setEdit={setEdit}
			handleQuestionChange={handleQuestionChange}
			handleTagFilterChange={handleTagFilterChange}
			handleSortChange={props.handleSortChange}
			/>
			break;
		case "edittag":
			pageClass = <EditTag
			edit={edit}
			setEdit={setEdit}
			handlePageSwap={props.handlePageSwap}

			/>
			break;
		default:
			pageClass = <> </>;
			break;
	}
	return (pageClass);
}