import {
  Group,
  Button,
  useMantineTheme,
  Image,
  useMantineColorScheme,
  ActionIcon,
  useComputedColorScheme,
} from '@mantine/core';;


import classes from './css/headerMenu.module.css';
import pageLogo from './assets/samuraiX.png'
import cx from 'clsx';
import { IconSun, IconMoon } from '@tabler/icons-react';
import actClasses from './css/actionToggle.module.css';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';

const links = [
  { link: '/home', label: 'Home' },
  { link: '/dashboard', label: 'Dashboard' },
  { link: '/aboutme', label: 'About me' },
]

export function HeaderMegaMenu() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const [active, setActive] = useState('');

  const headerItems = links.map((link)=> (
    <a
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={ (event) => {
          event.preventDefault()
          setActive(link.link)
        }
      }
    >
      {link.label}
    </a>
  ));
  return (
    <header className={classes.header}>
      <Group justify="space-between" h="100%">
        <Image src={pageLogo} h={65} w={65} />

        <Group h="100%" gap={0} visibleFrom="sm">
          {headerItems}
        </Group>

        <Group visibleFrom="sm">
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