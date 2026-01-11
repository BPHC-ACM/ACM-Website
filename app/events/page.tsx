'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnimatedTechBackground from '@/components/animated-tech-background';
import ReactMarkdown from 'react-markdown';

interface Event {
	id: string;
	title: string;
	date: string;
	location: string;
	description: string;
	speaker: string;
	image: string;
	registration_link: string;
	details: string;
}

export default function EventsPage() {
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

	useEffect(() => {
		async function fetchEvents() {
			try {
				const response = await fetch('/api/events');
				if (!response.ok) {
					throw new Error('Failed to fetch events');
				}
				const data = await response.json();
				setEvents(data);
			} catch (err) {
				setError('Failed to load events. Please try again later.');
				console.error(err);
			} finally {
				setLoading(false);
			}
		}

		fetchEvents();
	}, []);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setSelectedEvent(null);
			}
		};
		
		if (selectedEvent) {
			document.body.style.overflow = 'hidden';
			window.addEventListener('keydown', handleEscape);
		} else {
			document.body.style.overflow = 'unset';
		}
		
		return () => {
			document.body.style.overflow = 'unset';
			window.removeEventListener('keydown', handleEscape);
		};
	}, [selectedEvent]);

	const now = new Date();

	const upcomingEvents = events
		.filter((event) => new Date(event.date) > now)
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	const pastEvents = events
		.filter((event) => new Date(event.date) <= now)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	const defaultTab = upcomingEvents.length > 0 ? 'upcoming' : 'past';

	return (
		<div className='flex flex-col'>
			<section className='bg-card py-16 md:py-24'>
				<AnimatedTechBackground />
				<div className='container'>
					<div className='mx-auto max-w-3xl text-center'>
						<h1 className='mb-6 text-4xl font-bold tracking-tight md:text-5xl animate-slide-up'>
							<span className='heading-gradient'>
								Events & Workshops
							</span>
						</h1>
						<p
							className='mb-0 text-lg text-muted-foreground md:text-xl animate-slide-up'
							style={{ animationDelay: '0.2s' }}
						>
							Discover our upcoming events, workshops, and past activities.
						</p>
					</div>
				</div>
			</section>

			<section className='section-padding z-10'>
				<div className='container'>
					{loading ? (
						<div className='flex justify-center py-10'>
							<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
						</div>
					) : error ? (
						<div className='rounded-lg border border-destructive p-6 text-center'>
							<p className='text-destructive'>{error}</p>
							<Button
								variant='outline'
								className='mt-4'
								onClick={() => window.location.reload()}
							>
								Try Again
							</Button>
						</div>
					) : (
						<Tabs defaultValue={defaultTab} className='w-full'>
							<TabsList className='mb-8 grid w-full grid-cols-2 blue-border animate-fade-in'>
								<TabsTrigger value='upcoming' className='transition-all hover:text-primary'>
									Upcoming Events
								</TabsTrigger>
								<TabsTrigger value='past' className='transition-all hover:text-primary'>
									Past Events
								</TabsTrigger>
							</TabsList>
							<TabsContent value='upcoming' className='animate-fade-in'>
								{upcomingEvents.length > 0 ? (
									<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-animation'>
										{upcomingEvents.map((event) => (
											<EventCard
												key={event.id}
												event={event}
												onViewDetails={setSelectedEvent}
											/>
										))}
									</div>
								) : (
									<div className='rounded-lg border border-dashed p-10 text-center animate-fade-in'>
										<h3 className='mb-2 text-xl font-semibold'>
											No Upcoming Events
										</h3>
										<p className='mb-6 text-muted-foreground'>
											We're currently planning new events. Check back soon!
										</p>
									</div>
								)}
							</TabsContent>
							<TabsContent value='past' className='animate-fade-in'>
								{pastEvents.length > 0 ? (
									<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-animation'>
										{pastEvents.map((event) => (
											<EventCard
												key={event.id}
												event={event}
												isPast
												onViewDetails={setSelectedEvent}
											/>
										))}
									</div>
								) : (
									<div className='rounded-lg border border-dashed p-10 text-center animate-fade-in'>
										<h3 className='mb-2 text-xl font-semibold'>
											No Past Events
										</h3>
										<p className='text-muted-foreground'>
											Our event history will appear here once events are completed.
										</p>
									</div>
								)}
							</TabsContent>
						</Tabs>
					)}
				</div>
			</section>

			<section className='section-padding bg-muted z-10'>
				<div className='container'>
					<div className='mx-auto max-w-3xl text-center'>
						<h2 className='heading-gradient mb-6 text-3xl font-bold md:text-4xl animate-slide-up'>
							Want to Collaborate?
						</h2>
						<p
							className='mb-8 text-muted-foreground animate-slide-up'
							style={{ animationDelay: '0.1s' }}
						>
							If you're interested in hosting an event with us or have ideas for workshops, we'd love to hear from you.
						</p>
						<Button
							asChild
							size='lg'
							className='hover-lift hover-glow animate-slide-up'
							style={{ animationDelay: '0.2s' }}
						>
							<Link href='mailto:acm@hyderabad.bits-pilani.ac.in'>
								Get in Touch
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{selectedEvent && (
				<EventModal
					event={selectedEvent}
					onClose={() => setSelectedEvent(null)}
				/>
			)}
		</div>
	);
}

