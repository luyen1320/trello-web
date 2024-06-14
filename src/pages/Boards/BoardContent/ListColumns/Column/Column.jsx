import { AddCard, ContentCopy, ContentPaste, DeleteForever, DragHandle, ExpandMore, Close, Description } from '@mui/icons-material'
import { Box, Button, Tooltip, Typography, TextField } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import Cloud from '@mui/icons-material/Cloud'
import { useState } from 'react'
import ListCards from './ListCards/ListCards'
import { mapOrder } from '~/utils/sorts'
import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import { useConfirm } from 'material-ui-confirm'
import { toast } from 'react-toastify'

function Column({column, createNewCard, deleteColumnDetails}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition, 
        isDragging
    } = useSortable({id: column._id, data: {...column}});

    const dndKitColumnStyles = {
        // touchAction: 'none',
        transform: CSS.Translate.toString(transform),
        transition,
        height: '100%',
        opacity: isDragging ? 0.5 : undefined
    };

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const orderedCards = column.cards
    // const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')

    const [openNewCardForm, setOpenNewCardForm] = useState(false)
    const [newCardTitle, setNewCardTitle] = useState('')

    const toggleOpenNewCardForm = () => {
        setOpenNewCardForm(!openNewCardForm)
    }

    const addNewCard = () => {
        if(!newCardTitle) {
            toast.error('Please enter Card Tilte!')
            return
        }

        //tao du lieu card de goi API
        const newCardData = {
            title: newCardTitle,
            columnId: column._id
        }

        createNewCard(newCardData)

        toggleOpenNewCardForm()
        setNewCardTitle('')
    }

    //Xu ly xoa 1 column va cards ben trong no
    const confirmDeleteColumn = useConfirm()
    const handleDeleteColumn = () => {
        confirmDeleteColumn({
            title: 'Delete Column?',
            description: 'This action will permanently delete your Column and its Cards! Are you sure?',
            // content: '',
            confirmationText: 'Confirm',
            cancellationText: 'Cancel',
            
            // dialogProps: {maxWidth: 'xs'},
            // cancelationButtonProps: {color: 'inherit'},
            // confirmationButtonProps: {color: 'secondary', variant: 'outlined'},
            // buttonOrder: ['confirm','cancel']
        }).then(() => {
            deleteColumnDetails(column._id)
            // console.log(column._id)
        }).catch()
    }

  return (
    <div ref={setNodeRef} 
        style={dndKitColumnStyles} 
        {...attributes} 
        {...listeners} 
    >
        <Box
            sx={{
                minWidth: '300px',
                maxWidth: '300px',
                bgcolor:(theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
                ml: 2,
                borderRadius: '6px',
                height: 'fit-content',
                maxHeight: (theme) => `calc(${theme.trelloCustom.boardContentHeight} - ${theme.spacing(5)})`,
            }}
        >
            {/*Column header*/}
            <Box sx={{
                        height: (theme) => theme.trelloCustom.columnHeaderHeight,
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Typography variant='h6' sx={{
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}>{column?.title}</Typography>

                        <ExpandMore
                                sx={{
                                    color: 'text.primary',
                                    cursor: 'pointer',
                                 }}
                                id='basic-column-dropdown'
                                aria-controls={open ? 'basic-button-workspaces' : undefined}
                                aria-haspopup='true'
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                            />
                        <Menu
                                id='basic-menu-workspaces'
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby' : 'basic-button-workspaces'
                                }}
                            >
                                <MenuItem onClick={toggleOpenNewCardForm}
                                 sx={{
                                    '&:hover': {
                                        color: 'success.light',
                                        '& .add-card-icon': {color: 'success.light'}
                                    }
                                }}>
                                    <ListItemIcon>
                                        <AddCard fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Add new card</ListItemText>
                                </MenuItem>
                                <MenuItem>
                                    <ListItemIcon>
                                        <ContentCut fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Cut</ListItemText>
                                </MenuItem>
                                <MenuItem>
                                    <ListItemIcon>
                                        <ContentCopy fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Copy</ListItemText>
                                </MenuItem>
                                <MenuItem>
                                    <ListItemIcon>
                                        <ContentPaste fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Paste</ListItemText>
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={handleDeleteColumn}
                                    sx={{
                                    '&:hover': {
                                        color: 'warning.dark',
                                        '& .delete-forever-icon': {color: 'warning.dark'}
                                    }
                                }}>
                                    <ListItemIcon>
                                        <DeleteForever fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Delete this column</ListItemText>
                                </MenuItem>
                                <MenuItem>
                                    <ListItemIcon>
                                        <Cloud fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Web Clipboard</ListItemText>
                                </MenuItem>
                        </Menu>
            </Box>

            {/*Column card*/}         
            <ListCards cards={orderedCards}/>

            {/*Column footer*/}
            <Box sx={{
                height: (theme) => theme.trelloCustom.columnFooterHeight,
                p: 2, 
            }}>
                {!openNewCardForm ?
                    <Box sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Button startIcon={<AddCard/>} onClick={toggleOpenNewCardForm}>Add new card</Button>
                        <Tooltip title='Drag to move'>
                            <DragHandle sx={{cursor: 'pointer'}}/>
                        </Tooltip>
                    </Box>
                    :
                    <Box sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        <TextField 
                            label='Enter card title...' 
                            type='text' 
                            size='small'
                            variant='outlined'
                            autoFocus
                            data-no-dnd='true'
                            value={newCardTitle}
                            onChange={(e) => setNewCardTitle(e.target.value)}
                            sx={{
                                '& label': {color: 'text.primary'},
                                '& input': {
                                    color: (theme) => theme.palette.primary.main,
                                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white'),
                                },
                                '& label.Mui-focused': {color: (theme) => theme.palette.primary.main},
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                    borderColor: (theme) => theme.palette.primary.main
                                    },  
                                    '&:hover fieldset': {
                                        borderColor: (theme) => theme.palette.primary.main
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: (theme) => theme.palette.primary.main
                                    },
                                },
                                '& .MuiOutlinedInput-input': {
                                    borderRadius: 1
                                }
                            }}
                        />
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            <Button
                                data-no-dnd='true'
                                onClick={addNewCard}
                                variant='contained' color='success' size='small'
                                sx={{boxShadow: 'none',
                                border: '0.5px solid',
                                borderColor: (theme) => theme.palette.success.main,
                                '&:hover': {bgcolor: (theme) => theme.palette.success.main}
                            }}  >Add</Button>
                            <Close 
                                fontSize='small'
                                sx={{
                                color: (theme) => theme.palette.warning.light,
                                cursor: 'pointer',
                                
                                }}      
                                onClick={toggleOpenNewCardForm}         
                            />
                        </Box>
                    </Box>
                }
            </Box>
        </Box>
    </div>
  )
}

export default Column