import { Avatar, Badge, Box, Button, Divider, Flex, Grid, Paper, Table, Text, UnstyledButton, em, useMantineColorScheme } from "@mantine/core";
import { IconSettings, IconUser, IconActivity, IconMessage, IconMessageCircle } from "@tabler/icons-react";
import classes from './css/userProfile.module.css'
import { useParams } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { HeaderMegaMenu } from "./HeaderMegaMenu";
import { GiPositionMarker } from "react-icons/gi";
import { IoPersonCircle } from "react-icons/io5";
import axios from "axios";
import { useEffect, useState } from "react";

export function UserInfoHeader(props) {
	const {username, firstName, lastName, avatar, city, country, title} = props;
	const displayName = username.slice(0,2).toUpperCase();
	let avatarPhoto;
	if (avatar==='') {
		avatarPhoto = (
			<Avatar
				size={150}
				radius={120}
				// mx="auto"
			>
				{displayName}
			</Avatar>
		)
	} else {
		avatarPhoto = (<Avatar
			size={150}
			radius={120}
			src={avatar}
		/>)
	}

	return (
		<Paper withBorder p='lg' radius='md' className={classes.userInfo}>
			{avatarPhoto}
			<Text ta="center" fz="lg" fw={500} mt="md">
			{firstName} {lastName}
			</Text>
				<div className={classes.mainUserInner}>
					<IoPersonCircle size={18} className={classes.mainLinkIcon} /><Text ta="left" c="var(--mantine-color-gray-6)" fz="sm">{title}</Text>
				</div>
				<div className={classes.mainUserInner}>
					<GiPositionMarker size={18} className={classes.mainLinkIcon}/><Text ta="left" c="var(--mantine-color-gray-6)" fz="sm">{city}, {country}</Text>
				</div>

			<Button variant="default" fullWidth mt="md">
				<IconMessageCircle size={22} className={classes.messIcon} />
					<span style={{fontWeight:"normal"}}>Send Message</span>
			</Button>
		</Paper>
	);
}

export const NavbarUser = (props) => {
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
				<link.icon size={22} className={classes.mainLinkIcon} />
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

const UserInfo = (props) => {

	const {
		email, firstName, lastName,
		telephone, street, streetNumber,
		city, country
	} = props;

	const profileData = [
		{ name: 'First Name', value: firstName},
		{ name: 'Last Name', value: lastName},
		{ name: 'Email', value: email},
		{ name: 'Telephone', value: telephone},
		{ name: 'Address', value: `${streetNumber}, ${street} ${city}, ${country}`},
		
	];

	return (
		<Table ml={'50px'}>
			{
				profileData.map((data) => (
				<Table.Tbody key={data.name}>
					<Table.Tr>
						<Table.Td maw={'150px'} miw={'100px'} className={classes.profileFieldValue}>{data.name}</Table.Td>
						<Table.Td className={classes.profileFieldValue}>{data.value}</Table.Td>
					</Table.Tr>
				</Table.Tbody>
				))
			}
		</Table>
	)
}

function UserProfile() {
	const {uid} = useParams();
	const username = localStorage.getItem('username')
	const {colorScheme} = useMantineColorScheme()
	// console.log('theme:', colorScheme)
    const token = localStorage.getItem('token')
	const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [avatar, setAvatar] = useState('');
    const [telephone, setTelephone] = useState('');
    const [bio, setBio] = useState('');
    const [street, setStreet] = useState('');
    const [streetNumber, setStreetNumber] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [title, setJobTilte] = useState('');
	// const [isActive, setActive] = useState(true);
    // const [success, setSuccess] = useState(false);

	const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
    };

    useEffect(()=> {
        axios.get(`http://localhost:8000/users/${uid}/`, {headers:headers})
            .then(response => {
                // setData(response.data)
                setFirstName(response.data['first_name']);
                setLastName(response.data['last_name']);
                setAvatar(response.data['avatar']);
				setCountry(response.data['country']);
                setJobTilte(response.data['job_title']);
                setTelephone(response.data['telephone']);
                setBio(response.data['bio']);
                setStreet(response.data['street']);
                setStreetNumber(response.data['street_number']);
                setCity(response.data['city']);
                setCountry(response.data['country']);
                setJobTilte(response.data['job_title']);
				setActive(response.data['is_active']);
				setEmail(response.data['email']);
                // setSuccess(true);
            }).catch (error => {
                console.log(error);
            });
		},[]);  

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
									<UserInfoHeader
										username={username} firstName={firstName} lastName={lastName}
										avatar={avatar} city={city} country={country} title={title}
									/>
								</div>
								<Flex direction={'column'} align="flex-start">
									<Text ml={'50px'} mt={'10px'} mb={'25px'} maw={'700px'} className={classes.profileAbout}>
										<div dangerouslySetInnerHTML={{ __html: bio }} />
									</Text>
									<UserInfo
										email={email} firstName={firstName}
										lastName={lastName}
										telephone={telephone} street={street} streetNumber={streetNumber}
										city={city} country={country}
									/>
									<Button
										href={'/users/' + uid.toString() + '/editprofile'} component="a"
										variant="default" fw={'normal'} mt={'20px'} ml={'50px'}
									>
										Edit profile
									</Button>
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


