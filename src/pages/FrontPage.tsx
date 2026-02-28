import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from '../types';
import { ArrowRight, Cloud, Sun, Terminal, Database, TrendingUp, TrendingDown } from 'lucide-react';
import { profileService, skillService } from '../services';
import { Profile, Skill } from '../models';
import { FrontPageSkeleton } from '../components/PublicSkeletons';
import { useSiteConfig } from '../context/SiteConfigContext';

interface FrontPageProps { }

const FrontPage: React.FC<FrontPageProps> = () => {
    const navigate = useNavigate();
    const { heroTitle, heroSubtitle, heroImage, availableForWork, availabilityMessage } = useSiteConfig();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []); // Loads on mount and when data changes via storage events

    const loadData = async () => {
        setLoading(true);
        const [profileData, skillsData] = await Promise.all([
            profileService.get(),
            skillService.getFeatured()
        ]);
        setProfile(profileData);
        setSkills(skillsData.slice(0, 4)); // Top 4 skills for market watch
        setLoading(false);
    };



    // Listen for storage changes (soft refresh - no loading spinner)
    useEffect(() => {
        const handleStorageChange = () => {
            Promise.all([
                profileService.get(),
                skillService.getFeatured()
            ]).then(([profileData, skillsData]) => {
                setProfile(profileData);
                setSkills(skillsData.slice(0, 4));
            });
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('dataUpdated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('dataUpdated', handleStorageChange);
        };
    }, []);

    if (loading) {
        return <FrontPageSkeleton />;
    }

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'bullish': return { icon: <TrendingUp size={10} />, color: 'text-green-600', label: 'Bullish' };
            case 'high': return { icon: <TrendingUp size={10} />, color: 'text-green-600', label: 'High' };
            case 'stable': return { icon: <TrendingUp size={10} />, color: 'text-green-600', label: 'Stable' };
            case 'bearish': return { icon: <TrendingDown size={10} />, color: 'text-red-600', label: 'Bearish' };
            case 'declining': return { icon: <TrendingDown size={10} />, color: 'text-red-600', label: 'Declining' };
            default: return { icon: <TrendingUp size={10} />, color: 'text-gray-600', label: 'Stable' };
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

            {/* Left Sidebar */}
            <aside className="lg:col-span-3 space-y-8 lg:border-r border-ink lg:pr-8">
                {/* Tech Market Watch */}
                <div className="border border-ink p-4 bg-surface shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] dark:shadow-[4px_4px_0px_0px_rgba(244,241,234,0.5)] transition-colors">
                    <h3 className="font-mono font-bold uppercase text-xs border-b border-ink mb-3 pb-2 text-center">Skill Market Watch</h3>
                    <div className="space-y-3 text-xs font-mono">
                        {skills.length > 0 ? (
                            skills.map(skill => {
                                const trend = getTrendIcon(skill.trend);
                                return (
                                    <div key={skill.id} className="flex justify-between items-center">
                                        <span className="flex items-center gap-2">
                                            <Terminal size={14} /> {skill.name}
                                        </span>
                                        <span className={`font-bold flex items-center gap-1 ${trend.color}`}>
                                            {trend.label} {trend.icon}
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-2"><Terminal size={14} /> React.js</span>
                                    <span className="font-bold text-green-600 flex items-center gap-1">Bullish <TrendingUp size={10} /></span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-2"><Sun size={14} /> TypeScript</span>
                                    <span className="font-bold text-green-600 flex items-center gap-1">High <TrendingUp size={10} /></span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Index / Navigation */}
                <div>
                    <h3 className="font-sans font-bold uppercase text-xs tracking-widest mb-3 border-b-2 border-double border-ink pb-1">Index</h3>
                    <ul className="text-sm font-headline leading-snug space-y-2">
                        <li className="flex justify-between border-b border-dotted border-ink-light pb-1 cursor-pointer hover:bg-ink/5" onClick={() => navigate('about')}>
                            <span>Bio & Background</span>
                            <span>p. 2</span>
                        </li>
                        <li className="flex justify-between border-b border-dotted border-ink-light pb-1 cursor-pointer hover:bg-ink/5" onClick={() => navigate('classifieds')}>
                            <span>Selected Works</span>
                            <span>p. 4</span>
                        </li>
                        <li className="flex justify-between border-b border-dotted border-ink-light pb-1 cursor-pointer hover:bg-ink/5" onClick={() => navigate('editorial')}>
                            <span>Engineering Blog</span>
                            <span>p. 5</span>
                        </li>
                        <li className="flex justify-between border-b border-dotted border-ink-light pb-1 cursor-pointer hover:bg-ink/5" onClick={() => navigate('contact')}>
                            <span>Contact Info</span>
                            <span>p. 8</span>
                        </li>
                    </ul>
                </div>

                {/* Availability Status */}
                {availableForWork && (
                    <div className="border-2 border-ink border-dashed p-6 text-center rotate-1 hover:rotate-0 transition-transform duration-300 bg-surface">
                        <p className="font-mono text-[10px] uppercase mb-2">Notice</p>
                        <p className="font-headline font-bold italic text-lg leading-tight">"{availabilityMessage || 'Available for Full-time Roles & Freelance Commissions'}"</p>
                        <button onClick={() => navigate('contact')} className="font-mono text-xs mt-4 font-bold border-b border-ink hover:text-ink-light">Inquire Within</button>
                    </div>
                )}
            </aside>

            {/* Main Feature Story */}
            <article className="col-span-full lg:col-span-6 border-r-0 lg:border-r border-ink p-8 md:p-12">
                <div className="text-center max-w-4xl mx-auto">
                    <span className="inline-block border-b border-ink text-xs font-bold uppercase tracking-widest mb-3">{heroSubtitle || 'Portfolio Launched'}</span>
                    <h2 className="font-headline font-black text-5xl md:text-7xl leading-[0.9] uppercase mb-4 tracking-tighter">
                        {heroTitle || 'Full-Stack Engineer Redefines User Experience'}
                    </h2>
                    <div className="flex justify-center items-center gap-4 text-xs font-mono uppercase text-ink-light mb-6">
                        <span>By {profile?.name || '[Your Name]'}</span>
                        <span>•</span>
                        <span>{profile?.location || 'San Francisco'}</span>
                        <span>•</span>
                        <span>{profile?.vitals?.experience || '5 Years Exp.'}</span>
                    </div>
                </div>

                <figure className="mb-8 relative border border-ink p-1 bg-surface shadow-sm">
                    <div className="halftone h-64 md:h-80 w-full overflow-hidden">
                        <img
                            src={heroImage || "https://picsum.photos/800/600?grayscale"}
                            alt="Developer Desk"
                            className="w-full h-full object-cover grayscale contrast-125 brightness-90 hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                    <figcaption className="text-[10px] font-mono mt-1 text-right uppercase text-ink-light">Fig 1. Where ideas become reality.</figcaption>
                </figure>

                <div className="font-body text-lg leading-relaxed text-justify space-y-4">
                    <p className="drop-cap">
                        In a digital landscape often cluttered with complexity, one developer is making a case for clarity, performance, and robust architecture. Specializing in the React ecosystem and modern backend technologies, I build applications that not only function flawlessly but delight users with their intuitive design.
                    </p>
                    <p>
                        "It's about bridging the gap between design and engineering," says the developer. "Great software feels invisible. It just works." This philosophy has driven the successful delivery of numerous high-impact projects, from enterprise dashboards to consumer-facing e-commerce platforms.
                    </p>
                    <p>
                        With a strong foundation in Computer Science and a passion for continuous learning, my work is characterized by clean code, comprehensive testing, and an obsession with accessibility.
                    </p>
                    <div className="border-t-4 border-double border-ink my-6"></div>
                    <h4 className="font-bold font-headline uppercase text-xl mb-2">Core Competencies</h4>
                    <p>
                        My expertise spans the full development lifecycle. Whether it's architecting a microservices backend in Node.js, crafting a pixel-perfect UI with Tailwind CSS, or optimizing frontend performance, I bring a holistic approach to every challenge.
                    </p>
                </div>
            </article>

            {/* Right Sidebar */}
            <aside className="lg:col-span-3 space-y-8 lg:border-l border-ink lg:pl-8">

                {/* Blog Teaser */}
                <div className="border-b border-ink pb-6">
                    <h3 className="font-headline font-bold text-2xl mb-2 italic leading-tight">Op-Ed: The Future of Frontend</h3>
                    <p className="font-body text-sm mb-4 leading-normal">
                        Why server-side rendering is making a comeback and what it means for your next project.
                    </p>
                    <button onClick={() => navigate('editorial')} className="text-xs font-bold uppercase underline decoration-1 underline-offset-2 hover:bg-ink hover:text-newsprint inline-block transition-colors">Read Article <ArrowRight className="inline w-3 h-3 ml-1" /></button>
                </div>

                {/* Featured Projects Box */}
                <div className="bg-ink text-newsprint p-4">
                    <div className="border border-current p-2 text-center mb-4 opacity-80">
                        <h3 className="font-mono font-bold uppercase text-sm tracking-widest">Selected Works</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="group cursor-pointer" onClick={() => navigate('classifieds')}>
                            <h4 className="font-bold font-sans text-sm uppercase mb-1 group-hover:underline">FinTech Dashboard</h4>
                            <p className="text-xs font-serif leading-snug mb-1 opacity-80">Real-time data visualization for enterprise clients.</p>
                            <span className="text-[9px] font-mono border border-current px-1 inline-block mt-1 opacity-60">React / D3.js</span>
                        </div>

                        <div className="w-full h-px bg-current opacity-30"></div>

                        <div className="group cursor-pointer" onClick={() => navigate('classifieds')}>
                            <h4 className="font-bold font-sans text-sm uppercase mb-1 group-hover:underline">E-Commerce API</h4>
                            <p className="text-xs font-serif leading-snug mb-1 opacity-80">High-performance headless architecture.</p>
                            <span className="text-[9px] font-mono border border-current px-1 inline-block mt-1 opacity-60">Node / GraphQL</span>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <button onClick={() => navigate('classifieds')} className="w-full font-mono text-xs border-2 border-current px-4 py-2 hover:bg-newsprint hover:text-ink transition-colors uppercase font-bold">View Catalog</button>
                    </div>
                </div>

                {/* Testimonial / Philosophy */}
                <div className="border-4 border-ink p-1">
                    <div className="border border-ink p-4">
                        <blockquote className="font-headline italic text-center text-lg leading-tight">
                            "The code you write is your legacy. Make it readable, maintainable, and meaningful."
                        </blockquote>
                    </div>
                </div>

            </aside>
        </div>
    );
};

export default FrontPage;
