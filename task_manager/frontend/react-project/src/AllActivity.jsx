import { useEffect, useState } from 'react';
import {
    Table,
    ScrollArea,
    UnstyledButton,
    Group,
    Text,
    Center,
    TextInput,
    rem,
    keys,
    Box,
    Flex,
} from '@mantine/core';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons-react';
import { HeaderMegaMenu } from './HeaderMegaMenu';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaRunning, FaSwimmer } from 'react-icons/fa';
import { MdDirectionsBike } from 'react-icons/md';
import classes from './css/activity.module.css'

function Th({ children, reversed, sorted, onSort, width }) {
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
    <Table.Th w={width}>
        <UnstyledButton onClick={onSort}>
            <Group justify="space-between">
                <Text fw={500} fz="md">
                    {children}
                </Text>
                <Center>
                    <Icon style={{ width: rem(16), height: rem(16) }} />
                </Center>
            </Group>
        </UnstyledButton>
    </Table.Th>
    );
}

function filterData(data, search) {
    const query = search.toLowerCase().trim();
    return data.filter((item) => {
        return item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
    });
}

function sortData(data, payload) {
    const { sortBy } = payload;

    if (!sortBy) {
        return filterData(data, payload.search);
    }

    return filterData(
    [...data].sort((a, b) => {
        if (payload.reversed) {
            return b[sortBy].localeCompare(a[sortBy]);
        }

        return a[sortBy].localeCompare(b[sortBy]);
    }),
        payload.search
    );
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function ActType({type}){
    let ActIcon;
    switch(type) {
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
            console.log('type error:', type);

    }
    return (
        <ActIcon size={20} className={classes.typeIcon}/>
    );
}


function TableSort({data}) {
    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState(data);
    const [sortBy, setSortBy] = useState(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);

    const setSorting = (field) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setSortedData(sortData(data, { sortBy: field, reversed, search }));
    };

    const handleSearchChange = (event) => {
        const { value } = event.currentTarget;
        setSearch(value);
        setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
    };


    const rows = sortedData.map((row,i) => (
        <Table.Tr key={i}>
            <Table.Td><ActType type={row.type}/></Table.Td>
            <Table.Td><Text lineClamp={1}>{row.title}</Text></Table.Td>
            <Table.Td>{new Date(row.start).toLocaleDateString()}</Table.Td>
            <Table.Td>{new Date(row.terminate).toLocaleDateString()}</Table.Td>
            <Table.Td>{row.distance}</Table.Td>
            <Table.Td><Text lineClamp={1}>{row.description}</Text></Table.Td>
        </Table.Tr>
    ));

    const fields = [
        {name: 'type', width: '7%'},
        {name: 'title', width: '25%'},
        {name: 'start', width: '10%'},
        {name: 'terminate', width: '10%'},
        {name: 'distance', width: '10%'},
        {name: 'description', width: '35%'},
    ];

    return (
        <ScrollArea>
            <TextInput
                placeholder="Search by any field"
                mb="md"
                mt='xl'
                leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }}/>}
                value={search}
                onChange={handleSearchChange}
            />
            <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
                <Table.Tbody>
                    <Table.Tr>
                    {fields.map((field,i) => (
                        <Th key={i}
                            sorted={sortBy === field.name}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting(field.name)}
                            width={field.width}
                        >
                            {capitalizeFirstLetter(field.name)}
                        </Th>
                    ))}
                    </Table.Tr>
                </Table.Tbody>
                <Table.Tbody>
                    {rows.length > 0 ? (
                    rows
                    ) : (
                    <Table.Tr>
                        <Table.Td colSpan={Object.keys(data[0]).length}>
                        <Text fw={500} ta="center">
                            Nothing found
                        </Text>
                        </Table.Td>
                    </Table.Tr>
                    )}
                </Table.Tbody>
            </Table>
        </ScrollArea>
    );
}


const username = localStorage.getItem('username');
const token = localStorage.getItem('token');

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Token ' + token
};

function AllActivityPage() {
    const {uid} = useParams();
    const [loaded, setLoaded] = useState(false);
    const [data, setData] = useState([])

    useEffect(()=>{
        try {
            axios.get(`http://localhost:8000/users/${uid}/activities/all/`, {headers:headers})
            .then(response => {
                setData(response.data)
                setLoaded(true)
            }).catch (error => {
                console.log(error);
            });
        } catch (e) {
            console.error('Activity page failed:');
        };

    }, []);

    if (!loaded) return (<>Loading...</>)
    
    return (
        <Box h={'100%'}>
            <HeaderMegaMenu/>
            <Box ml={'200px'} mr={'200px'} >
                <TableSort data={data}/>
            </Box>
            
        </Box>
    )
};

export default AllActivityPage