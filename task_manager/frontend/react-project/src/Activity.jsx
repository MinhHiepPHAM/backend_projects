import { Box, Button, Container, Group, Modal, MultiSelect, NativeSelect, Paper, Text, TextInput, Textarea, filterProps } from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {DateInput, DatePicker, DateTimePicker} from "@mantine/dates"
import { useDisclosure } from "@mantine/hooks";
import { HeaderMegaMenu } from "./HeaderMegaMenu";
import axios from "axios";

const username = localStorage.getItem('username');
const token = localStorage.getItem('token');

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Token ' + token
};

function CreateNewActivity(props) {
    const {usernames} = props;
    const {uid} = useParams();
    const [title, setTitle] = useState('');
    const [type, setType] = useState('Running');
    const [description, setDescription] = useState('');
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [users, setUsers] = useState([]);
    const [opened, { open, close }] = useDisclosure(false);
    const createdby = username
    const [error, setError] = useState('');
    const [hasError, setHasError] = useState(false);
    const [emptyTitle, setErrorTitle] = useState(false); 
    const [startNotSet, setErrorStart] = useState(false);
    // const [loaded, setLoaded] = useState(false);

    const handleCreateButton = async (e) => {	
		e.preventDefault();
		try {
			const response = await axios.post(`http://localhost:8000/users/${uid}/activities/create/`, {
				type,
                title,
                users,
                start,
                end,
                description,
                createdby
			},{
				headers: headers
			});

            // console.log(title, type, description, start, end, users);
            // setLoaded(true);
            const resetFields = [
                {id: 'activity_title', value: ''},
                {id: 'act_type', value: 'Running'},
                {id: 'act_description', value: ''},
                {id: 'user_participate', value: []},
            ];

            resetFields.map((field) => {
                document.getElementById(field.id).value = field.value;
            })

            setTitle('');
            setType('Running');
            setDescription('');
            setUsers([]);

            setHasError(false);
            setError('');
		} catch (e) {
			console.error('Creation failed:', e);
            setError(e.response.data.error);

            setHasError(true)
            title === '' && setErrorTitle(true);
            start === null && setErrorStart(true);
            // setLoaded(true)
		}
	};

    // console.log(hasError, error, emptyTitle, startNotSet)

    const newActivity = (
        <Container size={800}>
            <Paper withBorder shadow="md" p={30} radius="md">
                {hasError &&
                <Text c='red' size='md' ta="left" mb='md'>
					{error}
				</Text>} 
                <NativeSelect id="act_type"
                    label='Type' required w={'30%'}
                    data={['Running', 'Swimming', 'Bicycle']}
                    onChange={(e)=> setType(e.target.value)}
                />

                <TextInput id='activity_title'
					mt='md' label="Activity Title" placeholder="Title" required
					onChange={(e) => {
                        setTitle(e.target.value);
                        setErrorTitle(e.target.value === '');
                    }}
                    error={emptyTitle}
				/>
				<Group justify="space-between" mt="md">
                    <DateInput id="act_start"
                        clearable
                        label='Start' w={'40%'} required 
                        valueFormat="DD/MM/YYYY"
                        onChange={(e)=>{
                            if (e!==null) {
                                setStart(e.toUTCString());
                                setErrorStart(false)
                            } else {
                                setStart(null);
                                setErrorStart(true)
                            }  
                        }}
                        error={startNotSet}
                    />
                    <DateInput id='act_end'
                        clearable
                        valueFormat="DD/MM/YYYY"
                        label='End' w={'40%'}
                        onChange={(e)=>{
                            if (e!==null) setEnd(e.toUTCString());
                            else setEnd(null);
                        }}
                    />
				</Group>
                <Textarea id="act_description"
                    label='Description' mt={'md'} onChange={(e)=>setDescription(e.target.value)}
                />
                <MultiSelect id="user_participate"
                    label="Members"
                    placeholder="Type username"
                    data={usernames}
                    limit={6}
                    searchable
                    clearable
                    onChange={setUsers}
                />
				<Button fullWidth mt="xl" type='submit' onClick={handleCreateButton}>
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
    const {uid} = useParams();
    const [usernames, setUsernames] = useState([]);
    const [activities, setActivities] = useState([]);
    
    useEffect(()=>{
        try {
            axios.get(`http://localhost:8000/users/${uid}/activities/`, {headers:headers})
            .then(response => {
                // console.log(response.data);
                setUsernames(response.data['usernames']);
                setActivities(response.data['activity']);
                // console.log(usernames, activities)
            }).catch (error => {
                console.log(error);
            });
        } catch (e) {
            console.error('Activity page failed:');
        };
    

    }, []);
    
    return (
        <Box h={'100%'}>
            <HeaderMegaMenu/>
            <Box ml={'200px'} mr={'200px'} >
                <CreateNewActivity usernames={usernames}/>
            </Box>
            
        </Box>
    )
};

export default ActivityPage