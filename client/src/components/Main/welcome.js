

export default function Welcome(props) {
	return (
		<div className="welcome-container">
			<h1>Welcome to Fake StackOverflow!</h1>
			<div className="welcome-buttons">
				<button className="welcome-login" onClick={() => props.handlePageSwap("login")}>Login</button>
				<button className="welcome-signup" onClick={() => props.handlePageSwap("signup")}>Sign Up</button>
				<button className="welcome-guest" onClick={() => props.handlePageSwap("home")}>Continue as Guest</button>
			</div>
		</div>
	)
}

