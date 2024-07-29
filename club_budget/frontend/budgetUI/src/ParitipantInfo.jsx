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
} from '@mantine/core'
import axios from 'axios';
import { useEffect, useState } from 'react';
import TableSort from './TableSort';
import HeaderMenu from './HeaderMenu';
import { useParams } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import { IoPersonAddOutline } from "react-icons/io5";
import { FaMoneyBillTransfer } from "react-icons/fa6";

function ParticipantInfo() {
    const {uid, title} = useParams()
    console.log(uid, title);
    const summary = (
        <Flex direction='row' gap='xl'>
            <Paper withBorder shadow="md" p={30} radius="md" mt='md'>
                <Table>
                    <Table.Thead></Table.Thead>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td>Amount</Table.Td>
                            <Table.Td>0</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td>Number of participants</Table.Td>
                            <Table.Td>2</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td>Start</Table.Td>
                            <Table.Td>07/27/2024</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td>Last balance reset</Table.Td>
                            <Table.Td>07/27/2024</Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </Paper>
            <Flex direction='column'>
                <Button
                    mt='xl'
                    variant='default'
                    // c='indigo'
                    fw={'normal'}
                    leftSection={<IoPersonAddOutline size={20}/>}
                >
                    Add member
                </Button>
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
                <Title c={'blue.5'} mt={'xl'} order={3}>
                    My First Club
                </Title>
                {summary}
                
            </Box>
        </Box>
    );
}

export default ParticipantInfo;