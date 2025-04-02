'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AnimatedTechBackground from '@/components/animated-tech-background';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';
import AnimatedACMLogo from '@/components/animated-acm-logo';
import RollingText from '@/components/rolling-text';
import {
	Github,
	ChevronLeft,
	ChevronRight,
	Users,
	Code,
	Globe,
	Lightbulb,
} from 'lucide-react';
import { teamHeads } from '@/lib/team-heads';
import { faqItems } from '@/lib/faq';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Home() {
	useSmoothScroll();
	const fadeIn = {
		hidden: { opacity: 0, y: 30 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
	};

	const slideUp = {
		hidden: { opacity: 0, y: 30 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
	};

	const staggerContainer = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const sliderRef = useRef(null);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIfMobile = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		checkIfMobile();
		window.addEventListener('resize', checkIfMobile);

		return () => {
			window.removeEventListener('resize', checkIfMobile);
		};
	}, []);

	const sliderSettings = {
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: isMobile ? 1 : 4,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 5000,
		pauseOnHover: true,
		arrows: false,
		responsive: [
			{
				breakpoint: 1280,
				settings: {
					slidesToShow: 3,
				},
			},
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
				},
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
					centerMode: true,
					centerPadding: '30px',
				},
			},
		],
	};

	const goToPrev = () => {
		if (sliderRef.current) {
			sliderRef.current.slickPrev();
		}
	};

	const goToNext = () => {
		if (sliderRef.current) {
			sliderRef.current.slickNext();
		}
	};

	return (
		<div className='flex flex-col'>
			{/* Hero Section */}
			<section className='relative overflow-hidden bg-card py-20 md:py-32'>
				<AnimatedTechBackground />
				<div className='container relative z-10'>
					<div className='mx-auto max-w-3xl text-center'>
						<motion.div
							className='flex justify-center space-x-4 mb-6'
							initial='hidden'
							animate='visible'
							variants={staggerContainer}
						>
							<AnimatedACMLogo />
						</motion.div>
						<motion.h1
							className='mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl'
							initial='hidden'
							animate='visible'
							variants={slideUp}
						>
							<RollingText className='heading-gradient'>
								Association for
							</RollingText>
							<RollingText className='heading-gradient w-[120%] md:w-auto -ml-8 md:m-auto md:-mt-4'>
								Computing Machinery
							</RollingText>
						</motion.h1>
						<motion.h2
							className='mb-8 text-2xl font-medium md:text-3xl'
							initial='hidden'
							animate='visible'
							variants={slideUp}
							transition={{ delay: 0.2 }}
						>
							BITS Pilani, Hyderabad Campus
						</motion.h2>
						<motion.p
							className='mb-8 text-lg text-muted-foreground md:text-xl'
							initial='hidden'
							animate='visible'
							variants={slideUp}
							transition={{ delay: 0.3 }}
						>
							Empowering students through technology, innovation,
							and community.
						</motion.p>
						<motion.div
							className='flex flex-col items-center justify-center gap-4 sm:flex-row'
							initial='hidden'
							animate='visible'
							variants={slideUp}
							transition={{ delay: 0.4 }}
						>
							<Button
								asChild
								size='lg'
								className='hover-lift hover-glow'
							>
								<Link prefetch={true} href='#about'>
									Learn More
								</Link>
							</Button>
							<Button
								asChild
								variant='outline'
								size='lg'
								className='hover-lift'
							>
								<Link prefetch={true} href='/events'>
									Explore Events
								</Link>
							</Button>
						</motion.div>
					</div>
				</div>
				<div className='absolute inset-0 z-0 opacity-20 mix-blend-overlay'>
					<div className='absolute inset-0 bg-gradient-to-r from-primary/70 to-[#66CCFF]/70 opacity-30' />
				</div>
			</section>

			{/* About ACM Section */}
			<section id='about' className='section-padding'>
				<div className='container'>
					<div className='mx-auto max-w-4xl'>
						<motion.h2
							className='mb-6 text-3xl font-bold text-center'
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
						>
							<RollingText className='heading-gradient'>
								What is ACM?
							</RollingText>
						</motion.h2>
						<motion.div
							className='space-y-4 text-muted-foreground'
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.2 }}
						>
							<p>
								The Association for Computing Machinery (ACM) is
								the world's largest educational and scientific
								computing society. Founded in 1947, ACM brings
								together computing educators, researchers, and
								professionals to inspire dialogue, share
								resources, and address the field's challenges.
							</p>
							<p>
								As the world's largest computing society, ACM
								strengthens the profession's collective voice
								through strong leadership, promotion of the
								highest standards, and recognition of technical
								excellence. ACM supports the professional growth
								of its members by providing opportunities for
								life-long learning, career development, and
								professional networking.
							</p>
						</motion.div>

						<motion.h2
							className='mb-6 mt-12 text-3xl font-bold text-center'
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
						>
							<RollingText className='heading-gradient'>
								Our Chapter
							</RollingText>
						</motion.h2>
						<motion.div
							className='space-y-4 text-muted-foreground'
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.2 }}
						>
							<p>
								The ACM Student Chapter at BITS Pilani,
								Hyderabad Campus was established to create a
								community of students passionate about computing
								and technology. Our chapter serves as a hub for
								technical activities, knowledge sharing, and
								professional development.
							</p>
							<p>
								We organize a variety of events throughout the
								academic year, including workshops, hackathons,
								technical talks, and coding competitions. These
								events provide opportunities for students to
								enhance their skills, explore new technologies,
								and connect with industry professionals.
							</p>
							<p>
								Our mission is to foster a culture of innovation
								and excellence in computing among students and
								to prepare them for successful careers in the
								technology industry.
							</p>
						</motion.div>

						<motion.h2
							className='mb-6 mt-12 text-3xl font-bold text-center'
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
						>
							<RollingText className='heading-gradient'>
								Our Vision
							</RollingText>
						</motion.h2>
						<motion.div
							className='space-y-4 text-muted-foreground'
							initial='hidden'
							whileInView='visible'
							viewport={{ once: true }}
							variants={staggerContainer}
						>
							<p>
								We envision a vibrant community where students
								can explore, learn, and innovate in the field of
								computing. We aim to:
							</p>
							<ul className='ml-6 list-disc space-y-2'>
								<li>
									Promote interest in computer science and
									related fields
								</li>
								<li>
									Provide platforms for students to showcase
									their technical skills
								</li>
								<li>
									Bridge the gap between academia and industry
								</li>
								<li>
									Encourage collaboration and knowledge
									sharing among students
								</li>
								<li>
									Prepare students for successful careers in
									technology
								</li>
							</ul>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className='section-padding bg-muted'>
				<div className='container'>
					<motion.h2
						className='mb-10 text-center text-3xl font-bold'
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
					>
						{isMobile ? (
							<>
								<RollingText className='heading-gradient'>
									Why Join our
								</RollingText>
								<RollingText>Community?</RollingText>
							</>
						) : (
							<RollingText className='heading-gradient'>
								Why Join Our Community?
							</RollingText>
						)}
					</motion.h2>
					<motion.div
						className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true }}
						variants={staggerContainer}
					>
						<motion.div variants={fadeIn}>
							<Card className='hover-lift h-full'>
								<CardContent className='flex flex-col items-center p-6 text-center h-full'>
									<div className='mb-4 rounded-full bg-gradient-to-r from-primary/20 to-[#66CCFF]/20 p-3'>
										<motion.div
											whileHover={{ rotate: 360 }}
											transition={{ duration: 0.5 }}
										>
											<Users className='h-6 w-6 text-primary' />
										</motion.div>
									</div>
									<h3 className='mb-2 text-xl font-semibold'>
										Community
									</h3>
									<p className='text-muted-foreground'>
										Connect with like-minded individuals
										passionate about computing and
										technology.
									</p>
								</CardContent>
							</Card>
						</motion.div>
						<motion.div variants={fadeIn}>
							<Card className='hover-lift h-full'>
								<CardContent className='flex flex-col items-center p-6 text-center h-full'>
									<div className='mb-4 rounded-full bg-gradient-to-r from-teal-500/20 to-primary/20 p-3'>
										<motion.div
											whileHover={{ rotate: 360 }}
											transition={{ duration: 0.5 }}
										>
											<Code className='h-6 w-6 text-teal-500' />
										</motion.div>
									</div>
									<h3 className='mb-2 text-xl font-semibold'>
										Learning
									</h3>
									<p className='text-muted-foreground'>
										Access workshops, tutorials, and
										resources to enhance your technical
										skills.
									</p>
								</CardContent>
							</Card>
						</motion.div>
						<motion.div variants={fadeIn}>
							<Card className='hover-lift h-full'>
								<CardContent className='flex flex-col items-center p-6 text-center h-full'>
									<div className='mb-4 rounded-full bg-gradient-to-r from-[#66CCFF]/20 to-pink-500/20 p-3'>
										<motion.div
											whileHover={{ rotate: 360 }}
											transition={{ duration: 0.5 }}
										>
											<Globe className='h-6 w-6 text-purple-500' />
										</motion.div>
									</div>
									<h3 className='mb-2 text-xl font-semibold'>
										Networking
									</h3>
									<p className='text-muted-foreground'>
										Build connections with industry
										professionals and potential employers.
									</p>
								</CardContent>
							</Card>
						</motion.div>
						<motion.div variants={fadeIn}>
							<Card className='hover-lift h-full'>
								<CardContent className='flex flex-col items-center p-6 text-center h-full'>
									<div className='mb-4 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-3'>
										<motion.div
											whileHover={{ rotate: 360 }}
											transition={{ duration: 0.5 }}
										>
											<Lightbulb className='h-6 w-6 text-amber-500' />
										</motion.div>
									</div>
									<h3 className='mb-2 text-xl font-semibold'>
										Innovation
									</h3>
									<p className='text-muted-foreground'>
										Participate in hackathons and projects
										to showcase your creativity.
									</p>
								</CardContent>
							</Card>
						</motion.div>
					</motion.div>
				</div>
			</section>

			{/* Team Carousel Section - FIXED HEIGHT CARDS */}
			<section className='section-padding bg-muted'>
				<div className='container'>
					<motion.h2
						className='mb-10 text-center text-3xl font-bold'
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
					>
						<RollingText className='heading-gradient'>
							Meet Our Team
						</RollingText>
					</motion.h2>

					<motion.div
						className='relative px-4'
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
					>
						<Slider ref={sliderRef} {...sliderSettings}>
							{teamHeads.map((member, index) => (
								<div key={index} className='px-3'>
									<motion.div
										whileHover={{ scale: 1.01 }}
										transition={{
											type: 'spring',
											stiffness: 400,
											damping: 17,
										}}
									>
										<Card className='overflow-hidden h-full flex flex-col'>
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
											<CardContent className='p-6 text-center flex flex-col flex-1'>
												<h3 className='mb-1 text-xl font-bold'>
													{member.name}
												</h3>
												<div className='min-h-12 flex items-center justify-center'>
													<p className='text-muted-foreground'>
														{member.designation}
													</p>
												</div>
											</CardContent>
										</Card>
									</motion.div>
								</div>
							))}
						</Slider>

						{!isMobile && (
							<div className='absolute w-[calc(100%+20px)] left-[-10px] flex justify-between top-1/2 mt-[-2rem] transform -translate-y-1/2 z-10'>
								<Button
									variant='outline'
									size='icon'
									onClick={goToPrev}
									className='rounded-full hover:bg-primary/10 hover:text-primary -ml-4'
								>
									<ChevronLeft className='h-5 w-5' />
									<span className='sr-only'>Previous</span>
								</Button>
								<Button
									variant='outline'
									size='icon'
									onClick={goToNext}
									className='rounded-full hover:bg-primary/10 hover:text-primary -mr-4'
								>
									<ChevronRight className='h-5 w-5' />
									<span className='sr-only'>Next</span>
								</Button>
							</div>
						)}

						<div className='flex justify-center mt-8'>
							<Button
								asChild
								variant='outline'
								className='hover-lift'
							>
								<Link href='/team' prefetch={true}>
									View All Team Members
								</Link>
							</Button>
						</div>
					</motion.div>
				</div>
			</section>
			{/* FAQ Section */}
			<section id='faq' className='section-padding'>
				<div className='container'>
					<div className='mx-auto max-w-4xl'>
						<motion.h2
							className='mb-10 text-center text-3xl font-bold'
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
						>
							{isMobile ? (
								<>
									<RollingText className='heading-gradient'>
										Frequently Asked
									</RollingText>
									<RollingText>Questions</RollingText>
								</>
							) : (
								<RollingText className='heading-gradient'>
									Frequently Asked Questions
								</RollingText>
							)}
						</motion.h2>
						<motion.div
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.2 }}
						>
							<Accordion
								type='single'
								collapsible
								className='w-full'
							>
								{faqItems.map((faq, index) => (
									<AccordionItem
										key={index}
										value={`item-${index}`}
									>
										<AccordionTrigger className='hover:text-primary transition-colors'>
											{faq.question}
										</AccordionTrigger>
										<AccordionContent>
											{faq.answer}
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</motion.div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className='section-padding bg-card'>
				<div className='container'>
					<div className='mx-auto max-w-3xl text-center'>
						<motion.h2
							className='mb-6 text-3xl font-bold md:text-4xl'
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
						>
							<RollingText className='heading-gradient'>
								Join Our Community
							</RollingText>
						</motion.h2>
						<motion.p
							className='mb-8 text-muted-foreground'
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.2 }}
						>
							Connect with like-minded individuals passionate
							about computing and technology. Follow us on social
							media and attend our events to stay updated.
						</motion.p>
						<motion.div
							className='flex flex-col sm:flex-row items-center justify-center gap-4'
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.3 }}
						>
							<Button
								asChild
								variant='outline'
								size='lg'
								className='hover-lift'
							>
								<a
									href='https://github.com/BPHC-ACM'
									target='_blank'
									rel='noopener noreferrer'
								>
									<Github className='mr-2 h-5 w-5' /> GitHub
								</a>
							</Button>
							<Button
								asChild
								size='lg'
								className='hover-lift hover-glow'
							>
								<Link href='/events' prefetch={true}>
									Upcoming Events
								</Link>
							</Button>
						</motion.div>
					</div>
				</div>
			</section>
		</div>
	);
}
