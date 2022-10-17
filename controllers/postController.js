const User = require('../models/user');
const Post = require('../models/post');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
    await Post.find({}).populate('postedBy', '_id name').populate('comments.postedBy', '_id name')
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })

}

const getFollowedPost = async (req, res) => {
    await Post.find({postedBy:{ $in: req.user.following }}).populate('postedBy', '_id name').populate('comments.postedBy', '_id name')
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })

}
// @desc    Create a post
// @route   POST /api/posts
// @access  Protected
const setPost = async (req, res) => {
    const { title, body, pic } = req.body;
    if (!title || !body || !pic) {
        return res.status(422).json({ error: "Please add all the fields" });
    }
    // req.user.password = undefined
    const post = await new Post({
        title,
        body,
        photo: pic,
        postedBy: req.user
    });
    await post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })

};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Protected
const updatePost = async (req, res) => {
    const { title, body } = req.body;
    const post = await Post.findById(req.params.id);
    if (post) {
        post.title = title;
        post.body = body;
        const updatedPost = await post.save();
        res.json(updatedPost);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Protected
const deletePost = async (req, res) => {
    await Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({ error: err })
            }
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.remove()
                    .then(result => {
                        res.json(result)
                    }).catch(err => {
                        console.log(err)
                    })

            }
        })
};
 
// @desc    Get a user's posts
// @route   GET /api/posts/user/:id
// @access  Private
const getUserPosts = async (req, res) => {
    await Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })
};

// @desc    Like a post
// @route   PUT /api/posts/like
// @access  Private
const likePost = async (req, res) => {
    await Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })
};

// @desc    Like a post
// @route   PUT /api/posts/unlike
// @access  Private
const unLikePost = async (req, res) => {
    await Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })
};

// @desc    Comment on a post
// @route   PUT /api/posts/comment
// @access  Private
const commentPost = async (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    await Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true
    })
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
};

module.exports = {
    setPost,
    getPosts,
    updatePost,
    deletePost,
    getUserPosts,
    likePost,
    unLikePost,
    commentPost,
    getFollowedPost
}
