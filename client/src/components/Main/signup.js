import { useState } from "react";
import axios from "axios";

export default function Signup(props) {
	const [error, setError] = useState({
		username: '',
		email: '',
		password: '',
	});

	const handleSubmit = (event) => {
		event.preventDefault();

		const formData = new FormData(event.target);
		const username = formData.get("username").trim();
		const email = formData.get("email").trim();
		const password = formData.get("password").trim();

		const newError = {
			username: '',
			email: '',
			password: '',
		};

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if(!email) {
			newError.email = "Email required!";
		} else if(!emailRegex.test(email)) {
			newError.email = "Invalid email form!";
		}

		if(!username) {
			newError.username = "Username required!";
		}

		if(!password) {
			newError.password = "Password required!";
		}else if(password.includes(username) || password.includes(email.split("@")[0])) {
			newError.password = "Password includes username or email id!";
		}

	}

    return (
        <form className="signup-container" onSubmit={handleSubmit}>
            <h1>Sign up</h1>
            <label className = "signup-label">
                Username:
                <input type="text" name="username"  />
            </label>
            <label className = "signup-label">
                Email:
                <input type="email" name="email"  />
            </label>
            <label className = "signup-label">
                Password:
                <input type="password" name="password"  />
            </label>
            <button className = "signup-button" type="submit">Sign up</button>
        </form>
    )
}