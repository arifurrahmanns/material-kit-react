import axios from '../axios/axiosinstance';
import store from '../redux/store';
import { logout } from 'src/redux/actions';

const calllogout = () => {
    axios.post("/user/logout").then((response) => {
        if (response.data.success) {
            console.log(response.data.success)
            store.dispatch({ ...logout() })
        }
    }).catch(function (error) {

        if (error.response) {
            if (error.response.status === 401) {
                store.dispatch({ ...logout() })
            };
        } else {
            store.dispatch({ ...logout() })
        }
    })
}

export default calllogout