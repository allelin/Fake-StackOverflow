import { useState } from "react";
import AskQuestion from "../Pages/askquestion";
import Home from "../Pages/home";
import Tags from "../Pages/tags";
import Answers from "../Pages/answers";
import AnswerForm from "../Pages/answerform";


export default function RightContent(props) {
	const [question, setQuestion] = useState(null);
	const [tag, setTag] = useState(null);

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
			/>
			break;
		case "askquestion":
			pageClass = <AskQuestion 
			handlePageSwap={props.handlePageSwap}
			handleSortChange={props.handleSortChange}
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
			/>;
			break;
		case "answerform":
			pageClass = <AnswerForm
			question={question}
			handlePageSwap={props.handlePageSwap}
			handleQuestionChange={handleQuestionChange}
			/>;
			break;
		default:
			pageClass = <Home 
			sort={props.sort}
			search={props.search} 
			handlePageSwap={props.handlePageSwap} 
			handleSortChange={props.handleSortChange} 
			handleQuestionChange={handleQuestionChange}
			tag={tag}
			TopBarLabel={props.TopBarLabel}
			/>
			break;
	}
	return (pageClass);
}