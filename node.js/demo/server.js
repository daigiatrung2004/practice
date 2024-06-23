const cookieParser = require('cookie-parser');
const express = require('express');

const port = '3000';
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	res.render('pages/index');
});

const db = {
	users: [
		{
			id: 1,
			email: 'nguyenvana@gmail.com',
			password: 'daoanhvu1',
		},
	],
};

sessions = [];

// LOGIN [GET]
app.get('/login', (req, res) => {
	res.render('pages/login');
});

// LOGIN [POST]
app.post('/login', (req, res) => {
	const { email, password } = req.body;
	const user = db.users.find((user) => user.email == email && user.password == password);

	if (user) {
		const sessionId = Date.now().toString();
		sessions[sessionId] = user.id;
		return res.setHeader('Set-Cookie', `sessionId=${sessionId};httpOnly;`).redirect('/dashboard');
	}
	res.render('pages/login');
});

// dashboard [GET]
app.get('/dashboard', (req, res) => {
	const userId = sessions[req.cookies.sessionId];
	const user = db.users.find((user) => user.id == userId);

	if (user) {
		return res.render('pages/dashboard');
	}

	delete sessions[req.cookies.sessionId];
	res.setHeader('Set-Cookie', ``).redirect('/dashboard').redirect('/login');
});

app.listen(port, () => {
	console.log(`web server run port ${port} success`);
});
