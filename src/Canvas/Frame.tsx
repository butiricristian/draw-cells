import React from 'react'

interface FrameProps {
  title: string
}

const Frame = ({title}: FrameProps) => {
  return (
    <div style={{height: '100%', border: 'solid 1px #ddd', width: '300px'}}>
      {title}
    </div>
  )
}

export default Frame