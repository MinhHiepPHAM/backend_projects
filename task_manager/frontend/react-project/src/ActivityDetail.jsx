import { 
    Box, 
    Button, 
    Container, 
    Loader,
    Modal,
    NumberInput,
    Paper,
    Text,
} from "@mantine/core";
import { HeaderMegaMenu } from "./HeaderMegaMenu";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";


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

function ActivityDetailPage() {
    const {aid} = useParams();
    const [loaded, setLoaded] = useState(false)
    useEffect(()=>{
        axios.get(`http://localhost:8000/activities/${aid}/detail/`, {headers:headers})
        .then(response => {
            setLoaded(true)
            // console.log(response.data)
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
            </Box>
            
        </Box>
    )
}

export default ActivityDetailPage