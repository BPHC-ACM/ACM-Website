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

		const numPoints = Math.floor((canvas.width * canvas.height) / 12000);

		for (let i = 0; i < numPoints; i++) {
			let type: 'node' | 'relay' | 'endpoint' = 'node';
			const typeRoll = Math.random();
			if (typeRoll > 0.92) type = 'endpoint';
			else if (typeRoll > 0.75) type = 'relay';

			points.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				vx: (Math.random() - 0.5) * 0.3,
				vy: (Math.random() - 0.5) * 0.3,
				active: Math.random() > 0.6,
				activeTime: Math.floor(Math.random() * 100),
				pulseFactor: Math.random() * 0.7,
				type,
				connections: [],
			});
		}

		const maxConnections = 5;
		const connectionDistance = Math.min(canvas.width, canvas.height) * 0.28;

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

			potentialConnections.sort((a, b) => a.distance - b.distance);
			const numConnections = Math.min(
				Math.floor(Math.random() * (maxConnections + 1)),
				potentialConnections.length
			);

			for (let k = 0; k < numConnections; k++) {
				point.connections.push(potentialConnections[k].index);
			}
		});

		let animationId: number;
		let globalTime = 0;

		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			globalTime++;

			points.forEach((point, index) => {
				point.x += point.vx;
				point.y += point.vy;

				if (Math.random() > 0.99) {
					point.vx = (Math.random() - 0.5) * 0.3;
					point.vy = (Math.random() - 0.5) * 0.3;
				}

				if (point.x < 0 || point.x > canvas.width) {
					point.vx *= -1;
					point.x = Math.max(0, Math.min(canvas.width, point.x));
				}
				if (point.y < 0 || point.y > canvas.height) {
					point.vy *= -1;
					point.y = Math.max(0, Math.min(canvas.height, point.y));
				}

				if (Math.random() > 0.99) {
					point.active = !point.active;
				}

				if (point.active) {
					point.activeTime++;
					point.pulseFactor = Math.min(0.9, point.pulseFactor + 0.03);
				} else {
					point.pulseFactor = Math.max(0.2, point.pulseFactor - 0.01);
				}

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

			points.forEach((point, index) => {
				if (point.pulseFactor > 0.1) {
					point.connections.forEach((connectionIndex) => {
						const connectedPoint = points[connectionIndex];

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
								`rgba(60, 200, 255, ${startOpacity})`
							);
							gradient.addColorStop(
								0.5,
								`rgba(80, 220, 255, ${
									(startOpacity + endOpacity) / 3
								})`
							);
							gradient.addColorStop(
								1,
								`rgba(60, 200, 255, ${endOpacity})`
							);

							ctx.beginPath();
							ctx.strokeStyle = gradient;

							ctx.lineWidth =
								1 *
								((point.pulseFactor +
									connectedPoint.pulseFactor) /
									2);
							ctx.moveTo(point.x, point.y);
							ctx.lineTo(connectedPoint.x, connectedPoint.y);
							ctx.stroke();

							if (Math.random() > 0.995) {
								const progress = (globalTime % 100) / 100;
								const dataX =
									point.x +
									(connectedPoint.x - point.x) * progress;
								const dataY =
									point.y +
									(connectedPoint.y - point.y) * progress;

								ctx.beginPath();

								ctx.fillStyle = `rgba(150, 240, 255, ${
									(startOpacity + endOpacity) * 0.9
								})`;

								ctx.arc(dataX, dataY, 1.5, 0, Math.PI * 2);
								ctx.fill();
							}
						}
					});
				}
			});

			points.forEach((point) => {
				if (point.pulseFactor > 0) {
					const intensity = point.pulseFactor;

					let size = 0;
					if (point.type === 'endpoint') size = 0.8 + intensity * 1.2;
					else if (point.type === 'relay')
						size = 0.7 + intensity * 0.9;
					else size = 0.5 + intensity * 0.8;

					let nodeColor = '';
					if (point.type === 'endpoint') {
						nodeColor = `rgba(50, 230, 255, ${
							0.3 + 0.7 * intensity
						})`;
					} else if (point.type === 'relay') {
						nodeColor = `rgba(40, 210, 250, ${
							0.25 + 0.65 * intensity
						})`;
					} else {
						nodeColor = `rgba(30, 190, 245, ${
							0.2 + 0.6 * intensity
						})`;
					}

					ctx.beginPath();
					ctx.fillStyle = nodeColor;
					ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
					ctx.fill();

					if (intensity > 0.1) {
						const glowSize = 3 + intensity * 3;
						ctx.shadowBlur = glowSize;
						ctx.shadowColor = `rgba(80, 220, 255, ${
							0.3 * intensity
						})`;
						ctx.beginPath();
						ctx.arc(point.x, point.y, size * 0.8, 0, Math.PI * 2);
						ctx.fill();
						ctx.shadowBlur = 0;
					}
				}
			});

			animationId = requestAnimationFrame(animate);
		};

		animationId = requestAnimationFrame(animate);

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
			<div className='absolute inset-0 bg-gradient-to-b from-background/0 via-background/5 to-background/70' />
		</div>
	);
};

export default AnimatedTechBackground;
