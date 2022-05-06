import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Page from './../../components/Page';
import { Grid, Button, Box, Container, Stack, Typography, CircularProgress, IconButton, TextField, InputAdornment } from '@mui/material';
import axios from '../../axios/axiosinstance'
import { styled } from '@mui/material/styles';
import getFilename from './../../helpers/getfileName';
import VendorProfilepic from './../../sections/vendor/Profilepic';
import Coverphoto from './../../sections/vendor/Coverphoto';
import { sentenceCase } from 'change-case';
import Label from './../../components/Label';
import Addressess from './../../sections/vendor/Addressess';
import Formfilelds from './../../sections/vendor/Formfields';
import Iconify from 'src/components/Iconify';
const Banner = styled('div')({

})


function Vendor() {
    const { id } = useParams()
    const [vendor, setVendor] = useState(null)
    const [updateId, setUpdateId] = useState(null)
    useEffect(() => {

        axios.get("admin/vendors/get", {
            params: {
                id: id,
                with_owner: true
            }
        }).then((response) => {
            setVendor(response.data.success)
        })
    }, [updateId])
    const updated = (id) => {
        let time = Date().toLocaleString()
        setUpdateId({ id, time })
    }




    if (vendor == null) {
        return <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CircularProgress />
        </div>
    }

    return (

        <Page title={"VENDOR - " + vendor.vendorName + " | " + process.env.REACT_APP_Name}>
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        {vendor ? vendor.vendorName : ""}

                    </Typography>
                    <div></div>
                </Stack>
                <Box sx={{ borderRadius: "20px", mt: 2, overflow: "hidden", background: "#fff" }}>

                    <Banner>
                        <Coverphoto id={vendor.id} updated={updated} img={vendor.coverPhoto} />
                        <div style={{ marginTop: "-60px", padding: "0 3%", display: "flex", alignItems: "center", gap: "20px" }}>
                            <VendorProfilepic id={vendor.id} updated={(uid) => { updated(uid) }} style={{ background: "#fff", border: "3px solid #ddd" }} image={vendor.avatar} />
                            <div style={{ marginTop: "30px" }}>
                                <h4 style={{ fontSize: "25px", color: "#222222" }}>
                                    {vendor.vendorName}
                                </h4>
                                <p>
                                    {vendor.user !== null ? sentenceCase(vendor.user.firstName + " " + vendor.user.lastName) :
                                        <Label
                                            variant="ghost"
                                            color={'error'}
                                        >
                                            {sentenceCase("not found")}
                                        </Label>}
                                </p>
                            </div>
                        </div>
                    </Banner>
                    {/* {console.log(vendor.addresses)} */}

                    <Addressess updated={updated} vendor={vendor} />


                    <Typography variant="h5" sx={{ px: 4, mt: 7 }}>
                        Vendor Information
                    </Typography>

                    <Stack sx={{ px: 4, }} direction="row" gap="30px">
                        <div style={{ width: "100%" }}>
                            {vendor.user !== null ?
                                <TextField sx={{ mt: 4 }} label="Owner" fullWidth value={vendor.user.firstName + " " + vendor.user.lastName} InputProps={{
                                    readOnly: true,

                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Iconify icon="bx:user" />
                                        </InputAdornment>)
                                }}>
                                </TextField> :
                                <Label
                                    variant="ghost"
                                    color={'error'}
                                >
                                    {sentenceCase("not found")}
                                </Label>
                            }

                        </div>
                        <div style={{ width: "100%" }}>
                            <Formfilelds updated={updated} type="text" update="name" label="Vendor Name" id={vendor.id} initial={vendor.vendorName} />
                        </div>
                    </Stack>


                    <Stack sx={{ px: 4, mt: -3 }} direction="row" gap="30px">

                        <div style={{ width: "100%" }}>
                            <Formfilelds updated={updated} type="email" update="email" label="Vendor Email" id={vendor.id} initial={vendor.vendorEmail} />
                        </div>
                        <div style={{ width: "100%" }}>
                            <Formfilelds updated={updated} type="tel" update="phone" label="Vendor Phone" id={vendor.id} initial={vendor.vendorPhone} />
                        </div>
                    </Stack>

                    <Stack sx={{ px: 4, mt: -3 }} direction="row" gap="30px">

                        <div style={{ width: "100%" }}>
                            <Formfilelds updated={updated} type="select" update="status" label="Vendor Status" id={vendor.id} initial={vendor.status} />
                        </div>
                    </Stack>
                </Box>


            </Container>
        </Page >
    )
}

export default Vendor