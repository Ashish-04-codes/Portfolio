import React, { useState, useEffect } from 'react';
import { Mail, Coffee, ImageOff, MessageSquare } from 'lucide-react';
import { blogPostService, profileService } from '../services';
import { BlogPost, Profile } from '../models';
import { useAppNavigate } from '../hooks/useAppNavigate';

const EditorialPage: React.FC = () => {
    const navigate = useAppNavigate();
    const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    // Listen for storage changes (soft refresh - no loading spinner)
    useEffect(() => {
        const handleStorageChange = () => {
            Promise.all([
                blogPostService.getPublished(),
                profileService.get()
            ]).then(([publishedPosts, profileData]) => {
                const featured = publishedPosts.find(p => p.featured) || publishedPosts[0];
                setFeaturedPost(featured);
                setProfile(profileData);
            });
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('dataUpdated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('dataUpdated', handleStorageChange);
        };
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [publishedPosts, profileData] = await Promise.all([
            blogPostService.getPublished(),
            profileService.get()
        ]);

        // Get featured post or most recent
        const featured = publishedPosts.find(p => p.featured) || publishedPosts[0];
        setFeaturedPost(featured);
        setProfile(profileData);
        setLoading(false);
    };

    const renderContent = (post: BlogPost) => {
        return post.content.map((block, index) => {
            switch (block.type) {
                case 'paragraph':
                    return (
                        <p key={index} className={index === 0 ? 'drop-cap' : ''}>
                            {block.content}
                        </p>
                    );
                case 'blockquote':
                    return (
                        <blockquote key={index} className="border-l-4 border-ink pl-6 my-8 italic text-xl font-headline bg-surface py-4 pr-4">
                            {block.content}
                        </blockquote>
                    );
                case 'heading':
                    const level = block.level || 2;
                    const headingClass = "font-headline font-bold mt-8 mb-4";
                    if (level === 1) return <h1 key={index} className={headingClass}>{block.content}</h1>;
                    if (level === 2) return <h2 key={index} className={headingClass}>{block.content}</h2>;
                    if (level === 3) return <h3 key={index} className={headingClass}>{block.content}</h3>;
                    if (level === 4) return <h4 key={index} className={headingClass}>{block.content}</h4>;
                    if (level === 5) return <h5 key={index} className={headingClass}>{block.content}</h5>;
                    return <h6 key={index} className={headingClass}>{block.content}</h6>;
                case 'list':
                    return (
                        <ul key={index} className="list-disc list-inside space-y-2 my-4">
                            {block.content.split('\n').map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    );
                default:
                    return null;
            }
        });
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <p className="font-mono text-sm">Loading editorial content...</p>
            </div>
        );
    }

    if (!featuredPost) {
        return (
            <div className="text-center py-12">
                <p className="font-mono text-sm mb-4">No blog posts available yet.</p>
                <p className="text-xs text-ink/60">Add blog posts in the admin panel to see them here.</p>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div>
            <div className="border-b-2 border-ink mb-8 pb-4 text-center">
                <h2 className="font-sans font-black text-4xl uppercase tracking-tighter w-full">Technical Insights</h2>
                <div className="flex justify-center mt-2">
                    <span className="bg-ink text-newsprint px-2 py-0.5 text-xs font-mono uppercase tracking-widest">Engineering Blog & Thoughts</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                {/* Main Article */}
                <div className="lg:col-span-8 lg:border-r border-ink lg:pr-12">
                    <article className="prose prose-lg max-w-none text-ink">
                        <div className="mb-6">
                            <span className="font-mono text-xs uppercase tracking-widest border-b border-ink pb-1 mb-2 inline-block">
                                {featuredPost.featured ? 'Featured Article' : 'Latest Article'}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-headline font-bold leading-none mb-4 mt-2">
                                {featuredPost.title}
                            </h1>
                            {featuredPost.subtitle && (
                                <h3 className="text-xl md:text-2xl font-headline italic text-ink-light leading-snug mb-6">
                                    {featuredPost.subtitle}
                                </h3>
                            )}
                            <div className="flex items-center justify-between border-y border-ink py-2 mb-8 font-sans text-xs uppercase tracking-widest">
                                <span>By {featuredPost.author}</span>
                                <span>{formatDate(featuredPost.publishDate)}</span>
                                <span>{featuredPost.readTime}</span>
                            </div>
                        </div>

                        {featuredPost.featuredImage && (
                            <div className="mb-8">
                                <img
                                    src={featuredPost.featuredImage}
                                    alt={featuredPost.title}
                                    className="w-full h-64 object-cover border border-ink"
                                />
                            </div>
                        )}

                        <div className="font-body text-lg leading-relaxed text-justify space-y-6">
                            {renderContent(featuredPost)}
                        </div>

                        <div className="mt-12 pt-8 border-t border-dashed border-ink flex items-center justify-end">
                            <div className="text-right">
                                <div className="text-3xl font-bold font-masthead italic">
                                    {profile?.name || 'The Daily Developer'}
                                </div>
                                <p className="text-xs font-mono uppercase mt-1">
                                    {profile?.title || 'Editor-in-Chief'}
                                </p>
                            </div>
                        </div>
                    </article>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Letters / Comments */}
                    <div className="bg-surface p-6 border border-ink shadow-[4px_4px_0px_0px_rgba(20,20,20,0.2)]">
                        <div className="border-b-2 border-ink mb-4 pb-2 flex justify-between items-end">
                            <h3 className="font-sans font-black text-xl uppercase">Recent Comments</h3>
                            <MessageSquare size={20} />
                        </div>
                        <div className="space-y-6">
                            <div className="pb-4 border-b border-dashed border-ink/40 last:border-0">
                                <h4 className="font-headline font-bold text-lg leading-tight mb-1">"Re: Dark Mode"</h4>
                                <p className="font-body text-sm leading-snug mb-2">
                                    "Great insights on accessibility standards. We implemented your suggestion and saw engagement rise."
                                </p>
                                <p className="font-mono text-xs text-right opacity-70">— Sarah J., <span className="italic">CTO</span></p>
                            </div>
                            <div className="pb-4 border-b border-dashed border-ink/40 last:border-0">
                                <h4 className="font-headline font-bold text-lg leading-tight mb-1">"Re: Architecture"</h4>
                                <p className="font-body text-sm leading-snug mb-2">
                                    "Finally someone said it. The churn in JS frameworks is exhausting."
                                </p>
                                <p className="font-mono text-xs text-right opacity-70">— Mike R., <span className="italic">Lead Dev</span></p>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-ink text-center">
                            <button onClick={() => navigate('contact')} className="w-full py-2 bg-ink text-newsprint font-mono text-xs uppercase tracking-widest hover:bg-transparent hover:text-ink border border-ink transition-colors">
                                Start a Discussion
                            </button>
                        </div>
                    </div>

                    {/* Ad / Promo */}
                    <div className="border-4 border-double border-ink p-4 text-center bg-surface opacity-90">
                        <p className="font-sans text-[10px] uppercase tracking-widest mb-2 border-b border-ink inline-block">Work With Me</p>
                        <h4 className="font-headline font-bold text-2xl uppercase leading-none mb-2">Freelance</h4>
                        <p className="font-headline italic text-sm mb-4">Accepting commissions for Q4 2024.</p>
                        <div className="w-16 h-16 mx-auto bg-ink text-newsprint rounded-full flex items-center justify-center mb-2">
                            <Coffee size={24} />
                        </div>
                        <p className="font-mono text-xs uppercase">Consulting & Dev</p>
                    </div>

                    {/* Comic Strip / Humor */}
                    <div className="relative border border-ink p-2 bg-surface transform rotate-1 hover:rotate-0 transition-transform">
                        <div className="absolute -top-3 -right-3 bg-ink text-newsprint text-xs font-mono px-2 py-1 rotate-3">Weekly Humor</div>
                        <div className="h-48 bg-newsprint-dark flex items-center justify-center border border-dashed border-gray-400">
                            <div className="text-center p-4">
                                <ImageOff size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="font-mono text-xs opacity-50">[Comic Loading...]</p>
                                <p className="font-headline italic text-xs mt-1">"It works on my machine"</p>
                            </div>
                        </div>
                        <p className="text-[10px] font-mono text-center mt-2 uppercase">Fig 2. The Daily Struggle</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EditorialPage;
