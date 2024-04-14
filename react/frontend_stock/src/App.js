import LoginPage from './Login';
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
						<Route path="/signup" element={<ReigistrationPage/>} />
						<Route path="/home" element={<Home/>} />
					</Routes>
				</main>
			</div>
		</BrowserRouter>
	);
}

export default App;
