import Container from '@mui/material/Container'
import BoardBar from './BoardBar/BoardBar'
import AppBar from '~/components/AppBar/AppBar'
// import {mockData} from '~/apis/mock-data'
import BoardContent from './BoardContent/BoardContent'
import { useEffect, useState } from 'react'
import { createNewCardAPI, createNewColumnAPI, deleteColumnDetailsAPI, fetchBoardDetailsAPI, moveCardToDifferentColumnAPI, updateBoardDetailsAPI, updateColumnDetailsAPI } from '~/apis'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'
import { mapOrder } from '~/utils/sorts'
import { Box, CircularProgress } from '@mui/material'
import { toast } from 'react-toastify'

const Board = () => {
    const [board, setBoard] = useState(null)

    useEffect(() => {
        const boardId = '6657400686fb24408aa0bd02'

        //Call API
        fetchBoardDetailsAPI(boardId).then(board => {
            board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

            //can xu ly van de keo tha vao 1 column rong(video 37.2)
            board.columns.forEach(column => {
                if(isEmpty(column.cards)){
                    column.cards = [generatePlaceholderCard(column)]
                    column.cardOrderIds = [generatePlaceholderCard(column)._id]
                } 
                else {
                    column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
                }
            })
            setBoard(board)
        })
    }, [])

    const createNewColumn = async (newColumnData) => {
        const createdColumn = await createNewColumnAPI({
            ...newColumnData,
            boardId: board._id
        })

        console.log('createdColumn: ',createdColumn)

        createdColumn.cards = [generatePlaceholderCard(createdColumn)]
        createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

        //cap nhat lai state board
        //phia front-end chung ta phai tu lam dung lai state board (thay vi phai goi lai api fetchBoardDetailsAPI)
        //luu y: cach lam nay phu thuoc vao tuy lua chon va dac thu du an, co noi thi BE se ho tro tra ve luon toan bo Board du day la api tao column hay card di chang nua => luc nay FE se nhan hon
        const newBoard = {...board}
        newBoard.columns.push(createdColumn)
        newBoard.columnOrderIds.push(createdColumn._id)
        setBoard(newBoard)
    }

    //func nay co nhiem vu goi API tao moi Card va lam lai du lieu state board
    const createNewCard = async (newCardData) => {
        const createdCard = await createNewCardAPI(
           { ...newCardData,
            boardId: board._id}
        )
        // console.log("createdCard: ",createdCard)
        const newBoard = {...board}
        const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
        if(columnToUpdate){
            //neu column rong
            if(columnToUpdate.cards.some(card => card.FE_PlaceholderCard)){
                columnToUpdate.cards = [createdCard]
                columnToUpdate.cardOrderIds = [createdCard._id]
            } else {
                //Nguoc lai Column da co data thi push vao cuoi mang
                columnToUpdate.cards.push(createdCard)
                columnToUpdate.cardOrderIds.push(createdCard._id)
            }
        } 
        setBoard(newBoard)
    }

    const moveColumns = (dndOrderedColumns) => {
        const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
        const newBoard = {...board}
        newBoard.columns = dndOrderedColumns
        newBoard.columnOrderIds = dndOrderedColumnsIds
        setBoard(newBoard)

        //goi API update Board
        updateBoardDetailsAPI(newBoard._id, {columnOrderIds: dndOrderedColumnsIds})
    }

    const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
        const newBoard = {...board}
        const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
        if(columnToUpdate){
            columnToUpdate.cards = dndOrderedCards
            columnToUpdate.cardOrderIds = dndOrderedCardIds
        }
        setBoard(newBoard)

        //goi API update column
        updateColumnDetailsAPI(columnId, {cardOrderIds: dndOrderedCardIds})
    }

    const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
        const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
        const newBoard = {...board}
        newBoard.columns = dndOrderedColumns
        newBoard.columnOrderIds = dndOrderedColumnsIds 
        setBoard(newBoard)

        //Goi API xu ly phia BE
        let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
        //Xu ly van de khi keo card cuoi cung ra khoi Column, Column rong se co placeholder card, can xoa no di truoc khi gui du lieu len cho phia BE
        if(prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []


        moveCardToDifferentColumnAPI({
            currentCardId,
            prevColumnId,
            prevCardOrderIds,
            nextColumnId,
            nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds,
        })
    }

    //Xu ly xoa 1 Column va Cards ben trong no
    const deleteColumnDetails = (columnId) => {
        //update cho chuan du lieu state board
        const newBoard = {...board}
        newBoard.columns = newBoard.columns.filter(c => c._id !== columnId)
        newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== columnId)
        setBoard(newBoard)

        //Goi APi xu ly phia FE
        deleteColumnDetailsAPI(columnId).then(res => {
            toast.success(res?.deleteResult)
        })
    }

    if(!board) {
        return(
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                width: '100vw',
                height: '100vh',

            }}>
                <CircularProgress/>
            </Box>
        )
    }

    return (
        <Container disableGutters maxWidth={false} sx={{height: '100vh'}}>
            <AppBar/>
            <BoardBar board={board}/>
            <BoardContent board={board}
                createNewColumn={createNewColumn}
                createNewCard={createNewCard}
                moveColumns={moveColumns}
                moveCardInTheSameColumn={moveCardInTheSameColumn}
                moveCardToDifferentColumn={moveCardToDifferentColumn}
                deleteColumnDetails={deleteColumnDetails}
            />
        </Container>
    )
}

export default Board