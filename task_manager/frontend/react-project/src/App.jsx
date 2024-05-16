// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import {DEFAULT_THEME, MantineProvider, createTheme, mergeThemeOverrides } from '@mantine/core';
import classes from './css/active.module.css'
import Home from './Home';



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
  return <MantineProvider theme={myTheme}>{
      <Home/>
    }</MantineProvider>;
}