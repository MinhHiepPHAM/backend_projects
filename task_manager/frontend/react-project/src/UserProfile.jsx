import { Avatar, Badge, Box, Button, Divider, Paper, Table, Text, UnstyledButton, useMantineColorScheme } from "@mantine/core";
import { IconSettings, IconUser, IconActivity, IconMessage, IconMessageCircle } from "@tabler/icons-react";
import classes from './css/userProfile.module.css'
import { useParams } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { HeaderMegaMenu } from "./HeaderMegaMenu";
import { GiPositionMarker } from "react-icons/gi";
import { IoPersonCircle } from "react-icons/io5";

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
				<div className={classes.mainUserInner}>
					<IoPersonCircle size={18} stroke={1.5} className={classes.mainLinkIcon} /><Text ta="left" c="var(--mantine-color-gray-6)" fz="sm">Software Engineer - Qualcomm</Text>
				</div>
				<div className={classes.mainUserInner}>
					<GiPositionMarker size={18} stroke={1.5} className={classes.mainLinkIcon}/><Text ta="left" c="var(--mantine-color-gray-6)" fz="sm">Ile-de-France, France</Text>
				</div>

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

const UserInfo = () =>{

	const profileData = [
		{ name: 'First Name', value: 'Minh Hiep'},
		{ name: 'Last Name', value: 'Pham'},
		{ name: 'Email', value: 'minh-hiep@gmail.com'},
		{ name: 'Telephone', value: '0123456789'},
		{ name: 'Address', value: 'Versailles, 78000 France'},
		{ name: 'About', value: 'I am currently a software engineer at Qualcomm France'},
		
	]

	const profile = profileData.map((data) => (
		<div className={classes.userProfileInfo}>
			<div className={classes.profileFieldName}>
				<Text>{data.name}</Text>
			</div>
			<div className={classes.profileFieldValue}>
				<Text>{data.value}</Text>
			</div>
		</div>
	));
	return (
		<>
		<Button variant="default" ml={'70px'} fw={'normal'} mt={'40px'}>Edit profile</Button>
		<div className={classes.mainUserProfileContainer}>
			{profile}
		</div>
		</>
	)
}

function UserProfile() {
	const {username} = useParams();
	const {colorScheme} = useMantineColorScheme()
	// console.log('theme:', colorScheme)

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
							<div>
								<UserInfo/>
							</div>
						</div>
					</div>		
			</Box>
					
		</>
	);
}

export default UserProfile