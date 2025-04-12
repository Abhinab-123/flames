import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeDSceneProps {
  objectType: string;
  intensity?: number;
}

const ThreeDScene = ({ objectType, intensity = 100 }: ThreeDSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectsRef = useRef<THREE.Object3D[]>([]);
  
  // Initialize the 3D scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clean up previous scene if it exists
    if (rendererRef.current) {
      containerRef.current.removeChild(rendererRef.current.domElement);
      
      // Dispose of all scene objects
      if (sceneRef.current) {
        sceneRef.current.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            } else if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            }
          }
        });
      }
    }
    
    // Setup new scene, camera, and renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Create objects based on the FLAMES result
    createObjects(objectType, intensity);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate objects
      objectsRef.current.forEach((obj) => {
        obj.rotation.x += 0.005;
        obj.rotation.y += 0.01;
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [objectType, intensity]);
  
  // Create 3D objects based on the FLAMES result
  const createObjects = (type: string, intensity: number) => {
    if (!sceneRef.current) return;
    
    // Clear existing objects
    objectsRef.current.forEach((obj) => sceneRef.current?.remove(obj));
    objectsRef.current = [];
    
    const numberOfObjects = Math.min(Math.max(Math.floor(intensity / 10), 1), 10);
    
    let objects: THREE.Object3D[] = [];
    
    switch (type) {
      case 'hearts':
        objects = createHearts(numberOfObjects);
        break;
      case 'stars':
        objects = createStars(numberOfObjects);
        break;
      case 'rings':
        objects = createRings(numberOfObjects);
        break;
      case 'flower':
        objects = createFlowers(numberOfObjects);
        break;
      case 'handshake':
        objects = createHandshake(numberOfObjects);
        break;
      case 'highfive':
        objects = createHighFive(numberOfObjects);
        break;
      default:
        objects = createStars(numberOfObjects);
    }
    
    objects.forEach((obj) => {
      sceneRef.current?.add(obj);
      objectsRef.current.push(obj);
    });
  };
  
  // Helper functions to create different 3D objects
  const createHearts = (count: number) => {
    const hearts: THREE.Object3D[] = [];
    const heartShape = new THREE.Shape();
    
    // Draw a heart shape
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, -0.5, -1, -1.5, -2, -0.5);
    heartShape.bezierCurveTo(-3, 0.5, -2, 2, 0, 3);
    heartShape.bezierCurveTo(2, 2, 3, 0.5, 2, -0.5);
    heartShape.bezierCurveTo(1, -1.5, 0, -0.5, 0, 0);
    
    const extrudeSettings = {
      depth: 0.2,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 0.1,
      bevelThickness: 0.1
    };
    
    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    
    for (let i = 0; i < count; i++) {
      const material = new THREE.MeshStandardMaterial({
        color: 0xFF4081,
        roughness: 0.3,
        metalness: 0.2
      });
      
      const heart = new THREE.Mesh(heartGeometry, material);
      heart.scale.set(0.3, 0.3, 0.3);
      heart.position.set(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 2
      );
      hearts.push(heart);
    }
    
    return hearts;
  };
  
  const createStars = (count: number) => {
    const stars: THREE.Object3D[] = [];
    
    const starGeometry = new THREE.BufferGeometry();
    const starPoints = [];
    
    // Create star shape
    for (let i = 0; i < 5; i++) {
      const outerAngle = (i * 2 * Math.PI) / 5;
      const innerAngle = outerAngle + Math.PI / 5;
      
      // Outer point
      starPoints.push(
        new THREE.Vector3(Math.cos(outerAngle), Math.sin(outerAngle), 0)
      );
      
      // Inner point
      starPoints.push(
        new THREE.Vector3(0.4 * Math.cos(innerAngle), 0.4 * Math.sin(innerAngle), 0)
      );
    }
    
    // Close the star
    starPoints.push(starPoints[0].clone());
    
    const starShape = new THREE.Shape();
    starShape.moveTo(starPoints[0].x, starPoints[0].y);
    for (let i = 1; i < starPoints.length; i++) {
      starShape.lineTo(starPoints[i].x, starPoints[i].y);
    }
    
    const extrudeSettings = {
      depth: 0.2,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 0.1,
      bevelThickness: 0.1
    };
    
    const starGeom = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
    
    for (let i = 0; i < count; i++) {
      const material = new THREE.MeshStandardMaterial({
        color: 0xFF9800,
        roughness: 0.3,
        metalness: 0.2
      });
      
      const star = new THREE.Mesh(starGeom, material);
      star.scale.set(0.4, 0.4, 0.4);
      star.position.set(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 2
      );
      stars.push(star);
    }
    
    return stars;
  };
  
  const createRings = (count: number) => {
    const rings: THREE.Object3D[] = [];
    
    for (let i = 0; i < count; i++) {
      const geometry = new THREE.TorusGeometry(0.7, 0.15, 16, 40);
      const material = new THREE.MeshStandardMaterial({
        color: 0xEC407A,
        roughness: 0.1,
        metalness: 0.8
      });
      
      const ring = new THREE.Mesh(geometry, material);
      ring.position.set(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 2
      );
      rings.push(ring);
    }
    
    return rings;
  };
  
  const createFlowers = (count: number) => {
    const flowers: THREE.Object3D[] = [];
    
    for (let i = 0; i < count; i++) {
      const flower = new THREE.Group();
      
      // Create center of flower
      const centerGeometry = new THREE.SphereGeometry(0.3, 32, 32);
      const centerMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFEB3B, 
        roughness: 0.5
      });
      const center = new THREE.Mesh(centerGeometry, centerMaterial);
      flower.add(center);
      
      // Create petals
      const petalCount = 5;
      for (let j = 0; j < petalCount; j++) {
        const petalGeometry = new THREE.SphereGeometry(0.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const petalMaterial = new THREE.MeshStandardMaterial({
          color: 0xAB47BC,
          roughness: 0.5
        });
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        petal.scale.set(1, 1, 2);
        petal.position.set(0.5 * Math.cos(j * 2 * Math.PI / petalCount), 0.5 * Math.sin(j * 2 * Math.PI / petalCount), 0);
        petal.lookAt(petal.position.clone().multiplyScalar(2));
        flower.add(petal);
      }
      
      flower.position.set(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 2
      );
      flowers.push(flower);
    }
    
    return flowers;
  };
  
  const createHandshake = (count: number) => {
    // Simplified representation of handshake
    const handshakes: THREE.Object3D[] = [];
    
    for (let i = 0; i < count; i++) {
      const handshake = new THREE.Group();
      
      // First hand
      const hand1 = new THREE.BoxGeometry(0.8, 0.3, 0.2);
      const handMaterial1 = new THREE.MeshStandardMaterial({
        color: 0x64B5F6,
        roughness: 0.5
      });
      const handMesh1 = new THREE.Mesh(hand1, handMaterial1);
      handMesh1.position.set(-0.4, 0, 0);
      handshake.add(handMesh1);
      
      // Second hand
      const hand2 = new THREE.BoxGeometry(0.8, 0.3, 0.2);
      const handMaterial2 = new THREE.MeshStandardMaterial({
        color: 0x81C784,
        roughness: 0.5
      });
      const handMesh2 = new THREE.Mesh(hand2, handMaterial2);
      handMesh2.position.set(0.4, 0, 0);
      handshake.add(handMesh2);
      
      // Connection point
      const connectionGeometry = new THREE.SphereGeometry(0.2, 16, 16);
      const connectionMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        roughness: 0.5
      });
      const connection = new THREE.Mesh(connectionGeometry, connectionMaterial);
      handshake.add(connection);
      
      handshake.position.set(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 2
      );
      handshakes.push(handshake);
    }
    
    return handshakes;
  };
  
  const createHighFive = (count: number) => {
    // Simplified representation of high five
    const highFives: THREE.Object3D[] = [];
    
    for (let i = 0; i < count; i++) {
      const highFive = new THREE.Group();
      
      // First hand
      const hand1 = new THREE.BoxGeometry(0.3, 0.8, 0.2);
      const handMaterial1 = new THREE.MeshStandardMaterial({
        color: 0x66BB6A,
        roughness: 0.5
      });
      const handMesh1 = new THREE.Mesh(hand1, handMaterial1);
      handMesh1.position.set(-0.3, 0.4, 0);
      handMesh1.rotation.z = Math.PI / 4;
      highFive.add(handMesh1);
      
      // Second hand
      const hand2 = new THREE.BoxGeometry(0.3, 0.8, 0.2);
      const handMaterial2 = new THREE.MeshStandardMaterial({
        color: 0x4DB6AC,
        roughness: 0.5
      });
      const handMesh2 = new THREE.Mesh(hand2, handMaterial2);
      handMesh2.position.set(0.3, 0.4, 0);
      handMesh2.rotation.z = -Math.PI / 4;
      highFive.add(handMesh2);
      
      // Sparkle effect
      const sparkleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
      const sparkleMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFD54F,
        roughness: 0.2,
        metalness: 0.8,
        emissive: 0xFFD54F,
        emissiveIntensity: 0.5
      });
      
      for (let j = 0; j < 5; j++) {
        const sparkle = new THREE.Mesh(sparkleGeometry, sparkleMaterial);
        sparkle.position.set(
          (Math.random() - 0.5) * 0.8,
          0.8 + Math.random() * 0.4,
          (Math.random() - 0.5) * 0.3
        );
        highFive.add(sparkle);
      }
      
      highFive.position.set(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 2
      );
      highFives.push(highFive);
    }
    
    return highFives;
  };
  
  return (
    <div ref={containerRef} className="scene-container bg-black/5 rounded-xl"></div>
  );
};

export default ThreeDScene;