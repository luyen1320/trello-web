import { Box } from '@mui/material'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {DndContext, DragOverlay, closestCenter, closestCorners, defaultDropAnimationSideEffects, getFirstCollision, pointerWithin, rectIntersection, useSensor, useSensors} from '@dnd-kit/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import {arrayMove} from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Cards from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensors'

const ACTIVE_DRAG_ITEM_TYPE = {
    COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
    CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({
    board,
    createNewColumn,
    createNewCard,
    moveColumns,
    moveCardInTheSameColumn,
    moveCardToDifferentColumn,
    deleteColumnDetails
}) {
    // const pointerSensor = useSensor(PointerSensor, {activationConstraint: {distance: 10}})

    const mouseSensor = useSensor(MouseSensor, {activationConstraint: {distance: 10}})
    const touchSensor = useSensor(TouchSensor, {activationConstraint: {delay: 250, tolerance: 500}})
    // const sensor = useSensors(pointerSensor)
    const sensors = useSensors(mouseSensor, touchSensor)

    const [orderedColumns, setOrderColumns] = useState([])

    //cung 1 thoi diem chi co 1 phan tu dang duoc keo (column hoac card)
    const [activeDragItemId, setActiveDragItemId] = useState(null)
    const [activeDragItemType, setActiveDragItemType] = useState(null)
    const [activeDragItemData, setActiveDragItemData] = useState(null)
    const [oldColumnWhenDraggingCard, setOldColumnWhenGraggingCard] = useState(null)

    //diem va cham cuoi cung
    const lastOverId = useRef(null)

    useEffect(() => {
        setOrderColumns(board.columns)
    },[board])

    const findColumnByCardId = (cardId) => {
        return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
    }

    //cap nhat lai state trong truong hop di chuyen card giua cac column khac nhau
    const moveCardBetweenDifferentColumns = (
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        triggerFrom
    ) => {
        setOrderColumns(prevColumns => {
                //tim vi tri (index) cua cai overCard trong column dich (noi card sap duoc tha)
                const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

                let newCardIndex
                const isBelowOverItem = active.rect.current.translated &&
                active.rect.current.translated.top > over.rect.top + over.rect.height
                const modifier = isBelowOverItem ? 1 : 0
                newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.lenght + 1

                //clone mang OrderedColumnsState cu ra 1 cai moi de xu ly data roi return - cap nhat lai
                const nextColumns = cloneDeep(prevColumns)
                const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
                const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

                //column cu
                if(nextActiveColumn) {
                    //kiem tra xem card dang keo no co ton tai o overColumn chua, neu co thi can xoa truoc
                    nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)             
                    
                    //them placeholder card neu column rong bi keo het card di, ko con cai nao nua
                    if(isEmpty(nextActiveColumn.cards)) {
                        nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
                    }

                    //tiep theo la them cai card dang keo vao overColumn theo vi tri index moi
                    nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
                }

                //column moi
                if(nextOverColumn) {
                    //xoa cardo cai column active (cung co the hieu la column cu, cai lux ma keo card ra khoi no de sang column khac)
                    nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)             
            
                    const rebuild_activeDraggingCardData = {
                        ...activeDraggingCardData,
                        columnId: nextOverColumn._id
                    }
                    console.log("rebuild_activeDraggingCardData: ",rebuild_activeDraggingCardData)

                    //tiep theo la them cai card dang keo vao overColumn theo vi tri index moi
                    nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

                    //xoa cai placeholder
                    nextActiveColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)

                    //cap nhat lai mang cardOrderIds cho chuan du lieu
                    nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
                }

                //neu func nay dc goi tu handleDragEnd nghi la da keo tha xong luc nay moi xu ly goi API 1 lan o day
                if(triggerFrom === 'handleDragEnd') {
                    moveCardToDifferentColumn(
                        activeDraggingCardId,
                        oldColumnWhenDraggingCard._id,
                        nextOverColumn._id,
                        nextColumns
                    )
                }

                return nextColumns
        })
    }

    //trigger khi bat dau keo 1 phan tu
    const handleDragStart = (event) => {
        // console.log("start: ",event)
        setActiveDragItemId(event?.active?.id)
        setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN )
        setActiveDragItemData(event?.active?.data?.current)

        //neu la keo card thi moi thuc hien hanh dong set gtri oldColumn
        if(event?.active?.data?.current?.columnId) {
            setOldColumnWhenGraggingCard(findColumnByCardId(event?.active?.id))
        }
    }

    //trigger trong qua trinh keo (drag) 1 phan tu
    const handleDragOver = (event) => {
        // console.log("over: ",event)
        //ko lam gi them neu dang keo column
        if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

        //Con neu koe card thi xu ly them de co the keo card qua lai hiua cac cloumn
        const { active, over } = event

        //kiem tra neu ko ton tai over (keo linh tinh ra ngoai thi return luon tranh loi)
        if(!active || !over) return

        //activeDraggingCardId la cai card dang dc keo
        const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
        //overCard: la cai card dang tuong tac tren hoac duoi so voi card duoc keo o tren
        const { id: overCardId } = over

        //tim 2 cai columns theo cardId
        const activeColumn = findColumnByCardId(activeDraggingCardId)
        const overColumn = findColumnByCardId(overCardId)

        //neu ko ton tai 1 trong 2 column thi ko lam gi het, tranh crash trang web
        if(!activeColumn || !overColumn) return

        //xu ly logic o day chi khi keo card qua 2 column khac nhau, con neu card trong chinh column ban dau cua no thi ko lam gi
        //vi day dang la doan xu ly luc keo (handleDragOver), con xu ly luc keo xong xuoi thi no lai la van de khac o (handleDragEnd)
        if(activeColumn._id !== overColumn._id) {
           moveCardBetweenDifferentColumns(
            overColumn,
            overCardId,
            active,
            over,
            activeColumn,
            activeDraggingCardId,
            activeDraggingCardData,
            'handleDragOver'
           )
        }
    }

    const handleDragEnd = (event) => {
        // console.log('check: ', event)

        const { active, over } = event

        //kiem tra neu ko ton tai over (keo linh tinh ra ngoai thi return luon tranh loi)
        if(!active || !over) return

        //xu ly keo tha card
        if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
            //activeDraggingCardId la cai card dang dc keo
            const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
            //overCard: la cai card dang tuong tac tren hoac duoi so voi card duoc keo o tren
            const { id: overCardId } = over

            //tim 2 cai cloumns theo cardId
            const activeColumn = findColumnByCardId(activeDraggingCardId)
            const overColumn = findColumnByCardId(overCardId)

            //neu ko ton tai 1 trong 2 column thi ko lam gi het, tranh crash tragn web
            if(!activeColumn || !overColumn) return

            console.log("activeDraggingCardId: ",activeDraggingCardId)
            if(oldColumnWhenDraggingCard._id !== overColumn._id) {
              moveCardBetweenDifferentColumns(
                overColumn,
                overCardId,
                active,
                over,
                activeColumn,
                activeDraggingCardId,
                activeDraggingCardData,
                'handleDragEnd'
                )
            } else {
                // lay vi tri cu (tu thang oldColumnWhenDraggingCard)
                const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)

                // lay vi tri cu (tu thang overColumn)
                const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)

                //dung arrayMove vi keo card trong 1 cai column thi tuong tu voi logic keo column trong 1 cai board content
                const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
                const dndOrderedCardIds = dndOrderedCards.map(card => card._id)
                console.log("dndOrderedCards: ", dndOrderedCards)

                setOrderColumns(prevColumns => {
                    //Clone mang OrderedColumnsState cu ra 1 cai moi de xu ly data roi return cap nhat lai OrderedColumnsState moi
                    const nextColumns = cloneDeep(prevColumns)

                    //tim toi cai column ma chung ta dang tha
                    const targetColumn = nextColumns.find(column => column._id === overColumn._id)

                    //cap nhat lai 2 gtri la card va cardOrderIds trong cai targetColumn
                    targetColumn.cards = dndOrderedCards
                    targetColumn.cardOrderIds = dndOrderedCardIds

                    return nextColumns
                })
                moveCardInTheSameColumn(dndOrderedCards, dndOrderedCardIds, oldColumnWhenDraggingCard._id)
            }
        }
        
        //xu ly keo tha columns
        if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
            if(active.id !== over.id) {
                // lay vi tri cu (tu thang active)
                const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)

                // lay vi tri moi (tu thang over)
                const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)

                const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
                // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id === over.id)

                moveColumns(dndOrderedColumns)
                
                //cap nhat lai state columns ban dau sau khi da keo tha
                setOrderColumns(dndOrderedColumns)
            }
        }

        //nhung du lieu sau khi keo tha nay luon phai dua ve gia tri null mac dinh ban dau
        setActiveDragItemId(null)
        setActiveDragItemType(null)
        setActiveDragItemData(null)
        setOldColumnWhenGraggingCard(null)
    }

    const customDropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                opacity: '0.5'
            }
        })
    }

    const collisionDetectionStratery = useCallback((args) => {
        if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
            return closestCorners( {...args})
        }

        //tim cac diem giao nhau, va cham - intersections voi con tro 
        const pointerInterSections = pointerWithin(args)

        if(!pointerInterSections?.length) return

        // const intersections = !!pointerInterSections?.length ? pointerInterSections : rectIntersection(args)

        //tim overId dau tien trong dam
        let overId = getFirstCollision(pointerInterSections, 'id')

        if(overId) {
            const checkColumn = orderedColumns.find(column => column._id === overId)
            if(checkColumn) {
                overId = closestCenter({
                    ...args,
                    droppableContainers: args.droppableContainers.filter(container => {
                        return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
                    })
                })[0]?.id
            }

            lastOverId.current = overId
            return [{id: overId}]
        }

        return lastOverId.current ? [{id: lastOverId.current}] : []
    },[activeDragItemType])

    return (
        <DndContext
            sensors={sensors}
            // collisionDetection={closestCorners}
            collisionDetection={collisionDetectionStratery}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <Box sx={{
                bgcolor:(theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
                width: '100%',
                height: (theme) => theme.trelloCustom.boardContentHeight,
                p: '10px 0'
            }}>
                <ListColumns 
                    columns={orderedColumns}
                    createNewColumn={createNewColumn}
                    createNewCard={createNewCard}
                    deleteColumnDetails={deleteColumnDetails}    
                />
                <DragOverlay dropAnimation={customDropAnimation}>
                    {!activeDragItemType && null}
                    {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData}/>}
                    {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Cards card={activeDragItemData}/>}
                </DragOverlay>
            </Box>
        </DndContext>
    );
}

export default BoardContent