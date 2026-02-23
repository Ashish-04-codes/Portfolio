import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Code,
  FolderOpen,
  X,
  Globe,
  Github,
  Layers,
  Cpu,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { projectService } from '../services';
import { Project } from '../models';
import { useAppNavigate } from '../hooks/useAppNavigate';

// Data Models
type ProjectLayout =
  | 'featured'
  | 'standard'
  | 'inverted'
  | 'text-only'
  | 'sidebar-image'
  | 'placeholder';

type ProjectItem = Project;

// ProjectModal Component
interface ProjectModalProps {
  project: ProjectItem;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const allImages = [
    ...(project.image ? [project.image] : []),
    ...(project.images || []).filter((img) => img !== project.image),
  ];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // 300ms matches duration-300
  };

  if (!project) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-ink/60 backdrop-blur-sm transition-all duration-300 ${isClosing ? 'opacity-0' : 'animate-in fade-in'
          }`}
        onClick={handleClose}
      />

      {/* Modal Content - "The Case File" */}
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-newsprint border-4 border-double border-ink shadow-[10px_10px_0px_0px_rgba(0,0,0,0.5)] flex flex-col duration-300 ${isClosing
            ? 'animate-out fade-out slide-out-to-bottom-4'
            : 'animate-in fade-in slide-in-from-bottom-4'
          }`}
      >
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-50 bg-[url('/cream-paper.png')] mix-blend-multiply"></div>

        {/* Header Ribbon */}
        <div className="sticky top-0 z-10 bg-newsprint border-b border-ink p-4 flex justify-between items-center select-none">
          <div className="flex gap-4 items-center">
            <div className="bg-ink text-newsprint px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest">
              Case File: #{project.id.toUpperCase()}
            </div>
            <span className="font-mono text-xs font-bold hidden sm:inline-block">
              Filed: {project.year}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="group flex items-center gap-2 font-mono text-xs font-bold uppercase hover:bg-ink hover:text-newsprint px-2 py-1 border border-transparent hover:border-ink transition-all"
          >
            <span>Close File</span>
            <div className="border border-ink p-0.5 group-hover:border-newsprint">
              <X size={14} />
            </div>
          </button>
        </div>

        {/* Main Body */}
        <div className="p-6 md:p-10 relative z-0">
          {/* Title Section */}
          <div className="text-center mb-8">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-light border-b border-ink pb-1 mb-2 inline-block">
              {project.category}
            </span>
            <h2 className="text-4xl md:text-6xl font-headline font-black uppercase leading-none tracking-tight mb-4">
              {project.title}
            </h2>
            <p className="font-headline italic text-lg md:text-xl opacity-80 max-w-2xl mx-auto">
              "{project.shortDesc}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column: Details */}
            <div className="md:col-span-8 space-y-8">
              {/* Image(s) */}
              {allImages.length > 0 && (
                <div className="space-y-3">
                  {/* Main Active Image */}
                  <div className="w-full border-2 border-ink p-1 bg-surface shadow-md relative">
                    <div className="halftone overflow-hidden h-64 md:h-80 w-full bg-newsprint-dark relative">
                      <img
                        src={allImages[activeImageIndex]}
                        alt={`${project.title} - Image ${activeImageIndex + 1}`}
                        className="w-full h-full object-cover grayscale contrast-125 hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute bottom-2 right-2 bg-newsprint px-2 py-1 border border-ink text-[10px] font-mono uppercase">
                        Fig {String.fromCharCode(65 + activeImageIndex)}. {activeImageIndex === 0 ? 'Interface Design' : `Screenshot ${activeImageIndex + 1}`}
                      </div>
                    </div>

                    {/* Navigation Arrows */}
                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={() => setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-ink/80 text-newsprint p-1.5 hover:bg-ink transition-colors"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button
                          onClick={() => setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-ink/80 text-newsprint p-1.5 hover:bg-ink transition-colors"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Strip */}
                  {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {allImages.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          className={`shrink-0 w-16 h-12 border-2 overflow-hidden transition-all ${idx === activeImageIndex
                              ? 'border-ink shadow-[2px_2px_0_0_rgba(0,0,0,1)]'
                              : 'border-ink/30 opacity-60 hover:opacity-100'
                            }`}
                        >
                          <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover grayscale" />
                        </button>
                      ))}
                      <div className="font-mono text-[9px] uppercase self-center pl-2 text-ink/50 shrink-0">
                        {activeImageIndex + 1} / {allImages.length}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="prose prose-ink max-w-none font-body text-lg leading-relaxed text-justify">
                <p className="first-letter:text-5xl first-letter:font-headline first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-[-6px]">
                  {project.fullDesc}
                </p>
              </div>

              {/* Challenge & Solution */}
              <div className="grid grid-cols-1 gap-6 mt-8">
                <div className="border-l-4 border-ink pl-4">
                  <h4 className="font-headline font-bold text-xl mb-2 flex items-center gap-2">
                    <Layers size={18} /> The Challenge
                  </h4>
                  <p className="font-body text-base italic">{project.challenge}</p>
                </div>
                <div className="border-l-4 border-ink pl-4">
                  <h4 className="font-headline font-bold text-xl mb-2 flex items-center gap-2">
                    <Cpu size={18} /> The Solution
                  </h4>
                  <p className="font-body text-base">{project.solution}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Meta */}
            <div className="md:col-span-4 space-y-8">
              {/* Tech Stack */}
              <div className="bg-surface border border-ink p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h4 className="font-mono text-xs font-bold uppercase tracking-widest mb-4 border-b border-ink pb-1">
                  Technology Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.techStack?.map((tech) => (
                    <span
                      key={tech}
                      className="bg-ink text-newsprint px-2 py-1 font-mono text-xs font-bold border border-ink hover:bg-transparent hover:text-ink transition-colors cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              {project.links && (
                <div className="space-y-3">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-widest mb-2 opacity-60">
                    Resources
                  </h4>
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between w-full border-2 border-ink p-3 font-mono text-sm font-bold uppercase hover:bg-ink hover:text-newsprint transition-all group"
                    >
                      <span>Live Demo</span>
                      <Globe size={16} className="group-hover:rotate-12 transition-transform" />
                    </a>
                  )}
                  {project.links.repo && (
                    <a
                      href={project.links.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between w-full border-2 border-ink p-3 font-mono text-sm font-bold uppercase hover:bg-ink hover:text-newsprint transition-all group"
                    >
                      <span>Source Code</span>
                      <Github size={16} className="group-hover:rotate-12 transition-transform" />
                    </a>
                  )}
                </div>
              )}

              {/* Decorative Stamp */}
              <div className="border-2 border-dashed border-ink p-4 text-center opacity-50 rotate-3 select-none">
                <div className="font-masthead text-2xl">Verified</div>
                <div className="font-mono text-[10px] uppercase mt-1">
                  Daily Developer Eng. Dept.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

interface ProjectCardProps {
  project: ProjectItem;
  onSelect: (project: ProjectItem) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  switch (project.layout) {
    case 'featured':
      return (
        <div
          className="col-span-1 md:col-span-2 row-span-2 border-r border-b border-ink p-0 flex flex-col group cursor-pointer"
          onClick={() => onSelect(project)}
        >
          <div className="w-full h-80 overflow-hidden border-b border-ink relative halftone bg-newsprint-dark">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-6 flex flex-col h-full justify-between bg-newsprint group-hover:bg-surface transition-colors">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="bg-ink text-newsprint text-[10px] font-mono px-1 py-0.5 uppercase tracking-wider">
                  Showcase
                </span>
                <span className="font-mono text-xs font-bold">{project.year}</span>
              </div>
              <h3 className="text-3xl font-headline font-bold mb-2 leading-tight group-hover:underline decoration-2 underline-offset-4">
                {project.title}
              </h3>
              <p className="font-headline text-lg leading-snug text-justify mb-4">
                {project.shortDesc}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-dotted border-ink flex justify-between items-center">
              <span className="font-mono text-xs uppercase font-bold text-ink-light">
                Category: {project.category}
              </span>
              <button className="bg-ink text-newsprint text-xs font-bold font-mono uppercase px-4 py-2 hover:bg-transparent hover:text-ink border border-ink transition-colors flex items-center gap-2">
                View Case Study <ExternalLink size={12} />
              </button>
            </div>
          </div>
        </div>
      );

    case 'inverted':
      return (
        <div
          className="border-r border-b border-ink p-6 bg-ink text-newsprint cursor-pointer group"
          onClick={() => onSelect(project)}
        >
          <div className="border-2 border-current p-2 h-full flex flex-col justify-center text-center group-hover:bg-newsprint group-hover:text-ink transition-colors">
            <h4 className="font-mono font-bold text-sm uppercase tracking-widest mb-2 border-b border-current pb-2">
              {project.category}
            </h4>
            <p className="font-headline text-base italic leading-relaxed mb-4">
              "{project.title}" <br />
              {project.shortDesc}
            </p>
            <button className="text-xs font-mono uppercase underline decoration-1 underline-offset-2 hover:no-underline flex items-center justify-center gap-2">
              <Code size={12} /> View Details
            </button>
          </div>
        </div>
      );

    case 'text-only':
      return (
        <div
          className="border-r border-b border-ink p-4 cursor-pointer hover:bg-surface transition-colors group"
          onClick={() => onSelect(project)}
        >
          <div className="flex justify-between items-baseline border-b border-ink pb-1 mb-2">
            <h4 className="font-bold text-lg font-headline group-hover:underline">
              {project.title}
            </h4>
            <span className="text-[10px] font-mono">{project.year}</span>
          </div>
          <p className="text-xs font-body leading-snug mb-2">
            <span className="float-left text-3xl font-black mr-1 leading-[0.8] font-headline">
              {project.shortDesc.charAt(0)}
            </span>
            {project.shortDesc.slice(1)}
          </p>
          <ul className="text-[10px] font-mono list-disc list-inside mt-2 space-y-1 opacity-80">
            {project.techStack?.slice(0, 3).map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </div>
      );

    case 'sidebar-image':
      return (
        <div
          className="border-r border-b border-ink p-4 flex flex-row gap-3 cursor-pointer hover:bg-surface transition-colors group"
          onClick={() => onSelect(project)}
        >
          <div className="w-16 h-full bg-newsprint-dark halftone border-r border-ink shrink-0">
            <img
              src={project.image}
              className="w-full h-full object-cover"
              alt={project.title}
              loading="lazy"
            />
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide group-hover:underline">
                {project.title}
              </h4>
              <p className="text-[11px] leading-tight mt-1 font-body">{project.shortDesc}</p>
            </div>
            <span className="text-[9px] font-mono block mt-2 hover:underline">See Gallery →</span>
          </div>
        </div>
      );

    case 'placeholder':
      return (
        <div className="border-r border-b border-ink p-0">
          <div className="text-center h-full flex flex-col items-center justify-center bg-newsprint-dark p-6">
            <FolderOpen size={48} className="opacity-50 mb-2" />
            <h4 className="font-bold text-sm uppercase font-mono">{project.title}</h4>
            <p className="text-[10px] font-headline italic mt-1">{project.shortDesc}</p>
          </div>
        </div>
      );

    case 'standard':
    default:
      return (
        <div
          className="border-r border-b border-ink p-4 flex flex-col cursor-pointer hover:bg-surface transition-colors group"
          onClick={() => onSelect(project)}
        >
          {project.image && (
            <div className="mb-3 border border-ink p-1 bg-surface halftone h-32 overflow-hidden">
              <img
                src={project.image}
                className="w-full h-full object-cover grayscale group-hover:scale-110 transition-transform duration-700"
                alt={project.title}
                loading="lazy"
              />
            </div>
          )}
          <h4 className="font-bold text-xl uppercase border-b border-ink pb-1 mb-2 font-headline group-hover:underline">
            {project.title}
          </h4>
          <p className="text-sm font-body leading-tight mb-3 text-justify">{project.shortDesc}</p>
          <div className="mt-auto text-[10px] font-mono flex gap-2 opacity-70">
            <span className="font-bold">{project.category}</span>
            <span>•</span>
            <span>{project.year}</span>
          </div>
        </div>
      );
  }
};

// Main ClassifiedsPage Component
const ClassifiedsPage: React.FC = () => {
  const navigate = useAppNavigate();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []); // Loads on mount

  // Listen for storage changes (soft refresh - no loading spinner)
  useEffect(() => {
    const handleStorageChange = () => {
      projectService.getAll().then((projectsData) => {
        const mappedProjects: ProjectItem[] = projectsData.map((project, index) => ({
          ...project,
          layout: (index === 0
            ? 'featured'
            : index % 4 === 0
              ? 'inverted'
              : 'standard') as ProjectLayout,
        }));
        setProjects(mappedProjects);
      });
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('dataUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dataUpdated', handleStorageChange);
    };
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const projectsData = await projectService.getAll();

    // Map Project model to ProjectItem interface
    const mappedProjects: ProjectItem[] = projectsData.map((project, index) => ({
      ...project,
      layout: (index === 0
        ? 'featured'
        : index % 4 === 0
          ? 'inverted'
          : 'standard') as ProjectLayout,
    }));

    setProjects(mappedProjects);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="font-mono text-sm">Loading projects...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 border border-ink p-8">
        <FolderOpen size={48} className="mx-auto mb-4 text-ink/20" />
        <p className="font-mono text-sm mb-2">No projects found.</p>
        <p className="text-xs text-ink/60">
          Add projects in the admin panel to showcase your work.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}

      {/* Header Section */}
      <div className="border-b-4 border-ink mb-2 pb-2 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] font-headline">
            Project Catalog
          </h2>
          <p className="text-sm md:text-base font-mono uppercase tracking-widest mt-2">
            A Collection of Digital Works & Case Studies
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs font-headline italic max-w-xs">
            "Showcasing the finest digital craftsmanship, tailored code, and bespoke interfaces.
            Available for detailed review."
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap border-b border-ink mb-0 py-2 gap-x-6 gap-y-2 text-xs font-bold uppercase font-mono bg-ink text-newsprint px-2">
        <span>Filter:</span>
        <button className="hover:underline">All Works</button>
        <span className="opacity-50">/</span>
        <button className="hover:underline">Commercial</button>
        <span className="opacity-50">/</span>
        <button className="hover:underline">Open Source</button>
        <span className="opacity-50">/</span>
        <button className="hover:underline">Experiments</button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-newsprint shadow-sm border-l border-ink border-t border-ink">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onSelect={setSelectedProject} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center border-t border-b border-ink py-2 mt-4 font-mono text-xs uppercase">
        <button className="flex items-center hover:underline" onClick={() => navigate('front')}>
          <ArrowLeft size={14} className="mr-1" /> Home
        </button>
        <span>Catalog Page 1 of 1</span>
        <button className="flex items-center hover:underline opacity-50 cursor-not-allowed">
          Next <ArrowRight size={14} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default ClassifiedsPage;
