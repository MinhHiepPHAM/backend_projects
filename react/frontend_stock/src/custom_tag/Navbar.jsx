import { useState } from 'react'
import '../css/navbar.css'

function Navbar() {
    const [isActive, setIsActive] = useState(false)

    const toggleActive = () => {
        setIsActive(!isActive);
    };

    const disable = () => {
        setIsActive(false);
    };

    return (
        <div className='App'>
            <header className='App-header'>
                <nav className='navbar'>
                    <a href='#home' className='logo'> Home </a>
                    <ul className='navMenu'>
                        <li onClick={disable}>
                            <a href='#aboutMe' className='navLink'>About me</a>
                        </li>
                        <li onClick={disable}>
                            <a href='#login' className='navLink'>Login</a>
                        </li>
                        <li onClick={disable}>
                            <a href='#register' className='navLink'>Register</a>
                        </li>
                    </ul>
                </nav>

            </header>

        </div>
    );

}

export default Navbar;
