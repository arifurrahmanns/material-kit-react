import axios from 'axios'
import store from './../redux/store';


const instance = axios.create({
    baseURL: "http://api.rootlandings.com/",
})
store.subscribe(listener)
let token = store.getState().auth
function select(state) {
    return state.auth
}

function listener() {
    token = select(store.getState())
    instance.defaults.headers.common['auth_token'] = token
}
instance.defaults.headers.common['auth_token'] = token

export default instance