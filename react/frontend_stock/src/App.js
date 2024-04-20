import LoginPage from './Login';
import LogoutPage from './Logout'
import Home from './Home';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import ReigistrationPage from './Register';

function App() {
	return (
		<BrowserRouter>
			<div className="App">
				<main>
					<Routes>
						<Route path="/login" element={<LoginPage/>} />
						<Route path="/logout" element={<LogoutPage/>} />
						<Route path="/signup" element={<ReigistrationPage/>} />
						<Route path="/home" element={<Home/>} />
					</Routes>
				</main>
			</div>
		</BrowserRouter>
	);
}

export default App;
