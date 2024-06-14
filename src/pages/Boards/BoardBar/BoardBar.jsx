import { Avatar, AvatarGroup, Box, Button, Chip, Tooltip } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import { AddToDrive, Bolt, FilterList, PersonAdd, VpnLock } from '@mui/icons-material'
import {capitalizeFirstLetter} from '~/utils/formatters'

const MENU_STYLES = {
    color: 'white',
    bgcolor: 'transparent',
    border: 'none',
    paddingX: '5px',
    borderRadius: '4px',
    '.MuiSvgIcon-root' : {
        color: 'white'
    },
    '&:hover': {
        bgcolor: 'primary.50'
    }
}

function BoardBar({board}) {
    
    return (
        <Box sx={{
            width: '100%',
            height: (theme) => theme.trelloCustom.boardBarHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            paddingX: 2, 
            overflowX: 'auto',
            bgcolor:(theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
            borderBottom: '1px solid white'
        }}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
               
                <Chip 
                    sx={MENU_STYLES}
                    icon={<DashboardIcon/>} 
                    label={board?.title} 
                    clickable 
                />
                
                <Chip 
                    sx={MENU_STYLES}
                    icon={<VpnLock/>} 
                    label={board?.type} 
                    clickable 
                />
                
                <Chip 
                    sx={MENU_STYLES}
                    icon={<AddToDrive/>} 
                    label='Add to google drive' 
                    clickable 
                />
                <Chip 
                    sx={MENU_STYLES}
                    icon={<Bolt/>} 
                    label='Automation' 
                    clickable 
                />
                <Chip 
                    sx={MENU_STYLES}
                    icon={<FilterList/>} 
                    label='Filters' 
                    clickable 
                />
            </Box>

            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                <Button 
                    variant='outlined' 
                    startIcon={<PersonAdd/>}
                    sx={{
                        color: 'white',
                        borderColor: 'white',
                        '&:hover': {borderColor: 'white'}
                    }}
                >Invite</Button>
                <AvatarGroup max={5} sx={{
                    gap: '10px',
                    '& .MuiAvatar-root' : {
                        height: 34,
                        width: 34,
                        fontSize: 16,
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        '&:first-of-type': {bgcolor: '#a4b0be'}
                    }
                }}>
                    <Tooltip title='users'>
                        <Avatar alt='luyen1'/>
                    </Tooltip>
                    <Tooltip title='users'>
                        <Avatar alt='luyen1'/>
                    </Tooltip>
                    <Tooltip title='users'>
                        <Avatar alt='luyen1'/>
                    </Tooltip>
                    <Tooltip title='users'>
                        <Avatar alt='luyen1'/>
                    </Tooltip>
                    <Tooltip title='users'>
                        <Avatar alt='luyen1'/>
                    </Tooltip>
                    <Tooltip title='users'>
                        <Avatar alt='luyen1'/>
                    </Tooltip>
                    <Tooltip title='users'>
                        <Avatar alt='luyen1'/>
                    </Tooltip>
                    <Tooltip title='users'>
                        <Avatar alt='luyen1'/>
                    </Tooltip>
                </AvatarGroup>
            </Box>
        </Box>
    )
}

export default BoardBar