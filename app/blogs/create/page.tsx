'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Eye, X } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import AnimatedTechBackground from '@/components/animated-tech-background';
import PasswordDialog from '@/components/password-dialog';
import { useBlogAuth } from '@/hooks/use-blog-auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  categories: string[];
  published: boolean;
}

export default function CreateEditBlogPage() {
  return (
    <Suspense fallback={<CreateEditBlogLoadingSkeleton />}>
      <CreateEditBlogPageContent />
    </Suspense>
  );
}

function CreateEditBlogLoadingSkeleton() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

function CreateEditBlogPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading, authenticate } = useBlogAuth();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const editId = searchParams.get('edit');
  const isEditing = !!editId;

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    categories: [],
    published: false,
  });

  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [showPreview, setShowPreview] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setShowPasswordDialog(true);
    }
  }, [authLoading, isAuthenticated]);

  const handleAuthSuccess = () => {
    authenticate();
  };

  const handleAuthCancel = () => {
    router.push('/blogs');
  };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Validate slug format
  const isValidSlug = (slug: string) => {
    return slug && slug.trim() && /^[a-z0-9-]+$/.test(slug.trim());
  };

  // Fetch blog data for editing
  useEffect(() => {
    if (isEditing && editId) {
      const fetchBlogData = async () => {
        try {
          const response = await fetch(`/api/blogs/manage/${editId}`);
          if (response.ok) {
            const data = await response.json();
            setFormData({
              title: data.title || '',
              slug: data.slug || '',
              excerpt: data.excerpt || '',
              content: data.content || '',
              featured_image: data.featured_image || '',
              categories: data.category_name ? [data.category_name] : [],
              published: data.published || false,
            });
          } else {
            toast({
              title: 'Error',
              description: 'Failed to fetch blog data',
              variant: 'destructive',
            });
            router.push('/blogs');
          }
        } catch (error) {
          console.error('Error fetching blog:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch blog data',
            variant: 'destructive',
          });
          router.push('/blogs');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchBlogData();
    }
  }, [isEditing, editId, router, toast]);

  const handleInputChange = (field: keyof BlogFormData, value: string | boolean | string[]) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-generate slug when title changes (only for new blogs)
      if (field === 'title' && !isEditing && typeof value === 'string') {
        updated.slug = generateSlug(value);
      }

      return updated;
    });
  };

  const addTag = (tag: string) => {
    const newTag = tag.trim().replace(/\s+/g, '-').toLowerCase();
    if (newTag && !formData.categories.includes(newTag) && formData.categories.length < 1) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, newTag],
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handlePreview = () => {
    if (isEditing) {
      // For editing, open the actual blog page
      window.open(`/blogs/${formData.slug}`, '_blank');
    } else {
      // For new blogs, show preview modal
      setShowPreview(true);
    }
  };

  // Simple markdown-like formatting for preview
  const formatPreviewContent = (content: string) => {
    return (
      content
        // Headers
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
        // Bold and italic
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        // Inline code
        .replace(
          /`(.*?)`/g,
          '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>',
        )
        // Code blocks
        .replace(
          /```([\s\S]*?)```/g,
          '<pre class="bg-muted p-3 rounded-lg overflow-x-auto my-4"><code class="text-sm font-mono">$1</code></pre>',
        )
        // Links
        .replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          '<a href="$2" class="text-primary underline hover:no-underline" target="_blank" rel="noopener noreferrer">$1</a>',
        )
        // Line breaks and paragraphs
        .replace(/\n\n/g, '</p><p class="mb-4">')
        .replace(/\n/g, '<br/>')
        // Wrap in paragraph if content doesn't start with a header
        .replace(/^(?!<[h123])/gm, '<p class="mb-4">')
        // Clean up any empty paragraphs
        .replace(/<p class="mb-4"><\/p>/g, '')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.content.trim() ||
      !formData.excerpt.trim() ||
      !formData.featured_image.trim() ||
      formData.categories.length === 0
    ) {
      toast({
        title: 'Validation Error',
        description:
          'Please fill in all required fields (title, slug, excerpt, content, featured image, and category)',
        variant: 'destructive',
      });
      return;
    }

    // Validate slug format
    if (!isValidSlug(formData.slug)) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid slug (lowercase letters, numbers, and hyphens only)',
        variant: 'destructive',
      });
      return;
    }

    // Validate that exactly one category is provided
    if (formData.categories.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please enter exactly one category',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const url = isEditing ? `/api/blogs/manage/${editId}` : '/api/blogs/manage';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: 'Success',
          description: `Blog ${isEditing ? 'updated' : 'created'} successfully`,
        });

        // For new blogs, optionally redirect to the preview
        if (!isEditing && result.slug) {
          // Give user option to preview or go back to blogs
          setTimeout(() => {
            const shouldPreview = window.confirm(
              'Blog created successfully! Would you like to preview it now?',
            );
            if (shouldPreview) {
              window.open(`/blogs/${result.slug}`, '_blank');
            }
            router.push('/blogs');
          }, 1000);
        } else {
          router.push('/blogs');
        }
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || `Failed to ${isEditing ? 'update' : 'create'} blog`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'create'} blog`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show password dialog if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <section className="bg-card py-10 md:py-16">
          <AnimatedTechBackground />
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                <span className="heading-gradient">Authentication Required</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Please authenticate to access blog management features.
              </p>
            </div>
          </div>
        </section>

        <PasswordDialog
          open={showPasswordDialog}
          onOpenChange={(open) => {
            setShowPasswordDialog(open);
            if (!open) {
              handleAuthCancel();
            }
          }}
          onSuccess={handleAuthSuccess}
          title="Blog Management Authentication"
          description="Please enter the password to create or edit blog posts."
        />
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="bg-card py-10 md:py-16">
        <AnimatedTechBackground />
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <Link
              href="/blogs"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blogs
            </Link>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              <span className="heading-gradient">
                {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
              </span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {isEditing ? 'Update your blog post' : 'Share your thoughts with the community'}
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section-padding flex-1">
        <div className="container">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter blog title"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="slug">Slug *</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => handleInputChange('slug', e.target.value)}
                        placeholder="blog-post-slug"
                        required
                        className={
                          !isValidSlug(formData.slug) && formData.slug ? 'border-destructive' : ''
                        }
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        URL-friendly version of the title (lowercase letters, numbers, and hyphens
                        only)
                      </p>
                      {!isValidSlug(formData.slug) && formData.slug && (
                        <p className="text-sm text-destructive mt-1">
                          Slug must contain only lowercase letters, numbers, and hyphens
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="excerpt">Excerpt *</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) => handleInputChange('excerpt', e.target.value)}
                        placeholder="Brief description of the blog post"
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="content">Content *</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                        placeholder="Write your blog content here... (Supports Markdown)"
                        rows={15}
                        required
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        You can use Markdown formatting
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="categories">Category *</Label>
                      <Input
                        id="categories"
                        type="text"
                        placeholder="Enter category name (Press Enter to add)"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && tagInput.trim()) {
                            e.preventDefault();
                            if (formData.categories.length < 1) {
                              addTag(tagInput);
                              setTagInput('');
                            }
                          }
                        }}
                        disabled={formData.categories.length >= 1}
                        required
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Enter one category for this post
                      </p>

                      {formData.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.categories.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="flex items-center gap-1 px-2 py-1"
                            >
                              #{tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="featured_image">Featured Image URL *</Label>
                      <Input
                        id="featured_image"
                        value={formData.featured_image}
                        onChange={(e) => handleInputChange('featured_image', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        type="url"
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="published"
                        checked={formData.published}
                        onCheckedChange={(checked) => handleInputChange('published', checked)}
                      />
                      <Label htmlFor="published">Published</Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {isEditing ? 'Updating...' : 'Creating...'}
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Save className="mr-2 h-4 w-4" />
                            {isEditing ? 'Update Blog' : 'Create Blog'}
                          </div>
                        )}
                      </Button>

                      {(formData.title || formData.content) && (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={handlePreview}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-[90%] rounded lg:max-w-4xl h-[85vh] mt-8 flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Blog Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {/* Preview Header */}
            <div className="border-b pb-3">
              <h1 className="text-2xl font-bold mb-2">{formData.title || 'Untitled Blog Post'}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>Slug: /{formData.slug || 'no-slug'}</span>
                <span>Published: {formData.published ? 'Yes' : 'No'}</span>
                {formData.categories.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span>Category:</span>
                    {formData.categories.map((category, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{category}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Featured Image and Excerpt Side by Side */}
            {(formData.featured_image || formData.excerpt) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Featured Image */}
                {formData.featured_image && (
                  <div className="w-full">
                    <img
                      src={formData.featured_image}
                      alt={formData.title || 'Featured image'}
                      className="w-full aspect-video object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Excerpt */}
                {formData.excerpt && (
                  <div className="bg-muted p-3 rounded-lg">
                    <h3 className="font-semibold mb-2 text-sm">Excerpt</h3>
                    <p className="text-muted-foreground italic text-sm leading-relaxed">
                      {formData.excerpt}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div>
              <h3 className="font-semibold mb-2 text-sm">Content</h3>
              <div className="bg-card p-4 rounded-lg border prose prose-sm prose-neutral dark:prose-invert max-w-none">
                {formData.content ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatPreviewContent(formData.content),
                    }}
                  />
                ) : (
                  <p className="text-muted-foreground italic">No content yet...</p>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                * This is a basic preview with simple formatting. The actual blog will have full
                Markdown rendering.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
