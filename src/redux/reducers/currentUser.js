import axios from '../../axios/axiosinstance'
const jsCookie = require("js-cookie");


const initialState = {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    authType: "",
    avatar: "",
    status: "",
    role: "",
}

const CurrentUser = (state = initialState, action) => {
    switch (action.type) {
        case "SETUSER":
            return state = action.user;

        default:
            return state = initialState
    }
}
export default CurrentUser
