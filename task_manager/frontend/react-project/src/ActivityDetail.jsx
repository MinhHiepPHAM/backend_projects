import { 
    Box, 
    Loader,
} from "@mantine/core";
import { HeaderMegaMenu } from "./HeaderMegaMenu";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


const token = localStorage.getItem('token');

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Token ' + token
};

function ActivityDetailPage() {
    const {aid} = useParams();
    const [loaded, setLoaded] = useState(false)
    useEffect(()=>{
        axios.get(`http://localhost:8000/activities/${aid}/detail/`, {headers:headers})
        .then(response => {
            setLoaded(true)
            console.log(response.data)
        }).catch (error => {
            console.log(error);
        });
    }, []);

    if (!loaded) return (<Loader  ml='50%' mt='10%' color="blue" />);

    return (
        <Box h={'100%'}>
            <HeaderMegaMenu/>
            <Box ml={'200px'} mr={'200px'} >
            </Box>
            
        </Box>
    )
}

export default ActivityDetailPage