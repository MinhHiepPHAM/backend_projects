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
import { useState } from 'react';
import { MdAlternateEmail } from "react-icons/md";
import { MdAttachMoney } from "react-icons/md";


function CreateNewBudget({uid}) {
    const [nUser, setNUser] = useState(0);
    const [userInfos, setUserInfos] = useState([]);

    function updateUserName(idx, userName) {
        const index = userInfos.findIndex(elt => elt.index === idx);
        let updatedInfos = [...userInfos];
        if (index !== -1) {
            updatedInfos[index] = {...updatedInfos[index], username: userName};
        } else {
            updatedInfos = [...userInfos, {index: idx, username: userName}];
        }

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

    console.log(nUser);
    const userInputs = [...Array(nUser).keys()].map(i => (
        <Grid key={i}>
            <Grid.Col span={4}>
            <TextInput id={`username.${i}`}
                label={i===0 ?'User Name':undefined}
                placeholder='User Name'
                required
                mb='md'
                onChange={(e)=>updateUserName(i, e.target.value)}
            />
            </Grid.Col>
            <Grid.Col span={6}>
            <TextInput id={`email.${i}`}
                label={i===0 ? 'Email':undefined}
                placeholder='Email'
                leftSection={<MdAlternateEmail/>}
                mb='md'
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

    function handleNumberUserChange(e) {
        setNUser(e);
        console.log(e,nUser)
        let updatedInfos = []
        for (let i=0; i< e; i++) {
            const emailElt = document.getElementById(`email.${i}`);
            const usernameElt = document.getElementById(`username.${i}`);
            const contributionElt = document.getElementById(`contribution.${i}`);
            const email = emailElt ? emailElt.value : ''
            const username = usernameElt ? usernameElt.value : ''
            const contribution = contributionElt ? contributionElt.value : ''
            updatedInfos.push({index: i,email: email, username: username, contribution: contribution});
        }
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
                    min={1}
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

    console.log(userInfos)
    return (
        <Box>
            <HeaderMenu/>
            {budgetContainer}
        </Box>
    )
}

export default CreateNewBudget