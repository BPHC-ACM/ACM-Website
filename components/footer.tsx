import Link from 'next/link';
import Image from 'next/image';
import { Github, Instagram, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
	return (
		<footer className='border-t bg-card'>
			<div className='container px-4 pt-16 pb-6'>
				<div className='grid gap-12 md:grid-cols-2 lg:grid-cols-3'>
					{/* Logo & Description Section */}
					<div className='animate-slide-up'>
						<div className='flex items-center gap-4 mb-5'>
							<div className='relative flex items-center justify-center h-12 w-12 overflow-hidden rounded-lg shadow-sm'>
								<Image
									src='/acm-logo.png'
									alt='ACM Logo'
									width={56}
									height={56}
									className='object-contain'
								/>
							</div>
							<div>
								<h3 className='text-xl font-bold text-primary'>
									ACM BITS Pilani
								</h3>
								<p className='text-sm font-medium'>
									Hyderabad Campus, Student Chapter
								</p>
							</div>
						</div>
						<p className='text-sm text-muted-foreground leading-relaxed max-w-md'>
							Promoting computing as a science and profession
							through education, networking, and advocacy. Join us
							in our journey to explore and advance the world of
							technology.
						</p>
					</div>

					<div
						className='animate-slide-up md:pl-24'
						style={{ animationDelay: '0.1s' }}
					>
						<h3 className='mb-4 text-lg font-semibold blue-accent inline-block'>
							Quick Links
						</h3>
						<ul className='space-y-2 text-sm'>
							<li>
								<Link
									prefetch={true}
									href='/events'
									className='text-muted-foreground hover:text-primary transition-colors'
								>
									Events
								</Link>
							</li>
							<li>
								<Link
									prefetch={true}
									href='/blogs'
									className='text-muted-foreground hover:text-primary transition-colors'
								>
									Blogs
								</Link>
							</li>
							<li>
								<Link
									prefetch={true}
									href='/team'
									className='text-muted-foreground hover:text-primary transition-colors'
								>
									Our Team
								</Link>
							</li>
							<li>
								<Link
									prefetch={true}
									href='/#about'
									className='text-muted-foreground hover:text-primary transition-colors'
								>
									About Us
								</Link>
							</li>
						</ul>
					</div>

					<div
						className='animate-slide-up'
						style={{ animationDelay: '0.2s' }}
					>
						<h3 className='mb-4 text-lg font-semibold blue-accent inline-block'>
							Connect With Us
						</h3>
						<div className='flex space-x-4'>
							<a
								href='https://github.com/BPHC-ACM'
								target='_blank'
								rel='noopener noreferrer'
								className='text-muted-foreground hover:text-primary transition-colors hover-lift'
								aria-label='GitHub'
							>
								<Github className='h-5 w-5' />
							</a>
							<a
								href='https://www.linkedin.com/company/acm-bphc-chapter/'
								target='_blank'
								rel='noopener noreferrer'
								className='text-muted-foreground hover:text-primary transition-colors hover-lift'
								aria-label='LinkedIn'
							>
								<Linkedin className='h-5 w-5' />
							</a>
							<a
								href='https://www.instagram.com/acm_bphc/'
								target='_blank'
								rel='noopener noreferrer'
								className='text-muted-foreground hover:text-primary transition-colors hover-lift'
								aria-label='Instagram'
							>
								<Instagram className='h-5 w-5' />
							</a>
							<a
								href='https://x.com/AcmBphc'
								target='_blank'
								rel='noopener noreferrer'
								className='text-muted-foreground hover:text-primary transition-colors hover-lift'
								aria-label='Twitter'
							>
								<Twitter className='h-5 w-5' />
							</a>
						</div>
						<div className='mt-4'>
							<p className='text-sm text-muted-foreground'>
								Email:{' '}
								<a
									href='mailto:acm@hyderabad.bits-pilani.ac.in'
									className='inline-flex items-center hover:text-primary transition-colors group'
								>
									<span className='group-hover:underline underline-offset-2'>
										acm@hyderabad.bits-pilani.ac.in
									</span>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='16'
										height='16'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
										className='ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform'
									>
										<path d='M5 12h14'></path>
										<path d='m12 5 7 7-7 7'></path>
									</svg>
								</a>
							</p>
						</div>
					</div>
				</div>
				<div className='mt-12 border-t pt-6 text-center'>
					<p className='text-sm text-muted-foreground'>
						&copy; {new Date().getFullYear()} ACM BITS Pilani
						Hyderabad Campus, Student Chapter.
					</p>
				</div>
			</div>
		</footer>
	);
}
