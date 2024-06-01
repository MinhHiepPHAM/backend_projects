import { Box, Button, Container, Group, Modal, NativeSelect, Paper, TextInput, Textarea } from "@mantine/core";
import { useState } from "react";
import { useParams } from "react-router-dom";
import {DateTimePicker} from "@mantine/dates"
import { useDisclosure } from "@mantine/hooks";
import { HeaderMegaMenu } from "./HeaderMegaMenu";


function CreateNewActivity() {
    const {uid} = useParams();
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [description, setSescription] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [users, setUsers] = useState([]);
    const [opened, { open, close }] = useDisclosure(false);

    

    const newActivity = (
        <Container size={800}>
            <Paper withBorder shadow="md" p={30} radius="md">
                <NativeSelect
                    label='Type' required w={'30%'}
                    data={['Running', 'Swimming', 'Bicycle']}
                />
                <TextInput
					mt='md' label="Activity Title" placeholder="Title" required
					onChange={(e) => setTitle(e.target.value)}
				/>
				<Group justify="space-between" mt="md">
                    <DateTimePicker label='Start' w={'40%'} required/>
                    <DateTimePicker label='End' w={'40%'}/>
				</Group>
                <Textarea label='Description' mt={'md'}/>
				<Button fullWidth mt="xl" type='submit' >
					Create
				</Button>
			</Paper>
        </Container>
    );

    return (
        <>
            <Modal size={'lg'} opened={opened} onClose={close} title="Create new activity" centered>
                {newActivity}
            </Modal>
            <Button onClick={open} mt={'xl'}>New Activity</Button>
        </>
    )

};

function ActivityPage() {
    return (
        <Box h={'100%'}>
            <HeaderMegaMenu/>
            <Box ml={'200px'} mr={'200px'} >
                <CreateNewActivity/>
            </Box>
            
        </Box>
    )
};

export default ActivityPage