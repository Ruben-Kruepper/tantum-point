import { useRef, useEffect, useState } from 'react'
import {
    Box,
    CircularProgress
} from '@material-ui/core'


export function LoadingFiller(props) {
    const boxRef = useRef(null)
    const [boxHeight, setBoxHeight] = useState(0)
    const [boxWidth, setBoxWidth] = useState(0)

    useEffect(() => {
        if (boxRef.current) {
            setBoxHeight(boxRef.current.offsetHeight)
            setBoxWidth(boxRef.current.offsetWidth)
        }
    }, [boxRef])

    return (
        <Box ref={boxRef} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: props.height || '100%', width: props.width || '100%' }}>
            <CircularProgress size={Math.floor(Math.min(boxHeight * 0.2, boxWidth * 0.2))} color='secondary' />
        </Box>
    )
}