import { getDomains } from '@/lib/domains';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import AnimatedTechBackground from '@/components/animated-tech-background';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Domains | ACM BITS Pilani',
    description: 'Explore our technology domains including Web Development, Machine Learning, Gen AI, Mobile Development, Quant, Events, Content, and Design at ACM BITS Pilani.',
    openGraph: {
        title: 'Domains | ACM BITS Pilani',
        description: 'Explore our technology domains including Web Development, Machine Learning, Gen AI, Mobile Development, Quant, Events, Content, and Design at ACM BITS Pilani.',
    },
};

export default async function DomainsPage() {
    const domains = await getDomains();

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="bg-card py-16 md:py-24">
                <AnimatedTechBackground />
                <div className="container">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl animate-slide-up">
                            <span className="heading-gradient">Our Domains</span>
                        </h1>
                        <p
                            className="mb-0 text-lg text-muted-foreground md:text-xl animate-slide-up"
                            style={{ animationDelay: '0.2s' }}
                        >
                            Explore our technology domains and discover the opportunities in each field.
                        </p>
                    </div>
                </div>
            </section>

            {/* Domains Grid */}
            <section className="py-16 px-4 z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                        {domains.map((domain) => {
                            const IconComponent = domain.icon;

                            return (
                                <Link key={domain.id} href={`/domains/${domain.slug}`}>
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
                                            <p className="text-sm text-muted-foreground">
                                                Click to learn more about this domain
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
