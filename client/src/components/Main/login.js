
export default function Login(props) {
    return (
        <form className="login-container" onSubmit={props.handleSubmit}>
            <h1>Log in</h1>
            <label className = "login-label">
                Email:
                <input type="email" name="email"  />
            </label>
            <label className = "login-label">
                Password:
                <input type="password" name="password"  />
            </label>
            <button className = "login-button" type="submit">Sign up</button>
        </form>
    )
}