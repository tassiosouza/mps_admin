// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'

// ** Amplify Auth
// ** Amplify
import aws_exports from '../../../aws-exports';
import Amplify, {Auth} from 'aws-amplify';

Amplify.configure(aws_exports);

const AuthGuard = props => {
  console.log('props: ')
  
  const { children, fallback } = props
  const router = useRouter()
  const auth = useAuth()
  useEffect(
    () => {
      console.log('route updated original: ' + console.log(auth));
      if (!router.isReady) {
        return
      }
      if (auth.user === null && !window.localStorage.getItem('userData')) {
        if (router.asPath !== '/') {
          router.replace({
            pathname: '/login',
            query: { returnUrl: router.asPath }
          })
        } else {
          router.replace('/login')
        }
      }
    //   const initAuth = async () => {
    //   const auth = await Auth.currentAuthenticatedUser()
    //   console.log('route updated: ' + JSON.stringify(auth));
    //   if (!router.isReady) {
    //     return
    //   }
    //   if (auth.user === null && !window.localStorage.getItem('userData')) {
    //     if (router.asPath !== '/') {
    //       router.replace({
    //         pathname: '/login',
    //         query: { returnUrl: router.asPath }
    //       })
    //     } else {
    //       router.replace('/login')
    //     }
    //   }
    // }
    //   initAuth()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route]
  )
  if (auth.loading || auth.user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
