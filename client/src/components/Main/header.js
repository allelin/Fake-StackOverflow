import { useState } from "react";

export default function Header(props) {
	const [searchValue, setSearchValue] = useState('');

	const handleSearchValue = props.handleSearch;
	const handleSortChange = props.handleSortChange;
	const handlePageSwap = props.handlePageSwap;

	const handleInputChange = (event) => {
		setSearchValue(event.target.value);
	};

	const handleSearch = (event) => {
		if(event.key === 'Enter') {
			const searchQuery = searchValue.toLowerCase().trim();
			handleSearchValue(searchQuery.split(/\s+/).filter(Boolean));
			handleSortChange("search");
			handlePageSwap("home");
		}
	}
	// console.log(props.user.);
	return (
		<div className="header">
			{props.user ? <div id="empty_space" onClick={() => handlePageSwap("profile")}>View Profile <br></br> {props.user.username} </div> : <div id="empty_space">Welcome <br></br> Guest </div>}
			<h1 id = "title">Fake StackOverflow</h1>
			<div id="search-bar">
				<input type="text" 
				placeholder="Search..." 
				value={searchValue} 
				onKeyDown={handleSearch} 
				onChange={handleInputChange}
				/>
			</div>
		</div>
	);
}