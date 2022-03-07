const jsCookie = require("js-cookie");

let initialState = null;


const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN":
            if (action.remember) {
                jsCookie.set("auth", action.token, { expires: 365 })
            } else {
                jsCookie.set("auth", action.token)
            }

            return state = action.token

        case "LOGOUT":
            jsCookie.remove("auth");
            return state = null;

        default:
            const cookie = jsCookie.get("auth");

            if (cookie != null) {
                return state = cookie
            } else {
                return state = null
            };
    }

}
export default authReducer

