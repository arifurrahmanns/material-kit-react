import axios from '../axios/axiosinstance';
import React, { useEffect } from 'react'
import calllogout from './callLogout';
import { setuser } from 'src/redux/actions';
import { useDispatch } from 'react-redux';

function LoadUser() {
    const dispatch = useDispatch()

    axios.get("user/info")
        .then(function (response) {
            if (response.data.role !== "admin") {
                calllogout()
                return false
            }
            dispatch({ ...setuser(), user: response.data })
        }).catch(error => {
            calllogout()
        });


    return (
        <></>
    )
}

export default LoadUser