'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Github, ExternalLink, Users, Star, CloudCog } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnimatedTechBackground from '@/components/animated-tech-background';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  github_link?: string;
  technologies: string[];
  status: 'active' | 'completed';
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch('/api/projects', {
        method: 'GET',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await res.json();
      
      const validProjects = data.filter((project: any) => 
        ['active', 'completed'].includes(project.status)
      );
      
      setProjects(validProjects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const activeProjects = projects.filter((project) => project.status === 'active');
  const completedProjects = projects.filter((project) => project.status === 'completed');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-card py-16 md:py-24">
        <AnimatedTechBackground />
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl animate-slide-up">
              <span className="heading-gradient">Our Projects</span>
            </h1>
            <p
              className="mb-0 text-lg text-muted-foreground md:text-xl animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              Explore our innovative projects, open-source contributions, and collaborative
              development initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Tabs Section */}
      <section className="section-padding z-10">
        <div className="container">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-destructive p-6 text-center">
              <p className="text-destructive">{error}</p>
              <Button variant="outline" className="mt-4" onClick={fetchProjects}>
                Try Again
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="mb-8 grid w-full grid-cols-2 blue-border animate-fade-in">
                <TabsTrigger value="active" className="transition-all hover:text-primary">
                  Active Projects ({activeProjects.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="transition-all hover:text-primary">
                  Completed ({completedProjects.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="animate-fade-in">
                {activeProjects.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-animation">
                    {activeProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No Active Projects"
                    description="We're currently planning new projects. Check back soon or contribute your ideas!"
                  />
                )}
              </TabsContent>

              <TabsContent value="completed" className="animate-fade-in">
                {completedProjects.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-animation">
                    {completedProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No Completed Projects Yet"
                    description="Our completed projects will appear here once they're finished."
                  />
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-muted z-10">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="heading-gradient mb-6 text-3xl font-bold md:text-4xl animate-slide-up">
              Want to Contribute?
            </h2>
            <p
              className="mb-8 text-muted-foreground animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              Join our open-source community and contribute to exciting projects. Whether you're a
              beginner or expert, there's something for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="hover-lift hover-glow animate-slide-up"
                style={{ animationDelay: '0.2s' }}
              >
                <Link href="https://github.com/your-org">
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="hover-lift animate-slide-up"
                style={{ animationDelay: '0.3s' }}
              >
                <Link href="mailto:acm@hyderabad.bits-pilani.ac.in">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover-lift animate-fade-in h-full flex flex-col">
      <div className="aspect-video relative">
        <Image
          src={project.image || '/placeholder.svg?height=200&width=400'}
          alt={project.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
              project.status,
            )}`}
          >
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>
      </div>
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="mb-2 text-xl font-bold">{project.title}</h3>
          <p className="line-clamp-3 text-muted-foreground mb-4">{project.description}</p>
        </div>

        {/* Technologies */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {project.technologies.slice(0, 3).map((tech, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md">
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-md">
                +{project.technologies.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          {project.github_link && (
            <Button asChild variant="outline" size="sm" className="hover-lift flex-1">
              <a href={project.github_link} target="_blank" rel="noopener noreferrer">
                <Github className="mr-1 h-4 w-4" />
                View Code
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
}

function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed p-10 text-center animate-fade-in">
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
