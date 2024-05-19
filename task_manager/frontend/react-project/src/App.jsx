// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import {DEFAULT_THEME, MantineProvider, createTheme, mergeThemeOverrides } from '@mantine/core';
import classes from './css/active.module.css'
import Home from './Home';
import Login from './Login';
import Register from './Register';



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
            </Routes>
          </main>
        </div>
		  </BrowserRouter>
    }</MantineProvider>;
}