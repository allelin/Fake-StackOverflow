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
	const [user, setUser] = useState(null);
	const [userProfile, setUserProfile] = useState(null);

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
		handleSortChange("newest");
		handlePageSwap("home");
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
			pageClass = <Welcome
			handlePageSwap={handlePageSwap}
			handleSortChange={handleSortChange}
			setUser={setUser}
			/>
			break;
		case "signup":
			pageClass = <Signup 
			handlePageSwap={handlePageSwap}
			/>
			break;
		case "login":
			pageClass = <Login 
			handlePageSwap={handlePageSwap}
			setUser={setUser}
			handleSortChange={handleSortChange}
			/>
			break;
		default:
			pageClass = 
		<div id="fso">
			<Header 
			handleSearch={handleSearch} 
			handleSortChange={handleSortChange} 
			handlePageSwap={handlePageSwap}
			user={user}
			setUserProfile={setUserProfile}/>
			<div id="main">
				<LeftNav 
				QClicked={QClicked}
				TagClicked={TagClicked}
				handleQClicked={handleQClicked} 
				handleTagClicked={handleTagClicked}
				handlePageSwap={handlePageSwap}
				user={user}
				setUser={setUser}
				/>
				<RightContent 
				page={page} 
				search={search} 
				sort={sort} 
				handleSortChange={handleSortChange} 
				handlePageSwap={handlePageSwap}
				TopBarLabel={TopBarLabel}
				setUser={setUser}
				user={user}
				userProfile={userProfile}
				setUserProfile={setUserProfile}
				/>
			</div>
		</div>;
			break;
	}

	return (pageClass);
}