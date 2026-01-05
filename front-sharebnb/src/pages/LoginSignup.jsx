// LoginSignup.jsx
import { Outlet, useNavigate } from 'react-router'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'

import { userService } from '../services/user'
import { login, signup } from '../store/actions/user.actions'
import { ImgUploader } from '../cmps/ImgUploader'

export function LoginSignup() {
    return (
        <div className="login-page">
            <Outlet />
        </div>
    )
}

export function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' })
    const navigate = useNavigate()

    async function onLogin(ev = null) {
        if (ev) ev.preventDefault()
        if (!credentials.username) return
        await login(credentials)
        navigate('/')
    }

    async function onDemoLogin(ev) {
        if (ev) ev.preventDefault()
        const demoCreds = {
            username: 'Alon Ben Ari',
            password: 'Baravizemer',
        }
        setCredentials(demoCreds)
        try {
            await login(demoCreds)
        } catch (err) {
            try {
                await signup({
                    username: 'Alon Ben Ari',
                    password: 'Baravizemer',
                    fullname: 'Alon Ben Ari',
                    imgUrl: 'https://ca.slack-edge.com/T08T1AM7L02-U08T35Z7745-79b18d468cce-512'
                })
            } catch (e) {
            }
        }
        navigate('/stay')
    }

    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }

    return (
        <form className="login-form" onSubmit={onLogin}>
            <div className="form-header-container">
                <h2>Log in</h2>
            </div>
            <input
                type="text"
                name="username"
                value={credentials.username}
                placeholder="Username"
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                value={credentials.password}
                placeholder="Password"
                onChange={handleChange}
                required
            />
            <button type="submit">Log in</button>
            <div className="or-divider">
                <hr /> <span>or</span> <hr />
            </div>
            <div className="demo-signup-links">
                <NavLink to="/stay" onClick={onDemoLogin}>
                    <div className="form-nav-container">
                        Demo login
                    </div>
                </NavLink>
                <NavLink to="/auth/signup">
                    <div className="form-nav-container">
                        Sign up
                    </div>
                </NavLink>
            </div>
        </form>
    )
}

export function Signup() {
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const navigate = useNavigate()

    function clearState() {
        setCredentials({ username: '', password: '', fullname: '', email: '', imgUrl: '' })
    }

    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }

    async function onSignup(ev = null) {
        if (ev) ev.preventDefault()
        // EDIT: also require email (we rely on it downstream)
        if (!credentials.username || !credentials.password || !credentials.fullname || !credentials.email) return // EDIT
        await signup(credentials)
        clearState()
        navigate('/')
    }

    function onUploaded(imgUrl) {
        setCredentials({ ...credentials, imgUrl })
    }

    return (
        <form className="signup-form" onSubmit={onSignup}>
            <div className="form-header-container">
                <h2>Sign up</h2>
            </div>
            <input
                type="text"
                name="fullname"
                value={credentials.fullname}
                placeholder="Fullname"
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="username"
                value={credentials.username}
                placeholder="Username"
                onChange={handleChange}
                required
            />
            <input
                type="email"
                name="email"
                value={credentials.email || ''}
                placeholder="Email"
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                value={credentials.password}
                placeholder="Password"
                onChange={handleChange}
                required
            />
            <ImgUploader onUploaded={onUploaded} />
            <button>Sign up</button>

            <div className="or-divider">
                <hr /> <span>or</span> <hr />
            </div>

            <NavLink to="/auth/login">
                <div className="form-nav-container">Log in</div>
            </NavLink>
        </form>
    )
}
