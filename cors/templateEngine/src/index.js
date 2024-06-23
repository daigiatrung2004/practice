const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', engine({ extname: '.html' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'resources/views/'));
const port = '3000';

app.get('/posts', (req, res) => {
	res.render('home');
});

app.listen(port, () => {
	console.log(`server ${port} startup success!`);
});
