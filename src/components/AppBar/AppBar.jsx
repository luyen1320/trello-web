import { Box, Button, InputAdornment, TextField, Tooltip, Typography } from '@mui/material'
import AppsIcon from '@mui/icons-material/Apps'
import {ReactComponent as trellologo} from '~/assets/trello.svg'
import SvgIcon from '@mui/material/SvgIcon'
import Workspace from './Menus/Workspace'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profile from './Menus/Profile'
import { Close, LibraryAdd, Search } from '@mui/icons-material'
import { useState } from 'react'
import ModelSelect from '../ModeSelect/ModeSelect'

function AppBar() {
    const [searchValue, setSearchValue] = useState('')

    return (
    <Box px={2} sx={{
            width: '100%',
            height: (theme) => theme.trelloCustom.appBarHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            overflowX: 'auto',
            bgcolor:(theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0')
        }}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                <AppsIcon sx={{color: 'white'}}/>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                    <SvgIcon component={trellologo} inheritViewBox sx={{color: 'white'}}/>
                    <Typography variant='span' sx={{fontSize: '1.2rem', fontWeight: 'bold', color: 'white'}}>Trello</Typography>
                </Box>
                <Box sx={{display: {xs: 'none',md: 'flex'}, gap: 1}}>
                    <Workspace/>
                    <Recent/>
                    <Starred/>
                    <Templates/>
                    <Button
                        sx={{
                            color: 'white',
                            border: 'none',
                            '&:hover': {border: 'none'}
                        }}
                        variant='outlined' startIcon={<LibraryAdd/>}>Create</Button>
                </Box>
            </Box>

            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                <TextField 
                    id='outlined-search' 
                    label='Search...' 
                    type='text' 
                    size='small'
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)} 
                    sx={{
                        minWidth: '120px', 
                        maxWidth: '180px',
                        '& label': {color: 'white'},
                        '& input': {color: 'white'},
                        '& label.Mui-focused': {color: 'white'},
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderWidth: 'white'
                            },
                            '&:hover fieldset': {
                                borderWidth: 'white'
                            },
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <Search sx={{color: 'white'}}/>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position='end'>
                                <Close 
                                fontSize='small'
                                sx={{color: searchValue ? 'white' : 'transparent', cursor: 'pointer'}}
                                onClick={() => setSearchValue('')}
                            />
                            </InputAdornment>
                        )
                    }}
                />

                <ModelSelect/>

                <Tooltip title='Notifacation'>
                    <Badge badgeContent={4} color="warning" variant='dot' sx={{cursor: 'pointer'}}>
                        <NotificationsNoneIcon sx={{color: 'white'}}/>
                    </Badge>
                </Tooltip>

                <Tooltip title='Help'>
                    <HelpOutlineIcon sx={{cursor: 'pointer', color: 'white'}}/>
                </Tooltip>

                <Profile/>
            </Box>
        </Box>
    )
}

export default AppBar