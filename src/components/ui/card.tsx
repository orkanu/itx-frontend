import React, { type PropsWithChildren } from 'react'
import './card.css'

interface CardProps {
  key?: any
}

const Card = ({ children, ...rest }: PropsWithChildren<CardProps>) => {
  return (
    <article {...rest} className="card">
      {children}
    </article>
  )
}

export default Card;
