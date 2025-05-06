import React from 'react'
import Card from './Card'

//component to display multiple cards when called
const CardGroup = ( {cards}) => {
    return(
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems:"center",
                justifyContent: "center",
                gap: "20px",
                padding: "20px",
            }}
        >
            { cards.map((card, index) =>(
                <Card
                    key={index}
                    title={card.title}
                    description={card.description}
                    imageUrl={card.imageUrl}
                />
            ))}
        </div>
    )
}
export default CardGroup