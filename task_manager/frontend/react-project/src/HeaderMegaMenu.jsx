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

export function HeaderMegaMenu() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  return (
    <header className={classes.header}>
      <Group justify="space-between" h="100%">
        <Image src={pageLogo} h={65} w={65} />

        <Group h="100%" gap={0} visibleFrom="sm">
          <a href="#" className={classes.link}>
            Home
          </a>
          <a href="#" className={classes.link}>
            Dashboard
          </a>
          <a href="#" className={classes.link}>
            About me
          </a>
        </Group>

        <Group visibleFrom="sm">
          <Button variant="outline" radius={15} h={42} size='md' border>Log In</Button>
          <Button radius={15} h={42} size='md'>Register</Button>
          <ActionIcon
            onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
            variant="outline"
            size="xl"
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