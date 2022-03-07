import React, { useState } from 'react'
import { styled } from '@mui/material/styles';

import axios from '../../axios/axiosinstance'
import { Input, IconButton, Avatar, CircularProgress } from '@mui/material';

import Iconify from '../../components/Iconify';
import getFilename from './../../helpers/getfileName';

const ProfilePic = styled("div")({
    position: "relative",
    display: "inline-block",
})
function VendorProfilepic({ image, updated, style, id }) {
    const [hovered, setHovered] = useState(false)
    const [loading, setLoading] = useState(false)

    const ProfileInput = styled("div")({
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50% , -50%)",
        background: "#0000005e",
        width: " 100%",
        height: " 100%",
        borderRadius: '50%',
        display: ' grid',
        placeContent: 'center',
        color: ' #fff',
        transition: ".3s ease",
        opacity: hovered ? "1" : "0",

    })
    const fileInput = (e) => {
        setLoading(true)
        setHovered(true)
        const file = new FormData()
        file.append("avatar", e.target.files[0], e.target.files[0].name)
        axios.post("admin/vendor/update?id=" + id, file).then((response) => {
            if (response.data.success) {
                updated(response.data.vendor_id)
                setLoading(!true)
                setHovered(!true)
            }
        })

    }

    return (
        <ProfilePic >

            <Avatar sx={{ width: "180px", height: "180px", ...style }} src={getFilename(image, 190)} alt="photoURL" />
            <ProfileInput onMouseEnter={() => { setHovered(true) }} onMouseLeave={() => { setHovered(false) }}>
                <label htmlFor="icon-button-file">
                    <Input sx={{ display: "none" }} onChange={(e) => { fileInput(e) }} accept="image/*" id="icon-button-file" type="file" />
                    <IconButton sx={{ color: "#fff" }} aria-label="upload picture" component="span">
                        {!loading ? <Iconify icon='ant-design:camera-outlined' /> :
                            < CircularProgress sx={{ color: "#fff" }} />
                        }

                    </IconButton>
                </label>
            </ProfileInput>
        </ProfilePic>
    )
}

export default VendorProfilepic