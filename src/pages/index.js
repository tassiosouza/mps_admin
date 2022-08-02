// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'

/**
 *  Set Home URL based on User Roles
 */
export const getHomeRoute = role => {
  if (role === 'client') return '/acl'
  else return '/dashboards/crm'
}

const Home = () => {
  // ** Hooks
  const auth = {
    user: {
      role: 'admin',
      password: 'admin',
      fullName: 'John Doe',
      username: 'johndoe',
      email: 'admin@materialize.com'
    },
    loading: false,
    isInitialized: true
  }
  const router = useRouter()
  useEffect(() => {
    if (auth.user) {
      const homeRoute = getHomeRoute('admin')

      // Redirect user to Home URL
      router.replace(homeRoute)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Spinner />
}

export default Home
