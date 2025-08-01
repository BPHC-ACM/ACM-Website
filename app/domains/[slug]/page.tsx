import { domainInfo } from '@/lib/domain-info';
import { slugToDomainId, domainIdToSlug, getAllDomainSlugs } from '@/lib/domain-utils';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AnimatedTechBackground from '@/components/animated-tech-background';
import { Metadata } from 'next';

interface DomainPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: DomainPageProps): Promise<Metadata> {
    const { slug } = await params;
    const domainId = slugToDomainId(slug);
    const domain = domainInfo.find((d) => d.id === domainId);

    if (!domain) {
        return {
            title: 'Domain Not Found',
        };
    }

    return {
        title: `${domain.title} | ACM BITS Pilani`,
        description: `Learn about ${domain.title} at ACM BITS Pilani. Explore opportunities, projects, and initiatives in this domain.`,
        openGraph: {
            title: `${domain.title} | ACM BITS Pilani`,
            description: `Learn about ${domain.title} at ACM BITS Pilani. Explore opportunities, projects, and initiatives in this domain.`,
        },
    };
}

export async function generateStaticParams() {
    return getAllDomainSlugs().map((slug) => ({
        slug,
    }));
}

export default async function DomainPage({ params }: DomainPageProps) {
    const { slug } = await params;
    const domainId = slugToDomainId(slug);
    const domain = domainInfo.find((d) => d.id === domainId);

    if (!domain) {
        notFound();
    }

    const IconComponent = domain.icon;

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="bg-card py-16 md:py-24">
                <AnimatedTechBackground />
                <div className="container">
                    <div className="mx-auto max-w-4xl">
                        {/* Domain Header */}
                        <div className="text-center">
                            <div className="mb-6 flex justify-center">
                                <div className="p-4 rounded-full bg-primary/10">
                                    <IconComponent className="h-12 w-12 text-primary" />
                                </div>
                            </div>
                            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl animate-slide-up">
                                <span className="heading-gradient">{domain.title}</span>
                            </h1>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 px-4 z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-lg max-w-none dark:prose-invert">
                        {domain.content.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="mb-6 leading-relaxed text-foreground">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {/* Navigation Section */}
                    <div className="mt-12 pt-8 border-t border-border">
                        <div className="flex justify-center">
                            <Link href="/domains">
                                <Button variant="default">
                                    View All Domains
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
