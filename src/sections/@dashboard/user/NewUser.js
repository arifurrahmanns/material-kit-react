import { Divider, Modal, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState, useRef } from 'react'
import { TextField, Stack, Alert, Button, Fab, InputAdornment, IconButton, CircularProgress, Icon, ButtonBase, Snackbar, Autocomplete } from '@mui/material';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import MuiPhoneNumber from 'material-ui-phone-number';
import axios from '../../axios/axiosinstance'
import './style.css';
import { LoadingButton } from '@mui/lab';
import { sentenceCase } from 'change-case';
import Iconify from 'src/components/Iconify';
function NewUser({ open, addNewClose, updated }) {
    const [users, setUsers] = useState([{}])
    const [alert, setAlert] = useState(false)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        axios.get("/admin/users").then(response => {
            if (response.data) {
                let data = []
                response.data.success.forEach(element => {
                    data.push({ value: element.id, label: element.firstName + " " + element.lastName })
                });
                setUsers(data)
            }
        })
    }, [])


    let LoginSchema = Yup.object().shape({
        // txt: Yup.string().email('Email must be a valid email address').required('Email is required') : Yup.string().required('This field is required'),
        name: Yup.string().required('Please endter a valid name'),
        email: Yup.string().email('Email must be a valid email address').required('Email is required'),
        phone: Yup.string().test('len', 'Please enter a valid phone number', val => val ? val.length > 8 : false).required('This field is required'),
        owner: Yup.number().required(),


    });
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            owner: ""
        },
        validationSchema: LoginSchema,
        onSubmit: (values, { setSubmitting }) => {
            console.log(values)
            setSubmitting(true)

            axios.post("admin/vendor/add", { name: values.name, email: values.email, phone: values.phone, owner_id: values.owner, }).then(response => {
                if (response.data.success) {
                    updated(response.data.vendor_id)
                    setAlert({ val: true, type: "success", msg: "Vendor added successfully." })
                    setSubmitting(false)

                }
            }).catch(e => {

                setAlert({ val: true, type: "error", msg: "Something went wrong, please try again." })
            })

        },
        enableReinitialize: true


    });
    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

    const changeVinputVal = (e) => {
        setFieldValue("phone", e)
    }
    const handleChange = (e) => {
        setFieldValue("owner", e)
    }
    const handleClose = () => {
        setAlert(false)
    }
    const fileInput = useRef()
    const inputFileClick = () => {
        fileInput.current.click()
    }

    const submitImport = (e) => {
        setLoading(true)
        const file = new FormData()
        file.append("file", e.target.files[0], e.target.files[0].name)
        axios.post("admin/vendor/import", file).then((response) => {
            if (response.data) {
                setLoading(!true)
                setAlert({ val: true, type: "success", msg: "Vendor imported successfully." })
                updated(response.data.vendor_id)
            }
        })
    }
    return (

        <>
            <Snackbar open={alert.val} autoHideDuration={6000} >
                <Alert onClose={handleClose} severity={alert ? alert.type : "error"} sx={{ width: '100%' }}>

                    {sentenceCase(alert ? alert.msg : "")}
                </Alert>
            </Snackbar>
            <Modal
                open={open}
                onClose={addNewClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ p: 3, position: "absolute", borderRadius: "10px", top: "50%", left: "50%", background: "#fff", overflow: "hidden", transform: "translate(-50% , -50%)", maxWidth: "500px", width: "100%" }}>
                    <Typography variant="h4" sx={{ mb: 2 }}>
                        Add New Vendor
                    </Typography>
                    <FormikProvider value={formik}>
                        <Form>
                            <TextField
                                fullWidth
                                autoComplete="name"
                                type={"text"}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">

                                        </InputAdornment>)
                                }}
                                value={values.name}
                                label={"Venodor Name"}
                                {...getFieldProps('name')}
                                error={Boolean(touched.name && errors.name)}
                                helperText={touched.name && errors.name}
                                sx={{ mt: 3 }}
                            />

                            <TextField
                                fullWidth
                                autoComplete="email"
                                type={"email"}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">

                                        </InputAdornment>)
                                }}
                                value={values.email}
                                label={"Venodor Email"}
                                {...getFieldProps('email')}
                                error={Boolean(touched.email && errors.email)}
                                helperText={touched.email && errors.email}
                                sx={{ mt: 3 }}
                            />

                            <MuiPhoneNumber
                                value={values.phone}
                                {...getFieldProps('phone')}
                                fullWidth style={{ maxHeight: "200px" }}
                                onChange={(e) => { changeVinputVal(e) }}
                                error={Boolean(touched.phone && errors.phone)}
                                helperText={touched.phone && errors.phone} defaultCountry={'us'}
                                sx={{ mt: 3 }}
                                label={"Venodor phone"}
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">

                                        </InputAdornment>)
                                }}
                            />

                            <Autocomplete
                                disablePortal
                                sx={{ p: 0, mt: 3 }}
                                id="combo-box-demo"
                                onChange={(event, value) => handleChange(value.value)}
                                renderOption={(props, option) => {
                                    return (
                                        <li {...props} key={option.value}>
                                            {option.label}
                                        </li>
                                    );
                                }}
                                options={users}
                                renderInput={(params) => {
                                    return < TextField
                                        id='combo-box-demo'
                                        autoComplete="owner"
                                        {...params}
                                        label={"Owner"}
                                        onChange={(e) => handleChange}
                                        error={Boolean(touched.owner && errors.owner)}
                                        helperText={touched.owner && errors.owner}
                                        {...getFieldProps('owner')}
                                    />
                                }}
                            />
                            <LoadingButton
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                loading={isSubmitting}
                                sx={{ mt: 3, py: 3.5 }}
                            >
                                Add Vendor
                            </LoadingButton>
                        </Form>
                    </FormikProvider>
                    <Divider sx={{ my: 3 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            OR
                        </Typography>
                    </Divider>
                    <label htmlFor="importFile">

                        <LoadingButton
                            fullWidth
                            size="large"
                            onClick={inputFileClick}
                            variant="outlined"
                            loading={loading}
                            endIcon={<Iconify icon="bi:filetype-csv" />}
                            sx={{ py: 3.5 }}
                        >
                            Import form CSV
                        </LoadingButton>
                        <input accept=".csv, text/csv" onChange={submitImport} ref={fileInput} type="file" style={{ display: "none" }} id='importFile' />
                    </label>
                </Box>
            </Modal>
        </>
    )
}

export default NewUser