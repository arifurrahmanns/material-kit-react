import { IconButton, Input, Stack, Box, Tooltip, Alert, Modal, Typography, Snackbar, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Iconify from 'src/components/Iconify'
import { Loader } from '@googlemaps/js-api-loader';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, Formik } from 'formik';
import axios from '../../axios/axiosinstance'
import AddressMap from './AddressMap';
import mapStyle from './../../helpers/mapStyle';
import { sentenceCase } from 'change-case';




function Addressess({ vendor, updated }) {
    const [locations, setLocation] = useState(null)
    const [edit, setEdit] = useState(false)
    const [addressForm, setAddressForm] = useState(null)
    const [alert, setAlert] = useState(false)
    const [aupdated, asetUpdated] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)

    const loader = new Loader({
        apiKey: "AIzaSyDVmLxJagzx2MGSJ58SPiL3WXD-x4QPtf4&libraries",
        version: "weekly",
        libraries: ["places"]
    });
    const mapOptions = {
        center: {
            lat: 0,
            lng: 0
        },
        zoom: 1
    }


    useEffect(() => {
        setLocation(vendor.addresses)
        loader
            .load()
            .then((google) => {
                const map = new google.maps.Map(document.getElementById("map"), mapOptions);
                var infowindow = new google.maps.InfoWindow();
                map.setOptions({ styles: mapStyle() });
                locations.forEach(element => {
                    let marker = new google.maps.Marker({
                        position: new google.maps.LatLng(element.latitude, element.longitude),
                        map: map,
                        title: element.addressString,
                        icon: "https://i.ibb.co/CnyjXqk/marker.png"
                    })
                    google.maps.event.addListener(marker, 'click', (function (marker) {
                        return function () {
                            infowindow.setContent(element.addressString);
                            infowindow.open(map, marker);
                        }
                    })(marker));

                })

            })
            .catch(e => {
                // do something
            });
    }, [locations, vendor.addresses])
    const deleteHandler = (id, vendor_id) => {
        axios.delete("/admin/vendor/addresses/delete", { data: { id } }).then((response) => {
            if (response.data) {
                if (response.data.success) {
                    let time = Date().toLocaleString()
                    updated(vendor_id)
                    asetUpdated(id, time)
                    setAlert({ val: true, type: "success", msg: response.data.success })

                }
                else {
                    updated(vendor_id)
                    let time = Date().toLocaleString()
                    asetUpdated(id, time)

                    setAlert({ val: true, type: "error", msg: response.data.error })
                }
            }
        })

    }
    useEffect(() => {
        if (locations === null) {
            return
        }
        if (edit === false) {
            setAddressForm(null)
            return
        }
        const editForm = locations.map((addr, index) => {
            return (

                <div key={index} style={{ padding: "8px", border: "1px solid #ddd", borderRadius: "4px ", margin: "10px 0 " }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="p" sx={{ fontSize: "16px" }}>
                            {addr.addressString}
                        </Typography>
                        <IconButton onClick={() => { deleteHandler(addr.id, addr.vendor_id) }}>
                            <Iconify icon="ant-design:delete-outlined" />
                        </IconButton>
                    </Stack>
                </div>
            )


        })
        setAddressForm(editForm)

    }, [edit, locations])
    const handleClose = () => {
        setAlert(false)
    }

    const addressAddedHandler = (data) => {
        if (data.success) {
            setAlert({ val: true, type: "success", msg: data.success })
            setModalOpen(false)
            return
        }
        if (data.error) {
            setAlert({ val: true, type: "error", msg: data.error })
            setModalOpen(false)
            return
        }
        setAlert({ val: true, type: "error", msg: "Something went wrong, please try again" })
        setModalOpen(false)
        return
    }

    return (
        <>
            <Snackbar open={alert.val} autoHideDuration={6000} >
                <Alert onClose={handleClose} severity={alert ? alert.type : "error"} sx={{ width: '100%' }}>

                    {sentenceCase(alert ? alert.msg : "")}
                </Alert>
            </Snackbar>
            <div style={{ position: "relative" }}>
                <div style={{ height: "300px", width: "100%", marginTop: "80px" }} id="map"></div>
                <div style={{ position: "absolute", bottom: "5px", left: "5px" }}>
                    <Tooltip title="Edit addresses" arrow>
                        <IconButton onClick={() => { setEdit(!edit) }} aria-label="delete" size="large" sx={{ color: "#000", background: "#fff" }}>
                            <Iconify icon="eva:edit-outline" />
                        </IconButton>
                    </Tooltip>
                </div>


            </div>
            {edit ? <div style={{ padding: "20px", maxWidth: "100%" }}>
                <>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setModalOpen(true)
                        }}
                        startIcon={<Iconify icon="eva:plus-fill" />}
                    >
                        Add New Address
                    </Button>
                    {addressForm}


                    <Modal
                        open={modalOpen}
                        onClose={() => { setModalOpen(false) }}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={{ position: "absolute", borderRadius: "10px", top: "50%", left: "50%", background: "#fff", overflow: "hidden", transform: "translate(-50% , -50%)", maxWidth: "500px", width: "100%" }}>
                            <AddressMap vendorId={vendor.id} updated={updated} callback={addressAddedHandler} />
                        </Box>
                    </Modal>
                </>
            </div> : <></>}
        </>
    )
}

export default Addressess