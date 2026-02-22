import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { profileService, skillService } from '../services';
import { Profile, Skill } from '../models';
import { useAppNavigate } from '../hooks/useAppNavigate';
import { logger } from '../utils/logger';

const AboutPage: React.FC = () => {
  const navigate = useAppNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []); // Loads on mount

  // Listen for storage changes (soft refresh - no loading spinner)
  useEffect(() => {
    const handleStorageChange = () => {
      Promise.all([profileService.get(), skillService.getFeatured()]).then(
        ([profileData, skillsData]) => {
          logger.debug('[AboutPage] Soft refresh', {
            profile: profileData
              ? { name: profileData.name, title: profileData.title, location: profileData.location }
              : null,
          });
          setProfile(profileData);
          setSkills(skillsData.slice(0, 8));
        }
      );
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
    const [profileData, skillsData] = await Promise.all([
      profileService.get(),
      skillService.getFeatured(),
    ]);
    logger.debug('[AboutPage] Loaded profile', {
      profile: profileData
        ? { name: profileData.name, title: profileData.title, location: profileData.location }
        : null,
    });
    setProfile(profileData);
    setSkills(skillsData.slice(0, 8)); // Top 8 skills
    setLoading(false);
  };

  if (loading) {
    return (
      <article className="bg-surface p-4 md:p-8 shadow-sm border border-ink/10 transition-colors">
        <div className="text-center py-12">
          <p className="font-mono text-sm">Loading profile...</p>
        </div>
      </article>
    );
  }

  if (!profile) {
    return (
      <article className="bg-surface p-4 md:p-8 shadow-sm border border-ink/10 transition-colors">
        <div className="text-center py-12">
          <p className="font-mono text-sm mb-4">No profile data found.</p>
          <p className="text-xs text-ink/60">Please set up your profile in the admin panel.</p>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-surface p-4 md:p-8 shadow-sm border border-ink/10 transition-colors">
      {/* Header */}
      <header className="mb-8 border-b-2 border-ink pb-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-2">
          <span className="h-px w-12 bg-ink"></span>
          <span className="font-mono text-xs font-bold uppercase tracking-widest bg-ink text-newsprint px-2 py-0.5">
            Profile
          </span>
          <span className="h-px w-12 bg-ink"></span>
        </div>
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black font-headline uppercase leading-[0.9] tracking-tighter mb-4">
          The Developer
          <br />
          <span className="italic font-headline font-light text-4xl md:text-6xl lg:text-7xl normal-case tracking-normal block mt-2">
            Behind The Code
          </span>
        </h2>
        <div className="flex flex-col md:flex-row justify-between items-center text-sm font-mono mt-6 pt-2 border-t border-ink/30 max-w-4xl mx-auto">
          <span className="uppercase">Subject: {profile.name}</span>
          <span className="italic">Role: {profile.title}</span>
          <span className="uppercase">{profile.location}</span>
        </div>
      </header>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        {/* Left Column (Image & Intro) */}
        <div className="md:col-span-4 space-y-6 md:border-r border-ink/20 md:pr-8">
          <figure className="mb-6 relative group cursor-crosshair">
            <div className="absolute inset-0 border border-ink translate-x-1 translate-y-1 bg-ink z-0"></div>
            <div className="relative z-10 border border-ink bg-surface p-1 halftone overflow-hidden h-[400px]">
              <img
                src={profile.profileImage || 'https://picsum.photos/400/500?grayscale'}
                alt={profile.name}
                className="w-full h-full object-cover grayscale contrast-125 hover:scale-105 transition-transform duration-700"
              />
            </div>
            <figcaption className="mt-2 text-[10px] font-mono uppercase tracking-wider text-right border-b border-ink/20 pb-1">
              Fig 1.1: Portrait of the Engineer
            </figcaption>
          </figure>

          <div className="font-body text-lg leading-relaxed text-justify">
            {profile.bio.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className={idx === 0 ? '' : 'mt-4 indent-4'}>
                {idx === 0 && (
                  <span className="float-left text-6xl font-headline font-black leading-[0.8] mr-2 pt-1">
                    {paragraph.charAt(0)}
                  </span>
                )}
                {idx === 0 ? paragraph.slice(1) : paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Middle Column (Q&A / Bio) */}
        <div className="md:col-span-5 space-y-8">
          {profile.sections && profile.sections.length > 0 ? (
            profile.sections
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <div key={section.id} className="space-y-2">
                  <h3 className="font-mono text-sm font-bold uppercase tracking-widest border-b border-ink inline-block mb-1">
                    {section.heading}
                  </h3>
                  <p className="font-bold font-headline text-xl">{section.subheading}</p>
                  <p className="font-body text-lg leading-relaxed text-ink/90 text-justify">
                    {section.content}
                  </p>
                </div>
              ))
          ) : (
            <div className="space-y-2">
              <h3 className="font-mono text-sm font-bold uppercase tracking-widest border-b border-ink inline-block mb-1">
                About Me
              </h3>
              <p className="font-body text-lg leading-relaxed text-ink/90 text-justify">
                Add sections to your profile in the admin panel to customize this area.
              </p>
            </div>
          )}
        </div>

        {/* Right Column (Vitals Sidebar) */}
        <div className="md:col-span-3 border-l border-ink/20 pl-0 md:pl-8 flex flex-col gap-8">
          {/* Vitals Card */}
          <div className="border-2 border-ink p-4 bg-newsprint relative shadow-[4px_4px_0_0_rgba(var(--rgb-ink),1)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-newsprint px-2 font-mono text-xs font-bold uppercase border-x border-ink/10">
              Vitals
            </div>
            <ul className="space-y-3 font-mono text-sm">
              {profile.vitals?.experience && (
                <li className="flex justify-between border-b border-dotted border-ink pb-1">
                  <span>Exp.</span>
                  <strong>{profile.vitals.experience}</strong>
                </li>
              )}
              {profile.vitals?.level && (
                <li className="flex justify-between border-b border-dotted border-ink pb-1">
                  <span>Level</span>
                  <strong>{profile.vitals.level}</strong>
                </li>
              )}
              {profile.vitals?.location && (
                <li className="flex justify-between border-b border-dotted border-ink pb-1">
                  <span>Loc.</span>
                  <strong>{profile.vitals.location}</strong>
                </li>
              )}
              {profile.vitals?.status && (
                <li className="flex justify-between border-b border-dotted border-ink pb-1">
                  <span>Status</span>
                  <strong>{profile.vitals.status}</strong>
                </li>
              )}
            </ul>
          </div>

          {skills.length > 0 && (
            <div className="text-center space-y-2 opacity-80 mt-4">
              <div className="w-full h-px bg-ink"></div>
              <h4 className="font-headline font-bold italic">Toolbox</h4>
              <div className="flex flex-wrap justify-center gap-2 text-xs font-mono uppercase">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="border border-ink px-2 py-1 hover:bg-ink hover:text-newsprint transition-colors cursor-default"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
              <div className="w-full h-px bg-ink"></div>
            </div>
          )}

          <div className="mt-auto pt-12 text-right">
            <button
              onClick={() => navigate('classifieds')}
              className="group inline-flex items-center gap-2 font-bold font-mono text-xs uppercase tracking-widest hover:underline"
            >
              <span>See Projects</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="mt-2 text-[10px] font-mono italic opacity-60">
              Turn to Page 4 for Catalog
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default AboutPage;
