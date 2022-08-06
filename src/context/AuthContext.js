// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

import Amplify, {Auth} from 'aws-amplify';
import { ConsoleLine } from 'mdi-material-ui';

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const [isInitialized, setIsInitialized] = useState(defaultProvider.isInitialized)
  const [userInformation, setUserInformation] = useState(null)

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      setIsInitialized(true)
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (storedToken) {
        setLoading(true)
        const currentUser = await Auth.currentAuthenticatedUser();
        if(currentUser) {
          setLoading(false)
          setUser(currentUser.attributes)
        }
        else {
          localStorage.removeItem('userData')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('accessToken')
          setUser(null)
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }
    initAuth()
  }, [])

  const handleLogin = (params, errorCallback) => {
    Auth.signIn(params.email, params.password).then( (user) => {
        window.localStorage.setItem(authConfig.storageTokenKeyName, user.signInUserSession.accessToken.jwtToken)
      })
      .then(() => {
        Auth.currentAuthenticatedUser()
          .then(async user => {
            const returnUrl = router.query.returnUrl
            setUser({ ...user.attributes })
            await window.localStorage.setItem('userData', JSON.stringify(user.attributes))
            const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
            router.replace(redirectURL)
          }).catch(() => {
          })
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      setUser(null)
      setIsInitialized(false)
      window.localStorage.removeItem('userData')
      await window.localStorage.removeItem(authConfig.storageTokenKeyName)
      router.push('/login')
    }
    catch(err) {
      console.log('Error when performing AWS Logout')
    }
  }
  

  const handleRegister = async (params, errorCallback) => {

    const {fullName, email, phoneNumber, password, confirmationCode} = params

    if(email) {
      try {
        const response = await Auth.signUp({
          username:email,
          email,
          password,
          attributes: {
            email,
            name: fullName,
            phone_number: phoneNumber
          }
        })
        var userInfo = {username: response.user.username, password: password}
        setUserInformation(userInfo)
        errorCallback({user: userInformation})
        } catch (err) {
          errorCallback({error:'AWS amplify error when signup'})
        }
    }
    else {
      await Auth.confirmSignUp(userInformation.username, confirmationCode.toString())
      Auth.signIn(userInformation.username, userInformation.password).then( (user) => {
        window.localStorage.setItem(authConfig.storageTokenKeyName, user.signInUserSession.accessToken.jwtToken)
      })
      .then(() => {
        Auth.currentAuthenticatedUser()
          .then(async user => {
            const returnUrl = router.query.returnUrl
            setUser({ ...user.attributes })
            await window.localStorage.setItem('userData', JSON.stringify(user.attributes))
            const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
            router.replace(redirectURL)
          }).catch(() => {
          })
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
    }
    
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
