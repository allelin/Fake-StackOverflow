import { useState } from "react";
import axios from "axios";

export default function Signup(props) {
	const [error, setError] = useState({
		username: '',
		email: '',
		password: '',
		retype: ''
	});

	const handleSubmit = async (event) => {
		try {
			event.preventDefault();

			const formData = new FormData(event.target);
			const username = formData.get("username").trim();
			const email = formData.get("email").trim().toLowerCase();
			const password = formData.get("password").trim();
			const retype = formData.get("retype").trim();

			const newError = {
				username: '',
				email: '',
				password: '',
				retype: ''
			};

			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if(!email) {
				newError.email = "Email required!";
			} else if(!emailRegex.test(email)) {
				newError.email = "Invalid email form!";
			} else {
				const emailExist = (await axios.get(`http://localhost:8000/account/${email}`, { withCredentials: true })).data;
				if(emailExist) {
					newError.email = "Email exist already!";
				}
			}

			if(!username) {
				newError.username = "Username required!";
			}

			if(!password) {
				newError.password = "Password required!";
			} else if(password.includes(username) || password.includes(email.split("@")[0])) {
				newError.password = "Password includes username or email id!";
			}

			if(!retype) {
				newError.retype = "Retype password required!"
			} else if(retype != password) {
				newError.retype = "Retyped password does not match!"
			}
			// console.log(newError);
			setError(newError);

			if(Object.values(newError).every(field => field === '')) {
				const newAcc = {
					username: username,
					email: email,
					password: password
				}

				axios.post(`http://localhost:8000/postaccount`, newAcc)
				.then(res => {
					props.handlePageSwap("login");
				});
			}
		} catch(error) {
			console.log(error);
		}

	}

    return (
        <div className="signup-container">
            <form className="signup" onSubmit={handleSubmit}>
                <h1>Sign up</h1>
                <label className="signup-field">Username</label>
                <input type="text" name="username" className="signup-input" placeholder="Username" />
				{error.username && <div className="error-message">{error.username}</div>}
                <label className="signup-field">Email</label>
                <input type="text" name="email" className="signup-input" placeholder="Wolfie@stonybrook.edu" />
				{error.email && <div className="error-message">{error.email}</div>}
                <label className="signup-field">Password</label>
                <input type="password" name="password" className="signup-input" placeholder="Password" />
				{error.password && <div className="error-message">{error.password}</div>}
                <label className="signup-field">Retype Password</label>
                <input type="password" name="retype" className="signup-input" placeholder="Retype your password" />
				{error.retype && <div className="error-message">{error.retype}</div>}
                <button id="signup-submit" type="submit">Sign up</button>
            </form>
        </div>
    )
}



{/* 
        <form className="signup-container" onSubmit={props.handleSubmit}>
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
}  */}

