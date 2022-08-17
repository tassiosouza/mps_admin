// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'

const StyledLink = styled('a')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  marginRight: theme.spacing(8)
}))

const AppBarContent = props => {
  // ** Props
  const {
    horizontalAppBarContent: userHorizontalAppBarContent,
    horizontalAppBarBranding: userHorizontalAppBarBranding
  } = props

  // ** Hooks
  const theme = useTheme()

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {userHorizontalAppBarBranding ? (
        userHorizontalAppBarBranding(props)
      ) : (
        <Link href='/' passHref>
          <StyledLink>
            <img src='/images/favicon.png' width={33} height={30} alt='logo'></img>
            <Typography variant='h6' sx={{ ml: 2, fontWeight: 700, lineHeight: 1.2 }}>
              {themeConfig.templateName}
            </Typography>
          </StyledLink>
        </Link>
      )}
      {userHorizontalAppBarContent ? userHorizontalAppBarContent(props) : null}
    </Box>
  )
}

export default AppBarContent
