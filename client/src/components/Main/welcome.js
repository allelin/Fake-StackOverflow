import { useEffect } from "react"
import axios from 'axios'

export default function Welcome(props) {
	useEffect(() => {
		axios.get(`http://localhost:8000/verifyuser`, { withCredentials: true })
		.then(res => {
			if(res.data){
				// console.log(res.data);
				props.setUser(res.data);
				props.handlePageSwap("home");
			}
		});
	});

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

