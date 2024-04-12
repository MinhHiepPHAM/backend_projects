import { useState } from 'react'
import '../css/navbar.css'
import Searchbar from './Searchbar';

function Navbar() {
    // const [isActive, setIsActive] = useState(false)

    // const toggleActive = () => {
    //     setIsActive(!isActive);
    // };

    // const disable = () => {
    //     setIsActive(false);
    // };

    return (
        <div className='App'>
            <header className='App-header'>
                <nav className='navbar'>
                    <ul className='navHome'>
                        <li>
                            <a href='#home' className='logo'> Home </a>
                        </li>
                        <li>
                            <a href='#aboutMe' className='navLink'>News</a>
                        </li>
                        <li>
                            <a href='#aboutMe' className='navLink'>Trendings</a>
                        </li>
                        <li>
                            <Searchbar />
                        </li>
                    </ul>
                    <ul className='navMenu'>
                        
                        <li>
                            <a href='#aboutMe' className='navLink'>About me</a>
                        </li>
                        <li>
                            <a href='#login' className='navLink'>Login</a>
                        </li>
                        <li>
                            <a href='#register' className='navLink'>Register</a>
                        </li>
                    </ul>
                </nav>

            </header>

        </div>
    );

}

export default Navbar;
