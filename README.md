# Portfolio — Next.js + TypeScript

A stunning, one-page portfolio with carousel, animations, and custom cursor.

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🖼️ Adding Your Images

1. Place your project images in `/public/images/`
2. Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`
3. Recommended size: **1200×675px** (16:9 ratio)

Example:
```
public/
  images/
    project1.jpg
    project2.jpg
    avatar.jpg
```

---

## ✏️ Editing Your Content

All your content lives in **one file**: `src/data/projects.ts`

### Edit Projects

```ts
export const projects: Project[] = [
  {
    id: 1,
    title: "Your Project Name",
    category: "Full Stack",       // Used for filters
    year: "2024",
    description: "What this project does and why it's impressive.",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    image: "/images/project1.jpg",  // Path in /public
    link: "https://yourproject.com",
    featured: true,  // Shows in the top carousel
  },
  // Add more projects...
];
```

### Edit Personal Info

```ts
export const personal = {
  name: "Your Name",
  role: "Full Stack Developer",
  bio: "Your bio here...",
  email: "hello@yourname.com",
  github: "https://github.com/yourname",
  linkedin: "https://linkedin.com/in/yourname",
  twitter: "https://twitter.com/yourname",
  avatar: "/images/avatar.jpg",
};
```

---

## 🎨 Features

- **Custom cursor** with hover effects
- **Auto-advancing carousel** for featured projects (every 5s, keyboard ← → navigation)
- **Category filters** for all projects
- **Project modal** — click any card for details
- **Scroll progress bar** at the top
- **Animated skill marquee**
- **Smooth entrance animations** via Framer Motion
- **Noise texture overlay** for depth
- **Responsive** — mobile, tablet, desktop

---

## 🎨 Customizing Colors

Edit the CSS variables in `src/app/globals.css`:

```css
:root {
  --bg: #0a0a0a;           /* Page background */
  --surface: #111111;      /* Card backgrounds */
  --surface2: #1a1a1a;     /* Secondary surfaces */
  --border: #222222;       /* Borders */
  --text: #f0ece4;         /* Main text */
  --text-muted: #6b6560;   /* Secondary text */
  --accent: #e8d5b0;       /* Accent color */
  --highlight: #f5c842;    /* Yellow highlight */
}
```

---

## 📦 Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **Google Fonts** (Syne + DM Sans)
