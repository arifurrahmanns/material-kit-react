import React, { useState, useEffect } from 'react'
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { TextField, Stack, Alert, Button, Fab, InputAdornment, IconButton, CircularProgress, Icon, ButtonBase, Snackbar, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import './style.css';
import Iconify from '../../../components/Iconify';
import { Typography } from '@mui/material';
import MuiPhoneNumber from 'material-ui-phone-number';

import axios from '../../../axios/axiosinstance';


function Formfileld(props) {

    const [error, setError] = useState()
    const [open, setOpen] = useState(false)
    const [alert, setAlert] = useState({ type: "sucess", message: "" })
    const [update, setUpdate] = useState(false)
    const [roleChanged, setRoleChanged] = useState(false)
    let LoginSchema = Yup.object().shape({
        txt: props.type === "email" ? Yup.string().email('Email must be a valid email address').required('Email is required') : Yup.string().required('This field is required'),
    });
    if (props.type === "tel") {
        LoginSchema = Yup.object().shape({
            txt: Yup.string().test('len', 'Please enter a valid phone number', val => val.length > 8).required('This field is required'),
        });
    }
    const uspdateHandler = () => {
        setUpdate(true)
    }

    const formik = useFormik({
        initialValues: {
            txt: props.initial
        },
        validationSchema: LoginSchema,
        onSubmit: (values, { setSubmitting }) => {

            setSubmitting(true)

            axios.post("/admin/user/update", { id: props.id, [props.update]: values.txt }).then(response => {
                if (response.data.success) {
                    setOpen(true)
                    setAlert({ ...Alert, type: "success", message: response.data.success })

                    setSubmitting(false)
                    setUpdate(false)
                    props.updated(props.id)
                } else {
                    setOpen(true)
                    setAlert({ ...Alert, type: "error", message: response.data.error })
                    setSubmitting(false)
                }
            }).catch(error => {
                setOpen(true)
                setAlert({ ...Alert, type: "error", message: "Something went wrong, try again." })
                setSubmitting(false)
            })
        },
        enableReinitialize: true


    });
    const { errors, touched, values, isSubmitting, handleChange, handleSubmit, getFieldProps, setFieldValue } = formik;
    const handleClose = () => {
        setOpen(!open)
    }


    let updateButton = update ?

        <IconButton
            size="midium"
            type="submit"
            edge="end"

        >
            {isSubmitting ? <CircularProgress size={20} /> : <Iconify icon="ant-design:save-outlined" />}

        </IconButton> :

        <ButtonBase type='button' onClick={uspdateHandler} edge="end">
            <Iconify icon="clarity:edit-line" />
        </ButtonBase>
    if (props.update === "email") {
        updateButton = null
    }
    const changeVinputVal = (e) => {
        setFieldValue("txt", e)
    }
    const roleSelectHandler = (e) => {
        setRoleChanged(true)
        setFieldValue("txt", e.target.value)
    }
    return (
        <Stack sx={{ my: 4 }}>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

                    <Stack direction="row" gap="10px" alignItems="center" justifyContent="space-between">
                        {props.update === "status" ?
                            <FormControl fullWidth >
                                <InputLabel id="role-simple-select-label">{props.label}</InputLabel>
                                <Stack direction={"row"}>
                                    <Select
                                        labelId="role-simple-select-label"
                                        id="role-simple-select"
                                        value={values.txt}

                                        label={props.label}
                                        fullWidth
                                        onChange={(e) => roleSelectHandler(e)}



                                    >
                                        <MenuItem value="active">Active</MenuItem>
                                        <MenuItem value="draft">Draft</MenuItem>
                                        <MenuItem value="banned">Banned</MenuItem>


                                    </Select>
                                    <LoadingButton loading={isSubmitting} type="submit" sx={{ display: !roleChanged ? "none" : "block" }}>
                                        Save
                                    </LoadingButton>
                                </Stack>

                            </FormControl> :
                            props.update === "role" ?

                                <FormControl fullWidth >
                                    <InputLabel id="role-simple-select-label">{props.label}</InputLabel>
                                    <Stack direction={"row"}>
                                        <Select
                                            labelId="role-simple-select-label"
                                            id="role-simple-select"
                                            value={values.txt}

                                            label={props.label}
                                            fullWidth
                                            onChange={(e) => roleSelectHandler(e)}



                                        >
                                            <MenuItem value="admin">Admin</MenuItem>
                                            <MenuItem value="user">User</MenuItem>

                                        </Select>
                                        <LoadingButton loading={isSubmitting} type="submit" sx={{ display: !roleChanged ? "none" : "block" }}>
                                            Save
                                        </LoadingButton>
                                    </Stack>

                                </FormControl>

                                :

                                props.type === "tel" && update ?
                                    <MuiPhoneNumber
                                        value={values.txt}
                                        {...getFieldProps('txt')}
                                        fullWidth style={{ maxHeight: "200px" }}
                                        focused={update}
                                        onChange={(e) => { changeVinputVal(e) }}
                                        error={Boolean(touched.txt && errors.txt)}
                                        label={"Phone Number"}
                                        helperText={touched.txt && errors.txt} defaultCountry={'us'}
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: !update,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {updateButton}
                                                </InputAdornment>)
                                        }}
                                    /> :



                                    <TextField
                                        fullWidth
                                        autoComplete="username"
                                        type={props.type}
                                        focused={update}
                                        InputProps={{
                                            readOnly: !update,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {updateButton}
                                                </InputAdornment>)
                                        }}
                                        value={values.txt}
                                        label={props.label}
                                        {...getFieldProps('txt')}
                                        error={Boolean(touched.txt && errors.txt)}
                                        helperText={touched.txt && errors.txt}
                                    />
                        }


                    </Stack>
                    {error ? <Alert sx={{ margin: "8px 0", textTransform: "capitalize" }} severity="error">{error}</Alert> : null}




                </Form>
            </FormikProvider>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%', textTransform: "capitalize" }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </Stack >
    )
}

export default Formfileld