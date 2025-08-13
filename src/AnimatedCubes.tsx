import { useState, useRef, useEffect, useCallback, type CSSProperties } from "react";
import * as THREE from "three";

let scene: THREE.Scene, renderer: THREE.WebGLRenderer, camera: THREE.OrthographicCamera;

type AnimatedCubesProps = {
  backgroundColor?: string;
  edgeColor?: string;
  initialDuration?: number;
  maxEdgeLength?: number;
  minEdgeLength?: number;
  maxFallingSpeed?: number;
  minFallingSpeed?: number;
  maxRotationSpeed?: number;
  minRotationSpeed?: number;
  numberOfCubes?: number;
  style?: CSSProperties;
  children?: React.ReactNode;
};

const AnimatedCubes = (props: AnimatedCubesProps) => {
  const {
    backgroundColor = "#262626",
    edgeColor = "#59c0bb",
    initialDuration = 3000,
    maxEdgeLength = 500,
    minEdgeLength = 100,
    maxFallingSpeed = 10,
    minFallingSpeed = 5,
    maxRotationSpeed = 0.03,
    minRotationSpeed = 0.01,
    numberOfCubes = 5,
    style,
  } = props;
  const [currentCubes, setCurrentCubes] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  const animate = useCallback(
    (cube: THREE.LineSegments, speedY: number, rotationX: number, rotationY: number) => {
      if (containerRef.current) {
        cube.position.y += speedY;
        cube.rotation.x += rotationX;
        cube.rotation.y += rotationY;
        renderer.render(scene, camera);
        if (cube.position.y > containerRef.current.offsetHeight) {
          // Dispose geometry if present
          if ("geometry" in cube && cube.geometry && typeof cube.geometry.dispose === "function") {
            (cube.geometry as THREE.BufferGeometry).dispose();
          }
          // Dispose material(s) if present
          const material = (cube as THREE.LineSegments).material;
          if (material) {
            if (Array.isArray(material)) {
              material.forEach((mat: THREE.Material) => {
                if (mat && typeof mat.dispose === "function") mat.dispose();
              });
            } else if (typeof material.dispose === "function") {
              material.dispose();
            }
          }
          scene.remove(cube);
          setCurrentCubes((current) => current - 1);
        } else {
          requestAnimationFrame(() => animate(cube, speedY, rotationX, rotationY));
        }
      }
    },
    [containerRef],
  );

  useEffect(() => {
    if (containerRef.current && sceneRef.current) {
      scene = new THREE.Scene();
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setClearColor(backgroundColor, 1);
      camera = new THREE.OrthographicCamera();

      function updateWindowDimension() {
        if (!containerRef.current) return;
        const halfWidth = containerRef.current.offsetWidth * 0.5;
        const halfHeight = containerRef.current.offsetHeight * 0.5;
        renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
        camera.left = -halfWidth;
        camera.right = halfWidth;
        camera.top = -halfHeight;
        camera.bottom = halfHeight;
        camera.updateProjectionMatrix();
      }
      updateWindowDimension();
      window.addEventListener("resize", updateWindowDimension);
      sceneRef.current.innerHTML = "";
      sceneRef.current.appendChild(renderer.domElement);

      setTimeout(() => setIsRunning(true), initialDuration);

      return function removeWindowListener() {
        renderer.dispose();
        // Dispose all geometries and materials in the scene
        scene.traverse((object: THREE.Object3D) => {
          // Dispose geometry if present
          if ((object as THREE.Mesh).geometry) {
            (object as THREE.Mesh).geometry.dispose();
          }
          // Dispose material(s) if present
          const material = (object as THREE.Mesh).material;
          if (material) {
            if (Array.isArray(material)) {
              material.forEach((mat) => {
                if (mat && typeof mat.dispose === "function") mat.dispose();
              });
            } else if (typeof material.dispose === "function") {
              material.dispose();
            }
          }
        });
        // Remove all children from the scene
        while (scene.children.length > 0) {
          scene.remove(scene.children[0]);
        }
        window.removeEventListener("resize", updateWindowDimension);
      };
    }
  }, [backgroundColor, initialDuration]);

  useEffect(() => {
    if (camera) {
      camera.near = -maxEdgeLength;
      camera.far = maxEdgeLength;
      camera.updateProjectionMatrix();
    }
  }, [maxEdgeLength]);

  useEffect(() => {
    if (currentCubes < numberOfCubes && containerRef.current) {
      const halfWidth = containerRef.current.offsetWidth * 0.5;
      const halfHeight = containerRef.current.offsetHeight * 0.5;
      const edgeLength =
        maxEdgeLength > minEdgeLength ? Math.random() * (maxEdgeLength - minEdgeLength) + minEdgeLength : minEdgeLength;
      const speedY =
        maxFallingSpeed > minFallingSpeed
          ? Math.random() * (maxFallingSpeed - minFallingSpeed) + minFallingSpeed
          : minFallingSpeed;
      const rotationX =
        maxRotationSpeed > minRotationSpeed
          ? (Math.round(Math.random()) * 2 - 1) *
            (Math.random() * (maxRotationSpeed - minRotationSpeed) + minRotationSpeed)
          : (Math.round(Math.random()) * 2 - 1) * minRotationSpeed;
      const rotationY =
        maxRotationSpeed > minRotationSpeed
          ? (Math.round(Math.random()) * 2 - 1) *
            (Math.random() * (maxRotationSpeed - minRotationSpeed) + minRotationSpeed)
          : (Math.round(Math.random()) * 2 - 1) * minRotationSpeed;
      const geometry = new THREE.BoxGeometry(edgeLength, edgeLength, edgeLength);
      const edges = new THREE.EdgesGeometry(geometry);
      const cube = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: edgeColor }));
      cube.position.x = Math.random() * containerRef.current.offsetWidth - halfWidth;
      cube.position.y = -halfHeight - edgeLength;
      cube.rotation.x = Math.random();
      cube.rotation.y = Math.random();
      scene.add(cube);
      setCurrentCubes((current) => current + 1);
      if (!isRunning) {
        setTimeout(
          () => {
            animate(cube, speedY, rotationX, rotationY);
          },
          (initialDuration / numberOfCubes) * currentCubes,
        );
      } else {
        animate(cube, speedY, rotationX, rotationY);
      }
    }
  }, [
    edgeColor,
    maxEdgeLength,
    minEdgeLength,
    maxFallingSpeed,
    minFallingSpeed,
    maxRotationSpeed,
    minRotationSpeed,
    numberOfCubes,
    currentCubes,
    animate,
    initialDuration,
    isRunning,
  ]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", ...style }}>
      <div ref={sceneRef} style={{ position: "relative", zIndex: -1, height: 0 }}></div>
      {props.children}
    </div>
  );
};

export default AnimatedCubes;
