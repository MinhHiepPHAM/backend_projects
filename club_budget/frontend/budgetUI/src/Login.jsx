import HeaderMenu from "./HeaderMenu";

import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
	Box,
} from '@mantine/core';

import { useViewportSize } from '@mantine/hooks';

function Login() {
	const { height, width } = useViewportSize();
	return (
			<Box w={width} h={height}>
					<HeaderMenu/>
					{/* <LoginForm /> */}
			</Box>
	);
}
export default Login