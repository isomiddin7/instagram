import React, { useContext, useRef, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './styles/Navbar.css';
import { UserContext } from '../App';

import M from 'materialize-css';

const Navbar = () => {
    const navigate = useNavigate()
    const { state, dispatch } = useContext(UserContext)
    const [search, setSearch] = useState('')
    const [userDetails, setUserDetails] = useState([])
    const searchModal = useRef(null)

    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, [])

    const renderList = () => {
        if (state) {
            return [
                <li key="1"><i data-target="modal1" className="large material-icons modal-trigger" style={{ color: "black" }}>search</i></li>,
                // <li key="1" style={{ color: "black" }}><AiOutlineSearch size={20} /> Search</li>,
                <li key="2"><Link to="/profile" className='links'>Profile</Link></li>,
                <li key="3"><Link to="/create" className='links'>Create Post</Link></li>,
                <li key="4"><Link to="/followedUserPost" className='links'>My following Posts</Link></li>,
                <li key="5">
                    <button className="btn #c62828 red darken-3"
                        onClick={() => {
                            localStorage.clear()
                            dispatch({ type: "CLEAR" })
                            navigate('/login')
                        }}
                    >
                        Logout
                    </button>
                </li>


            ]
        } else {
            return [
                <li key="6"><Link to="/Login" className='links'>Signin</Link></li>,
                <li key="7"><Link to="/register" className='links'>Signup</Link></li>

            ]
        }
    }

    const fetchUsers = async (query) => {
        setSearch(query)
        await fetch('http://localhost:8000/api/users/search_users', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query
            })
        })
            .then(res => res.json())
            .then(results => {
                setUserDetails(results.user)
            })
    }


    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state ? "/" : '/login'} className="brand-logo left links" style={{ color: 'black' }}>Instagram</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
            <div id="modal1" className="modal" ref={searchModal} style={{ color: "black" }}>
                <div className="modal-content">
                    <input
                        type="text"
                        placeholder="search users"
                        value={search}
                        onChange={(e) => fetchUsers(e.target.value)}
                    />
                    <ul className="collection">
                        {userDetails?.map(item => {
                            return <Link key={item?._id} to={item?._id !== state._id ? "/user_profile/" + item._id : '/profile'} onClick={() => {
                                M.Modal.getInstance(searchModal.current).close()
                                setSearch('')
                            }}><li className="collection-item" style={{color: 'black', width: '100%'}}>{item?.email}</li></Link>
                        })}
                    </ul>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch('')}>close</button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar