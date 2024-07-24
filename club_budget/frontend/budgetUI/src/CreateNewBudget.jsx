import {
    Container, 
    Title,
    Box,
    Paper,
    TextInput,
    NumberInput,
    Flex,
    Grid,
    Button,
    Text
} from '@mantine/core';
import HeaderMenu from './HeaderMenu';
import { useEffect, useState } from 'react';
import { MdAlternateEmail } from "react-icons/md";
import { MdAttachMoney } from "react-icons/md";
import axios from 'axios';


function CreateNewBudget({uid}) {
    const [nUser, setNUser] = useState(0);
    const [isValidInfos, setValidInfos] = useState([]);
    const [userInfos, setUserInfos] = useState([]);
    const [errorMess, setErrorMess] = useState(null);
    const [hasError, setError] = useState(false);
    // const [checked, setChecked] = useState(false);
    const [title, setTitle] = useState(null);
    // console.log(isValidInfos)

    function checkEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email) || email === '';
    }


    function updateUserName(idx, userName) {
        const index = userInfos.findIndex(elt => elt.index === idx);
        let updatedInfos = [...userInfos];
        if (index !== -1) {
            updatedInfos[index] = {...updatedInfos[index], username: userName};
        } else {
            updatedInfos = [...userInfos, {index: idx, username: userName}];
        }
        const isValid = userName !== '';
        const updatedIsValidInfos = [...isValidInfos];
        updatedIsValidInfos[idx] = {...updatedIsValidInfos[idx], username: isValid};
        setValidInfos(updatedIsValidInfos);

        setUserInfos(updatedInfos);
    }

    function updateEmail(idx, email) {
        const index = userInfos.findIndex(elt => elt.index === idx);
        let updatedInfos = [...userInfos];
        if (index !== -1) {
            updatedInfos[index] = {...updatedInfos[index], email: email};
        } else {
            updatedInfos = [...userInfos, {index: idx, email: email}];
        }

        const isValid = checkEmail(email);
        const updatedIsValidInfos = [...isValidInfos];
        updatedIsValidInfos[idx] = {...updatedIsValidInfos[idx], email: isValid};
        setValidInfos(updatedIsValidInfos);

        setUserInfos(updatedInfos);
    }

    function updateContribution(idx, contribution) {
        const index = userInfos.findIndex(elt => elt.index === idx);
        let updatedInfos = [...userInfos]
        if (index !== -1) { 
            updatedInfos[index] = {...updatedInfos[index], contribution: contribution}
        } else {
            updatedInfos = [...userInfos, {index: idx, contribution: contribution}];
        }

        setUserInfos(updatedInfos);
    }

    const userInputs = [...Array(nUser).keys()].map(i => (
        <Grid key={i}>
            <Grid.Col span={4}>
            <TextInput id={`username.${i}`}
                label={i===0 ?'User Name':undefined}
                placeholder='User Name'
                required
                mb='md'
                error={isValidInfos[i]?!isValidInfos[i].username:true}
                onChange={(e)=>updateUserName(i, e.target.value)}
                
            />
            </Grid.Col>
            <Grid.Col span={6}>
            <TextInput id={`email.${i}`}
                label={i===0 ? 'Email':undefined}
                placeholder='Email'
                leftSection={<MdAlternateEmail/>}
                mb='md'
                error={isValidInfos[i]?!isValidInfos[i].email:true}
                onChange={(e)=>updateEmail(i, e.target.value)}
            />
            </Grid.Col>
            <Grid.Col span={2}>
            <NumberInput id={`contribution.${i}`}
                label={i===0 ? 'Contribution': undefined}
                placeholder='Contribution'
                leftSection={<MdAttachMoney/>}
                mb='md'
                onChange={(e)=>updateContribution(i, e)}
            />
            </Grid.Col>
        </Grid>
    ));

    const headers = {
		'Content-Type': 'application/json',
		'Authorization': 'Token ' + localStorage.getItem('token')
	};

    function handleNumberUserChange(e) {
        setNUser(e);
        let updatedInfos = []
        let userErrors = []
        for (let i=0; i< e; i++) {
            const emailElt = document.getElementById(`email.${i}`);
            const usernameElt = document.getElementById(`username.${i}`);
            const contributionElt = document.getElementById(`contribution.${i}`);
            const email = emailElt ? emailElt.value : ''
            const username = usernameElt ? usernameElt.value : ''
            const contribution = contributionElt ? contributionElt.value : 0

            const isValidEmail = emailElt ? checkEmail(email): true
            const isValidUsername = usernameElt ? username !== '': true
            updatedInfos.push({index: i,email: email, username: username, contribution: contribution});
            userErrors.push({email: isValidEmail, username: isValidUsername})
        }
        setValidInfos(userErrors);
        setUserInfos(updatedInfos);
    }

    useEffect(()=>{
        // Check duplicated username
        let dupls = [];
        userInfos.reduce((arr,v, i)=> {
            if (arr.includes(v.username) && !['', undefined].includes(v.username)) dupls.push(v.index);
            arr.push(v.username);
            return arr;
        },[]);

        // highlight the field error
        let updatedIsValidInfos = [...isValidInfos];
        dupls.forEach((e)=>{
            updatedIsValidInfos[e].username = false
        });
        setValidInfos(updatedIsValidInfos);

    },[userInfos]);

    const handleSaveButton = async (e) => {
        e.preventDefault();
        // console.log(isValidInfos);
        // check all field before save
        let updatedIsValidInfos = [...isValidInfos];
        userInfos.reduce((arr,v, i)=> {
            if (v.username === '') updatedIsValidInfos[i].username = false;
            arr.push(v.username);
            return arr;
        },[]);

        setValidInfos(updatedIsValidInfos);
        let error = updatedIsValidInfos.some(item => !(item.email && item.username)) === 0;
        // const budgetTitle = document.getElementById('budgetTitle');
        if (title === '' || title === null) {
            error = true;
            setTitle('');

        }
        
        setError(error);
        if (error) setErrorMess('Some fields are not filled with valid info');
        // else {
        //     try {
        //         const response = await axios.post(`/users/${uid}/budgets/create`, {
        //             userInfos,
        //             title
        //         }, {headers: headers});

        //     } catch (e) {
        //         console.error('Login failed:', e);
        //     }
        // }
    }
    // console.log(hasError, errorMess);
    const budgetContainer = (
        <Container size='lg' my={20} >
            <Title c={'blue.9'} ta='center'>
                Create new budget!
            </Title>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                {	hasError &&
                    <Text c='red' size='md' ta="left" mb='md'>
                        {errorMess}
                    </Text>
                }
                <TextInput
                    id='budgetTitle'
                    placeholder='Name your budget'
                    mb='md'
                    required
                    error={title === ''}
                    onChange={(e)=>setTitle(e.target.value)}
                />
                <NumberInput
                    min={0}
                    maw={200} mb={'xl'}
                    placeholder='number of members'
                    onChange={handleNumberUserChange}
                />

                {userInputs}

                <Button variant='outline' mt="xl" type='submit' onClick={handleSaveButton}>
                    Create
                </Button>

            </Paper>

        </Container>
    )

    return (
        <Box>
            <HeaderMenu/>
            {budgetContainer}
        </Box>
    )
}

export default CreateNewBudget