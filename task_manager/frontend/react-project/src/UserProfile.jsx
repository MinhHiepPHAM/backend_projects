import { Avatar, Badge, Box, Button, Divider, Paper, Text, UnstyledButton, useMantineColorScheme } from "@mantine/core";
import { IconSettings, IconUser, IconActivity, IconMessage, IconMessageCircle } from "@tabler/icons-react";
import classes from './css/userProfile.module.css'
import { useParams } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { HeaderMegaMenu } from "./HeaderMegaMenu";


export function UserInfoAction({username}) {
	const displayName = username.slice(0,2).toUpperCase()
	return (
		<Paper withBorder p='lg' radius='md' className={classes.userInfo}>
			<Avatar
				size={120}
				radius={120}
				mx="auto"
			>
				{displayName}
			</Avatar>
			<Text ta="center" fz="lg" fw={500} mt="md">
				Minh Hiep Pham
			</Text>
			<Text ta="center" c="var(--mantine-color-gray-6)" fz="sm">
			Software Engineer • minh-hiep@gmail.com 
			</Text> 

			<Button variant="default" fullWidth mt="md">
			<IconMessageCircle size={22} className={classes.messIcon} stroke={1.5} />
				<span style={{fontWeight:"normal"}}>Send Message</span>
			</Button>
		</Paper>
	);
}

const NavbarUser = (props) => {
	const {numAct, numMess} = props;
	const links = [
		{ icon: IconUser, label: 'Profile'},
		{ icon: IconActivity, label: 'Activities', num: numAct },
		{ icon: IconMessage, label: 'Message', num: numMess },
		{ icon: IconSettings, label: 'Settings' },
	];

	const mainLinks = links.map((link) => (
		<UnstyledButton key={link.label} className={classes.mainLink}>
			<div className={classes.mainLinkInner}>
				<link.icon size={22} className={classes.mainLinkIcon} stroke={1.5} />
				<span>{link.label}</span>
			</div>
			{link.num && (
				<Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
					{link.num}
				</Badge>
			)}
		</UnstyledButton>
	));
	return mainLinks;
}

function UserProfile() {
	const {username} = useParams();
	const {colorScheme} = useMantineColorScheme()
	console.log('theme:', colorScheme)

	const { height, width } = useViewportSize();
	return (
		<>
			<Box w={width} h={height}>
					<HeaderMegaMenu/>
					<div className={classes.mainContainer} >
						<nav className={classes.navbar} style={{height: height-66}} > {/* 66 is height of header bar */}
							<div className={classes.section}>
								<NavbarUser numAct={5} numMess={6} />
							</div>
						</nav>
						<div style={{width:'100%'}}>
							<div className={classes.userContainer}>
									<UserInfoAction username={username}/>
							</div>
							<div>
								<Divider my="xs" labelPosition="center" mt={'30px'}
									label={<span style={{color: colorScheme === 'light' ? "var(--mantine-color-dark-2)" : "var(--mantine-color-dark-1)"}}>Profile Summary</span>}
									color={colorScheme === 'light' ? "var(--mantine-color-gray-3)": "var(--mantine-color-dark-4)"}
								/>
							</div>
						</div>
					</div>		
			</Box>
					
		</>
	);
}

export default UserProfile