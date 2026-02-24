import React, { useState, useEffect } from 'react';
import { Scissors, Stamp, Send, Mail, Github, Linkedin, Twitter, Globe } from 'lucide-react';
import { profileService } from '../services';
import { Profile } from '../models';
import { ContactPageSkeleton } from '../components/PublicSkeletons';

const ContactPage: React.FC = () => {
    const [isStamped, setIsStamped] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    // Listen for storage changes (soft refresh - no loading spinner)
    useEffect(() => {
        const handleStorageChange = () => {
            profileService.get().then((profileData) => {
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

    const loadProfile = async () => {
        setLoading(true);
        const profileData = await profileService.get();
        setProfile(profileData);
        setLoading(false);
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would send the form data
        // For now, just show the stamp animation
        setIsStamped(true);
        setTimeout(() => setIsStamped(false), 3000);
    };

    if (loading) {
        return <ContactPageSkeleton />;
    }

    return (
        <div className="flex items-center justify-center py-8 min-h-[60vh]">

            {/* The Cut-Out Slip */}
            <div className="relative w-full max-w-2xl mx-auto bg-surface p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)] transform rotate-1 transition-all hover:rotate-0 duration-500 animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-700 ease-out">

                {/* Scissors Indicator */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-surface px-4 text-ink z-20 flex flex-col items-center">
                    <Scissors className="text-ink transform rotate-90" size={24} />
                    <span className="text-[10px] font-mono uppercase tracking-widest mt-1">Cut Here</span>
                </div>

                {/* Dashed Border */}
                <div className="absolute inset-0 border-[3px] border-dashed border-ink pointer-events-none m-1"></div>

                {/* Form Content */}
                <div className="relative z-10 space-y-8">

                    {/* Header */}
                    <div className="text-center space-y-4 border-b-2 border-ink pb-6">
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none font-headline">
                            Correspondence Dept.
                        </h2>
                        <p className="font-headline italic text-lg md:text-xl max-w-lg mx-auto leading-relaxed text-ink/80">
                            {profile?.bio?.split('\n')[0] || "Seeking a digital architect? Fill out the slip below and post it immediately for a prompt telegraph response."}
                        </p>

                        {/* Contact Methods */}
                        {profile && (
                            <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-dashed border-ink mt-4">
                                {profile.email && (
                                    <a
                                        href={`mailto:${profile.email}`}
                                        className="flex items-center gap-2 px-3 py-1 border border-ink hover:bg-ink hover:text-newsprint transition-colors font-mono text-xs"
                                    >
                                        <Mail size={14} /> Email
                                    </a>
                                )}
                                {profile.github && (
                                    <a
                                        href={profile.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-1 border border-ink hover:bg-ink hover:text-newsprint transition-colors font-mono text-xs"
                                    >
                                        <Github size={14} /> GitHub
                                    </a>
                                )}
                                {profile.linkedin && (
                                    <a
                                        href={profile.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-1 border border-ink hover:bg-ink hover:text-newsprint transition-colors font-mono text-xs"
                                    >
                                        <Linkedin size={14} /> LinkedIn
                                    </a>
                                )}
                                {profile.twitter && (
                                    <a
                                        href={profile.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-1 border border-ink hover:bg-ink hover:text-newsprint transition-colors font-mono text-xs"
                                    >
                                        <Twitter size={14} /> Twitter
                                    </a>
                                )}
                                {profile.website && (
                                    <a
                                        href={profile.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-1 border border-ink hover:bg-ink hover:text-newsprint transition-colors font-mono text-xs"
                                    >
                                        <Globe size={14} /> Website
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Form */}
                    <form className="space-y-8 mt-8" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

                            {/* Name */}
                            <div className="group">
                                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest mb-2 font-mono group-focus-within:text-ink-light transition-colors">01. Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="e.g. John Doe"
                                    className="w-full bg-transparent border-b border-ink p-2 font-mono text-lg placeholder-ink-light/30 focus:outline-none focus:border-b-2 transition-all"
                                />
                            </div>

                            {/* Email */}
                            <div className="group">
                                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest mb-2 font-mono group-focus-within:text-ink-light transition-colors">02. Return Address (Email)</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="name@company.com"
                                    className="w-full bg-transparent border-b border-ink p-2 font-mono text-lg placeholder-ink-light/30 focus:outline-none focus:border-b-2 transition-all"
                                />
                            </div>
                        </div>

                        {/* Nature of Inquiry */}
                        <div className="space-y-3">
                            <span className="block text-xs font-bold uppercase tracking-widest mb-1 font-mono">03. Nature of Inquiry</span>
                            <div className="flex flex-wrap gap-6 font-mono text-sm">
                                <label className="flex items-center space-x-2 cursor-pointer group select-none">
                                    <input type="radio" name="topic" className="hidden peer" defaultChecked />
                                    <div className="w-4 h-4 border border-ink rounded-full flex items-center justify-center group-hover:bg-ink/10 transition-colors">
                                        <div className="w-2 h-2 bg-ink rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                                    </div>
                                    <span>Project Proposal</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer group select-none">
                                    <input type="radio" name="topic" className="hidden peer" />
                                    <div className="w-4 h-4 border border-ink rounded-full flex items-center justify-center group-hover:bg-ink/10 transition-colors">
                                        <div className="w-2 h-2 bg-ink rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                                    </div>
                                    <span>Employment Offer</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer group select-none">
                                    <input type="radio" name="topic" className="hidden peer" />
                                    <div className="w-4 h-4 border border-ink rounded-full flex items-center justify-center group-hover:bg-ink/10 transition-colors">
                                        <div className="w-2 h-2 bg-ink rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                                    </div>
                                    <span>Fan Mail</span>
                                </label>
                            </div>
                        </div>

                        {/* Message Area */}
                        <div className="group relative">
                            <label htmlFor="message" className="block text-xs font-bold uppercase tracking-widest mb-2 font-mono group-focus-within:text-ink-light transition-colors">04. Your Story (Message)</label>
                            <div className="relative w-full">
                                <textarea
                                    id="message"
                                    rows={5}
                                    placeholder="Start typing here..."
                                    className="w-full bg-transparent border border-ink p-4 font-mono text-lg leading-8 resize-none focus:outline-none focus:ring-1 focus:ring-ink focus:border-ink transition-all placeholder-ink-light/30"
                                    style={{
                                        backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgb(var(--rgb-ink) / 0.1) 31px, rgb(var(--rgb-ink) / 0.1) 32px)',
                                        lineHeight: '32px',
                                        padding: '8px 12px'
                                    }}
                                ></textarea>
                            </div>
                            <p className="text-[10px] text-right mt-1 font-mono italic opacity-60">* Please print clearly in black ink.</p>
                        </div>

                        {/* Footer / Submit */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
                            <div className="flex items-center gap-4 order-2 md:order-1">

                                {/* Interactive Stamp Box */}
                                <div
                                    onClick={() => !isStamped && setIsStamped(true)}
                                    className={`relative w-24 h-28 border-2 ${isStamped ? 'border-solid border-ink' : 'border-dotted border-ink/40'} flex items-center justify-center rotate-[-2deg] transition-all duration-300 ${!isStamped ? 'cursor-pointer hover:bg-ink/5 hover:scale-105' : 'cursor-default'} bg-surface overflow-hidden group/stamp`}
                                    title={isStamped ? "Postage Paid" : "Click to add postage"}
                                >
                                    {/* Placeholder Text */}
                                    <div className={`text-[10px] font-mono text-center leading-tight uppercase transition-opacity duration-300 ${isStamped ? 'opacity-0' : 'opacity-50 group-hover/stamp:opacity-80'}`}>
                                        Place<br />Stamp<br />Here
                                    </div>

                                    {/* The Stamp Graphic */}
                                    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isStamped ? 'opacity-100 scale-100 rotate-[-12deg]' : 'opacity-0 scale-[2.0] rotate-12'}`}>
                                        <div className="w-20 h-20 rounded-full border-4 border-double border-ink flex flex-col items-center justify-center text-ink bg-ink/5 p-1 mask-ink shadow-sm">
                                            <Stamp size={28} />
                                            <span className="text-[8px] font-bold font-mono uppercase mt-1 tracking-widest">Postage<br />Paid</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-xs max-w-[200px] font-headline italic leading-tight opacity-80">
                                    By posting this letter, you agree to receive a digital response within 1-2 business days.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="order-1 md:order-2 w-full md:w-auto bg-ink text-newsprint hover:bg-surface hover:text-ink border-2 border-ink transition-all duration-300 py-4 px-10 font-mono font-bold uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none translate-y-0 hover:translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!isStamped}
                                title={!isStamped ? "Please place a stamp first" : "Send message"}
                            >
                                Post Letter <Send size={16} className={isStamped ? 'animate-pulse' : ''} />
                            </button>
                        </div>

                    </form>
                </div>

                {/* Corner Decorative Marks */}
                <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-ink"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-ink"></div>
            </div>
        </div>
    );
};

export default ContactPage;
