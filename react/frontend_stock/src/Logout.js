import axios from 'axios';
import Navbar from './custom_tag/Navbar';
import './css/authentication.css'


const Logout = () => {
    try {
        axios.post('http://localhost:8000/logout/',
            {
                refresh_token:localStorage.getItem('refresh_token'),
                access_token:localStorage.getItem('access_token')
            }, {headers: {'Content-Type': 'application/json'}}, {withCredentials:true});

        axios.defaults.headers.common['Authorization'] = null;
        localStorage.clear()
        return (
            <div className='logout-container'>
                <h2 style={{color:'blue'}}>Successfully logout</h2>
            </div>
        )
    } catch (error) {
        console.error('Logout failed:', error);
        return error
    }
}

function LogoutPage() {
    return (
		<>
			<div>
				<Navbar isAuth={false}/>
			</div>

			<div>
				<Logout />
			</div>
		</>
	)
}

export default LogoutPage;