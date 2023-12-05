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

	return (
		<div className="header">
			<div id="empty_space"> </div>
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