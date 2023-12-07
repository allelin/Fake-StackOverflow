

export default function Login(props) {
    return (
        <div className="login-container">
            <form className="login">
                <h1>Login</h1>
                <label className="login-field">Username</label>
                <input type="email" className="login-input" placeholder="Username" />
                <label className="login-field">Password</label>
                <input type="password" className="login-input" placeholder="Password" />
                <button id="login-submit" type="submit">Login</button>
            </form>
        </div>
    )
}
