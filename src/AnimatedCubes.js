/**
 * @flow
 */
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'

let scene, renderer, camera

const AnimatedCubes = (props: Object) => {
  const {
    backgroundColor = '#262626', edgeColor = '#59c0bb',
    initialDuration = 3000, maxEdgeLength = 500,
    minEdgeLength = 100, maxFallingSpeed = 10, minFallingSpeed = 5,
    maxRotationSpeed = 0.03, minRotationSpeed = 0.01, numberOfCubes = 5, style
  } = props
  const [currentCubes, setCurrentCubes] = React.useState(0)
  const [isRunning, setIsRunning] = React.useState(false)
  const containerRef: ?Object = React.useRef(null)
  const sceneRef: ?Object = React.useRef(null)

  React.useEffect(() => {
    if ( containerRef && containerRef.current && sceneRef && sceneRef.current ) {
      scene = new THREE.Scene()
      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setClearColor(backgroundColor, 1)
      camera = new THREE.OrthographicCamera()

      function updateWindowDimension() {
        const halfWidth = containerRef.current.offsetWidth * 0.5
        const halfHeight = containerRef.current.offsetHeight * 0.5
        renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight)
        camera.left = -halfWidth
        camera.right = halfWidth
        camera.top = -halfHeight
        camera.bottom = halfHeight
        camera.updateProjectionMatrix()
      }
      updateWindowDimension()
      window.addEventListener('resize', updateWindowDimension)

      sceneRef.current.appendChild(renderer.domElement)

      setTimeout(() => setIsRunning(true), initialDuration)

      return function removeWindowListener() {
        renderer.dispose()
        scene.dispose()
        window.removeEventListener('resize', updateWindowDimension)
      }
    }
  }, [])

  React.useEffect(() => {
    camera.near = -maxEdgeLength
    camera.far = maxEdgeLength
    camera.updateProjectionMatrix()
  }, [maxEdgeLength])

  React.useEffect(() => {
    if ( currentCubes < numberOfCubes && containerRef && containerRef.current ) {
      const halfWidth = containerRef.current.offsetWidth * 0.5
      const halfHeight = containerRef.current.offsetHeight * 0.5
      const edgeLength = maxEdgeLength > minEdgeLength ? Math.random() * (maxEdgeLength - minEdgeLength) + minEdgeLength : minEdgeLength
      const speedY = maxFallingSpeed > minFallingSpeed ? Math.random() * (maxFallingSpeed - minFallingSpeed) + minFallingSpeed : minFallingSpeed
      const rotationX = maxRotationSpeed > minRotationSpeed ? (Math.round(Math.random()) * 2 - 1) * (Math.random() * (maxRotationSpeed - minRotationSpeed) + minRotationSpeed) : (Math.round(Math.random()) * 2 - 1) * minRotationSpeed
      const rotationY = maxRotationSpeed > minRotationSpeed ? (Math.round(Math.random()) * 2 - 1) * (Math.random() * (maxRotationSpeed - minRotationSpeed) + minRotationSpeed) : (Math.round(Math.random()) * 2 - 1) * minRotationSpeed
      const geometry = new THREE.BoxBufferGeometry(edgeLength, edgeLength, edgeLength)
      let cube
      const edges = new THREE.EdgesGeometry(geometry)
      cube = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: edgeColor }))
      cube.position.x = Math.random() * containerRef.current.offsetWidth - halfWidth
      cube.position.y = -halfHeight - edgeLength
      cube.rotation.x = Math.random()
      cube.rotation.y = Math.random()
      scene.add(cube)
      setCurrentCubes((current) => current + 1)
      if ( ! isRunning ) {
        setTimeout(() => {
          animate(cube, speedY, rotationX, rotationY)
        }, initialDuration / numberOfCubes * currentCubes)
      } else {
        animate(cube, speedY, rotationX, rotationY)
      }
    }
  }, [
    edgeColor, maxEdgeLength, minEdgeLength, maxFallingSpeed,
    minFallingSpeed, maxRotationSpeed, minRotationSpeed, numberOfCubes, currentCubes
  ])

  function animate(cube, speedY, rotationX, rotationY) {
    if ( containerRef && containerRef.current ) {
      cube.position.y += speedY
      cube.rotation.x += rotationX
      cube.rotation.y += rotationY
      renderer.render(scene, camera)
      if ( cube.position.y > containerRef.current.offsetHeight ) {
        cube.geometry.dispose()
        cube.material && cube.material.dispose()
        scene.remove(cube)
        setCurrentCubes((current) => current - 1)
      } else {
        requestAnimationFrame(() => animate(cube, speedY, rotationX, rotationY))
      }
    }
  }

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', ...style }}>
      <div
        ref={sceneRef}
        style={{ position: 'relative', zIndex: -1, height: 0 }}
      ></div>
      { props.children }
    </div>
  )
}

export default AnimatedCubes

AnimatedCubes.propTypes = {
  backgroundColor: PropTypes.string,
  edgeColor: PropTypes.string,
  maxEdgeLength: PropTypes.number,
  minEdgeLength: PropTypes.number,
  maxFallingSpeed: PropTypes.number,
  minFallingSpeed: PropTypes.number,
  maxRotationSpeed: PropTypes.number,
  minRotationSpeed: PropTypes.number,
  numberOfCubes: PropTypes.number,
  style: PropTypes.object
}
