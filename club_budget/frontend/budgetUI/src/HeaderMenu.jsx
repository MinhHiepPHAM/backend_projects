import {
    Group,
    Button,
    Image,
    Avatar,
    Text,
    Flex
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import pageLogo from './assets/samuraiX.png'
import axios from 'axios';
import { IoLogInOutline } from "react-icons/io5";
import { MdPersonPin } from "react-icons/md";
import { MdLogout } from "react-icons/md";

function NotLoggedIn() {
    return (
        <Flex direction={'row'} gap='md' mr='xl'>
            <Button
                href="/login"
                component='a'
                bg={'white'} c={'blue.7'}
                rightSection={<IoLogInOutline size={20} />}
            >
                Sign In
            </Button>
            <Button
                href="/signup"
                component='a'
                bg={'white'} c={'blue.9'}
                rightSection={<MdPersonPin size={20} />}
            >
                Sign Up
            </Button>
        </Flex>
    )
}

function LoggedIn({username}) {
    const displayName = username.slice(0,2).toUpperCase()
    const navigate = useNavigate()
    const logoutHandle = (e) =>{
        try {
                axios.post('/logout/', {
                    token : localStorage.getItem('token')
                },{ headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem('token')
                }
              });
              
                localStorage.removeItem('username');
                localStorage.removeItem('token');
                localStorage.removeItem('uid');
                navigate('/login')
        } catch (error) {
              console.error('Logout failed:', error);
        }
    }
    return (
    <Flex direction={'row'} gap='md' mr='xl'>
        <Group gap="sm">
            <Avatar color="white" h={41} w={41} ml={'10px'} bg={'blue.6'} radius="xl">{displayName}</Avatar>
            <Text fz="lg" fw={500} mr='md' c='white' >
                {username}
            </Text>
        </Group>
        <Button
            onClick={logoutHandle}
            rightSection={<MdLogout size={19} />}
        >
            Log Out
        </Button>
    </Flex>
    )
}

function HeaderMenu() {
    const username = localStorage.getItem('username')
    const uid = localStorage.getItem('uid')
    const isAuthenticated = localStorage.getItem('token') !== null
  
    return (
        <Group justify="space-between" w='100%' bg='var(--mantine-color-blue-4)'>
            <Image src={pageLogo} h={65} w={65} radius={'50%'}/>
            {isAuthenticated ? <LoggedIn username={username} uid={uid}/> : <NotLoggedIn/>}
        </Group>
    );
}

export default HeaderMenu;