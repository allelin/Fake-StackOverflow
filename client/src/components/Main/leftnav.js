export default function LeftNav(props) {
	const handleLogout = () => {
		props.handlePageSwap("welcome")
	}

    return (
		<div className="left_bar">
			<nav className="nav_main">
				<div id="questions" 
				className={`${props.QClicked ? 'clicked' : ''}`} 
				onClick={props.handleQClicked}
				>Questions
				</div>
				<div id="tags" 
				className={`${props.TagClicked ? 'clicked' : ''}`} 
				onClick={props.handleTagClicked}
				>Tags
				</div>
				<button type="button" id="logout_button"
				onClick={handleLogout}
				>Logout</button>
			</nav>
		</div>
	);
}