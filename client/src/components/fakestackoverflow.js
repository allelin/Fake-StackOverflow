import { useState } from 'react';
import Header from './Main/header';
import LeftNav from './Main/leftnav';
import RightContent from './Main/rightcontent';
import Welcome from './Main/welcome';
import Signup from './Main/signup';
import Login from './Main/login';

export default function FakeStackOverflow() {
	const [page, setPage] = useState("welcome");
	const [sort, setSort] = useState("newest");
	const [TopBarLabel, setTopBarLabel] = useState("All Questions");
	const [QClicked, setQClicked] = useState(true);
	const [TagClicked, setTagClicked] = useState(false);
	const [search, setSearch] = useState([]);

	const handlePageSwap = (page) => {
		if(page === "home") {
			if(!QClicked) {
				setQClicked(!QClicked);
				setTagClicked(!TagClicked);
			}
		}
		if(page === "tags") {
			if(!TagClicked) {
				setQClicked(!QClicked);
				setTagClicked(!TagClicked);
			}
		}
		setPage(page);
	}

	const handleSearch = (searchQuery) => {
		setSearch(searchQuery);
	}

	const handleSortChange = (sortName) => {
		if(sortName === "search") {
			handleTopBarLabel("Search Results");
		} else {
			handleTopBarLabel("All Questions");
		}
		setSort(sortName);
	}

	const handleQClicked = () => {
		handlePageSwap("home");
		handleSortChange("newest");
	}
	
	const handleTagClicked = () => {
		handlePageSwap("tags");
	}

	const handleTopBarLabel = (label) => {
		setTopBarLabel(label);
	}

	let pageClass;
	switch(page) {
		case "welcome":
			pageClass = <Signup 
			/>
			break;
		default:
			pageClass = 
		<div id="fso">
			<Header 
			handleSearch={handleSearch} 
			handleSortChange={handleSortChange} 
			handlePageSwap={handlePageSwap}/>
			<div id="main">
				<LeftNav 
				QClicked={QClicked}
				TagClicked={TagClicked}
				handleQClicked={handleQClicked} 
				handleTagClicked={handleTagClicked}
				/>
				<RightContent 
				page={page} 
				search={search} 
				sort={sort} 
				handleSortChange={handleSortChange} 
				handlePageSwap={handlePageSwap}
				TopBarLabel={TopBarLabel}
				/>
			</div>
		</div>;
			break;
	}

	return (pageClass);
}