import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
}; 

export const logout = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000)
    };
}

export const auth = (email, password, requestType) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }

        //default URL for signup 
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
        const apiKey = 'AIzaSyDDkQIk2feWHQyFd1RctxjqS8lDvg_zN4Q';
        
        //change URL to signin if parameter requestType === 'signin'
        if(requestType === 'signin') {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';
        }
        axios.post(`${url}${apiKey}`, authData)
            .then(response => {
                console.log(response);
                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch(err => {
                console.log(err.response);
                dispatch(authFail(err.response.data.error));
            });
    };
};