import React, { useState, useEffect, useContext } from 'react'
import '../styles/Home.css'
import { AiOutlineLike, AiOutlineDislike, AiOutlineDelete } from 'react-icons/ai'
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';
import M from 'materialize-css';

const FollowedUserPost = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const fetchPosts = async () => {
      await fetch('http://localhost:8000/api/posts/followedPost', {
        method: 'GET',
        headers: {
          "Authorization": "Bearer " + localStorage.getItem('token')
        }
      })
        .then(res => res.json())
        .then(result => {
          setData(result.posts)
          console.log(result.posts);
        })
    }
    fetchPosts()
  }, []);



  const likePost = async (id) => {
    await fetch(`http://localhost:8000/api/posts/like`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('token')
      },
      body: JSON.stringify({
        postId: id
      })
    })
      .then(res => res.json())
      .then(result => {
        const newData = data.map(item => {
          if (item._id === result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData)
      })
      .catch(err => {
        console.log(err);
      })
  }
  const dislikePost = async (id) => {
    await fetch('http://localhost:8000/api/posts/unlike', {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('token')
      },
      body: JSON.stringify({
        postId: id
      })
    })
      .then(res => res.json())
      .then(result => {
        const newData = data.map(item => {
          if (item._id === result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData)
      })
      .catch(err => {
        console.log(err);
      })
  }

  const makeComment = async (text, postId) => {
    await fetch('http://localhost:8000/api/posts/comments', {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('token')
      },
      body: JSON.stringify({
        postId,
        text
      })
    })
      .then(res => res.json())
      .then(result => {
        console.log(result);
        const newData = data.map(item => {
          if (item._id === result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData)
      })
      .catch(err => {
        console.log(err);
      })
  }

  const deletePost = async (postId) => {
    await fetch(`http://localhost:8000/api/posts/delete/${postId}`, {
      method: 'DELETE',
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('token')
      }
    })
      .then(res => res.json())
      .then(result => {
        const newData = data.filter(item => {
          return item._id !== result._id
        })
        setData(newData)
        M.toast({ html: "Deleted Successfully", classes: "#43a047 green darken-1" })
      })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <div className='home_container'>
      {
        data?.map(item => {
          return (
            <div className='card home_card' key={item?._id}>
              <h5 style={{padding:"5px"}}>
                <Link to={item.postedBy._id !== state._id ? `/user_profile/${item.postedBy._id}` : '/profile'}>{item?.postedBy?.name}</Link> 
              {item?.postedBy?._id === state._id && <AiOutlineDelete style={{float:"right", cursor: 'pointer'}} onClick={() => deletePost(item?._id)} />}
              </h5>
              <div className='card-image'>
                <img src={item?.photo} alt='post' />
              </div>
              <div className='card-content'>
                {
                  item?.likes?.includes(state._id)
                    ? <AiOutlineDislike size={20} onClick={() => dislikePost(item?._id)} style={{ cursor: 'pointer' }} />
                    : <AiOutlineLike size={20} onClick={() => likePost(item?._id)} style={{ cursor: 'pointer' }} />
                }
                <h6>{item.likes?.length} likes</h6>
                <h6>{item?.title}</h6>
                <p>{item?.body}</p>
                {
                  item?.comments?.map(res => {
                    return (
                      <h6 key={res._id}><span style={{ fontWeight: '500' }}>{res?.postedBy?.name}</span> {res?.text}</h6>
                    )
                  })
                }
                <form onSubmit={(e) => {
                  e.preventDefault()
                  makeComment(e.target[0].value, item?._id)
                }}>
                  <input type="text" placeholder="add a comment" />
                </form>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default FollowedUserPost