import { useEffect, useState} from "react";
import axios from 'axios'

export default function Tags(props) {
	const [tags, setTags] = useState([]);
	const [rows, setRows] = useState([]);

	useEffect(() => {
		axios.get('http://localhost:8000/tags', { withCredentials: true })
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

			// while (currentRow.length < 3 && currentRow.length > 0) {
			// 	currentRow.push(null); 
			// }
			
			if (currentRow.length > 0) {
				rows.push(currentRow);
			}

			setRows(rows);
			// console.log(rows);
			setTags(tagsList);
		});
	}, []);

	return (
		<div id="right_bar">
			<div className="tagstopbar">
				<h2 id="tagNum"> {tags.length + " tags"} </h2>
				<h2>All Tags</h2>
				<button type="button" id="askbutton" 
				onClick={() => props.handlePageSwap("askquestion")}>Ask Question</button>
			</div>
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
									</div>
								</td>
							// : <td></td>))
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}