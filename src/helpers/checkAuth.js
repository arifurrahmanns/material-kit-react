
import axios from '../axios/axiosinstance';
import { useDispatch } from 'react-redux';
import moduleName from 'react';
import { logout, setuser } from '../redux/actions/index';
import store from './../redux/store';
import calllogout from './callLogout';
const CheckAuth = () => {
    axios.get("user/info")
        .then(function (response) {
            if (response.data.role !== "admin") {
                calllogout()
                return false
            }
            store.dispatch({ ...setuser(), user: response.data })
        }).catch(error => {
            calllogout()
        });
}
export default CheckAuth;
