import React, { useState } from 'react'
import { styled } from '@mui/material/styles';
import getFilename from './../../helpers/getfileName';
import { IconButton, CircularProgress, Input, Tooltip, Stack } from '@mui/material';
import axios from '../../axios/axiosinstance'
import Iconify from './../../components/Iconify';
const Cover = styled('div')({
    height: "400px",
    position: "relative",
})
function Coverphoto({ img, updated, id }) {
    const [loading, setLoading] = useState(false)
    const fileInput = (e) => {
        setLoading(true)

        const file = new FormData()
        file.append("cover_photo", e.target.files[0], e.target.files[0].name)
        axios.post("admin/vendor/update?id=" + id, file).then((response) => {
            if (response.data.success) {
                updated(response.data.vendor_id)
                setLoading(!true)

            }
        })

    }


    return (
        <Cover>

            {loading ? <Stack justifyContent="center" alignItems="center" sx={{ height: "100%" }} >
                < CircularProgress sx={{ color: "#000" }} />
            </Stack> :

                <>
                    <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src={getFilename(img, 1160)} alt="" />

                    <Stack sx={{ position: "absolute", right: "10px", bottom: "10px" }}>

                        <Tooltip title="Edit cover photo" arrow>

                            <IconButton aria-label="delete" size="large" sx={{ color: "#000", background: "#fff" }}>
                                <label htmlFor="icon-button-file_cover" style={{ lineHeight: 0 }}>
                                    <Input sx={{ display: "none" }} onChange={(e) => { fileInput(e) }} accept="image/*" id="icon-button-file_cover" type="file" />
                                    <Iconify icon="eva:edit-outline" />
                                </label>
                            </IconButton>

                        </Tooltip>

                    </Stack>

                </>
            }
        </Cover>
    )
}

export default Coverphoto