import React, { useEffect, useRef, useState } from 'react'
import {
  Stage,
  Layer,
  Rect,
  FastLayer,
  Line,
  Circle,
} from 'react-konva'

// Konva

const Chart = () => {
  // const [state, setState] = useState({
  //   isDragging: false,
  //   x: 50,
  //   y: 50,
  // })

  const [zoom, setZoom] = useState({
    scaleX: 1,
    scaleY: 1,
  })

  // add refs dynamically for components
  const refs = [
    {
      ref: useRef(),
    },
    {
      ref: useRef(),
    },
  ]

  // add components dynamically
  const components = [
    {
      component: (
        <Rect
          ref={refs[0].ref}
          x={100}
          y={200}
          width={100}
          height={100}
          fill="tomato"
          draggable
          // onDragStart={() => {
          //   setState((prev) => ({ ...prev, isDragging: true }))
          // }}
          // onDragEnd={(e) => {
          //   setState((prev) => ({
          //     ...prev,
          //     isDragging: false,
          //     x: e.target.x(),
          //     y: e.target.y(),
          //   }))
          // }}
        />
      ),
    },
    {
      component: (
        <Circle
          ref={refs[1].ref}
          x={200}
          y={100}
          radius={50}
          fill="lightblue"
          draggable
          // onDragStart={() => {
          //   setState((prev) => ({ ...prev, isDragging: true }))
          // }}
          // onDragEnd={(e) => {
          //   setState((prev) => ({
          //     ...prev,
          //     isDragging: false,
          //     x: e.target.x(),
          //     y: e.target.y(),
          //   }))
          // }}
        />
      ),
    },
  ]

  const handleZoomOut = () => {
    if (zoom.scaleX === 5) return
    setZoom((prev) => ({
      ...prev,
      scaleX: prev.scaleX + 1,
      scaleY: prev.scaleY + 1,
    }))
  }

  const handleZoomIn = () => {
    if (zoom.scaleX === 1) return
    setZoom((prev) => ({
      ...prev,
      scaleX: prev.scaleX - 1,
      scaleY: prev.scaleY - 1,
    }))
  }

  const handleReset = () => {
    setZoom({ scaleX: 1, scaleY: 1 })
    document.body.scrollTop = 0 // For Safari
    document.documentElement.scrollTop = 0
  }

  useEffect(() => {
    refs.forEach((item) => {
      const shape = item.ref.current
      shape.to({ ...zoom, onFinish: () => {} })
    })
  }, [zoom])

  const grid = buildGrid()

  return (
    <div>
      <div style={{ position: 'fixed', zIndex: '10' }}>
        <button type="button" onClick={handleReset}>
          reset
        </button>
        <button type="button" onClick={handleZoomIn}>
          Zoom In
        </button>
        <button type="button" onClick={handleZoomOut}>
          Zoom Out
        </button>
      </div>
      <Stage
        width={process?.browser ? window.innerWidth : 1000}
        height={2000}
      >
        <FastLayer>
          {grid.map(({ key, x, y, points }) => (
            <Line
              key={key}
              stroke="lightgrey"
              strokeWidth={1}
              x={x}
              y={y}
              points={points}
            />
          ))}
        </FastLayer>
        <Layer>
          {components.map(({ component }) => (
            <React.Fragment>{component}</React.Fragment>
          ))}
        </Layer>
      </Stage>
    </div>
  )
}

function buildGrid() {
  const lines = []

  for (let column = 0; column <= 100; column += 1) {
    lines.push({
      key: `grid-line-vertical-${column}`,
      points: [0, 0, 0, 2000],
      x: 50 * column,
      y: 0,
    })
  }

  for (let row = 0; row <= 100; row += 1) {
    lines.push({
      key: `grid-line-horizontal-${row}`,
      points: [0, 0, 2000, 0],
      x: 0,
      y: 50 * row,
    })
  }

  return lines
}

export default Chart
