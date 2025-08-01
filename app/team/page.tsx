import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { teamHeads } from '@/lib/team-heads';
import { domainInfo } from '@/lib/domain-info';
import { domainIdToSlug } from '@/lib/domain-utils';
import AnimatedTechBackground from '@/components/animated-tech-background';

export default function TeamPage() {
	return (
		<div className='flex flex-col'>
			{/* Hero Section */}
			<section className='bg-card py-16 md:py-24'>
				<AnimatedTechBackground />
				<div className='container'>
					<div className='mx-auto max-w-3xl text-center'>
						<h1 className='mb-6 text-4xl font-bold tracking-tight md:text-5xl animate-slide-up'>
							<span className='heading-gradient '>Our Team</span>
						</h1>
						<p
							className='mb-0 text-lg text-muted-foreground md:text-xl animate-slide-up'
							style={{ animationDelay: '0.2s' }}
						>
							Meet the dedicated individuals who make ACM BITS
							Pilani, Hyderabad Campus possible.
						</p>
					</div>
				</div>
			</section>

			{/* Team Members Section */}
			<section className='section-padding z-10'>
				<div className='container'>
					<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-animation'>
						{teamHeads.map((member, index) => (
							<Card
								key={index}
								className='overflow-hidden hover-lift hover-glow animate-fade-in'
							>
								<div className='aspect-square relative'>
									<Image
										src={
											member.image ||
											'/placeholder.svg?height=300&width=300'
										}
										alt={member.name}
										fill
										className='object-cover'
									/>
								</div>
								<CardContent className='p-6 text-center'>
									<h3 className='mb-1 text-xl font-bold'>
										{member.name}
									</h3>
									<p className='text-muted-foreground'>
										{member.designation}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Domain Information Section */}
			<section className="py-16 px-4 bg-muted/30">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold tracking-tight mb-4">Learn More About Each Domain</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Explore detailed information about our key technology domains and discover the opportunities in each field.
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
						{domainInfo.map((domain) => {
							const IconComponent = domain.icon
							const slug = domainIdToSlug(domain.id)

							return (
								<Link key={domain.id} href={`/domains/${slug}`}>
									<Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-primary/20">
										<CardContent className="p-6 text-center">
											<div className="mb-4 flex justify-center">
												<div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
													<IconComponent className="h-8 w-8 text-primary" />
												</div>
											</div>
											<h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
												{domain.title}
											</h3>
											<p className="text-sm text-muted-foreground">Click to learn more about this domain</p>
										</CardContent>
									</Card>
								</Link>
							)
						})}
					</div>
				</div>
			</section>

			{/* Get Involved Section */}
			<section className='section-padding z-10 bg-muted'>
				<div className='container'>
					<div className='mx-auto max-w-3xl text-center'>
						<h2 className='mb-6 text-3xl font-bold md:text-4xl animate-slide-up'>
							Get Involved
						</h2>
						<p
							className='mb-8 text-muted-foreground animate-slide-up'
							style={{ animationDelay: '0.1s' }}
						>
							Interested in collaborating with ACM BPHC? We're
							always looking for passionate individuals to work
							with us.
						</p>
						<div
							className='rounded-lg bg-card p-8 animate-slide-up'
							style={{ animationDelay: '0.2s' }}
						>
							<h3 className='mb-4 text-xl font-semibold'>
								How to Get Involved
							</h3>
							<ul className='mb-6 space-y-2 text-left'>
								<li className='flex items-start'>
									<span className='mr-2 text-primary'>•</span>
									<span>
										Attend our orientation sessions at the
										beginning of each semester
									</span>
								</li>
								<li className='flex items-start'>
									<span className='mr-2 text-primary'>•</span>
									<span>
										Participate actively in our events and
										workshops
									</span>
								</li>
								<li className='flex items-start'>
									<span className='mr-2 text-primary'>•</span>
									<span>
										Volunteer for event organization and
										management
									</span>
								</li>
								<li className='flex items-start'>
									<span className='mr-2 text-primary'>•</span>
									<span>
										Collaborate on technical projects and
										research
									</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
