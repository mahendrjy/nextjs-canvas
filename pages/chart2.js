import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import styles from '../styles/Chart.module.css'

// D3

function Chart() {
  const [showGrid, setShowGrid] = useState(false)
  const canvasRef = useRef(null)
  let [context, setContext] = useState()
  const [box, setBox] = useState({
    width: 50,
    height: 50,
    x: 0,
    y: 0,
    color: 'tomato',
  })

  useEffect(() => {
    if (process?.browser) {
      setBox((prev) => ({
        ...prev,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      }))
    }
  }, [])

  const drawGrid = (context) => {
    // Box width
    const boxWidth = window.innerWidth
    // Box height
    const boxHeight = window.innerHeight
    // Padding
    const p = 10

    for (let x = 0; x <= boxWidth; x += 40) {
      if (x === 0) {
        context.moveTo(0.5 + x + p, 0)
        context.lineTo(0.5 + x + p, boxHeight + p)
      } else {
        context.moveTo(0.5 + x, 0)
        context.lineTo(0.5 + x, boxHeight + p)
      }
    }

    for (let x = 0; x <= boxHeight; x += 40) {
      if (x === 0) {
        context.moveTo(0, 0.5 + x + p)
        context.lineTo(boxWidth + p, 0.5 + x + p)
      } else {
        context.moveTo(0, 0.5 + x + p)
        context.lineTo(boxWidth + p, 0.5 + x + p)
      }
    }
    context.strokeStyle = 'black'
    context.stroke()
  }

  useEffect(() => {
    if (process?.browser) {
      let canvas = canvasRef.current
      setContext(canvas.getContext('2d'))
      let context = context || canvas.getContext('2d')
      let width = canvas.width
      let height = canvas.height

      const zoomInElement = document.querySelector('#zoom_in')
      const zoomOutElement = document.querySelector('#zoom_out')
      const zoomReset = document.querySelector('#zoom_reset')

      function zoomed(transform) {
        context.save()
        context.clearRect(0, 0, width, height)

        context.translate(transform.x, transform.y)
        context.scale(transform.k, transform.k)
        context.beginPath()

        context.fillStyle = box.color
        context.fillRect(box.x, box.y, box.width, box.height)
        context.fill()
        context.restore()
        if (showGrid) {
          drawGrid(context)
        }
      }

      const zoomFunc = d3
        .zoom()
        .scaleExtent([1, 8])
        .on('zoom', ({ transform }) => zoomed(transform))

      zoomReset.addEventListener('click', () => {
        zoomed(d3.zoomIdentity)
      })

      zoomOutElement.addEventListener('click', () => {
        zoomFunc.scaleBy(d3.select(canvas), 1.2)
      })

      zoomInElement.addEventListener('click', () => {
        zoomFunc.scaleBy(d3.select(canvas), 0.9)
      })

      d3.select(canvas).call(zoomFunc)

      zoomed(d3.zoomIdentity)
      context.clearRect(0, 0, width, height)

      context.fillStyle = box.color
      context.fillRect(box.x, box.y, box.width, box.height)
    }
  })

  useEffect(() => {
    if (showGrid && context) {
      drawGrid(context)
    }
  }, [showGrid])

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.button}
          id="zoom_reset"
          onClick={() => setShowGrid(false)}
        >
          Reset
        </button>
        <button
          type="button"
          className={styles.button}
          id="zoom_in"
        >
          Zoom IN
        </button>
        <button
          type="button"
          className={styles.button}
          id="zoom_out"
        >
          Zoom Out
        </button>
        <button
          type="button"
          className={styles.button}
          onClick={() => setShowGrid(true)}
        >
          Show Grid
        </button>
      </div>
      {process && process.browser && (
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={process?.browser ? window?.innerWidth : 1000}
          height={process?.browser ? window?.innerHeight : 1000}
        />
      )}
    </div>
  )
}

export default Chart
