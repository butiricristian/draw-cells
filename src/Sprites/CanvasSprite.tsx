import { Node } from 'konva/lib/Node'
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
        // onTransformEnd={(e) => {
        //   // transformer is changing scale of the node
        //   // and NOT its width or height
        //   // but in the store we have only width and height
        //   // to match the data better we will reset scale on transform end
        //   const node: Node = ref.current;
        //   const scaleX = node.scaleX();
        //   const scaleY = node.scaleY();

        //   // we will reset it back
        //   node.scaleX(1);
        //   node.scaleY(1);
        //   onChange({
        //     ...shapeProps,
        //     // x: node.x(),
        //     // y: node.y(),
        //     // set minimal value
        //     width: Math.max(5, node.width() * scaleX),
        //     height: Math.max(5, node.height() * scaleY),
        //     rotation: node.rotation()
        //   });
        // }}
      />
    </React.Fragment>
  )
})

export default CanvasSprite
