import { Avatar, Badge, Box, Button, Divider, Flex, Grid, Paper, Table, Text, UnstyledButton, useMantineColorScheme } from "@mantine/core";
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
				size={150}
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

const UserInfo = () => {

	const profileData = [
		{ name: 'First Name', value: 'Minh Hiep'},
		{ name: 'Last Name', value: 'Pham'},
		{ name: 'Email', value: 'minh-hiep@gmail.com'},
		{ name: 'Telephone', value: '0123456789'},
		{ name: 'Address', value: 'Versailles, 78000 France'},
		// { name: 'About', value: 'I am currently a software engineer at Qualcomm France'},
		
	]

	return (
		<Table ml={'50px'}>
			{
				profileData.map((data) => (
				<Table.Tbody key={data.name}>
					<Table.Tr>
						<Table.Td maw={'50px'} className={classes.profileFieldValue}>{data.name}</Table.Td>
						<Table.Td className={classes.profileFieldValue}>{data.value}</Table.Td>
					</Table.Tr>
				</Table.Tbody>
				))
			}
		</Table>
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
				<Box ml={'200px'} mr={'200px'} >
					<div className={classes.mainContainer} >
	 					<nav className={classes.navbar} style={{height: height-66}} > {/* 66 is height of header bar */}
	 						<div className={classes.section}>
	 							<NavbarUser numAct={5} numMess={6} />
	 						</div>
	 					</nav>
						<div style={{width:'100%'}}>
							<Flex direction={'row'} gap={'md'} align={'center'} justify={'center'}>
								<div className={classes.userContainer}>
									<UserInfoAction username={username}/>
								</div>
								<Flex direction={'column'} align="flex-start">
									<Text ta={'center'}  mt={'40px'} mb={'25px'} maw={'700px'} className={classes.profileAbout}>
										{'"' + 'I am currently a software engineer at Qualcomm France. I am learning django, restful framework for backend and react framework for frontend.' + '"'}
									</Text>
									<UserInfo/>
									<Button variant="default" fw={'normal'} mt={'20px'} ml={'50px'}>Edit profile</Button>
								</Flex>
							</Flex>
							<Divider my="xs" labelPosition="center" mt={'30px'}
									label={<span style={{color: colorScheme === 'light' ? "var(--mantine-color-dark-2)" : "var(--mantine-color-dark-1)"}}>Summary</span>}
									color={colorScheme === 'light' ? "var(--mantine-color-gray-3)": "var(--mantine-color-dark-4)"}
							/>
						</div>
					</div>
				</Box>	
			</Box>
					
		</>
	);
}

export default UserProfile


