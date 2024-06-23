const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const https = require('https');
const crypto = require('crypto');
const { base64url } = require('./helpers');
const fs = require('fs');
const secretKey = '35ee9567863076b01682233e803ea586cd5ae85427664eb3698ec38b48d86750';

const app = express();
app.use(cookieParser());
app.use(
	cors({
		origin: 'http://localhost:5173',
		optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
		credentials: true,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;

const users = [
	{
		userId: 1,
		email: 'nguyenvana@gmail.com',
		password: 'daoanhvu1',
	},
];

const db = [
	{
		id: 1,
		title: 'title 1',
		description: 'description 1',
	},
	{
		id: 2,
		title: 'title 2',
		description: 'description 2',
	},
	{
		id: 3,
		title: 'title 3',
		description: 'description 3',
	},
];

const sessions = {};

app.get('/api/posts', (req, res) => {
	res.json(db);
});

app.get('/api/auth/me', (req, res) => {
	// console.dir(sessions);
	// console.log(req.cookies);
	// const sessionId = req.cookies.sessionId;
	// if (!sessionId) {
	// 	return res.status(401).json({ message: 'Authorized' });
	// }

	// const user = users.find((user) => user.userId == sessions[sessionId].sub);

	// res.json(user);
	console.log(req.headers.authorization);
	const token = req.headers.authorization?.slice(7);
	const [headerBase64, payloadBase64, SecretKeyReq] = token.split('.');

	// create sign
	const hmac = crypto.createHmac('sha256', secretKey);
	const sign = hmac.update(`${headerBase64}.${payloadBase64}`).digest('base64url');
	if (sign != SecretKeyReq) {
		res.status(401).json({ message: 'Authorized' });
	}

	const payload = JSON.parse(atob(payloadBase64));
	const user = users.find((user) => user.userId == payload.id);
	if (user) {
		res.json(user);
	}
	res.json({});
});

app.post('/api/auth/login', (req, res) => {
	// console.log(base64url);
	const { email, password } = req.body;
	console.log(email, password);
	const user = users.find((user) => user.email == email && user.password == password);
	if (!user) {
		res.status(401).json({ message: 'Authorized' });
	}

	const header = {
		alg: 'HS256',
		typ: 'JWT',
	};

	const payload = {
		id: user.userId,
		name: 'John Doe',
		iat: 1516239022,
	};

	// convert data to base64
	const headerStr = JSON.stringify(header);
	const payloadStr = JSON.stringify(payload);

	const dataStr = `${base64url(headerStr)}.${base64url(payloadStr)}`;

	// create sign
	const hmac = crypto.createHmac('sha256', secretKey);
	const sign = hmac.update(dataStr).digest('base64url');

	res.json({ token: `${dataStr}.${sign}` });
});

// const option = {
// 	key: fs.readFileSync('phjmdinh.com+4-key.pem'),
// 	cert: fs.readFileSync('phjmdinh.com+4.pem'),
// };

app.listen(port, () => {
	console.log(`connect webserver success in port ${port}`);
});
