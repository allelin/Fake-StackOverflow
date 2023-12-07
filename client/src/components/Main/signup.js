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
        <div className="signup-container">
            <form className="signup" onSubmit={handleSubmit}>
                <h1>Sign up</h1>
                <label className="signup-field">Username</label>
                <input type="text" className="signup-input" placeholder="Username" />
                <label className="signup-field">Email</label>
                <input type="email" className="signup-input" placeholder="Wolfie@stonybrook.edu" />
                <label className="signup-field">Password</label>
                <input type="password" className="signup-input" placeholder="Password" />
                <label className="signup-field">Retype Password</label>
                <input type="password" className="signup-input" placeholder="Retype your password" />
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



{/* 
<div class="container">
	<div class="screen">
		<div class="screen__content">
			<form class="login">
				<div class="login__field">
					<i class="login__icon fas fa-user"></i>
					<input type="text" class="login__input" placeholder="User name / Email">
				</div>
				<div class="login__field">
					<i class="login__icon fas fa-lock"></i>
					<input type="password" class="login__input" placeholder="Password">
				</div>
				<button class="button login__submit">
					<span class="button__text">Log In Now</span>
					<i class="button__icon fas fa-chevron-right"></i>
				</button>				
			</form>
		</div>
		<div class="screen__background">
			<span class="screen__background__shape screen__background__shape4"></span>
			<span class="screen__background__shape screen__background__shape3"></span>		
			<span class="screen__background__shape screen__background__shape2"></span>
			<span class="screen__background__shape screen__background__shape1"></span>
		</div>		
	</div>
</div> */}