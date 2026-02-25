  "use client";

  import { useEffect, useRef, useState, useCallback } from "react";
  import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
  import { projects, personal, Project, resolveImage } from "@/data/projects";
  import Image from "next/image";

  // ─── Cursor ───────────────────────────────────────────────────────────────────
  function Cursor() {
    const dot = useRef<HTMLDivElement>(null);
    const ring = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState(false);
    useEffect(() => {
      const move = (e: MouseEvent) => {
        if (dot.current) { dot.current.style.left = e.clientX + "px"; dot.current.style.top = e.clientY + "px"; }
        if (ring.current) { ring.current.style.left = e.clientX + "px"; ring.current.style.top = e.clientY + "px"; }
      };
      const over = (e: MouseEvent) => {
        const t = e.target as HTMLElement;
        setHovered(!!(t.closest("a") || t.closest("button") || t.closest("[data-hover]")));
      };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseover", over);
      return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); };
    }, []);

    return (
      <>
        <div ref={dot} className={`cursor ${hovered ? "hovered" : ""}`} />
        <div ref={ring} className={`cursor-ring ${hovered ? "hovered" : ""}`} />
      </>
    );
  }

  // ─── Marquee ──────────────────────────────────────────────────────────────────
  function Marquee({ items }: { items: string[] }) {
    const text = items.join("  ·  ");
    return (
      <div className="overflow-hidden py-4 border-y" style={{ borderColor: "var(--border)" }}>
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "0.12em" }}
        >
          {[text, text].map((t, i) => <span key={i} className="mr-16">{t}</span>)}
        </motion.div>
      </div>
    );
  }

  // ─── Placeholder ──────────────────────────────────────────────────────────────
  function PlaceholderImage({ index, title }: { index: number; title: string }) {
    const colors = [
      ["#1a1a2e", "#e8d5b0"], ["#0f2027", "#c4a882"], ["#1a0f2e", "#f5c842"],
      ["#0f1f1a", "#b0d5c8"], ["#2e1a0f", "#d5b0a0"], ["#1f1a0f", "#e8c842"],
    ];
    const [bg, fg] = colors[index % colors.length];
    return (
      <div className="absolute inset-0 flex items-center justify-center" style={{ background: bg }}>
        <div className="text-center">
          <div className="text-6xl font-bold mb-2 opacity-10" style={{ fontFamily: "var(--font-display)", color: fg }}>
            {String(index + 1).padStart(2, "0")}
          </div>
          <div className="text-xs tracking-widest uppercase opacity-40" style={{ fontFamily: "var(--font-mono)", color: fg }}>{title}</div>
        </div>
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`grid-${index}`} width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={fg} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${index})`} />
        </svg>
      </div>
    );
  }

  // ─── Smart Image (falls back to placeholder on error) ─────────────────────────
  function SmartImage({
    src, alt, index, className,
  }: { src: string; alt: string; index: number; className?: string }) {
    const [error, setError] = useState(false);
    if (error || !src) return <PlaceholderImage index={index} title={alt} />;
    return (
      <Image
        src={src} alt={alt} fill
        className={className ?? "object-cover"}
        onError={() => setError(true)}
      />
    );
  }

  // ─── Project Card ─────────────────────────────────────────────────────────────
  function ProjectCard({ project, onClick, index }: { project: Project; onClick: () => void; index: number }) {
    const img = resolveImage(project.image);
    const childCount = img.children_image?.length ?? 0;

    return (
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        onClick={onClick}
        data-hover
        className="group relative cursor-none rounded-2xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        whileHover={{ y: -6, transition: { duration: 0.3 } }}
      >
        {/* Main image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "16/9", background: "var(--surface2)" }}>
          <SmartImage src={img.main_image} alt={project.title} index={index}
            className="object-cover transition-transform duration-700 group-hover:scale-110" />

          {/* Hover overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.6)" }}>
            <span className="text-sm tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--highlight)" }}>
              View Project →
            </span>
          </div>

          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-3 left-3 px-2 py-1 rounded text-xs tracking-wider uppercase"
              style={{ background: "var(--highlight)", color: "#000", fontFamily: "var(--font-mono)", fontWeight: 500 }}>
              Featured
            </div>
          )}

          {/* Children image count badge */}
          {childCount > 0 && (
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs flex items-center gap-1"
              style={{ background: "rgba(0,0,0,0.75)", color: "var(--accent)", fontFamily: "var(--font-mono)", backdropFilter: "blur(6px)", border: "1px solid var(--border)" }}>
              ⊞ +{childCount}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                {project.category} · {project.year}
              </p>
              <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}>
                {project.title}
              </h3>
            </div>
            <motion.div className="text-xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--accent)" }}>↗</motion.div>
          </div>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span key={tag} className="px-2 py-1 rounded text-xs"
                style={{ background: "var(--surface2)", color: "var(--text-muted)", fontFamily: "var(--font-mono)", border: "1px solid var(--border)" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.article>
    );
  }

  // ─── Carousel (Featured) ──────────────────────────────────────────────────────
  function Carousel({ projects }: { projects: Project[] }) {
    const [current, setCurrent] = useState(0);
    const total = projects.length;
    const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);
    const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);

    useEffect(() => {
      const handler = (e: KeyboardEvent) => { if (e.key === "ArrowLeft") prev(); if (e.key === "ArrowRight") next(); };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }, [prev, next]);

    useEffect(() => { const t = setTimeout(next, 5000); return () => clearTimeout(t); }, [current, next]);

    const project = projects[current];
    const img = resolveImage(project.image);

    return (
      <div className="relative rounded-3xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="grid lg:grid-cols-2 min-h-[480px]">
          {/* Image side */}
          <div className="relative overflow-hidden" style={{ background: "var(--surface2)", minHeight: "320px" }}>
            <AnimatePresence mode="wait">
              <motion.div key={current} className="absolute inset-0"
                initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                <SmartImage src={img.main_image} alt={project.title} index={current} className="object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 60%, var(--surface))" }} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Content side */}
          <div className="relative p-8 lg:p-12 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div key={current}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "var(--highlight)", fontFamily: "var(--font-mono)" }}>
                  {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} · {project.category}
                </p>
                <h3 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}>
                  {project.title}
                </h3>
                <p className="leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs"
                      style={{ background: "var(--surface2)", color: "var(--accent)", fontFamily: "var(--font-mono)", border: "1px solid var(--border)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" data-hover
                    className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                    style={{ color: "var(--highlight)", fontFamily: "var(--font-mono)" }}>
                    Visit Project ↗
                  </a>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Carousel controls */}
            <div className="flex items-center gap-4 mt-8">
              <button onClick={prev} data-hover
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }} aria-label="Previous">←</button>
              <div className="flex gap-2">
                {projects.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)} data-hover aria-label={`Go to ${i + 1}`}
                    className="rounded-full transition-all duration-300"
                    style={{ width: i === current ? "24px" : "6px", height: "6px", background: i === current ? "var(--highlight)" : "var(--border)" }} />
                ))}
              </div>
              <button onClick={next} data-hover
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }} aria-label="Next">→</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Project Modal with children gallery ──────────────────────────────────────
  function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
    const img = resolveImage(project.image);
    // Combine main + children into one flat list
    const allImages = [img.main_image, ...(img.children_image ?? [])].filter(Boolean);
    const [activeIdx, setActiveIdx] = useState(0);
    const [lightbox, setLightbox] = useState(false);

    const goPrev = useCallback((e?: React.MouseEvent) => {
      e?.stopPropagation();
      setActiveIdx(i => (i - 1 + allImages.length) % allImages.length);
    }, [allImages.length]);

    const goNext = useCallback((e?: React.MouseEvent) => {
      e?.stopPropagation();
      setActiveIdx(i => (i + 1) % allImages.length);
    }, [allImages.length]);

    // Keyboard nav inside modal
    useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") { if (lightbox) setLightbox(false); else onClose(); }
        if (e.key === "ArrowLeft") goPrev();
        if (e.key === "ArrowRight") goNext();
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }, [lightbox, onClose, goPrev, goNext]);

    return (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(14px)" }}
          onClick={onClose}
        >
          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-3xl rounded-2xl overflow-hidden flex flex-col"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", maxHeight: "90vh" }}
            onClick={e => e.stopPropagation()}
          >
            {/* ── Image viewer ── */}
            <div
              className="relative flex-shrink-0 cursor-zoom-in"
              style={{ aspectRatio: "16/9", background: "var(--surface2)" }}
              onClick={() => setLightbox(true)} data-hover
            >
              <AnimatePresence mode="wait">
                <motion.div key={activeIdx} className="absolute inset-0"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}>
                  <SmartImage
                    src={allImages[activeIdx] ?? ""}
                    alt={`${project.title} — image ${activeIdx + 1}`}
                    index={project.id - 1}
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next (only if multiple images) */}
              {allImages.length > 1 && (
                <>
                  <button
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all z-10"
                    style={{ background: "rgba(0,0,0,0.65)", color: "var(--text)", border: "1px solid var(--border)", backdropFilter: "blur(6px)" }}
                    onClick={goPrev} data-hover aria-label="Previous image">←</button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all z-10"
                    style={{ background: "rgba(0,0,0,0.65)", color: "var(--text)", border: "1px solid var(--border)", backdropFilter: "blur(6px)" }}
                    onClick={goNext} data-hover aria-label="Next image">→</button>
                  {/* Counter */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs"
                    style={{ background: "rgba(0,0,0,0.7)", color: "var(--text-muted)", fontFamily: "var(--font-mono)", backdropFilter: "blur(6px)" }}>
                    {activeIdx + 1} / {allImages.length}
                  </div>
                </>
              )}

              {/* Expand hint */}
              <div className="absolute top-3 left-3 px-2 py-1 rounded text-xs opacity-50 pointer-events-none"
                style={{ background: "rgba(0,0,0,0.6)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                ⤢ click to expand
              </div>

              {/* Close button */}
              <button onClick={e => { e.stopPropagation(); onClose(); }} data-hover
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-sm z-10"
                style={{ background: "rgba(0,0,0,0.7)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>✕</button>
            </div>

            {/* ── Thumbnail strip (only if 2+ images) ── */}
            {allImages.length > 1 && (
              <div className="flex gap-2 px-4 py-3 overflow-x-auto flex-shrink-0"
                style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)" }}>
                {allImages.map((src, i) => (
                  <button key={i} onClick={() => setActiveIdx(i)} data-hover
                    className="relative flex-shrink-0 rounded-lg overflow-hidden transition-all"
                    style={{
                      width: "72px", height: "48px", background: "var(--surface)",
                      border: `2px solid ${i === activeIdx ? "var(--highlight)" : "var(--border)"}`,
                      opacity: i === activeIdx ? 1 : 0.5,
                      transform: i === activeIdx ? "scale(1.05)" : "scale(1)",
                    }}
                    aria-label={`View image ${i + 1}`}>
                    <SmartImage src={src} alt={`thumb ${i + 1}`} index={i} className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* ── Info ── */}
            <div className="p-6 overflow-y-auto">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1"
                    style={{ color: "var(--highlight)", fontFamily: "var(--font-mono)" }}>
                    {project.category} · {project.year}
                  </p>
                  <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{project.title}</h3>
                </div>
              </div>
              <p className="mb-5 leading-relaxed" style={{ color: "var(--text-muted)" }}>{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {project.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs"
                    style={{ background: "var(--surface2)", color: "var(--accent)", fontFamily: "var(--font-mono)", border: "1px solid var(--border)" }}>
                    {tag}
                  </span>
                ))}
              </div>
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" data-hover
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
                  style={{ background: "var(--highlight)", color: "#000", fontFamily: "var(--font-mono)" }}>
                  Visit Project ↗
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* ── Fullscreen Lightbox ── */}
        <AnimatePresence>
          {lightbox && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.97)", zIndex: 60 }}
              onClick={() => setLightbox(false)}
            >
              <motion.div
                initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-6xl mx-4"
                onClick={e => e.stopPropagation()}
              >
                <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                  <SmartImage src={allImages[activeIdx] ?? ""} alt={project.title} index={project.id - 1} className="object-contain" />
                </div>

                <button onClick={() => setLightbox(false)} data-hover
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full"
                  style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>✕</button>

                {allImages.length > 1 && (
                  <>
                    <button onClick={goPrev} data-hover aria-label="Previous"
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full"
                      style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>←</button>
                    <button onClick={goNext} data-hover aria-label="Next"
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full"
                      style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>→</button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs"
                      style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-mono)" }}>
                      {activeIdx + 1} / {allImages.length}
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // ─── Stat Block ───────────────────────────────────────────────────────────────
  function StatBlock({ value, label }: { value: string; label: string }) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
        <div className="text-4xl lg:text-5xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>{value}</div>
        <div className="text-xs tracking-widest uppercase" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{label}</div>
      </motion.div>
    );
  }

  // ─── Main Page ────────────────────────────────────────────────────────────────
  export default function Portfolio() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [activeFilter, setActiveFilter] = useState("All");
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    const categories = ["All", ...Array.from(new Set(projects.map(p => p.category)))];
    const filtered = activeFilter === "All" ? projects : projects.filter(p => p.category === activeFilter);
    const featuredProjects = projects.filter(p => p.featured);
    const carouselProjects = featuredProjects.length >= 2 ? featuredProjects : projects.slice(0, 3);

    // Derive all unique tags from projects for the marquee
    const allTags = Array.from(new Set(projects.flatMap(p => p.tags)));
    const displayName = personal.name || "Developer";

    return (
      <>
        <Cursor />
        <motion.div className="fixed top-0 left-0 right-0 h-0.5 origin-left z-50"
          style={{ scaleX, background: "var(--highlight)" }} />

        {/* ── Nav ── */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 lg:px-12 py-5"
          style={{ background: "rgba(10,10,10,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}
        >
          <div className="font-bold text-lg" style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}>
            {displayName.split(" ")[0] || "Portfolio"}<span style={{ color: "var(--highlight)" }}>.</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
            {["Work", "About", "Contact"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} data-hover className="hover:text-white transition-colors tracking-wider">{item}</a>
            ))}
          </div>
          <a href={`mailto:${personal.email}`} data-hover
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: "var(--highlight)", color: "#000", fontFamily: "var(--font-mono)" }}>
            Hire Me
          </a>
        </motion.nav>

        <main>
          {/* ── Hero ── */}
          <section className="min-h-screen flex flex-col justify-center px-6 lg:px-16 pt-24 pb-16 relative overflow-hidden">
            {/* <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-5"
                style={{ background: "radial-gradient(circle, var(--highlight), transparent)" }} />
              <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full opacity-5"
                style={{ background: "radial-gradient(circle, var(--accent2), transparent)" }} />
            </div> */}

            <div className="max-w-6xl mx-auto w-full relative">
              <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="text-sm tracking-widest uppercase mb-6"
                style={{ color: "var(--highlight)", fontFamily: "var(--font-mono)" }}>
                Available for work · {new Date().getFullYear()}
              </motion.p>


              {/* Profile Image - Responsive */}
              <div className="relative flex items-center justify-center lg:absolute lg:right-0 lg:top-1/3 lg:-translate-y-1/2 mb-12 lg:mb-0">
                
                {/* Half-ring gradient - responsive sizing */}
                <div className="absolute w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] xl:w-[450px] xl:h-[450px]">
                  <div 
                    className="absolute inset-0"
                    style={{ 
                      background: "conic-gradient(from 90deg at 50% 50%, var(--accent1) 0deg, var(--accent2) 90deg, transparent 90deg, transparent 360deg)",
                      borderRadius: "9999px",
                      opacity: 0.3,
                      filter: "blur(15px)"
                    }}
                  />
                </div>

                {/* Subtle glow - responsive sizing */}
                <div 
                  className="absolute w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] lg:w-[340px] lg:h-[340px] xl:w-[380px] xl:h-[380px] rounded-full"
                  style={{ 
                    background: "radial-gradient(circle, var(--accent1) 0%, transparent 70%)",
                    filter: "blur(30px)",
                    opacity: 0.2
                  }}
                />

                {/* Profile Image - responsive */}
                <div className="relative z-10">
                  <Image
                    src={personal.image}
                    width={400}
                    height={400}
                    alt="Profile Image"
                    className="rounded-full shadow-2xl shadow-white w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] md:w-[280px] md:h-[280px] lg:w-[320px] lg:h-[320px] xl:w-[400px] xl:h-[400px] object-cover"
                    priority // Add priority since it's above the fold
                  />
                </div>

              </div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-6xl lg:text-8xl xl:text-9xl font-bold leading-none mb-8"
                style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}>
                {personal.name
                  ? personal.name.split(" ").map((word, i) => (
                      <span key={i} className="block">
                        {i === 1 ? <span style={{ color: "var(--highlight)" }}>{word}</span> : word}
                      </span>
                    ))
                  : (<><span className="block">Creative</span><span className="block" style={{ color: "var(--highlight)" }}>Developer</span></>)
                }
              </motion.h1>

              <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
                  className="max-w-lg text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {personal.bio}
                </motion.p>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }} className="flex items-center gap-4">
                  <a href={personal.github} target="_blank" rel="noopener noreferrer" data-hover
                    className="w-10 h-10 flex items-center justify-center rounded-full transition-colors text-sm"
                    style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}>GH</a>
                  <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" data-hover
                    className="w-10 h-10 flex items-center justify-center rounded-full transition-colors text-sm"
                    style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}>LI</a>
                  <a href="#work" data-hover
                    className="flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}>
                    View Work ↓
                  </a>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="grid grid-cols-3 gap-8 mt-20 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
                <StatBlock value={`${projects.length}+`} label="Projects" />
                <StatBlock value="3+" label="Years Exp." />
                <StatBlock value="CS" label="Degree (ongoing)" />
              </motion.div>
            </div>
          </section>

          {/* ── Marquee ── */}
          <Marquee items={allTags} />

          {/* ── Featured Carousel ── */}
          <section className="px-6 lg:px-16 py-20 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="flex items-center justify-between mb-10">
              <div>
                <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Selected</p>
                <h2 className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Featured Work</h2>
              </div>
              <span className="text-xs tracking-widest uppercase hidden md:block"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>← → to navigate</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              <Carousel projects={carouselProjects} />
            </motion.div>
          </section>

          {/* ── All Projects ── */}
          <section id="work" className="px-6 lg:px-16 py-20 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Portfolio</p>
                <h2 className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>All Projects</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveFilter(cat)} data-hover
                    className="px-4 py-1.5 rounded-full text-xs transition-all"
                    style={{
                      background: activeFilter === cat ? "var(--highlight)" : "var(--surface)",
                      color: activeFilter === cat ? "#000" : "var(--text-muted)",
                      border: `1px solid ${activeFilter === cat ? "var(--highlight)" : "var(--border)"}`,
                      fontFamily: "var(--font-mono)"
                    }}>
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filtered.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} onClick={() => setSelectedProject(project)} />
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* ── About ── */}
          <section id="about" className="px-6 lg:px-16 py-20" style={{ background: "var(--surface)" }}>
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
                <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>About Me</p>
                <h2 className="text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                  Building things that<br /><span style={{ color: "var(--highlight)" }}>actually matter.</span>
                </h2>
                <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>{personal.bio}</p>
                <p className="leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  I specialize in building scalable web applications and intuitive user interfaces. Whether it&apos;s a school project or a real-world product, I bring the same level of care and craftsmanship to every piece of work.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="space-y-6">
                <h3 className="text-sm tracking-widest uppercase mb-4" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Tech Stack</h3>
                <div className="grid grid-cols-3 gap-3">
                  {allTags.slice(0, 12).map((skill, i) => (
                    <motion.div key={skill}
                      initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                      className="p-3 rounded-xl text-center text-xs"
                      style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                      {skill}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── Contact ── */}
          <section id="contact" className="px-6 lg:px-16 py-32 max-w-5xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <p className="text-xs tracking-widest uppercase mb-6" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                Let&apos;s Work Together
              </p>
              <h2 className="text-6xl lg:text-8xl font-bold mb-8 leading-none" style={{ fontFamily: "var(--font-display)" }}>
                Got a project<br /><span style={{ color: "var(--highlight)" }}>in mind?</span>
              </h2>
              <p className="text-xl mb-12" style={{ color: "var(--text-muted)" }}>
                I&apos;m always open to discussing new projects and creative ideas.
              </p>
              <a href={`mailto:${personal.email}`} data-hover
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-lg font-semibold transition-all hover:gap-5"
                style={{ background: "var(--highlight)", color: "#000", fontFamily: "var(--font-display)" }}>
                Send a Message ↗
              </a>
            </motion.div>
          </section>

          {/* ── Footer ── */}
          <footer className="px-6 lg:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ borderTop: "1px solid var(--border)" }}>
            <p className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              © {new Date().getFullYear()} {personal.name || "Portfolio"}. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
              <a href={personal.github} target="_blank" rel="noopener noreferrer" data-hover className="hover:text-white transition-colors">GitHub</a>
              <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" data-hover className="hover:text-white transition-colors">LinkedIn</a>
            </div>
          </footer>
        </main>

        {/* ── Modal ── */}
        <AnimatePresence>
          {selectedProject && (
            <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
          )}
        </AnimatePresence>
      </>
    );
  }
