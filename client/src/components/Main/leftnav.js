import axios from 'axios'

export default function LeftNav(props) {
	const handleLogout = async () => {
		let logout = await axios.get(`http://localhost:8000/logout`, { withCredentials: true });
		props.setUser(null);
		props.handlePageSwap("welcome");
	}

	const handleSignInUp = () => {
		props.handlePageSwap("welcome");
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
				{props.user ? <button type="button" id="logout_button"
				onClick={handleLogout}
				>Logout</button> : <button type="button" id="signinup_button"
				onClick={handleSignInUp}
				>Sign in/Sign up</button>}
			</nav>
		</div>
	);
}