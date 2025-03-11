import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import AnimatedTechBackground from '@/components/animated-tech-background';

export const revalidate = 3600; // Revalidate every hour

async function getEvents() {
	const supabase = createServerSupabaseClient();
	const { data } = await supabase
		.from('events')
		.select('*')
		.order('date', { ascending: true });

	return data || [];
}

export default async function EventsPage() {
	const events = await getEvents();

	// Get current date
	const now = new Date();

	// Get upcoming events (future dates)
	const upcomingEvents = events
		.filter((event) => new Date(event.date) > now)
		.sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
		);

	// Get past events (past dates)
	const pastEvents = events
		.filter((event) => new Date(event.date) <= now)
		.sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		);

	return (
		<div className='flex flex-col'>
			{/* Hero Section */}
			<section className='bg-card py-16 md:py-24'>
				<AnimatedTechBackground />
				<div className='container'>
					<div className='mx-auto max-w-3xl text-center'>
						<h1 className='mb-6 text-4xl font-bold tracking-tight md:text-5xl animate-slide-up'>
							<span className='heading-gradient animate-glow'>
								Events & Workshops
							</span>
						</h1>
						<p
							className='mb-0 text-lg text-muted-foreground md:text-xl animate-slide-up'
							style={{ animationDelay: '0.2s' }}
						>
							Discover our upcoming events, workshops, and past
							activities.
						</p>
					</div>
				</div>
			</section>

			{/* Events Tabs Section */}
			<section className='section-padding'>
				<div className='container'>
					<Tabs defaultValue='upcoming' className='w-full'>
						<TabsList className='mb-8 grid w-full grid-cols-2 blue-border animate-fade-in'>
							<TabsTrigger
								value='upcoming'
								className='transition-all hover:text-primary'
							>
								Upcoming Events
							</TabsTrigger>
							<TabsTrigger
								value='past'
								className='transition-all hover:text-primary'
							>
								Past Events
							</TabsTrigger>
						</TabsList>
						<TabsContent
							value='upcoming'
							className='animate-fade-in'
						>
							{upcomingEvents.length > 0 ? (
								<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-animation'>
									{upcomingEvents.map((event) => (
										<EventCard
											key={event.id}
											event={event}
										/>
									))}
								</div>
							) : (
								<div className='rounded-lg border border-dashed p-10 text-center animate-fade-in'>
									<h3 className='mb-2 text-xl font-semibold'>
										No Upcoming Events
									</h3>
									<p className='mb-6 text-muted-foreground'>
										We're currently planning new events.
										Check back soon!
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
										/>
									))}
								</div>
							) : (
								<div className='rounded-lg border border-dashed p-10 text-center animate-fade-in'>
									<h3 className='mb-2 text-xl font-semibold'>
										No Past Events
									</h3>
									<p className='text-muted-foreground'>
										Our event history will appear here once
										events are completed.
									</p>
								</div>
							)}
						</TabsContent>
					</Tabs>
				</div>
			</section>

			{/* CTA Section */}
			<section className='section-padding bg-muted'>
				<div className='container'>
					<div className='mx-auto max-w-3xl text-center'>
						<h2 className='mb-6 text-3xl font-bold md:text-4xl animate-slide-up'>
							Want to Collaborate?
						</h2>
						<p
							className='mb-8 text-muted-foreground animate-slide-up'
							style={{ animationDelay: '0.1s' }}
						>
							If you're interested in hosting an event with us or
							have ideas for workshops, we'd love to hear from
							you.
						</p>
						<Button
							asChild
							size='lg'
							className='hover-lift hover-glow animate-slide-up'
							style={{ animationDelay: '0.2s' }}
						>
							<Link href='/contact'>Get in Touch</Link>
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
}

interface EventCardProps {
	event: {
		id: string;
		title: string;
		date: string;
		location: string;
		description: string;
		speaker: string;
		image: string;
		registration_link: string;
	};
	isPast?: boolean;
}

function EventCard({ event, isPast = false }: EventCardProps) {
	return (
		<Card className='overflow-hidden transition-all hover:shadow-lg hover-lift animate-fade-in'>
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
				{!isPast ? (
					<Button asChild className='hover-lift'>
						<a
							href={event.registration_link}
							target='_blank'
							rel='noopener noreferrer'
						>
							Register Now
						</a>
					</Button>
				) : (
					<Button variant='outline' disabled>
						Event Completed
					</Button>
				)}
			</CardContent>
		</Card>
	);
}
