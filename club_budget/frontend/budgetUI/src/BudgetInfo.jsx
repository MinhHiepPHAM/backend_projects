import {
    Box,
    Loader,
    Avatar,
    Table,
    Text,
    Title,
    Flex,
    Paper,
    Button,
    Modal,
    TextInput,
    Grid,
} from '@mantine/core'
import axios from 'axios';
import { useEffect, useState } from 'react';
import TableSort from './TableSort';
import HeaderMenu from './HeaderMenu';
import { useParams } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import { IoPersonAddOutline, IoPersonOutline } from "react-icons/io5";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { useDisclosure } from "@mantine/hooks";
import { MdAlternateEmail } from "react-icons/md";

function AddNewMember(props) {
    const {uid, title, users} = props;
    const [newMember, setNewMember] = useState(null);
    const [newEmail, setNewEmail] = useState(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [status, setStatus] = useState(null)
    
    const handleAddButton = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/users/${uid}/budgets/${title}/add/memeber/`, {
				newMember,
                newEmail
			},{
				headers: headers
			});
            setStatus(response.status);
        } catch (e) {
            console.error('Creation failed:', e);
        }

    }

    return (
        <>
            <Modal size={'xl'} opened={opened} onClose={close} title="Add new member to the budget" centered>
                {/* {(error!=='') && <Text c='red' size='md' ta="left" mb='md'>{error}</Text>} */}
                {(status===201) && <Text c='blue' size='md' ta="left" mb='md'>Successfully add user: "{newMember}"</Text>}
                <Grid>
                    <Grid.Col span={5}>
                        <TextInput
                            placeholder='User Name'
                            required
                            leftSection={<IoPersonOutline size={20}/>}
                            onChange={(e)=>setNewMember(e.target.value)}
                            
                        />
                    </Grid.Col>
                    <Grid.Col span={7}>
                        <TextInput
                            placeholder='Email'
                            leftSection={<MdAlternateEmail/>}
                            onChange={(e)=>setNewEmail(e.target.value)}
                        />
                    </Grid.Col>
                </Grid>
                <Button mt={'md'} type="submit" variant='outline' fw={'normal'} onClick={handleAddButton}>Add</Button>
            </Modal>
            <Button
                    mt='xl'
                    variant='default'
                    fw={'normal'}
                    leftSection={<IoPersonAddOutline size={20}/>}
                    onClick={open}
                >
                    Add member
            </Button>
        </>
    )
}


function BudgetInfo() {
    const {uid, title} = useParams();
    const [loaded, setLoaded] = useState(false);
    const [amount, setAmount] = useState(0);
    const [memberNames, setMemberNames] = useState([]);
    const [sessions, setSessions] = useState([])
    const [budget, setBudget] = useState(null)
    useEffect(()=> {
        async function fetchData(){
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token')
            }
            
            try {
                const response = await axios.get(`/users/${uid}/budgets/${title}/detail/`, {headers:headers});
                console.log(response);
                setAmount(response.data.amount);
                setMemberNames(response.data.participants);
                setSessions(response.data.sessions);
                setBudget(response.data.budget);
                setLoaded(true);
            } catch (e) {
                console.log(e)
            }    
        }
        fetchData();
         
    }, [loaded]);

    if (!loaded) {
        return (
            <Box>
                <HeaderMenu/>
                <Box ml={'200px'} mr={'200px'} >
                <Loader  ml='50%' mt='10%' color="blue" />
                    
                </Box>
            </Box>
        )
    }

    const summary = (
        <Flex direction='row' gap='xl'>
            <Paper withBorder shadow="md" p={30} radius="md" mt='md'>
                <Table>
                    <Table.Thead></Table.Thead>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td>Amount</Table.Td>
                            <Table.Td>{amount}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td>Number of participants</Table.Td>
                            <Table.Td>{memberNames.length}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td>Start</Table.Td>
                            <Table.Td>{new Date(budget.start).toLocaleDateString()}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td>Last balance reset</Table.Td>
                            <Table.Td>{new Date(budget.start_base).toLocaleDateString()}</Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </Paper>
            <Flex direction='column'>
                {/* <AddNewMember
                    uid={uid}
                    title={title}
                /> */}
                <Button
                    mt='md'
                    variant='default'
                    fw={'normal'}
                    leftSection={<IoMdAdd size={20}/>}
                >
                    New session
                </Button>
                <Button
                    mt='md'
                    variant='default'
                    fw={'normal'}
                    leftSection={<FaMoneyBillTransfer size={20}/>}
                >
                    Get balance
                </Button>

            </Flex>
        </Flex>
    )

    return (
        <Box>
            <HeaderMenu/>
            <Box ml={'200px'} mr={'200px'} >
                <Title c={'blue.5'} mt={'xl'} ml={'xs'} order={3}>
                    {title}
                </Title>
                {summary}
                
            </Box>
        </Box>
    );
}

export default BudgetInfo;