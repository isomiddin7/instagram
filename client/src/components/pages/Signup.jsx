import React, { useEffect, useState } from 'react'
import '../styles/Signup.css'
import { Link, useNavigate } from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [image, setImage] = useState('')
  const [url, setUrl] = useState('')

  // useEffect(() => {
  //   if (url) {
  //     handleSubmit()
  //   }
  // }, [url])
  // const uploadPic = async () => {
  //   const data = new FormData()
  //   data.append('file', image)
  //   data.append('upload_preset', 'instagram-clone')
  //   data.append('cloud_name', 'dtgshn4gt')
  //   await fetch('https://api.cloudinary.com/v1_1/dtgshn4gt/image/upload', {
  //     method: 'POST',
  //     body: data
  //   }).then(res => res.json())
  //     .then(data => {
  //       setUrl(data.url)
  //     }).catch(err => {
  //       console.log(err)
  //     })
  // }
  const handleSubmit = async  () => {
      if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g.test(email)) {
        M.toast({ html: 'invalid email', classes: '#c62828 red darken-3' })
        return
      }
      await fetch('http://localhost:8000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          pic: url
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: '#c62828 red darken-3' })
          } else {
            M.toast({ html: data.message, classes: '#43a047 green darken-1' })
            navigate('/login')
          }
        }).catch(err => {
          console.log(err)
        })
  }

  return (
    <div className='register_container'>
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        {/* <div className='file-field input-field'>
          <div className='btn #64b5f6 blue darken-1'>
            <span>Upload Profile Picture</span>
            <input
              type='file'
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <div className='file-path-wrapper'>
            <input className='file-path validate' type='text' />
          </div>
        </div> */}
        <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => handleSubmit()}>
          Login
        </button>
        <p>
          <Link to='/login'>Already have an account ?</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup