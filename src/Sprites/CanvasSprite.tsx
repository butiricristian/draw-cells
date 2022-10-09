import React from 'react'
import { Image } from 'react-konva'

const CanvasSprite = React.forwardRef(({spriteId, onSelect, onChange, ...shapeProps}: any, ref: any) => {
  const img = new window.Image()
  img.src = require(`../assets/cells/${shapeProps.backgroundUrl}.svg`)

  return (
    <React.Fragment>
      <Image
        spriteId={spriteId}
        image={img}
        onClick={onSelect}
        onTap={onSelect}
        ref={ref}
        {...shapeProps}
      />
    </React.Fragment>
  )
})

export default CanvasSprite
