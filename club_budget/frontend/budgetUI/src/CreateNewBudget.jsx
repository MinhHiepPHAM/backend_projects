import {
    Container, 
    Title,
    Box,
    Paper,
    TextInput,
    NumberInput,
    Flex,
    Grid,
    Button
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

    function checkEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email)
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
        const updatedError = [...isValidInfos];
        updatedError[idx] = {...updatedError[idx], username: isValid};
        setValidInfos(updatedError);

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
        const updatedError = [...isValidInfos];
        updatedError[idx] = {...updatedError[idx], email: isValid};
        setValidInfos(updatedError);

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

    const budgetContainer = (
        <Container size='lg' my={20} >
            <Title c={'blue.9'} ta='center'>
                Create new budget!
            </Title>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <TextInput
                    placeholder='Name your budget'
                    mb='md'
                    required
                />
                <NumberInput
                    min={0}
                    maw={200} mb={'xl'}
                    placeholder='number of members'
                    onChange={handleNumberUserChange}
                />

                {userInputs}

                <Button variant='outline' mt="xl" type='submit'>
                    Create
                </Button>

            </Paper>

        </Container>
    )

    // console.log(userInfos)
    return (
        <Box>
            <HeaderMenu/>
            {budgetContainer}
        </Box>
    )
}

export default CreateNewBudget