import React, { useState } from 'react'
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import axios from '../../../axios/axiosinstance';
import { motion, AnimatePresence } from "framer-motion"
import { useFormik, Form, FormikProvider } from 'formik';
import Iconify from './../../../components/Iconify';
import {
    Link,
    Stack,
    Checkbox,
    TextField,
    IconButton,
    InputAdornment,
    FormControlLabel,
    Button,
    Alert
} from '@mui/material';

function SubmitCode(props) {
    const LoginSchema = Yup.object().shape({
        code: Yup.string().required('This field is required'),
        password: Yup.string().required('Password is required')
    });
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false)
    const handleShowPassword = () => {
        setShowPassword((show) => !show);
    };
    const [error, setError] = useState()
    const formik = useFormik({
        initialValues: {
            email: props.currentEmail,
            code: "",
            password: ""
        },
        validationSchema: LoginSchema,
        onSubmit: (values, { setSubmitting }) => {

            axios.post("/user/auth/passwordreset", {

                email: values.email,
                code: values.code,
                newPassword: values.password
            })
                .then(function (response) {

                    if (response.data.error) {
                        setError(response.data.error)
                    }
                    if (response.data.success) {
                        setSuccess(true)
                    }
                    setSubmitting(false)
                }).catch((error) => {
                    setError(error.error)
                    setSubmitting(false)
                });

        }
    });
    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

    return (
        <div>
            {success ? <>
                <Alert sx={{ my: 3 }} severity="success">Password changed successfully.</Alert>
                <Button onClick={() => { props.Changeform("login") }} fullWidth sx={{ py: 2 }} variant="contained" href="#contained-buttons">
                    Login Now
                </Button></> :




                <motion.div
                    initial={{
                        opacity: 0,
                    }}
                    animate={

                        {
                            opacity: 1,

                        }}
                    transition={{
                        type: "linear", duration: .4
                    }}
                    exit={{
                        opacity: 0,
                    }}
                >


                    <FormikProvider value={formik}>
                        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    autoComplete="username"
                                    type="text"
                                    label="Verification code"
                                    {...getFieldProps('code')}
                                    error={Boolean(touched.code && errors.code)}
                                    helperText={touched.code && errors.code}
                                />
                                <TextField
                                    fullWidth
                                    autoComplete="current-password"
                                    type={showPassword ? 'text' : 'password'}
                                    label="New password"
                                    {...getFieldProps('password')}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleShowPassword} edge="end">
                                                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    error={Boolean(touched.password && errors.password)}
                                    helperText={touched.password && errors.password}
                                />
                                <TextField

                                    fullWidth
                                    type="hidden"
                                    sx={{ display: "none" }}
                                    {...getFieldProps('email')}
                                    value={values.email}
                                    error={Boolean(touched.code && errors.code)}
                                    helperText={touched.code && errors.code}
                                />


                            </Stack>

                            {error ? <Alert sx={{ margin: "8px 0", textTransform: "capitalize" }} severity="error">{error}</Alert> : null}
                            <LoadingButton sx={{ mt: 3 }}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                loading={isSubmitting} >
                                Submit
                            </LoadingButton>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
                                <div></div>
                                <Stack direction="row" sx={{ cursor: "pointer", }} alignItems="center" onClick={() => { props.Changeform("forgetCode") }} justifyContent="space-between" gap="10px">
                                    <svg style={{ width: "20px" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg> Send me the code again.
                                </Stack>
                            </Stack>
                        </Form>
                    </FormikProvider>


                </motion.div>
            }
        </div >
    )
}

export default SubmitCode