import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
  useColorScheme
} from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { Box } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'

function ModelSelect() {
  const { mode, setMode } = useColorScheme()

  const handleChange = (event) => {
    const selectedMode = event.target.value
    setMode(selectedMode)
  }
  
  return (
      <FormControl size='small'>
        <InputLabel 
          id="label-select-dark-light-mode"
          sx={{
            color: 'white',
            '&.Mui-focused': {color: 'white'}
          }}  
        >Mode</InputLabel>

        <Select
          labelId="label-select-dark-light-mode"
          id="select-dark-light-mode"      
          value={mode}
          label="Mode"
          onChange={handleChange}
          sx={{
            color: 'white',
            '.MuiOutlineInput-notchedOutline': {borderColor: 'white'},
            '&:hover .MuiOutlineInput-notchedOutline': {borderColor: 'white'},
            '&.Mui-focused .MuiOutlineInput-notchedOutline': {borderColor: 'white'},
            '.MuiSvgIcon-root': {color: 'white'}

          }}
        >
          <MenuItem value="light">
            <Box style={{display: 'flex', alignItems: 'center', gap: '8px'}}><LightModeIcon fontSize='small'/> Light</Box>
          </MenuItem>

          <MenuItem value="dark">
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}><DarkModeIcon fontSize='small'/> Dark</Box>
            
          </MenuItem>
          <MenuItem value="system">
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}><SettingsBrightnessIcon fontSize='small'/> System</Box>
         
          </MenuItem>
        </Select>
      </FormControl>
  );
}

export default ModelSelect