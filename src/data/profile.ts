export interface SkillGroup {
  title: string;
  items: string[];
}

export interface Project {
  title: string;
  summary: string;
  technologies: string[];
  highlights: string[];
}

export const profile = {
  name: "Sharbin Joe J S",
  initials: "SJ",
  role: "Android & Full-Stack Developer",
  status: "Fresher",
  phoneDisplay: "+91 63697 03275",
  phoneHref: "tel:+916369703275",
  email: "sharbinjo@gmail.com",
  emailHref: "mailto:sharbinjo@gmail.com",
  linkedin:
    "https://www.linkedin.com/in/sharbin-joe-58b802313",
  github: "https://github.com/sharbinjo-sudo",
  resume: "/resume/Sharbin-Joe-JS-Resume.pdf",
  summary:
    "Android and full-stack developer who builds production-ready applications using Kotlin, Django, Flutter, React and Spring Boot. Experienced in API design, database integration, containerization and cloud deployment, with basic practical knowledge of Android reverse engineering and APK analysis.",
  education: {
    degree: "Bachelor of Technology in Artificial Intelligence & Data Science",
    institution: "V.V. College of Engineering, Tisaiyanvilai",
    period: "2024 - 2028",
  },
} as const;

export const skillGroups: SkillGroup[] = [
  {
    title: "Programming Languages",
    items: ["Python", "Kotlin", "Dart", "Java", "C", "C++"],
  },
  {
    title: "Mobile Development",
    items: ["Android", "Kotlin", "Java", "XML", "Flutter", "Jetpack Compose"],
  },
  {
    title: "Web & Backend",
    items: ["React", "Django", "Spring Boot", "REST APIs"],
  },
  {
    title: "Databases",
    items: ["SQL", "SQLite", "PostgreSQL", "NeonDB", "Room"],
  },
  {
    title: "DevOps & Cloud",
    items: ["Docker", "Render", "Netlify", "Cloudinary"],
  },
  {
    title: "Tools & Platforms",
    items: [
      "Git",
      "GitHub",
      "Postman",
      "Jupyter Notebook",
      "VS Code",
      "WSL",
      "Kali Linux",
      "JADX",
      "Unity",
    ],
  },
  {
    title: "Basic Reverse Engineering",
    items: [
      "APK Decompilation",
      "JADX GUI",
      "apktool",
      "HxD Hex Editor",
      "Smali",
      "ADB",
      "AndroidManifest Analysis",
      "DEX Inspection",
      "Native .so Inspection",
      "ELF Basics",
      "Strings & File Headers",
      "UPX Detection",
    ],
  },
];

export const freelanceExperience = {
  role: "Freelance Full-Stack Developer",
  period: "Nov 2025 - Dec 2025",
  summary:
    "Developed a paid client-facing plant disease detection application using deep-learning image classification.",
  highlights: [
    "Built a Flutter mobile app for uploading plant-leaf images and displaying disease predictions.",
    "Implemented a Django REST backend for image upload, model inference and classification responses.",
    "Integrated a CNN model for Healthy, Powdery Mildew and Rust Disease categories.",
    "Used Cloudinary for image storage and PostgreSQL on NeonDB for application data.",
    "Tested APIs with Postman and deployed backend services to the cloud.",
  ],
  technologies: [
    "Flutter",
    "Django",
    "REST API",
    "CNN",
    "Cloudinary",
    "PostgreSQL",
    "NeonDB",
  ],
} as const;

export const projects: Project[] = [
  {
    title: "Firewall Application with URL Scanner",
    summary:
      "A VPN-based Android firewall that monitors application-level network traffic and applies URL scanning and rule-based filtering.",
    technologies: ["Android", "Kotlin", "XML", "VPN Service"],
    highlights: [
      "Routes network requests through an Android VPN-based traffic handler.",
      "Scans URLs and applies rules to identify suspicious links.",
      "Records detected URLs through a threat-logging module.",
      "Uses a clean XML interface and Android development practices.",
    ],
  },
  {
    title: "On-Device Facial Emotion Recognition",
    summary:
      "A real-time Android emotion-recognition pipeline that performs face detection and TensorFlow Lite inference entirely on the device.",
    technologies: [
      "Android",
      "CameraX",
      "ML Kit",
      "TensorFlow Lite",
      "CNN",
    ],
    highlights: [
      "Detects and localizes faces using Google ML Kit.",
      "Processes camera frames using CameraX.",
      "Classifies Happy, Sad, Angry and Surprise emotions.",
      "Runs offline with optimized TensorFlow Lite inference.",
    ],
  },
  {
    title: "Library Management Application",
    summary:
      "An offline-first Android application for managing books, members and issue records with a modern maintainable architecture.",
    technologies: [
      "Android",
      "Jetpack Compose",
      "Material 3",
      "MVVM",
      "Room",
    ],
    highlights: [
      "Implements ViewModel and Repository patterns.",
      "Stores data locally with Room Database.",
      "Supports book issuing, tracking and input validation.",
      "Includes a dedicated no-internet user experience.",
    ],
  },
];

export const certifications = [
  "Typewriting English - Government of Tamil Nadu Department of Technical Education",
  "Advanced Diploma in Python Programming - CSC",
  "Programming in Java - Kalvi",
  "SQL Server - Kalvi",
];

export const practicalExperience = [
  "Static analysis of Android applications using JADX GUI.",
  "Decompilation of APK files using JADX and apktool to inspect Java code, resources, manifests and Smali.",
  "Basic Smali reading and controlled modification of decompiled Android applications for learning and authorized testing.",
  "Hex-level inspection with HxD to identify magic bytes, file signatures, embedded archives and binary structure.",
  "Inspection of AndroidManifest.xml, permissions, exported components, activities, services, receivers and content providers.",
  "Basic examination of DEX files and native Android .so libraries, including ELF headers, strings and imported symbols.",
  "Use of ADB and log output to observe application behavior during controlled testing.",
  "Use of UPX to check whether native libraries are packed or unpacked.",
  "Review of hardcoded secrets, exposed endpoints and weak client-side validation.",
  "Controlled ethical penetration-testing practice using Kali Linux.",
  "Inspection of authentication flows and client-server network traffic.",
  "Unity scene management, scripting fundamentals and asset integration.",
  "Understanding of the Unity-to-Android APK build and packaging process.",
];
