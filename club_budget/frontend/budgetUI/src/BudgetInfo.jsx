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

function checkEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email) || email === '' | email === null;
}

function AddNewMember(props) {
    const {uid, title, users} = props;
    const [newMember, setNewMember] = useState(null);
    const [newEmail, setNewEmail] = useState(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [status, setStatus] = useState(null);
    const [nameError, setNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    
    const handleAddButton = async(e) => {
        e.preventDefault();
        const inValidMember = newMember === null;
        setNameError(nameError||inValidMember);
        if (!inValidMember && !nameError && !emailError)
        {
            try {
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem('token')
                }
                const response = await axios.post(`/users/${uid}/budgets/${title}/add/member/`, {
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

    }

    useEffect(()=>{
        const inValidMember = newMember === '' || users.includes(newMember);
        const invalidEmail = !checkEmail(newEmail);
        setEmailError(invalidEmail);
        setNameError(inValidMember);
        setStatus(null);
    }, [newMember, newEmail]);

    return (
        <>
            <Modal size={'xl'} opened={opened} onClose={close} title={<Text>Add new member to the budget ({<span style={{color:'red'}}>*</span>}<span style={{fontSize:'15px', color:'gray'}}>: required field</span>)</Text>} centered>
                {(emailError || nameError) && <Text c='red' size='md' ta="left" mb='md'>Invalid member name or email</Text>}
                {(status===201) && <Text c='blue' size='md' ta="left" mb='md'>Successfully add new member: "{newMember}"</Text>}
                <Grid>
                    <Grid.Col span={5}>
                        <TextInput
                            placeholder='New member name'
                            label='Name'
                            required
                            leftSection={<IoPersonOutline size={20}/>}
                            error={nameError}
                            onChange={(e)=>setNewMember(e.target.value)}
                            
                        />
                    </Grid.Col>
                    <Grid.Col span={7}>
                        <TextInput
                            placeholder='Email'
                            label='Email'
                            leftSection={<MdAlternateEmail/>}
                            error={emailError}
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
                <AddNewMember
                    uid={uid}
                    title={title}
                    users={memberNames}
                />
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