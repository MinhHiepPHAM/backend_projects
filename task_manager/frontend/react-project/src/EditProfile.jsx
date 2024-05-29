import { 
    Box, Button, Divider, FileInput, Flex,
    InputBase, Text, TextInput, Autocomplete, 
    FileButton,
    Avatar
} from "@mantine/core";
import { HeaderMegaMenu } from "./HeaderMegaMenu";
import { NavbarUser } from "./UserProfile";
import classes from './css/userProfile.module.css'
import { useParams } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { IMaskInput } from 'react-imask';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor } from '@mantine/tiptap';
import jobTitles from "./assets/jobTitle";

function EditProfile() {
	const {uid} = useParams();
	const username = localStorage.getItem('username');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [avatar, setAvatar] = useState('');
    const [telephone, setTelephone] = useState('');
    const [bio, setBio] = useState('');
    const [street, setStreet] = useState('');
    const [streetNumber, setStreetNumber] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [success, setSuccess] = useState(false);
    // const [data, setData] = useState({});

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + localStorage.getItem('token')
    };

    useEffect(()=> {
        axios.get(`http://localhost:8000/users/${uid}/editprofile`, {headers:headers})
            .then(response => {
                // console.log('response:', response)
                setSuccess(true)
                // setData(response.data)
                setFirstName(response.data['first_name']);
                setLastName(response.data['last_name']);
                setAvatar(response.data['avatar']);
                setTelephone(response.data['telephone']);
                setBio(response.data['bio']);
                setStreet(response.data['street']);
                setStreetNumber(response.data['street_number']);
                setCity(response.data['city']);
                setCountry(response.data['country']);
                setSuccess(true);
            }).catch (error => {
                console.log(error);
            });
    },[]);    

    const textInputs = [
        {setFunction: setFirstName, label:'First Name', value: firstName}, 
        {setFunction: setLastName, label:'Last Name', value: lastName}, 
    ];

    const nameInputs = textInputs.map((input) => (
            <TextInput key={input.label}
                mt={'md'} ml={'xl'}
                label={input.label}
                w={'350px'}
                value={input.value}
                onChange={(e)=> {input.setFunction(e.target.value);}}
            />
    ));

    const jobtitles = (
        <Autocomplete
            label="Job Title"
            placeholder="Enter your job title"
            mt={'md'} ml={'xl'}
            w={'350px'}
            data={jobTitles}
            withScrollArea={false}
            styles={{ dropdown: { maxHeight: 200, overflow: 'auto' } }}
        />
    );
    

    const telephoneInput = (
        <InputBase 
            label='Your Phone'
            component={IMaskInput}
            mask="(+33) 00-00-00-00-00 "
            mt={'md'} ml={'xl'}
            w={'200px'}
            value={telephone}
            onChange={(e)=> {input.setTelephone(e.target.value);}}
        />
    )

    const streetFields = [
        {setFunction: setStreetNumber, label:'Number', value: streetNumber, width:'100px'}, 
        {setFunction: setStreet, label:'Street', value: street, width:'400px'}, 
    ];

    const streetInput = (
        <Flex direction={'row'} gap={'md'} align={'flex-start'} justify={'left'}>
            {
                streetFields.map((input) => (
                    <TextInput key={input.label}
                        mt={'md'} ml={'xl'}
                        label={input.label}
                        w={input.width}
                        value={input.value}
                        onChange={(e)=> {input.setFunction(e.target.value);}}
                    />
                ))
            }
        </Flex>
    )

    const cityFields = [
        {setFunction: setCity, label:'City', value: city, width:'250px'}, 
        {setFunction: setCountry, label:'Country', value: country, width:'250px'}, 
    ];

    const cityInput = (
        <Flex direction={'row'} gap={'md'} align={'flex-start'} justify={'left'}>
            {
                cityFields.map((input) => (
                    <TextInput key={input.label}
                        mt={'md'} ml={'xl'}
                        label={input.label}
                        w={input.width}
                        value={input.value}
                        onChange={(e)=> {input.setFunction(e.target.value);}}
                    />
                ))
            }
        </Flex>
    )

    const editor = useEditor({
        extensions: [StarterKit,],
        content: bio
    }, );
    

	const { height, width } = useViewportSize();

    const avatarInput = (
        <Flex direction={'row'} align={'center'} >
            {avatar!=='' && <Avatar src={avatar} size={250} radius={120} mx="auto" mt={'lg'}/>}
            {avatar==='' && <Avatar src={avatar} size={250} radius={120} mx="auto" mt={'lg'}>{username.slice(0,2).toUpperCase()}</Avatar>}
            <Flex direction={'column'} align={'flex-start'}>
                <FileInput onChange={(e)=>setAvatar(URL.createObjectURL(e))} accept="image/png,image/jpeg"
                    maw={'120px'} ml={'xl'} placeholder='Upload Avatar' mt={'xs'}
                    variant="default"
                />
                <TextInput onChange={(e)=> setAvatar(e.target.value)}
                    w={'350px'} ml={'xl'} placeholder='Enter Image URL' mt={'xs'} mr={'xl'}
                />
            </Flex>
        </Flex>
    );

    console.log(avatar)

    if (!success) return (<div></div>) // waiting for fetching data

    editor.commands.setContent(bio);

    editor.on('update', ({editor}) => {
        setBio(editor.getHTML())
    });
    
    const aboutInput = (
        <RichTextEditor editor={editor} ml={'xl'} maw={'600px'}>
            <RichTextEditor.Content/>
        </RichTextEditor>
    );

    const saveButton = (
        <Button
            variant="default"
            mt={'md'} ml={'xl'}
        >
            Save
        </Button>
    )
    return (
        <div>
            <Box w={width} h={height}>
                <HeaderMegaMenu/>
                <Box ml={'200px'} mr={'200px'} >
                    <div className={classes.mainContainer} >
                            <nav className={classes.navbar} style={{height: height-66}} > {/* 66 is height of header bar */}
                                <div className={classes.section}>
                                    <NavbarUser numAct={5} numMess={6} />
                                </div>
                            </nav>
                        <div>
                            <Text mt='xs' ml='xl' fw={'bold'} size="xl">
                                Edit your profile
                            </Text>
                            <Divider my="xs" mt={'10px'} w={'auto'}/>
                            <Flex direction={'row'}>
                                <Flex direction={'column'} align={'flex-start'}>
                                    {jobtitles}
                                    {nameInputs}
                                    {telephoneInput}
                                    {streetInput}
                                    {cityInput}
                                    <Text mt={'md'} ml={'xl'}>About me <span style={{fontSize:'12px'}}>(using markdown to style the text)</span></Text>
                                    {aboutInput}
                                    {saveButton}
                                </Flex>
                                <Flex direction={'column'} align={'flex-end'}>
                                    {avatarInput}
                                    
                                </Flex>

                            </Flex>
                            
                            
                        </div>
                    </div>
                </Box>
            </Box>
                    
        </div>
    );
	
}

export default EditProfile
