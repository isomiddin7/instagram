const express = require('express')
const router = express.Router()
const { getPosts,setPost,updatePost,deletePost, getUserPosts, likePost, unLikePost, commentPost, getFollowedPost} = require('../controllers/postController')

const { protect } = require('../middleware/authMiddleware')

router.get('/allposts', protect, getPosts)
router.get('/mypost', protect, getUserPosts)
router.get('/followedPost', protect, getFollowedPost)
router.post('/', protect, setPost)
router.put('/update/:id', protect, updatePost)
router.put('/like', protect, likePost)
router.put('/unlike', protect, unLikePost)
router.put('/comments', protect, commentPost)
router.delete('/delete/:postId', protect, deletePost)

module.exports = router