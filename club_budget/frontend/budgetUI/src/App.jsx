// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/dates/styles.css';
import '@mantine/core/styles.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import {DEFAULT_THEME, MantineProvider, createTheme, mergeThemeOverrides } from '@mantine/core';
import axios from 'axios';

const themeOverride = createTheme({
	autoContrast : true,
	luminanceThreshold: 0.66,
	focusRing: 'auto',
	activeClassName: classes.active,
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
						</Routes>
					</main>
				</div>
			</BrowserRouter>
		}</MantineProvider>;
}