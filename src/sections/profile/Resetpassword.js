import { Alert, IconButton, InputAdornment, Snackbar, Stack, TextField } from '@mui/material'
import { Form, FormikProvider, useFormik, Formik } from 'formik'
import React, { useState } from 'react'
import * as Yup from 'yup';
import Iconify from 'src/components/Iconify';
import { LoadingButton } from '@mui/lab';
import axios from '../../axios/axiosinstance'
import { sentenceCase } from 'change-case';
import CheckAuth from './../../helpers/checkAuth';
function Resetpassword({ updated }) {
    const [alert, setAlert] = useState({ type: "sucess", message: "" })
    const [error, setError] = useState()
    const [open, setOpen] = useState(false)
    const [showPassword, setShowPassword] = useState(false);


    const LoginSchema = Yup.object().shape({
        oldPwd: Yup.string().required('Old password is required'),
        newPwd: Yup.string().min(8, "Password must be at least 4 characters.").required('New password is required')

    });


    const formik = useFormik({
        initialValues: {
            oldPwd: "",
            newPwd: ""
        },
        validationSchema: LoginSchema,
        onSubmit: (values, { setSubmitting }) => {

            setSubmitting(true)
            axios.post("user/update", {
                oldPassword: values.oldPwd,
                newPassword: values.newPwd
            }).then(response => {
                if (response.data.success) {
                    setOpen(true)
                    setAlert({ ...Alert, type: "success", message: sentenceCase(response.data.success) })
                    setSubmitting(false)
                    CheckAuth()
                }
                if (response.data.error) {
                    setOpen(true)
                    setAlert({ ...Alert, type: "error", message: sentenceCase(response.data.error) })
                    setSubmitting(false)
                    CheckAuth()
                }
            }).catch(e => {
                setOpen(true)
                setAlert({ ...Alert, type: "error", message: "Something went wrong." })
                setSubmitting(false)
                CheckAuth()
            })

        },
        enableReinitialize: true


    });
    const handleClose = () => {
        setOpen(!open)
    }
    const handleShowPassword = () => {
        setShowPassword((show) => !show);
    };
    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;
    return (
        <>
            <FormikProvider value={Formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

                    <TextField
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        value={values.oldPwd}
                        label="Old Password"
                        sx={{ mt: 3 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleShowPassword} edge="end">
                                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        {...getFieldProps('oldPwd')}
                        error={Boolean(touched.oldPwd && errors.oldPwd)}
                        helperText={touched.oldPwd && errors.oldPwd}
                    />
                    <TextField
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        value={values.newPwd}
                        label="New Password"
                        sx={{ mt: 3 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleShowPassword} edge="end">
                                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        {...getFieldProps('newPwd')}
                        error={Boolean(touched.newPwd && errors.newPwd)}
                        helperText={touched.newPwd && errors.newPwd}
                    />



                    {error ? <Alert sx={{ margin: "8px 0", textTransform: "capitalize" }} severity="error">{error}</Alert> : null}


                    <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                        sx={{ mt: 3 }}
                    >
                        Save
                    </LoadingButton>

                </Form>
            </FormikProvider>

            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%', textTransform: "capitalize" }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default Resetpassword