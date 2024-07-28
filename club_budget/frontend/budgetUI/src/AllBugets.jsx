import {
    Box,
    Loader,
    Avatar,
    Table,
    Text,
    Title
} from '@mantine/core'
import axios from 'axios';
import { useEffect, useState } from 'react';
import TableSort from './TableSort';
import HeaderMenu from './HeaderMenu';
import { useParams } from 'react-router-dom';


function filterData(data, query) {
    const q = query.toLowerCase().trim();
    return data.filter((item) => {
        return item.budget.title.toLowerCase().includes(q)
    });
}

function sortData(data, option) {
    const { sortBy } = option;

    if (!sortBy) {
        return filterData(data, option.query);
    }

    return filterData(
        [...data].sort((a, b) => {
            if (option.reversed) {
                return b[sortBy].localeCompare(a[sortBy]);
            }

            return a[sortBy].localeCompare(b[sortBy]);
        }),
        option.query
    );
}


function AllBugets() {
    const [loaded, setLoaded] = useState(false);
    const [data, setData] = useState(null);
    const [query, setQuerySearch] = useState('');
    const [sortedData, setSortedData] = useState(null);
    const [sortBy, setSortBy] = useState(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const {uid} = useParams();

    const setSorting = (field) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setSortedData(sortData(data, { sortBy: field, reversed, query }));
    };

    const handleSearchChange = (event) => {
        const { value } = event.currentTarget;
        setQuerySearch(value);
        setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, query: value }));
    };

    useEffect(()=> {
        async function fetchData(){
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token')
            }
            
            try {
                const response = await axios.get(`/users/${uid}/budgets/all/`, {headers:headers});
                setData(response.data)
                setSortedData(sortData(response.data, { sortBy, reverseSortDirection, query }));
                setLoaded(true);
            } catch (e) {
                console.log(e)
            }    
        }
        fetchData();
         
    }, [loaded]);

    if (!loaded) return (
        <Box>
            <HeaderMenu/>
            <Loader  ml='50%' mt='10%' color="blue" />
        </Box>
    )

    const fields = [
        {name: 'title', width: '35%'},
        {name: 'start', width: '15%'},
        {name: 'updated', width: '15%'},
        {name: 'outcome', width: '10%'},
        {name: 'participants', width: '25%'},
    ];

    const prticipantsRender = (participants) => (
        <Avatar.Group>
            {participants.slice(0,5).map((name)=> (
                <Avatar key={name} name={name} color="initials" />
            ))}
            {participants.length>5 && <Tooltip
                withArrow
                label = {participants.slice(5,participants.length).map((name)=>(
                    <div key={name}>{name}</div>
                ))}
        
            >
                <Avatar>+{participants.length-5}</Avatar>
            </Tooltip>
            }
        </Avatar.Group>

    );

    console.log(data);

    const rowsData= sortedData.map((row,i) => (
        <Table.Tr key={i}>
            <Table.Td><Text>{row.budget.title}</Text></Table.Td>
            <Table.Td>{new Date(row.budget.start).toLocaleDateString()}</Table.Td>
            <Table.Td>{new Date(row.budget.last_updated).toLocaleDateString()}</Table.Td>
            <Table.Td><Text>{row.amount}</Text></Table.Td>
            <Table.Td>{prticipantsRender(row.participants)}</Table.Td>
        </Table.Tr>
    ));

    const tableSort = (
        <TableSort
            rowDatas = {rowsData}
            fieldConfigs = {fields}
            searchQuery = {query}
            onSearchChange = {handleSearchChange}
            sortBy = {sortBy}
            reverseSortDirection = {reverseSortDirection}
            onSort = {setSorting}
        />
    )

    return (
        <Box>
            <HeaderMenu/>
            <Box ml={'200px'} mr={'200px'} >
                <Title c={'blue.5'} ta='center' mt={'xl'} order={2}>
                    All budgets 
                </Title>
                {tableSort}
            </Box>
        </Box>
    )
}

export default AllBugets;