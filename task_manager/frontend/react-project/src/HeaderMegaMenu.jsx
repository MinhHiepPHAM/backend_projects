import {
  Group,
  Button,
  useMantineTheme,
  Image,
  useMantineColorScheme,
  ActionIcon,
  useComputedColorScheme,
  Avatar,
  Text,
} from '@mantine/core';;


import classes from './css/headerMenu.module.css';
import pageLogo from './assets/samuraiX.png'
import cx from 'clsx';
import { IconSun, IconMoon } from '@tabler/icons-react';
import actClasses from './css/actionToggle.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function NotLoggedIn() {
  return (
    <>
      <Button
        href="/login"
        component='a'
        variant="outline"
        radius={15}
        size='md'
      >
        Log In
      </Button>
      <Button
        href="/signup"
        color='rgba(48, 127, 230, 1)'
        component='a'
        radius={15}
        size='md' 
      >
        Register
      </Button>
    </>
  )
}

function LoggedIn({username}) {
  const displayName = username.slice(0,2).toUpperCase()
  return (
    <>
      <Group gap="sm">
        <Avatar color="cyan" h={41} w={41} radius="xl">{displayName}</Avatar>
        <Text className={classes.text} fz="lg" fw={500} >
          {username}
        </Text>
      </Group>
      <Button
        href="/logout"
        component='a'
        variant="outline"
        radius={15}
        size='md'
      >
        Log Out
      </Button>
    </>
  )
}

const links = [
  { link: '/home', label: 'Home' },
  { link: '/dashboard', label: 'Dashboard' },
  { link: '/aboutme', label: 'About me' },
]

export function HeaderMegaMenu({page=''}) {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const [activedPage, setActivedPage] = useState(page);
  const navigate = useNavigate();
  const username = localStorage.getItem('username')
  // console.log('localstorage:', username, localStorage)
  const isAuthenticated = localStorage.getItem('token') !== null

  const headerItems = links.map((link)=> (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={activedPage === link.label || undefined}
      onClick={ (event) => {
          event.preventDefault()
          setActivedPage(link.label)
          navigate(link.link)
        }
      }
    >
      {link.label}
    </a>
  ));
  return (
    <header className={classes.header}>
      <Group justify="space-between" h="100%">
        <Image src={pageLogo} h={65} w={65} onClick={(e)=> navigate('/home')}/>

        <Group h="100%" gap={0} visibleFrom="sm">
          {headerItems}
        </Group>

        <Group visibleFrom="sm">
          {isAuthenticated ? <LoggedIn username={username}/> : <NotLoggedIn/>}
          <ActionIcon
            onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
            variant="outline"
            h={41} w={41}
            radius={21}
            aria-label="Toggle color scheme"
          >
            <IconSun className={cx(actClasses.icon, actClasses.light)} stroke={1.5} />
            <IconMoon className={cx(actClasses.icon, actClasses.dark)} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Group>
    </header>
  );
}