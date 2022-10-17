import React, { useState, useEffect } from 'react'
import '../styles/CreatePost.css';
import M from 'materialize-css'
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [image, setImage] = useState('')
    const [url, setUrl] = useState('')

    useEffect(() => {
        const getData = async () => {
            if (url) {
                await fetch('http://localhost:8000/api/posts/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        title,
                        body,
                        pic: url
                    })
                }).then(res => res.json())
                    .then(data => {
                        if (data.error) {
                            M.toast({ html: data.error, classes: '#c62828 red darken-3' })
                        } else {
                            M.toast({ html: 'created post success', classes: '#43a047 green darken-1' })
                            navigate('/')
                        }
                    }).catch(err => {
                        console.log(err)
                    })

            }
        }
        getData()
    }, [url])

    const handleSubmit = async () => {
        const data = new FormData()
        data.append('file', image)
        data.append('upload_preset', 'instagram-clone')
        data.append('cloud_name', 'dtgshn4gt')
        await fetch('https://api.cloudinary.com/v1_1/dtgshn4gt/image/upload', {
            method: 'POST',
            body: data
        }).then(res => res.json())
            .then(data => {
                setUrl(data.url)
            }).catch(err => {
                console.log(err)
            })
    }
    return (
        <div className='card input-field'>
            <input
                type='text'
                placeholder='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type='text'
                placeholder='body'
                value={body}
                onChange={(e) => setBody(e.target.value)}
            />
            <div className='file-field input-field'>
                <div className='btn #64b5f6 blue darken-1'>
                    <span>Upload Image</span>
                    <input
                        type='file'
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <div className='file-path-wrapper'>
                    <input className='file-path validate' type='text' />
                </div>
            </div>
            <button className='btn waves-effect waves-light #64b5f6 blue darken-1' onClick={() => handleSubmit()}>
                Create Post
            </button>
        </div>
    )
}

export default CreatePost