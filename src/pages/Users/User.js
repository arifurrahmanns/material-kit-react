import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import Page from '../../components/Page';

import { useHistory, useParams } from 'react-router-dom'
import { styled } from '@mui/material/styles';
import { Container, Avatar, Divider, Stack, Button } from '@mui/material';
import Profilepic from '../../sections/@dashboard/user/Profilepic';
import { Typography } from '@mui/material';
import axios from '../../axios/axiosinstance'
import Formfileld from '../../sections/@dashboard/user/Formfileld'
import Iconify from 'src/components/Iconify';


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

function User() {
    const { id } = useParams()
    const [account, setaccount] = useState()
    const [updateId, setUpdateId] = useState(null)
    const [chnagePwd, setChngPwd] = useState(false)
    useEffect(() => {

        axios.get("admin/users", {
            params: {
                id: id,
            }
        }).then((response) => {
            setaccount(response.data.success)
        })
    }, [updateId])

    const updated = (id) => {
        const date = new Date();
        const time = date.getTime()
        setUpdateId({
            time,
            id
        })
    }

    // avatar

    return (
        account != null ?
            <Page sx={{ mt: 3 }} title={account.firstName + " " + account.lastName + " | " + process.env.REACT_APP_Name}>

                <Container sx={{ maxWidth: "600px !important" }}>
                    <Typography variant="h4" sx={{ mb: 5, textAlign: "center" }} gutterBottom>
                        Profile: {account.firstName}
                    </Typography>
                    <Wrapper>
                        <ProfileDiv style={{ marginBottom: "20px" }}>
                            <Profilepic pic={account.avatar} id={id} updated={updated} />
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


                        <Formfileld type="text" updated={updated} update="firstName" id={id} label="First Name" initial={account.firstName} />
                        <Formfileld type="text" updated={updated} update="lastName" id={id} label="Last Name" initial={account.lastName} />
                        <Formfileld type="tel" updated={updated} update="phone" id={id} label="Phone Number" initial={account.phone} />
                        <Formfileld type="email" updated={updated} update="email" id={id} label="Email Address" initial={account.email} />
                        <Formfileld type="select" updated={updated} update="role" id={id} label="Role" initial={account.role} />
                        <Typography variant="h5" sx={{ mb: 3 }}>
                            Security
                        </Typography>
                        <Typography variant="h6" sx={{ mb: -3, fontWeight: "400", fontSize: '14px !important' }}>
                            Change pasword
                        </Typography>
                        <Formfileld type="password" updated={updated} update="newPassword" id={id} label="New password" initial={''} />

                    </Wrapper>
                </Container>

            </Page > : <></>
    )
}

export default User