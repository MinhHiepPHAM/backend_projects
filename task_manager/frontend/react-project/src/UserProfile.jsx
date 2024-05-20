import { Badge, Box, UnstyledButton } from "@mantine/core";
import { IconSettings, IconUser, IconActivity, IconMessage } from "@tabler/icons-react";
import classes from './css/userProfile.module.css'
import { useParams } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { HeaderMegaMenu } from "./HeaderMegaMenu";


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

	const { height, width } = useViewportSize();
	return (
		<>
			<Box w={width} h={height}>
					<HeaderMegaMenu/>
					<nav className={classes.navbar} style={{height: height-66}} > {/* 66 is height of header bar */}
						<div className={classes.section}>
							{ <NavbarUser numAct={5} numMess={6} /> }
						</div>
					</nav>		
			</Box>
					
		</>
	);
}

export default UserProfile