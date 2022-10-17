const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a text value'],
    },
    body: {
      type: String,
      required: [true, 'Please add a text value'],
    },
    photo: {
      type: String,
      required: true,
    },
    likes: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User'
    }],
    comments: [{
      text: String,
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }],
  },
  {
    timestamps: true,
  }
)
const Post = mongoose.model('Post', postSchema)
module.exports = Post