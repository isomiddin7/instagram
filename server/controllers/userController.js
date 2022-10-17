const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/user')
const Post = require('../models/post')
const { ObjectId } = require('mongodb');
// @desc    Register new user
// @route   POST /api/users
// @access  Public

const registerUser = async (req, res) => {
  const { name, email, password } = req.body
  if (!email || !password || !name) {
    return res.status(422).json({ error: "please add all the fields" })
  }
  await User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "user already exists with that email" })
      }
      bcrypt.hash(password, 12)
        .then(hashedpassword => {
          const user = new User({
            email,
            password: hashedpassword,
            name
          });

          user.save()
            .then(user => {
              res.json({ message: "saved successfully" })
            })
            .catch(err => {
              console.log(err)
            })
        })

    })
    .catch(err => {
      console.log(err)
    })
}


// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: "please add email or password" })
  }
  await User.findOne({ email: email })
    .then(savedUser => {
      if (!savedUser) {
        return res.status(400).json({ error: "Invalid Email or password" })
      }
      bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
          if (doMatch) {
            const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET)
            const { _id, name, email, followers, following, pic} = savedUser
            res.json({ token, user: { _id, name, email, followers, following, pic} })
          }
          else {
            return res.status(400).json({ error: "Invalid Email or password" })
          }
        })
        .catch(err => {
          console.log(err)
        })
    })
}

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

const otherUserProfile = async (req, res) => {
  await User.findOne({ _id: ObjectId(req.params.id) })
    .select("-password")
    .then(user => {
      Post.find({ postedBy: ObjectId(req.params.id) })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err })
          }
          res.json({ user, posts })
        })
    }).catch(error => {
      return res.status(404).json({ error: "User not found" })
    })
}

// @desc follow user
// @route PUT /api/users/follow
// @access Private
const followUser = async (req, res) => {
  User.findByIdAndUpdate(req.body.followId, {
    $push: { followers: req.user._id }
  }, {
    new: true
  }, (err, result) => {
    if (err) {
      return res.status(422).json({ error: err })
    }
    User.findByIdAndUpdate(req.user._id, {
      $push: { following: req.body.followId }

    }, { new: true }).select("-password").then(result => {
      res.json(result)
    }).catch(err => {
      return res.status(422).json({ error: err })
    })

  }
  )
  // const user = await User.findById(ObjectId(req.body.followId)).populate("followers", "_id name").populate('postedBy', '_id name');
  // user.followers.push(req.user._id)
  // await user.save((err, result) => {
  //   if(err)
  //     return res.status(422).json({error:err})

  //   return res.status(200).json({message:result});
  // }
  // )
}
// @desc unfollow user
// @route PUT /api/users/unfollow
// @access Private
const unfollowUser = async (req, res) => {
  User.findByIdAndUpdate(req.body.unfollowId, {
    $pull: { followers: req.user._id }
  }, {
    new: true
  }, (err, result) => {
    if (err) {
      return res.status(422).json({ error: err })
    }
    User.findByIdAndUpdate(req.user._id, {
      $pull: { following: req.body.unfollowId }

    }, { new: true }).select("-password").then(result => {
      res.json(result)
    }).catch(err => {
      return res.status(422).json({ error: err })
    })

  }
  )
  // const user = await User.findById(ObjectId(req.body.unfollowId)).populate("followers", "_id name").populate('postedBy', '_id name');
  // user.followers.pull(req.user._id)
  // await user.save((err, result) => {
  //   if (err)
  //     return res.status(422).json({ error: err })

  //   return res.status(200).json({ message: result });
  // }
  // )
}

// @desc update user profile
// @route PUT /api/users/update
// @access Private
const updatePic = async (req, res) => {
  User.findByIdAndUpdate(req.user._id, { $set: { pic: req.body.pic } }, { new: true }, (err, result) => {
    if (err) {
      return res.status(422).json({ error: "pic cannot post" })
    }
    res.json(result)
  })
}

// @desc search user
// @route GET /api/users/search
// @access Public
const searchUser = async (req, res) => {
  let userPattern = new RegExp("^" + req.body.query)
  User.find({ email: { $regex: userPattern } })
    .select("_id email")
    .then(user => {
      res.json({ user })
    }).catch(err => {
      console.log(err)
    })
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
  otherUserProfile,
  followUser,
  unfollowUser,
  updatePic,
  searchUser
}