export interface ChildrenImage {
  main_image: string;
  children_image?: string[];
}

export interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  /**
   * image can be:
   *   - a ChildrenImage object  { main_image: "/images/foo.png", children_image: ["/images/bar.png"] }
   *   - a plain string shorthand "/images/foo.png"  (treated as main_image with no children)
   */
  image: ChildrenImage | string;
  link?: string;
  featured?: boolean;
}

/** Normalise either format to a ChildrenImage */
export function resolveImage(image: ChildrenImage | string): ChildrenImage {
  if (typeof image === "string") return { main_image: image, children_image: [] };
  return { main_image: image.main_image, children_image: image.children_image ?? [] };
}

// ─────────────────────────────────────────────
//  EDIT YOUR PROJECTS HERE
//  - Place images in /public/images/
//  - image can be a plain string OR { main_image, children_image: [] }
// ─────────────────────────────────────────────
export const projects: Project[] = [
  {
    id: 1,
    title: "Financial System",
    category: "Gspreadsheet",
    year: "2025",
    description:
      "A Gspreadsheet Financial System, For financial recording",
    tags: ["Google App Script", "Google Sheet", "Google Drive", "Google Docs"],
    image: {
      main_image: "/images/Screenshot 2026-02-18 180029.png",
      children_image: [
        "/images/Screenshot 2026-02-18 180108.png",
        "/images/Screenshot 2026-02-18 180129.png"
        
      ],
    },
    link: "https://docs.google.com/spreadsheets/d/1WEac176Nxbd5SOd4i9rw4GumWPpEP8wdgAIUIuz8oxI/edit?usp=sharing",
    featured: true,
  },
  {
    id: 2,
    title: "TicTac Toe",
    category: "Frontend",
    year: "2024",
    description:
      "My First UI/UX project in our school",
    tags: ["Java", "Eclipse IDE", "JavaSwing"],
    image: {
      main_image: "/images/Screenshot 2026-02-24 235219.png",
      children_image: [
        "/images/Screenshot 2026-02-24 235258.png",
        "/images/Screenshot 2026-02-24 235313.png",
        "/images/Screenshot 2026-02-24 235400.png",
        "/images/Screenshot 2026-02-24 235507.png"
      ]
    },
    link: "",
    featured: true,
  },
  {
    id: 3,
    title: "Donation System with Blockchain and integrated with PayMongo Payment gateway (Unfinished)",
    category: "Web Application",
    year: "2026",
    description:
      "Current working are- PayMongo Testing Integration, Beneficiary Requests, Login/Register with auth, Allocation Budget, and Pool creation. Will work for Blockchain technology with Polygon/Solana.",
    tags: ["Next JS", "TypeScript", "Postgres", "vercel blob", "Google Provider", "JWT", "Prisma", "nodemailer"],
    image: {
      main_image: "/images/Screenshot 2026-02-18 180507.png",
      children_image: [
        "/images/Screenshot 2026-02-26 012707.png",
      ]
    },
    featured: true,
    link: "https://thesis-final-umber.vercel.app/",
  },
  {
    id: 4,
    title: "Basic Mobile Application",
    category: "UI/UX",
    year: "2023",
    description:
      "Only Focused on Login System, Posting, and Comments.",
    tags: ["Firebase", "Android Studio", "Java/Kotlin", "Google Provider"],
    image: {
      main_image: "/images/Screenshot 2026-02-18 181334.png",
      children_image: [
        "/images/Screenshot 2026-02-18 181305.png"
      ]
    },
    link: "",
  },
  {
    id: 5,
    title: "Badoo Additional Features",
    category: "UI/UX with Figma",
    year: "2023",
    description:
      "Badoo is an existing application for dating app. We added new features for this application just using the Figma sample.",
    tags: ["Figma"],
    image: "/images/Screenshot 2026-02-18 182358.png",
    link: "https://www.figma.com/proto/0BgpQ1AS4aee2npwA8fkP6/Untitled?node-id=2-171&p=f&t=q1gsog58oFOrwGus-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=2%3A171&show-proto-sidebar=1",
  },
  {
    id: 6,
    title: "Financial Blog",
    category: "Website Blog",
    year: "2023",
    description:
      "The author of a blog can post and share their knowledge about the Financial World. Readers can comment and reply.",
    tags: ["Php", "Laravel", "SQLite"],
    image: "/images/Screenshot 2026-02-18 063147.png",
    link: "https://example.com",
  },
  {
    id: 7,
    title: "Simple Medical Digital Kit",
    category: "Basic Web App",
    year: "2022",
    description:
      "Basic application that medical used such as BMI canculator, Stopwatch, Unit Converter, etc.",
    tags: ["React"],
    image: {
      main_image: "/images/Screenshot 2026-02-26 005745.png",
      children_image: [
        "/images/Screenshot 2026-02-26 005859.png",
        "/images/Screenshot 2026-02-26 005933.png",
      ]
    },
    link: "https://example.com",
  },
];

// ─────────────────────────────────────────────
//  EDIT YOUR PERSONAL INFO HERE
// ─────────────────────────────────────────────
export const personal = {
  name: "Clyde Timothy Ador",
  role: "Full Stack Developer",
  image: "/images/profile.png",
  bio: "I'm a Computer Science student passionate about building clean, user-friendly apps. I love learning new technologies and am looking forward to contributing to real-world projects.",
  email: "clydeador39@gmail.com",
  github: "https://github.com/clydeador123545",
  linkedin: "https://www.linkedin.com/in/clyde-timothy-ador-99a53a24a/",
  twitter: "https://twitter.com/yourname",
  avatar: "/images/avatar.jpg",
};
