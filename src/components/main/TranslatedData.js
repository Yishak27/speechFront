import { Container } from '@mui/material'
import React from 'react'

export const TranslatedData = (props) => {
    return (
        <Container>
            <h1>Amharic Word</h1>
            <p>
                {props.text || 'እየተሞከረ ነው.....'}
            </p>
        </Container>
    )
}
