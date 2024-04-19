// import { useState } from 'react'
import '../css/navbar.css'
import Searchbar from './Searchbar';

function LogoutBar() {
    return (
        <>
            <li>
                <a href='/logout' className='navLink'>Logout</a>
            </li>
            <li>
                <a href='/dashboard' className='navLink'>Dashboard</a>
            </li>
        </>
    )
}

function LoginBar() {
    return (
        <>
            <li>
                <a href='/login' className='navLink'>Login</a>
            </li>
            <li>
                <a href='/signup' className='navLink'>Register</a>
            </li>
        </>
    )
}

function Navbar({isAuth}) {
    console.log(isAuth)
    return (
        <div className='App'>
            <header className='App-header'>
                <nav className='navbar'>
                    <ul className='navHome'>
                        <li>
                            <a href='/home' className='navLink'> Home </a>
                        </li>
                        <li>
                            <a href='/news' className='navLink'>News</a>
                        </li>
                        <li>
                            <a href='/trendings' className='navLink'>Trendings</a>
                        </li>
                        <li>
                            <Searchbar />
                        </li>
                    </ul>
                    <ul className='navMenu'>
                        <li>
                            <a href='/aboutMe' className='navLink'>About me</a>
                        </li>
                        {isAuth
                            ?  <LogoutBar/>
                            :  <LoginBar/>
                        }

                    </ul>
                </nav>

            </header>

        </div>
    );

}

export default Navbar;
