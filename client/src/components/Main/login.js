import { useState } from "react"
import axios from "axios"


export default function Login(props) {
    const [error, setError] = useState({
        email: '',
        password: ''
    })

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const email = formData.get("email").trim().toLowerCase();
        const password = formData.get("password").trim();

        const newError = {
            email: '',
            password: ''
        }

        if(!email) {
            newError.email = "Email required!";
        }

        if(!password) {
            newError.password = "Password required!";
        }

        setError(newError);

        if(Object.values(newError).every(field => field === '')) {     
            axios.get(`http://localhost:8000/login/${email}/${password}`, { withCredentials: true })  
            .then(res => {
                if(res.data) {
                    props.setUser(res.data);
					// console.log(res.data.username);
					props.handleSortChange("newest");
                    props.handlePageSwap("home");
                } else {
                    setError({ email: "Email or password is incorrect!", password: "Email or password is incorrect!" });
                }
            }
            )
        }
    }




    return (
        <div className="login-container">
            <form className="login" onSubmit={handleSubmit}>
                <h1>Login</h1>
                <label className="login-field">Email</label>
                <input type="text" name="email" className="login-input" placeholder="wolfie@stonybrook.edu" />
                {error.email && <p className="error-message">{error.email}</p>}
                <label className="login-field">Password</label>
                <input type="password" name="password" className="login-input" placeholder="Password" />
                {error.password && <p className="error-message">{error.password}</p>}
                <button id="login-submit" type="submit">Login</button>
            </form>
        </div>
    )
}

