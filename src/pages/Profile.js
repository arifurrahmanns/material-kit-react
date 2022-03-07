import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import Page from './../components/Page';
import { styled } from '@mui/material/styles';
import { Container, Avatar, Divider, Stack, Button } from '@mui/material';
import Profilepic from './../sections/profile/Profilepic';
import { Typography } from '@mui/material';
import { maxHeight } from '@mui/system';
import Formfileld from './../sections/profile/Formfileld';
import Iconify from 'src/components/Iconify';

import Resetpassword from './../sections/profile/Resetpassword';
const Wrapper = styled("div")({
    background: "#fff",
    padding: "20px",
    borderRadius: "10px"
})
const ProfileDiv = styled("div")({
    display: "flex",
    gap: "20px",
    alignItems: "center",
})

function Profile() {

    const [account, setaccount] = useState()
    const user = useSelector((store) => store.currentUser)

    const [update, setUpdate] = useState(false)
    useEffect(() => {
        setaccount(user)
    }, [user])

    // avatar

    return (
        account != null ?
            <Page sx={{ mt: 3 }} title={account.firstName + " " + account.lastName + " | " + process.env.REACT_APP_Name}>

                <Container sx={{ maxWidth: "600px !important" }}>
                    <Typography variant="h4" sx={{

                        mb: 5, textAlign: "center"
                    }} gutterBottom>
                        My profile
                    </Typography>
                    <Wrapper>
                        <ProfileDiv style={{ marginBottom: "20px" }}>
                            <Profilepic />
                            <div >
                                <Typography variant="h5">
                                    {account.firstName + " " + account.lastName}
                                </Typography>
                                <Typography sx={{ opacity: 0.8, mb: 1 }}>
                                    {account.email}
                                </Typography>
                                <Typography variant="p" sx={{ textTransform: "capitalize" }}>
                                    Role: {account.role}
                                </Typography>
                            </div>
                        </ProfileDiv>
                        <Divider component="div" sx={{ my: 2 }} />
                        <Typography variant="h5" sx={{ mb: 3 }}>
                            Personal info
                        </Typography>


                        <Formfileld type="text" update="firstName" label="First Name" initial={account.firstName} />
                        <Formfileld type="text" update="lastName" label="Last Name" initial={account.lastName} />
                        <Formfileld type="tel" update="phone" label="Phone Number" initial={account.phone} />
                        <Formfileld type="email" update="email" label="Email Address" initial={account.email} />

                        <Button onClick={() => { setUpdate(!update) }} endIcon={<Iconify icon="akar-icons:lock-on" />}>
                            Change Password
                        </Button>
                        <div style={{ display: !update ? "none" : "block" }}>
                            <Resetpassword />
                        </div>

                    </Wrapper>
                </Container>

            </Page > : <></>
    )
}

export default Profile