interface EventCardProps {
	event: Event;
	isPast?: boolean;
	onViewDetails: (event: Event) => void;
}

function EventCard({ event, isPast = false, onViewDetails }: EventCardProps) {
	return (
		<Card 
			className='overflow-hidden transition-all hover:shadow-lg hover-lift animate-fade-in cursor-pointer'
			onClick={() => onViewDetails(event)}
		>
			<div className='aspect-video relative'>
				<Image
					src={event.image || '/placeholder.svg?height=200&width=400'}
					alt={event.title}
					fill
					className='object-cover'
				/>
			</div>
			<CardContent className='p-6'>
				<div className='mb-4 flex flex-wrap gap-2'>
					<div className='flex items-center text-sm text-muted-foreground'>
						<Calendar className='mr-1 h-4 w-4 text-primary' />
						{new Date(event.date).toLocaleDateString('en-US', {
							day: 'numeric',
							month: 'short',
							year: 'numeric',
						})}
					</div>
					<div className='flex items-center text-sm text-muted-foreground'>
						<MapPin className='mr-1 h-4 w-4 text-primary' />
						{event.location}
					</div>
				</div>
				<h3 className='mb-2 text-xl font-bold'>{event.title}</h3>
				<p className='mb-4 line-clamp-2 text-muted-foreground'>
					{event.description}
				</p>
				<Button
					variant={isPast ? 'outline' : 'default'}
					className='hover-lift pointer-events-none'
				>
					{isPast ? 'View Report' : 'View Details'}
				</Button>
			</CardContent>
		</Card>
	);
}

interface EventModalProps {
	event: Event;
	onClose: () => void;
}

function EventModal({ event, onClose }: EventModalProps) {
	const isPast = new Date(event.date) <= new Date();
	
	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in'
			onClick={onClose}
		>
			<div
				className='relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-card rounded-lg shadow-2xl animate-slide-up'
				onClick={(e) => e.stopPropagation()}
			>
				<button
					onClick={onClose}
					className='absolute top-4 right-4 z-10 rounded-full bg-background/80 p-2 hover:bg-background transition-colors'
					aria-label='Close modal'
				>
					<X className='h-5 w-5' />
				</button>

				<div className='relative aspect-video w-full'>
					<Image
						src={event.image || '/placeholder.svg?height=400&width=800'}
						alt={event.title}
						fill
						className='object-cover rounded-t-lg'
					/>
				</div>

				<div className='p-8'>
					<h2 className='text-3xl font-bold mb-4 heading-gradient'>
						{event.title}
					</h2>

					<div className='flex flex-wrap gap-4 mb-6 text-muted-foreground'>
						<div className='flex items-center'>
							<Calendar className='mr-2 h-5 w-5 text-primary' />
							<span>
								{new Date(event.date).toLocaleDateString('en-US', {
									weekday: 'long',
									day: 'numeric',
									month: 'long',
									year: 'numeric',
								})}
							</span>
						</div>
						<div className='flex items-center'>
							<MapPin className='mr-2 h-5 w-5 text-primary' />
							<span>{event.location}</span>
						</div>
					</div>

					{event.speaker && (
						<div className='mb-6'>
							<h3 className='text-lg font-semibold mb-2'>Speaker</h3>
							<p className='text-muted-foreground'>{event.speaker}</p>
						</div>
					)}

					<div className='mb-6'>
						<h3 className='text-lg font-semibold mb-2'>
							{isPast ? 'Event Report' : 'Description'}
						</h3>
						{event.details ? (
							<div className='prose prose-sm max-w-none dark:prose-invert text-muted-foreground'>
								<ReactMarkdown>{event.details}</ReactMarkdown>
							</div>
						) : (
							<p className='text-muted-foreground leading-relaxed whitespace-pre-wrap'>
								{event.description}
							</p>
						)}
					</div>

					<div className='flex gap-4'>
						<Button onClick={onClose} variant='outline'>
							Close
						</Button>
						{!isPast && event.registration_link && (
							<Button asChild className='hover-lift'>
								<a
									href={event.registration_link}
									target='_blank'
									rel='noopener noreferrer'
								>
									Register Now
								</a>
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
