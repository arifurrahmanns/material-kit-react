import React, { useState } from 'react'
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import axios from '../../../axios/axiosinstance';
import { motion, AnimatePresence } from "framer-motion"
import { useFormik, Form, FormikProvider } from 'formik';
import {
    Link,
    Stack,
    Checkbox,
    TextField,
    IconButton,
    InputAdornment,
    FormControlLabel,
    Alert
} from '@mui/material';

function Forgetcode(props) {
    const LoginSchema = Yup.object().shape({
        email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    });

    const [error, setError] = useState()
    const formik = useFormik({
        initialValues: {
            email: props.currentEmail,
        },
        validationSchema: LoginSchema,
        onSubmit: (values, { setSubmitting }) => {

            axios.post("/user/auth/passwordreset?action=sendcode", {

                email: values.email,
            })
                .then(function (response) {

                    if (response.data.error) {
                        setError(response.data.error)
                    }
                    if (response.data.success) {
                        props.setEmail(values.email)
                        props.Changeform("codeSubmit")
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
                                type="email"
                                label="Email address"
                                {...getFieldProps('email')}
                                error={Boolean(touched.email && errors.email)}
                                helperText={touched.email && errors.email}
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
                            <Stack direction="row" sx={{ cursor: "pointer", }} alignItems="center" onClick={() => { props.Changeform("login") }} justifyContent="space-between" gap="10px">
                                <svg style={{ width: "20px" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg> Back to login
                            </Stack>
                        </Stack>
                    </Form>
                </FormikProvider>


            </motion.div>

        </div >
    )
}

export default Forgetcode