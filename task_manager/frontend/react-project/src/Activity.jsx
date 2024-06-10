import {
    Box, Button, Container, Divider, Flex, Group, Modal, MultiSelect,
    NativeSelect, Paper, Table, Text, TextInput, Textarea,
    Title
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DateInput, DatePicker, DateTimePicker } from "@mantine/dates"
import { useDisclosure } from "@mantine/hooks";
import { HeaderMegaMenu } from "./HeaderMegaMenu";
import axios from "axios";
import { FaRunning } from "react-icons/fa";
import classes from './css/activity.module.css'
import { MdDirectionsBike } from "react-icons/md";

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

function RunningActivity(props) {
    const {uid} = props

    const ActTitle = ({type}) => {
        let ActIcon;
        switch(type) {
            case 'Running':
                ActIcon = FaRunning;
                break;
            case 'Bicycle':
                ActIcon = MdDirectionsBike;
                break;
            default:
                console.log('type error:', type);

        }

        return (
            <Group justify="space-between" mb={'md'}>
                <Flex direction={'row'}>
                    <ActIcon size={22} color="var(--mantine-color-blue-6)" className={classes.activityIcon}/>
                    <Text ta="left" fz="xl" c='var(--mantine-color-blue-6)'>{type} Activities:</Text>
                </Flex>
                <a color='var(--mantine-color-blue-5)' href={`/users/${uid}/activities/running`}>view all</a>
            </Group>
        );
    };

    const activitiesInfo = [
        {title: 'Dailly running 2024', distance: '200', calories: '4523', start:'01/01/2024', end: '31/12/2024', description:'This is running record for 2024 running activities'},
        {title: 'Qualcomm French running 2024', distance: '100', calories: '2523', start:'01/01/2024', end: '31/03/2024', description:'This is running record for 2024 running activities.'},
    ];

    const runnings = activitiesInfo.map((act,i) => (
    <div key={i}>
        <div style={{textAlign: 'center', marginBottom: '10px'}}>
            <Title order={4} c='var(--mantine-color-blue-4)'>
                {act.title}
            </Title>
            <Divider></Divider>
        </div>
        <Table ml={'xl'} withRowBorders={false} mt={'md'} mb={'md'}>						
            <Table.Thead>
                <Table.Tr justify='center'>
                    <Table.Th w={'10%'}>Start</Table.Th>
                    <Table.Th w={'10%'}>End</Table.Th>
                    <Table.Th w={'10%'}>Distance</Table.Th>
                    <Table.Th w={'10%'}>Calories</Table.Th>
                    <Table.Th>Description</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                <Table.Tr>
                    <Table.Td>{act.start}</Table.Td>
                    <Table.Td>{act.end}</Table.Td>
                    <Table.Td>{act.distance} Km</Table.Td>
                    <Table.Td>{act.calories} Kcals</Table.Td>
                    <Table.Td><Text lineClamp={1}>{act.description}</Text></Table.Td>
                </Table.Tr>
            </Table.Tbody>
        </Table>
    </div>
    ));

    return (
        <>
        {/* <Title c={'var(--mantine-color-blue-8)'}>Running Activities</Title> */}
        <Paper withBorder shadow="md" p={30} radius="md" mt={'md'} className={classes.activityBackground}>
            <ActTitle type='Running' />
            {runnings}
        </Paper>
        </>
        
    )
}

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
                <RunningActivity uid={uid} />
            </Box>
            
        </Box>
    )
};

export default ActivityPage