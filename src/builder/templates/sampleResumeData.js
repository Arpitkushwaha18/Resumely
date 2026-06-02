const contactFor = (slug, city) => ({
  email: `${slug}@example.com`,
  phone: "+91 98765 43210",
  linkedin: `linkedin.com/in/${slug}`,
  github: `github.com/${slug}`,
  portfolio: `${slug}.dev`,
  location: city,
});

const education = (institution, degree, branch, coursework) => [
  {
    institution,
    level: "Undergraduate",
    degree,
    branch,
    currentYear: "Third Year",
    graduationYear: "2027",
    score: "8.6 CGPA",
    coursework,
  },
];

const cert = (name, organization, year = "2025") => ({ name, organization, year });

const baseAchievements = [
  "Built and presented multiple academic projects with clear documentation.",
  "Collaborated with peers to deliver coursework and project milestones on time.",
];

export const sampleResumeDataByTemplate = {
  prestige: {
    personal: {
      fullName: "Daniel Morgan",
      professionalTitle: "Software Engineering Student",
      ...contactFor("daniel-morgan", "Bengaluru, Karnataka"),
    },
    summary: "Software engineering student focused on building reliable web applications, writing clean code, and translating product requirements into simple user experiences.",
    experience: [{ role: "Software Engineering Intern", organization: "BrightLayer Labs", type: "Internship", location: "Bengaluru", startDate: "May 2025", endDate: "Jul 2025", description: "Built reusable React components, documented frontend patterns, and supported API integration for student-facing dashboards." }],
    education: education("PES University", "B.Tech", "Computer Science and Engineering", "Software Engineering, Data Structures, Database Systems"),
    projects: [
      { name: "Internship Tracker", technologies: "React.js, Node.js, PostgreSQL", description: "Created a placement workflow app for tracking applications, interviews, offer status, and recruiter notes." },
      { name: "Code Review Dashboard", technologies: "TypeScript, REST APIs, Tailwind CSS", description: "Designed a dashboard that summarizes pull request activity, review status, and project health indicators." },
    ],
    skills: ["JavaScript", "TypeScript", "React.js", "Node.js", "PostgreSQL", "Git", "REST API Development", "Problem Solving", "Communication Skills"],
    certifications: [cert("Meta Front-End Developer", "Coursera"), cert("GitHub Foundations", "GitHub")],
    achievements: ["Ranked in the top 10% of the department coding challenge.", ...baseAchievements],
  },
  executive: {
    personal: {
      fullName: "Olivia Bennett",
      professionalTitle: "Business Administration Student",
      ...contactFor("olivia-bennett", "Mumbai, Maharashtra"),
    },
    summary: "Business administration student interested in operations, strategy, and stakeholder coordination. Experienced in case analysis, presentation building, and process improvement projects.",
    experience: [{ role: "Operations Intern", organization: "NorthStar Retail", type: "Internship", location: "Mumbai", startDate: "Jun 2025", endDate: "Aug 2025", description: "Prepared weekly operations reports, tracked vendor follow-ups, and helped document process gaps across retail teams." }],
    education: education("NMIMS School of Business", "BBA", "Business Administration", "Operations Management, Marketing, Business Analytics"),
    projects: [
      { name: "Market Entry Strategy Report", technologies: "Excel, PowerPoint, Market Research", description: "Analyzed competitor positioning, customer segments, and pricing assumptions for a student consulting project." },
      { name: "Inventory Process Study", technologies: "Excel, Process Mapping", description: "Mapped stock movement steps and recommended improvements for reorder tracking and branch coordination." },
    ],
    skills: ["Leadership", "Project Management", "Communication Skills", "Presentation Skills", "Research Skills", "Microsoft SQL Server", "Critical Thinking", "Time Management"],
    certifications: [cert("Business Analytics Fundamentals", "Microsoft Learn"), cert("Project Management Basics", "PMI")],
    achievements: ["Led a 5-member team in an inter-college business case competition.", ...baseAchievements],
  },
  zenith: {
    personal: {
      fullName: "Sophia Chen",
      professionalTitle: "Data Analytics Student",
      ...contactFor("sophia-chen", "Pune, Maharashtra"),
    },
    summary: "Data analytics student skilled in SQL, Python, dashboards, and insight communication. Enjoys cleaning datasets and turning analysis into decisions.",
    experience: [{ role: "Analytics Intern", organization: "MetricWorks", type: "Internship", location: "Pune", startDate: "Apr 2025", endDate: "Jun 2025", description: "Cleaned campaign datasets, created weekly KPI dashboards, and summarized customer trends for the marketing team." }],
    education: education("Symbiosis Institute of Technology", "B.Tech", "Artificial Intelligence and Data Science", "Statistics, Machine Learning, Database Management Systems"),
    projects: [
      { name: "Sales Insight Dashboard", technologies: "Python, SQL, Power BI", description: "Built interactive revenue dashboards with category trends, regional filters, and monthly performance summaries." },
      { name: "Customer Churn Analysis", technologies: "Python, Pandas, Scikit-learn", description: "Analyzed churn patterns and trained a baseline model to identify high-risk customer segments." },
    ],
    skills: ["Python", "SQL", "R", "MATLAB", "Data Visualization", "Problem Solving", "Research Skills", "Critical Thinking"],
    certifications: [cert("Google Data Analytics", "Google"), cert("Python for Data Science", "IBM")],
    achievements: ["Presented a dashboard case study at the college analytics club showcase.", ...baseAchievements],
  },
  nova: {
    personal: {
      fullName: "Ethan Carter",
      professionalTitle: "Full Stack Developer",
      ...contactFor("ethan-carter", "Hyderabad, Telangana"),
    },
    summary: "Full stack developer focused on React, Node.js, APIs, and database-backed products. Builds clean interfaces with practical backend workflows.",
    experience: [{ role: "Full Stack Developer Intern", organization: "CloudNest Apps", type: "Internship", location: "Hyderabad", startDate: "May 2025", endDate: "Aug 2025", description: "Implemented authentication screens, connected REST endpoints, and improved dashboard responsiveness across mobile and desktop." }],
    education: education("VNR VJIET", "B.Tech", "Information Technology", "Web Engineering, Cloud Computing, Database Systems"),
    projects: [
      { name: "Developer Portfolio CMS", technologies: "React.js, Node.js, Express.js, MongoDB", description: "Built a content-managed portfolio with project publishing, admin authentication, and deployment-ready API routes." },
      { name: "Realtime Chat App", technologies: "Next.js, WebSockets, PostgreSQL", description: "Created a chat interface with room-based messaging, typing states, and persistent conversation history." },
    ],
    skills: ["JavaScript", "TypeScript", "React.js", "Next.js", "Node.js", "Express.js", "MongoDB", "PostgreSQL", "Git", "Docker"],
    certifications: [cert("Responsive Web Design", "freeCodeCamp"), cert("Node.js API Development", "Postman Academy")],
    achievements: ["Deployed 6 full-stack projects with public repositories and documentation.", ...baseAchievements],
  },
  atlas: {
    personal: {
      fullName: "Noah Anderson",
      professionalTitle: "Frontend Developer",
      ...contactFor("noah-anderson", "Chennai, Tamil Nadu"),
    },
    summary: "Frontend developer focused on accessible interfaces, responsive layouts, and component-driven development for student and community projects.",
    experience: [{ role: "Frontend Developer Intern", organization: "PixelForge Studio", type: "Internship", location: "Chennai", startDate: "Jun 2025", endDate: "Aug 2025", description: "Converted Figma screens into responsive React components and improved page load consistency across core views." }],
    education: education("SRM Institute of Science and Technology", "B.Tech", "Computer Science and Engineering", "Human Computer Interaction, Web Technologies, Data Structures"),
    projects: [
      { name: "Campus Events Portal", technologies: "React.js, Tailwind CSS, Firebase", description: "Built an event discovery platform with filters, registration status, and mobile-first event cards." },
      { name: "Design System Playground", technologies: "Storybook, TypeScript, CSS3", description: "Created reusable UI components with documented variants, states, and accessibility notes." },
    ],
    skills: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React.js", "Tailwind CSS", "Figma", "Responsive Web Design", "Attention to Detail"],
    certifications: [cert("Frontend Developer Career Path", "Scrimba"), cert("Accessibility Fundamentals", "Microsoft Learn")],
    achievements: ["Won best UI award at a department-level project exhibition.", ...baseAchievements],
  },
  nexus: {
    personal: {
      fullName: "Lucas Reed",
      professionalTitle: "Computer Science Student",
      ...contactFor("lucas-reed", "Delhi, India"),
    },
    summary: "Computer science student with a strong foundation in programming, databases, and systems. Interested in internships involving backend development and applied problem solving.",
    experience: [{ role: "Student Developer", organization: "College Coding Cell", type: "Volunteer", location: "Delhi", startDate: "Jan 2025", endDate: "Present", description: "Maintained coding resources, reviewed beginner submissions, and helped organize peer learning sessions." }],
    education: education("Delhi Technological University", "B.Tech", "Computer Science and Engineering", "Operating Systems, DBMS, Computer Networks"),
    projects: [
      { name: "Library Management API", technologies: "Java, Spring Boot, MySQL", description: "Implemented book issue workflows, search endpoints, and admin controls for a library operations system." },
      { name: "Algorithm Visualizer", technologies: "JavaScript, HTML5, CSS3", description: "Created visual walkthroughs for sorting and graph traversal algorithms with step controls." },
    ],
    skills: ["Java", "Python", "SQL", "Spring Boot", "MySQL", "Git", "Problem Solving", "Teamwork and Collaboration"],
    certifications: [cert("Java Programming", "Oracle Academy"), cert("Database Foundations", "Oracle Academy")],
    achievements: ["Solved 300+ programming problems across practice platforms.", ...baseAchievements],
  },
  launchpad: {
    personal: {
      fullName: "Emma Walker",
      professionalTitle: "Computer Science Student",
      ...contactFor("emma-walker", "Noida, Uttar Pradesh"),
    },
    summary: "Computer science student seeking internship opportunities in web development. Comfortable with frontend basics, data structures, and collaborative academic projects.",
    experience: [],
    education: education("KCC Institute of Technology and Management", "B.Tech", "Computer Science and Engineering", "Data Structures, Operating Systems, Database Management Systems"),
    projects: [
      { name: "Campus Placement Portal", technologies: "React.js, Node.js, MongoDB, Express.js", description: "Created a portal for viewing job listings, submitting applications, and tracking placement status." },
      { name: "Expense Tracker Application", technologies: "JavaScript, HTML5, CSS3", description: "Built a responsive app for recording expenses, organizing categories, and reviewing spending patterns." },
    ],
    skills: ["JavaScript", "React.js", "Node.js", "MongoDB", "HTML5", "CSS3", "Git", "SQL", "Communication Skills", "Problem Solving"],
    certifications: [cert("Google Cloud Computing Foundations", "Google"), cert("JavaScript Essentials", "Cisco Networking Academy")],
    achievements: ["Participated in inter-college hackathons and technical events.", ...baseAchievements],
  },
  elevate: {
    personal: {
      fullName: "James Foster",
      professionalTitle: "Information Technology Student",
      ...contactFor("james-foster", "Jaipur, Rajasthan"),
    },
    summary: "Information technology student interested in cloud tools, web systems, and user-friendly digital products. Blends technical execution with clear presentation.",
    experience: [{ role: "IT Support Intern", organization: "BluePeak Services", type: "Internship", location: "Jaipur", startDate: "May 2025", endDate: "Jul 2025", description: "Supported internal tools, documented troubleshooting steps, and helped update web content for service teams." }],
    education: education("Manipal University Jaipur", "B.Tech", "Information Technology", "Cloud Computing, Web Technologies, Computer Networks"),
    projects: [
      { name: "Service Desk Portal", technologies: "React.js, Firebase, Tailwind CSS", description: "Designed a ticket submission and tracking interface with status filters and role-based views." },
      { name: "Cloud Notes App", technologies: "JavaScript, Firestore, CSS3", description: "Built a note-taking app with realtime sync, search, and responsive layouts." },
    ],
    skills: ["React.js", "JavaScript", "Firebase", "Cloud Computing", "Git", "Figma", "Presentation Skills", "Adaptability"],
    certifications: [cert("AWS Cloud Practitioner Essentials", "AWS"), cert("Introduction to Web Development", "IBM SkillsBuild")],
    achievements: ["Designed a project demo selected for the department technology showcase.", ...baseAchievements],
  },
  horizon: {
    personal: {
      fullName: "Grace Mitchell",
      professionalTitle: "Software Engineering Student",
      ...contactFor("grace-mitchell", "Gurugram, Haryana"),
    },
    summary: "Software engineering student interested in clean architecture, testing, and maintainable frontend systems. Enjoys simplifying complex workflows into clear interfaces.",
    experience: [{ role: "Software Engineering Intern", organization: "CodeCraft Systems", type: "Internship", location: "Gurugram", startDate: "Jun 2025", endDate: "Aug 2025", description: "Worked on UI bug fixes, component cleanup, and test cases for a customer support dashboard." }],
    education: education("Bennett University", "B.Tech", "Software Engineering", "Software Design, Testing, Data Structures"),
    projects: [
      { name: "Bug Tracker Lite", technologies: "React.js, TypeScript, Supabase", description: "Built an issue tracking app with priority labels, status boards, and team assignment filters." },
      { name: "Study Planner", technologies: "Next.js, PostgreSQL, Tailwind CSS", description: "Created a planner for schedules, revision goals, and progress summaries." },
    ],
    skills: ["TypeScript", "React.js", "Next.js", "PostgreSQL", "Git", "Responsive Web Design", "Critical Thinking", "Time Management"],
    certifications: [cert("Software Engineering Virtual Experience", "JPMorgan Chase"), cert("React Basics", "Meta")],
    achievements: ["Maintained a 9.0 CGPA while contributing to team-based software projects.", ...baseAchievements],
  },
  swift: {
    personal: {
      fullName: "William Scott",
      professionalTitle: "Cyber Security Student",
      ...contactFor("william-scott", "Kochi, Kerala"),
    },
    summary: "Cyber security student focused on secure coding, network fundamentals, and practical security analysis. Interested in entry-level security and SOC internship roles.",
    experience: [{ role: "Security Lab Volunteer", organization: "University Cyber Cell", type: "Volunteer", location: "Kochi", startDate: "Feb 2025", endDate: "Present", description: "Documented lab exercises, monitored practice CTF tasks, and helped peers understand basic web security concepts." }],
    education: education("Cochin University of Science and Technology", "B.Tech", "Computer Science and Engineering", "Network Security, Operating Systems, Cryptography"),
    projects: [
      { name: "Phishing URL Classifier", technologies: "Python, Scikit-learn, Pandas", description: "Built a classifier using URL features and evaluated model performance with precision and recall metrics." },
      { name: "Password Strength Tool", technologies: "JavaScript, HTML5, CSS3", description: "Created a browser-based checker with entropy scoring and practical security suggestions." },
    ],
    skills: ["Python", "SQL", "Linux", "Networking", "JavaScript", "Git", "Problem Solving", "Attention to Detail"],
    certifications: [cert("Introduction to Cybersecurity", "Cisco Networking Academy"), cert("Security Fundamentals", "Microsoft Learn")],
    achievements: ["Finished in the top 15 teams in a college CTF event.", ...baseAchievements],
  },
};

export const sampleResumeData = sampleResumeDataByTemplate.launchpad;

export function getSampleResumeData(templateId = "launchpad") {
  return sampleResumeDataByTemplate[templateId] || sampleResumeData;
}
