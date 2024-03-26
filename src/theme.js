import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { teal, deepOrange, cyan } from '@mui/material/colors'

const theme = extendTheme({
  trelloCustom: {
    appBarHeight: '48px',
    boardBarHeight: '58px'
  },
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secondary: deepOrange
      }
    },
    dark: {
      palette: {
        primary: cyan,
        secondary: deepOrange
      }
    }
  }
  // ...other properties
})

export default theme
