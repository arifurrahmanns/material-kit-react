import React, { useState } from 'react'
import LoginForm from './LoginForm';
import Forgetcode from './Forgetcode';
import { motion, AnimatePresence } from "framer-motion"
import SubmitCode from './SubmitCode';


function Index() {
    const [currentForm, setCurrentForm] = useState("login")
    const [email, setEmail] = useState()

    const Changeform = (current) => {
        if (current === "forgetCode") {
            setCurrentForm("forgetCode")
        }
        if (current === "login") {
            setCurrentForm("login")
        }
        if (current === "codeSubmit") {
            setCurrentForm("codeSubmit")
        }
    }

    const current = () => {
        if (currentForm === "login") {
            return <LoginForm Changeform={Changeform} />
        } if (currentForm === "forgetCode") {
            return <Forgetcode Changeform={Changeform} setEmail={(email) => { setEmail(email) }} currentEmail={email} />
        }
        if (currentForm === "codeSubmit") {
            return <SubmitCode Changeform={Changeform} currentEmail={email} />
        }

    }

    return (
        <>
            {current()}
        </>
    )
}

export default Index
