import { useState } from 'react';
import axios from 'axios';

export default function CommentForm(props) {
    const [error, setError] = useState({
        cText: "",
    });
    const handleSubmit = (event) => {
        event.preventDefault();

        // let validForm = true;
        const formData = new FormData(event.target);
        const cText = formData.get("cText").trim();

        const newError = {
            cText: "",
        };

        if (!cText) {
            newError.aText = "Comment text cannot be empty";
        } 
        if(qSummary.length > 140) {
			newError.qSummary = "Comment text must be less than 140 words!";
		} 
        // else {
        //     const hyperlinkFormat = /\[([^\]]*)\]\(([^)]*)\)/g;
        //     const matches = aText.matchAll(hyperlinkFormat);
        //     for (const match of matches) {
        //         if (match[1] === "" || match[2] === "" || (!match[2].startsWith("https://") && !match[2].startsWith("http://"))) {
        //             // alert("Invalid hyperlink format. Please use [text](https://google.com) format for hyperlinks.");
        //             // validForm = false;
        //             newError.aText = "Invalid hyperlink format. Please use [text](https://google.com) format for hyperlinks.";
        //             break;
        //         }
        //     }
        // }


        setError(newError);

        // if (newError.cText === "" && newError.username === "") {
        //     const newComment = {
        //         text: cText,
        //         com_by: props.user.username,
        //         qid: props.question._id
        //     };
        //     axios.post(`http://localhost:8000/${props.id}/postComment`, newComment, { withCredentials: true })
        //     .then (res => {
        //         // console.log(res.data);
        //         props.handleQuestionChange(res.data);
        //         props.handlePageSwap("answers");
        //     })
        // }

    }

    return (
        <div id="right_bar">
            <form id="newCommentForm"
            onSubmit={handleSubmit}
            >
                {/* <h2>Username*</h2>
                <br></br>
                <input type="text" name="aUsername" className="wordbox" placeholder="Nathan Smith"
                // required
                />
                {error.username && <div className="error-message">{error.username}</div>} */}
                <h2>Comment*</h2>
                <br></br>
                <textarea name="cText" className="wordarea" placeholder="Isn't like this..."
                // required
                ></textarea>
                {error.cText && <div className="error-message">{error.cText}</div>}
                <div id="bottom">
                    <input id="post_comment_button" type="submit" value="Post Comment" />
                    <p style={{ color: 'red' }}>* indicates mandatory fields</p>
                </div>
            </form>
        </div>
    );
}

