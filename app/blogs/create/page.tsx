'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import AnimatedTechBackground from '@/components/animated-tech-background';
import PasswordDialog from '@/components/password-dialog';
import { useBlogAuth } from '@/hooks/use-blog-auth';

interface Category {
	id: string;
	name: string;
	slug: string;
}

interface BlogFormData {
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	featured_image: string;
	category_id: string;
	published: boolean;
}

export default function CreateEditBlogPage() {
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
		category_id: '',
		published: false,
	});

	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(isEditing);

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

	// Fetch categories
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await fetch('/api/blogs/categories/all');
				if (response.ok) {
					const data = await response.json();
					setCategories(data);
				}
			} catch (error) {
				console.error('Error fetching categories:', error);
			}
		};
		fetchCategories();
	}, []);

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
							category_id: data.category_id || '',
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

	const handleInputChange = (field: keyof BlogFormData, value: string | boolean) => {
		setFormData(prev => {
			const updated = { ...prev, [field]: value };
			
			// Auto-generate slug when title changes (only for new blogs)
			if (field === 'title' && !isEditing && typeof value === 'string') {
				updated.slug = generateSlug(value);
			}
			
			return updated;
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!formData.title.trim() || !formData.content.trim() || !formData.category_id) {
			toast({
				title: 'Validation Error',
				description: 'Please fill in all required fields',
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
				toast({
					title: 'Success',
					description: `Blog ${isEditing ? 'updated' : 'created'} successfully`,
				});
				router.push('/blogs');
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
								<span className="heading-gradient">
									Authentication Required
								</span>
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
					<div className="mx-auto max-w-3xl">
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
				<div className="container max-w-4xl">
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
											/>
											<p className="text-sm text-muted-foreground mt-1">
												URL-friendly version of the title
											</p>
										</div>

										<div>
											<Label htmlFor="excerpt">Excerpt</Label>
											<Textarea
												id="excerpt"
												value={formData.excerpt}
												onChange={(e) => handleInputChange('excerpt', e.target.value)}
												placeholder="Brief description of the blog post"
												rows={3}
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
											<Label htmlFor="category">Category *</Label>
											<Select
												value={formData.category_id}
												onValueChange={(value) => handleInputChange('category_id', value)}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select category" />
												</SelectTrigger>
												<SelectContent>
													{categories.map((category) => (
														<SelectItem key={category.id} value={category.id}>
															{category.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										<div>
											<Label htmlFor="featured_image">Featured Image URL</Label>
											<Input
												id="featured_image"
												value={formData.featured_image}
												onChange={(e) => handleInputChange('featured_image', e.target.value)}
												placeholder="https://example.com/image.jpg"
												type="url"
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
											<Button
												type="submit"
												className="w-full"
												disabled={loading}
											>
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

											{formData.slug && (
												<Button
													type="button"
													variant="outline"
													className="w-full"
													onClick={() => window.open(`/blogs/${formData.slug}`, '_blank')}
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
		</div>
	);
}