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
    NumberInput,
    MultiSelect,
    Select,
    TagsInput,

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
import { MdAlternateEmail, MdAttachMoney, MdEditCalendar } from "react-icons/md";
import { TbCategoryPlus, TbCategory } from "react-icons/tb";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { DatePickerInput } from '@mantine/dates';

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

function NewSession(props) {
    const {uid, title, users} = props;
    const [opened, { open, close }] = useDisclosure(false);
    const [status, setStatus] = useState(null);
    const [nOutcome, setNOutcome] = useState(0);
    const [newCategories, setNewCategories] = useState([]);
    const [createdCategories, setCreatedCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [outcomes, setOutcomes] = useState([]);
    const [error, setError] = useState(false);
    const [date, setDate] = useState(null)

    function updateCostChange(i, value) {
        let index = outcomes.findIndex(e => e.index === i);
        let updatedOutcomes = [...outcomes];
        if (index === -1) {
            updatedOutcomes.push({index: i, cost: value});
        } else {
            updatedOutcomes[index].cost = value;
        }
        setOutcomes(updatedOutcomes);
    }

    function updateCategoryChange(i, cat) {
        let index = outcomes.findIndex(e => e.index === i);
        let updatedOutcomes = [...outcomes];
        if (index === -1) {
            updatedOutcomes.push({index: i, category: cat});
        } else {
            updatedOutcomes[index].category = cat;
        }
        setOutcomes(updatedOutcomes);
    }

    useEffect(() => {
        let er = outcomes.length !== nOutcome;
        er = er || outcomes.some((e)=> e.category === null) || date === null || date === '';
        setError(er);
    }, [nOutcome, date, outcomes]);

    console.log(outcomes, error, nOutcome, date);

    const handleAddSessionSummit = async (e) => {
        if (!error) {
            let updatedOutcomes = [...outcomes];
            updatedOutcomes.forEach((elt)=> {
                if (elt.cost === undefined) elt.cost = 0;
            })
            setOutcomes(updatedOutcomes);
            try {
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem('token')
                }
                const response = await axios.post(`/users/${uid}/budgets/${title}/add/session/`, {
                    outcomes
                }, {headers: headers});

            } catch (e) {
                console.log(e);
                setError(true);
            }
        }
    }

    const outcomeInputs = [...Array(nOutcome).keys()].map(i => (
        <Grid key={i}>
            <Grid.Col span={8}>
                <Select id={`category${i}`}
                    placeholder='Pick the category'
                    mb='md'
                    leftSection={<TbCategory/>}
                    data={categories}
                    searchable
                    onChange={(e) => updateCategoryChange(i,e)}
                />
            </Grid.Col>

            <Grid.Col span={4}>
                <NumberInput id={`cost.${i}`}
                    placeholder='Cost'
                    leftSection={<MdAttachMoney/>}
                    mb='md'
                    onChange={(e) => updateCostChange(i,e)}
                />
            </Grid.Col>
        </Grid>
    ));

    // console.log(participantInputs)

    return (
        <>
            <Modal size={'lg'} opened={opened} onClose={close} title='Add new session to the budget' centered>
               <DatePickerInput
                    placeholder='Pick date'
                    label='Session Date'
                    required
                    leftSection={<MdEditCalendar/>}
                    onChange={setDate}
               />
                <MultiSelect
                    mt='md'
                    label='Participants'
                    placeholder='Pick name'
                    data={users}
                    leftSection={<IoPersonAddOutline/>}
                    hidePickedOptions
                />
                <TagsInput
                    mt='md'
                    label='Enter to submit new category'
                    description='Update the categories if do not find in select box'
                    placeholder='New category'
                    data={createdCategories}
                    leftSection={<TbCategoryPlus/>}
                    onChange={(cats)=> {
                        setNewCategories(cats)
                        setCategories([...createdCategories, ...cats])
                    }}
                />
                <NumberInput
                    min={0}
                    maw={200} mt='md' mb='md'
                    placeholder='Number of outcomes'
                    onChange={setNOutcome}
                    leftSection={<AiOutlineFieldNumber/>}
                />
                {outcomeInputs}
                <Button mt={'md'} type="submit" variant='outline' fw={'normal'} onSubmit={handleAddSessionSummit}>
                    Add
                </Button>
            </Modal>
            <Button
                    mt='md'
                    variant='default'
                    fw={'normal'}
                    leftSection={<IoMdAdd size={20}/>}
                    onClick={open}
                >
                    New session
            </Button>
        </>
    );

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
                // console.log(response);
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
                <NewSession
                    uid={uid}
                    title={title}
                    users={memberNames}
                />
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