const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const app = express();
const helmet = require('helmet');
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');


// connecting db
mongoose.connect(process.env.MONGO_URL,  () => {
    console.log('Connected to DB');
});


app.use(cors({origin: '*'}));
app.use(express.json());
app.use(helmet())
app.use(express.urlencoded({extended: false}));


app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);



app.listen(port, () => console.log(`Listening on port ${port}`));    