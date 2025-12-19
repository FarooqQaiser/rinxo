 import React from 'react'
import { Link } from 'react-router-dom'

export default function Button({locationHref,extraCss, btnName, bgColour,textColour, hoverBgColour, fontTextStyle, children}) {
  return (
    <Link to={locationHref}>
        <button className={`${extraCss} ${bgColour} ${textColour} ${fontTextStyle} ${hoverBgColour}`}>
            {btnName}
            {children}
        </button> 
    </Link>

  )
}
