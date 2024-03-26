import { Box } from '@mui/material'
import ModelSelect from '../ModeSelect'

function AppBar() {
    return (
        <Box sx={{
                backgroundColor: 'primary.light',
                width: '100%',
                height: (theme) => theme.trelloCustom.appBarHeight,
                display: 'flex',
                alignItems: 'center'
            }}>
                <ModelSelect/>
            </Box>
    )
}

export default AppBar;