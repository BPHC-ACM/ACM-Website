'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Github, ExternalLink, Users, Star, CloudCog } from 'lucide-react';
import AnimatedTechBackground from '@/components/animated-tech-background';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  github_link?: string;
  website_link?: string;
  technologies: string[];
  teams: string; // Added team field
  team_members?: string[]; // Added team members field (optional)
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
      
      setProjects(data);
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

      {/* Projects Section */}
      <section className="section-padding z-10">
        <div className="container max-w-7xl">
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
            <div className="w-full">
              {/* All Projects Section */}
              {projects.length > 0 ? (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold mb-6 text-center heading-gradient animate-fade-in">
                    All Projects ({projects.length})
                  </h2>
                  <div className="space-y-6 stagger-animation">
                    {projects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState
                  title="No Projects Found"
                  description="We're currently working on exciting new projects. Check back soon or contribute your ideas!"
                />
              )}
            </div>
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
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover-lift animate-fade-in">
      <div className="flex flex-col lg:flex-row h-full">
        {/* Image Section */}
        <div className="lg:w-2/5 relative flex-shrink-0">
          <Image
            src={project.image || '/placeholder.svg?height=300&width=500'}
            alt={project.title}
            width={500}
            height={300}
            className="w-full h-full object-cover"
            style={{ aspectRatio: '16/9' }}
          />
        </div>

        {/* Content Section */}
        <div className="lg:w-3/5 flex flex-col">
          <CardContent className="p-6 lg:p-8 flex-1 flex flex-col">
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-2xl lg:text-3xl font-bold leading-tight">{project.title}</h3>
              </div>
              
              {/* Team Information */}
              {project.teams && (
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                    {project.teams}
                  </span>
                </div>
              )}

              {/* Team Members (if available) */}
              {project.team_members && project.team_members.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-muted-foreground mb-1">Team Members:</p>
                  <div className="flex flex-wrap gap-1">
                    {project.team_members.slice(0, 5).map((member, index) => (
                      <span key={index} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                        {member}
                      </span>
                    ))}
                    {project.team_members.length > 5 && (
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                        +{project.team_members.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <p className="text-muted-foreground leading-relaxed">{project.description}</p>
            </div>

            {/* Technologies */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Technologies:</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.slice(0, 6).map((tech, index) => (
                  <span key={index} className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full">
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 6 && (
                  <span className="px-3 py-1 text-sm bg-muted text-muted-foreground rounded-full">
                    +{project.technologies.length - 6} more
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                {project.github_link && (
                  <Button asChild variant="outline" className="hover-lift">
                    <a href={project.github_link} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      View Source Code
                    </a>
                  </Button>
                )}
                {project.website_link && (
                  <Button asChild className="hover-lift hover-glow">
                    <a href={project.website_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </div>
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
