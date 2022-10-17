import React, { useState, useContext } from 'react'
import '../styles/Login.css'
import { Link, useNavigate } from 'react-router-dom';
import M from 'materialize-css';
import { UserContext } from '../../App'


const Login = () => {
  const {state, dispatch} = useContext(UserContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g.test(email)) {
      M.toast({ html: 'invalid email', classes: '#c62828 red darken-3' })
      return
    }
    await fetch('http://localhost:8000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        pic: 'https://res.cloudinary.com/dtgshn4gt/image/upload/v1665886577/noAvatar_gfblpw.png',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: '#c62828 red darken-3' })
        } else {
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          dispatch({ type: 'USER', payload: data.user })
          M.toast({ html: "signedin success", classes: '#43a047 green darken-1' })
          navigate('/')
        }
      }).catch(err => {
        console.log(err)
      })
  }
  return (
    <div className='card_container'>
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => handleSubmit()}>
          Login
        </button>
        <p>
          <Link to='/register'>Don't have an account ?</Link>
        </p>
      </div>
    </div>
  )
}

export default Login