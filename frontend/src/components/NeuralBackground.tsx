"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function NeuralBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 10;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Particles — fewer, slower, more ambient
    const count = 50;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      velocities[i * 3] = (Math.random() - 0.5) * 0.004;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const pointsMat = new THREE.PointsMaterial({
      size: 0.035,
      color: 0x00c8d4,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
    });

    const pointsMesh = new THREE.Points(pointsGeo, pointsMat);
    scene.add(pointsMesh);

    // Lines — very subtle
    const linePositions = new Float32Array(count * count * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setDrawRange(0, 0);

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00c8d4,
      transparent: true,
      opacity: 0.05,
    });

    const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(linesMesh);

    const threshold = 4.0;
    let animationId: number;

    function animate() {
      if (disposed) return;
      animationId = requestAnimationFrame(animate);

      const posArr = pointsGeo.attributes.position.array as Float32Array;

      for (let i = 0; i < count; i++) {
        posArr[i * 3] += velocities[i * 3];
        posArr[i * 3 + 1] += velocities[i * 3 + 1];
        posArr[i * 3 + 2] += velocities[i * 3 + 2];

        if (Math.abs(posArr[i * 3]) > 12) velocities[i * 3] *= -1;
        if (Math.abs(posArr[i * 3 + 1]) > 7) velocities[i * 3 + 1] *= -1;
        if (Math.abs(posArr[i * 3 + 2]) > 5) velocities[i * 3 + 2] *= -1;
      }
      pointsGeo.attributes.position.needsUpdate = true;

      const lineArr = lineGeo.attributes.position.array as Float32Array;
      let idx = 0;

      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = posArr[i * 3] - posArr[j * 3];
          const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
          const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
          if (dx * dx + dy * dy + dz * dz < threshold * threshold) {
            lineArr[idx++] = posArr[i * 3];
            lineArr[idx++] = posArr[i * 3 + 1];
            lineArr[idx++] = posArr[i * 3 + 2];
            lineArr[idx++] = posArr[j * 3];
            lineArr[idx++] = posArr[j * 3 + 1];
            lineArr[idx++] = posArr[j * 3 + 2];
          }
        }
      }

      for (let k = idx; k < lineArr.length; k++) lineArr[k] = 0;
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.setDrawRange(0, Math.floor(idx / 3));

      renderer.render(scene, camera);
    }

    animate();

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
      if (renderer.domElement.parentElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: "fixed", inset: 0, zIndex: 0 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(5,5,12,0.3) 0%, rgba(5,5,12,0.55) 50%, rgba(5,5,12,1) 100%)",
        }}
      />
    </div>
  );
}
