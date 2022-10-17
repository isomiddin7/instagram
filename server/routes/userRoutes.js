const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getMe, otherUserProfile, followUser, unfollowUser, updatePic, searchUser} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.get('/user/:id', protect, otherUserProfile);
router.get('/me', protect, getMe);
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/search_users', searchUser)
router.put('/follow', protect, followUser)
router.put('/updatepic', protect, updatePic)
router.put('/unfollow', protect, unfollowUser)


module.exports = router