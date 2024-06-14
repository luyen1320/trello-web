import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
// import { teal, deepOrange, cyan, orange } from '@mui/material/colors'

const APP_BAR_HEIGHT = '58px'
const BOARD_BAR_HEIGHT = '60px'
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`
const COLUMN_HEADER_HEIGHT = '50px'
const COLUMN_FOOTER_HEIGHT = '56px'

const theme = extendTheme({
  trelloCustom: {
    appBarHeight: APP_BAR_HEIGHT,
    boardBarHeight: BOARD_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT,
    columnHeaderHeight: COLUMN_HEADER_HEIGHT,
    columnFooterHeight: COLUMN_FOOTER_HEIGHT
  },
  colorSchemes: {
    // light: {
    //   palette: {
    //     primary: teal,
    //     secondary: deepOrange
    //   }
    // },
    // dark: {
    //   palette: {
    //     primary: cyan,
    //     secondary: orange
    //   }
    // }
  },
  components: {
    MuiCssbaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            with: '8px',
            height: '1px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: 'red',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'white'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderWidth: '0.5px',
          '&:hover': {borderWidth: '0.5px'}
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({theme}) => ({
          // color: theme.palette.primary.main,
          fontSize: '0.875rem' 
        })
      }
    },
     MuiTypography: {
      styleOverrides: {
        root: {'&.MuiTypographyBody1': '0.875rem'}
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({theme}) => ({
            // color: theme.palette.primary.main,
            fontSize: '0.875rem',
          //   '.MuiOutlineInput-notchedOutline': {
          //     borderColor: theme.palette.primary.light
          //   },
          //   '&:hover': {
          //     '.MuiOutlineInput-notchedOutline': {
          //     borderColor: theme.palette.primary.main
          //   }
          // },
          '& fieldset': {
              borderWidth: '0.5px !important'
          },
          '&:hover fieldset': {
              borderWidth: '1px !important'
          },
          '&.Mui-focused fieldset': {
              borderWidth: '1px !important'
          }
        })
      }
    }
  }
  // ...other properties
})

export default theme
