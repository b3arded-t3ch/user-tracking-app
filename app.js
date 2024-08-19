const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/user_tracking_app', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log('connected to MongoDB');
});


const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
	res.send('Hello world!');
});

app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`);
});
