import {Box} from '@mui/material'
import Column from './Column/Column'
import {Button, TextField, InputAdornment} from '@mui/material'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { NoteAdd } from '@mui/icons-material'
import { useState } from 'react'
import { Close } from '@mui/icons-material'
import { toast } from 'react-toastify'


function ListColumns({columns, createNewColumn, createNewCard, deleteColumnDetails}) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  const toggleOpenNewColumnForm = () => {
    setOpenNewColumnForm(!openNewColumnForm)
  }

  const addNewColumn = () => {
    if(!newColumnTitle) {
      toast.error("Please enter Column Title!")
      return
    }

    //tao du lieu column de goi API
    const newColumnData = {
      title: newColumnTitle
    }

    createNewColumn(newColumnData)

    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }

  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '*::-webkit-scrollbar-track': {m: 2},
      }}>
        {columns?.map(column =>(
          <Column 
            key={column._id}
            column={column}
            createNewCard={createNewCard}
            deleteColumnDetails={deleteColumnDetails}
          />
        ))}
        {!openNewColumnForm ?
          <Box onClick={toggleOpenNewColumnForm}
            sx={{
            minWidth: '200px',
            maxWidth: '200px',
            mx: 2,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: 'ffffff3d'
          }}>
            <Button
            startIcon={<NoteAdd/>}
            sx={{
              color:'white',
              width: '100%',
              justifyContent: 'flex-start',
              pl: 2.5,
              py: 1
            }}
          >
            Add new column
            </Button>
          </Box> 
          :
          <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column', 
            gap: 1
          }}>
            <TextField 
              label='Enter column title...' 
              type='text' 
              size='small'
              variant='outlined'
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
                sx={{
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
                            '&.Mui-focused fieldset': {
                                borderWidth: 'white'
                            }
                        }
                }}
              />
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
              <Button 
                onClick={addNewColumn}
                variant='contained' color='success' size='small'
                sx={{boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': {bgcolor: (theme) => theme.palette.success.main}
              }}  >Add Column</Button>
              <Close 
                fontSize='small'
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': {color: (theme) => theme.palette.warning.light}
                }}  
                onClick={toggleOpenNewColumnForm}             
              />
            </Box>
          </Box>
        }
      </Box>
    </SortableContext>
  )
}

export default ListColumns