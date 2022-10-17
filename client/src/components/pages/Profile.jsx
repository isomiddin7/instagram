import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import '../styles/Profile.css'

const Profile = () => {
  const [pics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");


  useEffect(() => {
    const fetchUser = async () => {
      await fetch('http://localhost:8000/api/posts/mypost', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
      })
        .then(res => res.json())
        .then(data => {
          setPics(data.posts);
        })
        .catch(err => {
          console.log(err)
        })
    }
    fetchUser()
  }, []);


  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append('file', image);
      data.append('upload_preset', 'instagram-clone');
      data.append('cloud_name', 'dtgshn4gt');
      fetch('https://api.cloudinary.com/v1_1/dtgshn4gt/image/upload', {
        method: 'POST',
        body: data
      })
        .then(res => res.json())
        .then(data => {
          fetch('http://localhost:8000/api/users/updatepic', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
              pic: data.url
            })
          })
            .then(res => res.json())
            .then(result => {
              localStorage.setItem('user', JSON.stringify({ ...state, pic: result.pic }))
              dispatch({ type: 'UPDATEPIC', payload: result.pic })
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }, [image])

  const updatePhoto = (file) => {
    setImage(file)
  }


  return (
    <div className='container-3'>
      <div className='profile_container'>
        <div className='x'>
          <div>
            <img
              style={{ width: '160px', height: '160px', borderRadius: '80px' }}
              src={state?.pic}
              alt="pic"
              className='profile_pic'
            />
          </div>
          <div>
            <h4>{state?.name}</h4>
            <h4>{state?.email}</h4>
            <div className='infos'>
              <h6>{pics?.length} posts</h6>
              <h6>{state?.followers?.length} followers</h6>
              <h6>{state?.following?.length} following</h6>
            </div>
          </div>
        </div>
        <div className="file-field input-field">
          <div className="btn #64b5f6 blue darken-1">
            <span>Update pic</span>
            <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
      </div>
      <div className='gallery'>
        {
          pics?.map(item => {
            return (
              <img
                key={item._id}
                className='item'
                src={item?.photo}
                alt={item?.title}
              />
            )
          })
        }
      </div>
    </div>
  )
}

export default Profile