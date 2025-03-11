'use client';

import React, { useEffect, useRef } from 'react';

export const AnimatedTechBackground: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		canvas.width = window.innerWidth;
		canvas.height = 500;

		// Create points with motion and connection properties
		interface Point {
			x: number;
			y: number;
			vx: number;
			vy: number;
			active: boolean;
			activeTime: number;
			pulseFactor: number;
			type: 'node' | 'relay' | 'endpoint';
			connections: number[];
		}

		const points: Point[] = [];
		// Increased density factor to create more points
		const numPoints = Math.floor((canvas.width * canvas.height) / 15000); // Increased density from 20000 to 15000

		// Create randomly positioned points
		for (let i = 0; i < numPoints; i++) {
			// Assign node types with probability
			let type: 'node' | 'relay' | 'endpoint' = 'node';
			const typeRoll = Math.random();
			if (typeRoll > 0.92) type = 'endpoint';
			else if (typeRoll > 0.75) type = 'relay';

			points.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				vx: (Math.random() - 0.5) * 0.3, // Gentle random movement
				vy: (Math.random() - 0.5) * 0.3,
				active: Math.random() > 0.7,
				activeTime: Math.floor(Math.random() * 100),
				pulseFactor: Math.random() * 0.5,
				type,
				connections: [],
			});
		}

		// Establish initial connections between points
		// Increased maximum connections per point
		const maxConnections = 4; // Increased from 3 to 4
		// Increased connection distance to create more connections
		const connectionDistance = Math.min(canvas.width, canvas.height) * 0.25; // Increased from 0.2 to 0.25

		// Create connections based on proximity
		points.forEach((point, i) => {
			const potentialConnections = [];

			for (let j = 0; j < points.length; j++) {
				if (i !== j) {
					const dx = points[j].x - point.x;
					const dy = points[j].y - point.y;
					const distance = Math.sqrt(dx * dx + dy * dy);

					if (distance < connectionDistance) {
						potentialConnections.push({
							index: j,
							distance: distance,
						});
					}
				}
			}

			// Sort by distance and take closest ones
			potentialConnections.sort((a, b) => a.distance - b.distance);
			const numConnections = Math.min(
				Math.floor(Math.random() * (maxConnections + 1)),
				potentialConnections.length
			);

			for (let k = 0; k < numConnections; k++) {
				point.connections.push(potentialConnections[k].index);
			}
		});

		// Animation loop
		let animationId: number;
		let globalTime = 0;

		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			globalTime++;

			// Update point positions and states
			points.forEach((point, index) => {
				// Move points with gentle random motion
				point.x += point.vx;
				point.y += point.vy;

				// Occasional direction changes
				if (Math.random() > 0.99) {
					point.vx = (Math.random() - 0.5) * 0.3;
					point.vy = (Math.random() - 0.5) * 0.3;
				}

				// Keep points within canvas bounds
				if (point.x < 0 || point.x > canvas.width) {
					point.vx *= -1;
					point.x = Math.max(0, Math.min(canvas.width, point.x));
				}
				if (point.y < 0 || point.y > canvas.height) {
					point.vy *= -1;
					point.y = Math.max(0, Math.min(canvas.height, point.y));
				}

				// Update active state with random pulses
				if (Math.random() > 0.995) {
					point.active = !point.active;
				}

				// Update pulse factor
				if (point.active) {
					point.activeTime++;
					point.pulseFactor = Math.min(0.7, point.pulseFactor + 0.02);
				} else {
					point.pulseFactor = Math.max(0, point.pulseFactor - 0.01);
				}

				// Occasionally update connections based on new proximities
				if (globalTime % 200 === index % 200) {
					point.connections = [];
					const potentialConnections = [];

					for (let j = 0; j < points.length; j++) {
						if (index !== j) {
							const dx = points[j].x - point.x;
							const dy = points[j].y - point.y;
							const distance = Math.sqrt(dx * dx + dy * dy);

							if (distance < connectionDistance) {
								potentialConnections.push({
									index: j,
									distance: distance,
								});
							}
						}
					}

					potentialConnections.sort(
						(a, b) => a.distance - b.distance
					);
					const numConnections = Math.min(
						Math.floor(Math.random() * (maxConnections + 1)),
						potentialConnections.length
					);

					for (let k = 0; k < numConnections; k++) {
						point.connections.push(potentialConnections[k].index);
					}
				}
			});

			// Draw connections first (rays of light)
			points.forEach((point, index) => {
				if (point.pulseFactor > 0.1) {
					point.connections.forEach((connectionIndex) => {
						const connectedPoint = points[connectionIndex];

						// Only draw connection if both points are somewhat active
						if (connectedPoint.pulseFactor > 0.1) {
							const gradient = ctx.createLinearGradient(
								point.x,
								point.y,
								connectedPoint.x,
								connectedPoint.y
							);

							const startOpacity = Math.min(
								0.4,
								point.pulseFactor * 0.6
							);
							const endOpacity = Math.min(
								0.4,
								connectedPoint.pulseFactor * 0.6
							);

							gradient.addColorStop(
								0,
								`rgba(30, 180, 230, ${startOpacity})`
							);
							gradient.addColorStop(
								0.5,
								`rgba(40, 190, 240, ${
									(startOpacity + endOpacity) / 4
								})`
							);
							gradient.addColorStop(
								1,
								`rgba(30, 180, 230, ${endOpacity})`
							);

							ctx.beginPath();
							ctx.strokeStyle = gradient;
							ctx.lineWidth =
								0.5 *
								((point.pulseFactor +
									connectedPoint.pulseFactor) /
									2);
							ctx.moveTo(point.x, point.y);
							ctx.lineTo(connectedPoint.x, connectedPoint.y);
							ctx.stroke();

							// Add data transfer effect along the line
							if (Math.random() > 0.95) {
								const progress = (globalTime % 100) / 100;
								const dataX =
									point.x +
									(connectedPoint.x - point.x) * progress;
								const dataY =
									point.y +
									(connectedPoint.y - point.y) * progress;

								ctx.beginPath();
								ctx.fillStyle = `rgba(100, 220, 255, ${
									(startOpacity + endOpacity) * 0.8
								})`;
								ctx.arc(dataX, dataY, 1, 0, Math.PI * 2);
								ctx.fill();
							}
						}
					});
				}
			});

			// Draw the points
			points.forEach((point) => {
				if (point.pulseFactor > 0) {
					const intensity = point.pulseFactor;

					// Size based on node type
					let size = 0;
					if (point.type === 'endpoint') size = 0.8 + intensity * 1.2;
					else if (point.type === 'relay')
						size = 0.7 + intensity * 0.9;
					else size = 0.5 + intensity * 0.8;

					// Draw main node
					let nodeColor = '';
					if (point.type === 'endpoint') {
						nodeColor = `rgba(20, 200, 255, ${
							0.2 + 0.5 * intensity
						})`;
					} else if (point.type === 'relay') {
						nodeColor = `rgba(10, 180, 240, ${
							0.15 + 0.45 * intensity
						})`;
					} else {
						nodeColor = `rgba(0, 160, 230, ${
							0.1 + 0.4 * intensity
						})`;
					}

					ctx.beginPath();
					ctx.fillStyle = nodeColor;
					ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
					ctx.fill();

					// Glow effect
					if (intensity > 0.2) {
						const glowSize = 2 + intensity * 2;
						ctx.shadowBlur = glowSize;
						ctx.shadowColor = `rgba(30, 200, 255, ${
							0.2 * intensity
						})`;
						ctx.beginPath();
						ctx.arc(point.x, point.y, size * 0.7, 0, Math.PI * 2);
						ctx.fill();
						ctx.shadowBlur = 0;
					}
				}
			});

			animationId = requestAnimationFrame(animate);
		};

		animationId = requestAnimationFrame(animate);

		// Handle resize
		const handleResize = () => {
			canvas.width = window.innerWidth;
			canvas.height = 500;
		};

		window.addEventListener('resize', handleResize);

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<div className='absolute inset-0 overflow-hidden'>
			<canvas ref={canvasRef} className='w-full h-full' />
			<div className='absolute inset-0 bg-gradient-to-b from-background/0 via-background/5 to-background/90 z-10' />
		</div>
	);
};

export default AnimatedTechBackground;
