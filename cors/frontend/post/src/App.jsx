import { useEffect, useState } from 'react'

const baseApi = 'http://localhost:3000/api';

function App() {
	const [user, setUser] = useState(null);
	const [error, setError] = useState('');
	const [fields, setFields] = useState({
		email: 'nguyenvana@gmail.com',
		password: 'daoanhvu1'
	});

	const setFeildsValue = ({target: {name, value}}) => {
		setFields ( prev => (
			{
				...prev,
				[name] : value
			}
		))
	}

	const handleSubmit = (e) => {
		setError('');
		e.preventDefault();

		fetch(`${baseApi}/auth/login`,
			{
				method:'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify(fields)
			}
		)
		.then((res) => {
			console.log(res);
			if (!!res.ok) {
				return res.json();
			}
			throw Error(res);
		})
		.then(({token}) => localStorage.setItem('token', token))
		.catch((error) => {
			if (error.status == '401') {
				return setError('Email hoặc Password không đúng!');
			}

			return setError('Đã xảy ra lỗi bất thường vui lòng liên hệ contact@abc.gmail.com để được hỗ trợ');
		});
	}

	useEffect(() => {
		fetch(`${baseApi}/auth/me`,
		{
			headers: {
				Authorization: `Bearer ${localStorage.token}`
			}
		}
	)
	.then((res) => {
		if (res.status == 401) {
			throw Error(res);
		}

		return res.json();
	})
	.then(user => setUser(user));
	}, [])

	return (
		<div>
			{user ? (
				<p>Xin chao, {user.email}</p>
			) : (
				<>
				<form  method="post" onSubmit={handleSubmit}>
					<label htmlFor="email">Email:</label><br/>
					<input
					type="email"
					name="email"
					value={fields.email}
					onChange={setFeildsValue}
					id="email" />
					<br/>
					<label htmlFor="password">Password:</label><br/>
					<input
					type="password"
					name="password"
					value={fields.password}
					onChange={setFeildsValue}
					id="password" />
					<br/>
					<button>Login</button>
				</form>
				{error && <p style={{color: 'red'}}>{error}</p>}
			</>
			)
			}
		</div>
	)
}

export default App
