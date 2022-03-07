// material
import { Stack, Button, Divider, Typography, Alert } from '@mui/material';
// component
import Iconify from '../../components/Iconify';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { GoogleLogin } from 'react-google-login';
import axios from '../../axios/axiosinstance'
import { useState } from 'react';
import { login } from 'src/redux/actions';
import { useDispatch } from 'react-redux';
// ----------------------------------------------------------------------





export default function AuthSocial() {
  const [error, setError] = useState()
  const dispatch = useDispatch();
  const responseFacebook = (response) => {

    if (response.accessToken) {
      axios.get("/auth/redirect/facebook", {
        headers: {
          access_token: response.accessToken
        },
        params: {
          admin: true
        }

      }).then((response) => {

        if (response.data.success) {
          dispatch({ remember: false, token: response.data.token, ...login() })
        }
      }).catch((error) => {
        setError(error.response.data.error)
      })
    }

  }
  const responseGoogle = (response) => {
    if (response.accessToken) {
      // console.log(response.accessToken)
      axios.get("/auth/redirect/google", {
        headers: {
          access_token: response.accessToken
        },
        params: {
          admin: true
        }

      }).then((response) => {

        if (response.data.success) {
          dispatch({ remember: false, token: response.data.token, ...login() })
        }
      }).catch((error) => {
        setError(error.response.data.error)
      })
    }
  }


  return (
    <>
      <Stack direction="row" spacing={2}>

        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_APP_ID}
          render={renderProps => (
            <Button fullWidth size="large" color="inherit" onClick={renderProps.onClick} variant="outlined">
              <Iconify icon="eva:google-fill" color="#DF3E30" height={24} />
            </Button>
          )}
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />
        <FacebookLogin
          appId={process.env.REACT_APP_FACEBOOK_APP_ID}
          callback={responseFacebook}
          render={renderProps => (
            <Button fullWidth size="large" onClick={renderProps.onClick} color="inherit" variant="outlined">
              <Iconify icon="eva:facebook-fill" color="#1877F2" height={24} />
            </Button>
          )}
        />



      </Stack>
      {error ? <Alert sx={{ margin: "8px 0", textTransform: "capitalize" }} severity="error">{error}</Alert> : null}
      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
    </>
  );
}
