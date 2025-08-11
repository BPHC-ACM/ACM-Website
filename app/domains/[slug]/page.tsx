import { getDomainBySlug, getAllDomainSlugs } from '@/lib/domains';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AnimatedTechBackground from '@/components/animated-tech-background';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import { ComponentProps, ReactNode } from 'react';

interface DomainPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface CodeProps extends ComponentProps<'code'> {
  inline?: boolean;
  className?: string;
  children: ReactNode;
}

export async function generateMetadata({ params }: DomainPageProps): Promise<Metadata> {
  const { slug } = await params;
  const domain = await getDomainBySlug(slug);

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
  const slugs = await getAllDomainSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function DomainPage({ params }: DomainPageProps) {
  const { slug } = await params;
  const domain = await getDomainBySlug(slug);

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
          <article
            className="prose prose-lg prose-a:break-words prose-a:line-clamp-1
 prose-headings:scroll-mt-20 dark:prose-invert prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg max-w-none"
          >
            {domain.content.startsWith('<p>') || domain.content.startsWith('<h') ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: domain.content,
                }}
              />
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="mt-8 mb-4 text-3xl font-bold" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="mt-8 mb-4 text-2xl font-bold" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="mt-6 mb-3 text-xl font-bold" {...props} />
                  ),
                  p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                  ul: ({ node, ...props }) => <ul className="mb-4 ml-6 list-disc" {...props} />,
                  ol: ({ node, ...props }) => <ol className="mb-4 ml-6 list-decimal" {...props} />,
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props} />
                  ),
                  code: ({ inline, className, children, ...props }: CodeProps) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={atomDark}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-md my-4"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code
                        className={`${className} bg-muted px-1.5 py-0.5 rounded text-sm`}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {domain.content}
              </ReactMarkdown>
            )}
          </article>

          {/* Navigation Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex justify-center">
              <Link href="/domains">
                <Button variant="default">View All Domains</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
