import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom';
import '../styles/UserProfile.css'

const UserProfile = () => {
    const { state, dispatch } = useContext(UserContext);
    const { userId } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [showFollow, setShowFollow] = useState(state ? !state.following?.includes(userId) : true);

    useEffect(() => {
        const fetchData = async () => {
            await fetch(`http://localhost:8000/api/users/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            })
                .then(res => res.json())
                .then(data => {
                    setUserProfile(data);
                    console.log(data);
                })
                .catch(err => {
                    console.log(err);
                })
        }
        fetchData();
    }, [userId]);

    const followUser = () => {
        fetch(`http://localhost:8000/api/users/follow`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                followId: userId
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                dispatch({ type: 'UPDATE', payload: { following: data.following, followers: data.followers } });
                localStorage.setItem('user', JSON.stringify(data));
                setUserProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id]
                        }
                    }
                })
                setShowFollow(false);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const unfollowUser = () => {
        fetch(`http://localhost:8000/api/users/unfollow`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                unfollowId: userId
            })
        })
            .then(res => res.json())
            .then(data => {
                dispatch({ type: 'UPDATE', payload: { following: data.following, followers: data.followers } });
                localStorage.setItem('user', JSON.stringify(data));
                setUserProfile((prevState) => {
                    const newFollower = prevState.user.followers.filter(item => item !== data._id);
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollower
                        }
                    }
                })
                setShowFollow(true)
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <>
            {
                userProfile ?
                    <div className='container-4'>
                        <div className='profile_container-4'>
                            <div>
                                <img
                                    src={userProfile?.user?.pic}
                                    alt="pic"
                                    className='profile_pic-4'
                                />
                            </div>
                            <div>
                                <h6>{userProfile?.user?.name}</h6>
                                <h6>{userProfile?.user?.email}</h6>
                                <div className='info_container-4'>
                                    <h6>{userProfile?.posts?.length} posts</h6>
                                    <h6>{userProfile?.user?.followers?.length} followers</h6>
                                    <h6>{userProfile?.user?.following?.length} following</h6>
                                </div>
                                {showFollow ?
                                    <button style={{
                                        margin: "10px"
                                    }} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                        onClick={() => followUser()}
                                    >
                                        Follow
                                    </button>
                                     : 
                                    <button
                                        style={{
                                            margin: "10px"
                                        }}
                                        className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                        onClick={() => unfollowUser()}
                                    >
                                        UnFollow
                                    </button>
                                }
                            </div>
                        </div>
                        <div className='gallery-4'>
                            {
                                userProfile?.posts?.map(item => {
                                    return (
                                        <img
                                            key={item?._id}
                                            className='item-4'
                                            src={item?.photo}
                                            alt={item?.title}
                                        />
                                    )
                                })
                            }
                        </div>
                    </div>
                    : <h2>Loading...</h2>
            }
        </>
    )
}

export default UserProfile