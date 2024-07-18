// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/dates/styles.css';
import '@mantine/core/styles.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import {DEFAULT_THEME, MantineProvider, createTheme, mergeThemeOverrides } from '@mantine/core';
import axios from 'axios';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import CreateNewBudget from './CreateNewBudget';

const themeOverride = createTheme({
	autoContrast : true,
	luminanceThreshold: 0.66,
	focusRing: 'auto',
	defaultRadius:'sm',
	cursorType: 'pointer',
	primaryShade:6
})
const myTheme = mergeThemeOverrides(DEFAULT_THEME, themeOverride);

axios.defaults.baseURL = 'http://localhost:8000';

export default function App() {
  	return <MantineProvider theme={myTheme}>
		{
			<BrowserRouter>
				<div className="App">	
					<main>
						<Routes>
							<Route path="/login" element={<Login/>} />
							<Route path="/signup" element={<Register/>} />
							<Route path="/home" element={<Home/>} />
							<Route path='/users/:uid/budgets/create' element={<CreateNewBudget/>} />
						</Routes>
					</main>
				</div>
			</BrowserRouter>
		}</MantineProvider>;
}