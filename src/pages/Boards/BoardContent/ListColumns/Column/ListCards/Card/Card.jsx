import { Attachment, Comment, Group, Opacity } from '@mui/icons-material'
import { Button, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'

function Cards({card}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({id: card._id, data: {...card}});

    const dndKitCardStyles = {
        // touchAction: 'none', danh default cho sensor dang PointerSensor
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : undefined,
        border: isDragging ? '1px solid #2ecc71' : undefined
    };

    const shouldShowCardAction = () => {
        return !!card?.memberIds?.length || !!card?.memberIds?.length || !!card?.memberIds?.length 
    }
  return (
     <Card 
        ref={setNodeRef} 
        style={dndKitCardStyles} 
        {...attributes} 
        {...listeners} 
        sx={{
            cursor: 'pointer',
            boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
            overflow: 'unset',
            display: card?.FE_PlaceholderCard ? 'none' : 'block',
            // display: card?.FE_PlaceholderCard ? 'hidden' : 'unset',
            // height: card?.FE_PlaceholderCard ? '0px' : 'unset' 
        }}>
            {card?.cover &&
                <CardMedia
                    sx={{ height: 140 }}
                    image={card?.cover}
                   
                />
            }
            
            <CardContent sx={{
                 p: 1.5,
                '&:last-child': {p: 1.5} 
            }}>
            <Typography>
                {card?.title}
            </Typography>
            </CardContent>

            {shouldShowCardAction() && 
            <CardActions>
                {!!card?.memberIds?.length && 
                    <Button size="small" startIcon={<Group/>}>{card?.memberIds?.length}</Button>
                }
                {!!card?.comments?.length && 
                    <Button size="small" startIcon={<Comment/>}>{card?.comments?.length}</Button>
                }
                {!!card?.attachments?.length && 
                    <Button size="small" startIcon={<Attachment/>}>{card?.attachments?.length}</Button>
                }
                
                </CardActions> 
            }
    </Card>
  )
}

export default Cards