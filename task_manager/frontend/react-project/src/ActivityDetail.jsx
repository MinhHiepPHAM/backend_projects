import { 
    Avatar,
    Box, 
    Button, 
    Container, 
    Divider, 
    Flex, 
    Loader,
    Modal,
    NumberInput,
    Paper,
    Table,
    Text,
    Title,
    Tooltip,
} from "@mantine/core";
import { HeaderMegaMenu } from "./HeaderMegaMenu";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import classes from './css/activity.module.css'
import { FaRunning, FaSwimmer } from "react-icons/fa";
import { MdDirectionsBike } from "react-icons/md";


const token = localStorage.getItem('token');

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Token ' + token
};

function CreateNewAction() {
    const {aid} = useParams();
    const [opened, { open, close }] = useDisclosure(false);
    const [distance, setDistance] = useState(null);
    const [date, setDate] = useState(null);
    const [error, setError] = useState('');
    const [hasError, setHasError] = useState(false);
    const [emptyDate, setEmptyDate] = useState(false);
    const [emptyDistance, setEmptyDistance] = useState(false);

    const handleCreateButton = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8000/activities/${aid}/create/`,{
                date,
                distance
            }, {
                headers: headers
            });
            setDistance(null);
            setHasError(false);
            setError('');
        } catch (e) {
            setError(e.response.data.error);
            setHasError(true);
            (distance===null || distance === '') && setEmptyDistance(true);
            date === null && setEmptyDate(true);
        }
    };

    const newAction = (
        <Modal size={'md'} opened={opened} onClose={close} title="Create new activity record" centered>
            <Container size={600}>
                <Paper withBorder shadow="md" p={30} radius="md">
                    {hasError &&
                    <Text c='red' size='md' ta="left" mb='md'>
                        {error}
                    </Text>}

                    <NumberInput id="act_distance"
                        label='Distance (Km)'
                        placeholder="Enter your Km day gain"
                        allowDecimal={false}
                        onChange={(e)=> {
                            setDistance(e);
                            setEmptyDistance(distance === '');
                        }}
                        min={1}
                        error={hasError&&emptyDistance}
                    />

                    <DateInput id="action_date"
                        clearable mt={'lg'}
                        label='Date'
                        valueFormat="DD/MM/YYYY"
                        onChange={(e)=>{
                            if (e!==null) {
                                setDate(e.toUTCString());
                                setEmptyDate(false)
                            } else {
                                setDate(null);
                                setEmptyDate(true)
                            }  
                        }}
                        error={emptyDate}
                    />

                    <Button fullWidth mt="xl" type='submit' onClick={handleCreateButton}>
                        Create
                    </Button>

                </Paper>
            </Container>
        </Modal>
        
    );
    return (
        <>
            {newAction}
            <Button onClick={open} mt={'xl'}>New Record</Button>

        </>
    )
}

function ActivityInfoTable({activity}) {
    let ActIcon;
    switch(activity.type) {
        case 'RUN':
            ActIcon = FaRunning;
            break;
        case 'BIKE':
            ActIcon = MdDirectionsBike;
            break;
        case 'SWIM':
            ActIcon = FaSwimmer;
            break;
        default:
            console.log('type error:', activity.type);
    }

    const userInActivity = (
        <Avatar.Group>
            {activity.users.slice(0,3).map((user, i)=> (
                <Avatar key={i} src={user.avatar} title={user.username}/>
            ))}
            {activity.users.length>3 && <Tooltip
                withArrow
                label = {activity.users.slice(3,activity.users.length).map((u,j)=>(
                    <div key={j}>{u.username}</div>
                ))}
            >
                <Avatar>+{activity.users.length-1}</Avatar>
            </Tooltip>
            }
        </Avatar.Group>

    );
    

    const activityDetail = (
        <>
            <div style={{ textAlign: 'center', marginBottom: '10px'}}>
                    <Title order={4} c='var(--mantine-color-blue-4)'>
                        {activity.title}
                    </Title>
                <Divider></Divider>
            </div>
            <div style={{display:'flex', justifyContent:'center'}}>
                <Table withRowBorders={false} mt={'md'} mb={'md'}>						
                    <Table.Tbody>
                        <Table.Tr justify='center'>
                            <Table.Th>Type</Table.Th>
                            <Table.Th>Users</Table.Th>
                            <Table.Th>Start</Table.Th>
                            <Table.Th>Terminate</Table.Th>
                            <Table.Th>Last update</Table.Th>
                            <Table.Th>Distance</Table.Th>
                            <Table.Th>Description</Table.Th>
                        </Table.Tr>
                    </Table.Tbody>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td><ActIcon size={20} className={classes.activityIcon}/></Table.Td>
                            <Table.Td>{userInActivity}</Table.Td>
                            <Table.Td>{new Date(activity.start).toLocaleDateString()}</Table.Td>
                            <Table.Td>{new Date(activity.terminate).toLocaleDateString()}</Table.Td>
                            <Table.Td>{new Date(activity.updated).toLocaleDateString()}</Table.Td>
                            <Table.Td>{activity.distance} Km</Table.Td>
                            <Table.Td><Text lineClamp={1} title={activity.description}>{activity.description}</Text></Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </div>

        </>
    );
    return activityDetail;
}

function ActivityDetailPage() {
    const {aid} = useParams();
    const [loaded, setLoaded] = useState(false)
    const [data, setData] = useState(null)
    useEffect(()=>{
        axios.get(`http://localhost:8000/activities/${aid}/detail/`, {headers:headers})
        .then(response => {
            setLoaded(true)
            console.log(response.data)
            setData(response.data.activity);
        }).catch (error => {
            console.log(error);
        });
    }, []);

    if (!loaded) return (<Loader  ml='50%' mt='10%' color="blue" />);

    return (
        <Box h={'100%'}>
            <HeaderMegaMenu/>
            <Box ml={'200px'} mr={'200px'} >
                <CreateNewAction/>
                <ActivityInfoTable activity={data}/>
            </Box>
            
        </Box>
    )
}

export default ActivityDetailPage