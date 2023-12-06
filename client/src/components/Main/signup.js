
export default function Signup(props) {
    return (
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
}