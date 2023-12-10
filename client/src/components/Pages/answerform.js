import { useState } from 'react';
import axios from 'axios';

export default function AnswerForm(props) {
    const [error, setError] = useState({
        aText: "",
        // username: "",
    });
    const handleSubmit = (event) => {
        event.preventDefault();

        // let validForm = true;
        const formData = new FormData(event.target);
        const aText = formData.get("aText").trim();
        // const username = formData.get("aUsername").trim();

        const newError = {
            aText: "",
            // username: "",
        };

        if (!aText) {
            newError.aText = "Answer text cannot be empty";
        } else {
            const hyperlinkFormat = /\[([^\]]*)\]\(([^)]*)\)/g;
            const matches = aText.matchAll(hyperlinkFormat);
            for (const match of matches) {
                if (match[1] === "" || match[2] === "" || (!match[2].startsWith("https://") && !match[2].startsWith("http://"))) {
                    // alert("Invalid hyperlink format. Please use [text](https://google.com) format for hyperlinks.");
                    // validForm = false;
                    newError.aText = "Invalid hyperlink format. Please use [text](https://google.com) format for hyperlinks.";
                    break;
                }
            }
        }

        // if (!username) {
        //     newError.username = "Username cannot be empty";
        // }

        setError(newError);

		// console.log("hi");

        if (newError.aText === "") {
            const newAnswer = {
                text: aText,
                // ans_by: props.user.username,
                qid: props.question._id,
				// email: props.user,email
            };
			// console.log("hi");
            axios.post(`http://localhost:8000/postanswer`, newAnswer, { withCredentials: true })
            .then (res => {
                // console.log(res.data);
                props.handleQuestionChange(res.data);
                props.handlePageSwap("answers");
            });
        }

    }

    return (
        <div id="right_bar">
            <form id="newAnswerForm"
            onSubmit={handleSubmit}
            >
                {/* <h2>Username*</h2>
                <br></br>
                <input type="text" name="aUsername" className="wordbox" placeholder="Nathan Smith"
                // required
                />
                {error.username && <div className="error-message">{error.username}</div>} */}
                <h2>Answer Text*</h2>
                {/* <br></br> */}
                <textarea name="aText" className="wordarea" placeholder="You can do this..."
                // required
                ></textarea>
                {error.aText && <div className="error-message">{error.aText}</div>}
                <div id="bottom">
                    <input id="post_answer_button" type="submit" value="Post Answer" />
                    <p style={{ color: 'red' }}>* indicates mandatory fields</p>
                </div>
            </form>
        </div>
    );
}

