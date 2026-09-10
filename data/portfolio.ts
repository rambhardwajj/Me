export interface SkillItem {
  prefix: string;
  name: string;
  category?: string;
}

export interface ExperienceRole {
  title: string;
  subtitle?: string;
  period: string;
  bullets: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  shortName: string;
  location: string;
  roles: ExperienceRole[];
  period: string;
  isCurrent?: boolean;
  highlight: string;
  description?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  role: string;
  subtitle: string;
  metrics: string;
  period: string;
  description: string;
  bullets: string[];
  tags: string[];
  featured?: boolean;
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  location: string;
  highlights: string[];
}

export interface AchievementItem {
  title: string;
  organization: string;
  year: string;
  description: string;
  badge?: string;
}

export const PORTFOLIO_DATA = {
  personal: {
    name: "Ram Bhardwaj",
    handle: "@bhardwajram",
    headline: "Founder-operator blending strategic diagnosis with technical & business execution.",
    subline: "Experienced in driving GTM, product, vendor management, partnerships & operations across B2B & D2C. Scaled ventures $0 to $6K MRR.",
    currentFocus: "PGP in Tech & Business @ Masters' Union",
    location: "Gurugram / Noida, India",
    statusText: "Open to High-Impact Leadership & Founder-Operator Roles",
    avatar: "/images/avatar.png",
    photo: "/images/ram-photo.jpg",
    photoDate: "SEP 10, 2026",
    socials: {
      email: "ram.bhardwaj2027@mastersunion.org",
      phone: "+91 8433239806",
      linkedin: "https://www.linkedin.com/in/bhardwajram",
      github: "https://github.com/bhardwajram",
      twitter: "https://x.com/bhardwajram",
      resume: "https://www.linkedin.com/in/bhardwajram",
    },
  },

  skills: [
    { prefix: "STR", name: "GTM Strategy" },
    { prefix: "PRT", name: "Next.js" },
    { prefix: "PRT", name: "React.js" },
    { prefix: "AUT", name: "AI Agents" },
    { prefix: "BCK", name: "Python" },
    { prefix: "DBT", name: "SQL" },
    { prefix: "CLD", name: "AWS & GCP" },
    { prefix: "AUT", name: "n8n & Make" },
    { prefix: "MGT", name: "Jira / Scrum" },
    { prefix: "AI",  name: "Claude AI" },
    { prefix: "OPS", name: "Power BI" },
    { prefix: "DES", name: "UI/UX Design" },
  ] as SkillItem[],

  experiences: [
    {
      id: "newral",
      company: "Newral - CSXExplained Private Limited",
      shortName: "NEWRAL",
      location: "Noida, India",
      period: "Oct '25 - Jun '26",
      isCurrent: true,
      highlight: "Scaled $0 to $6K MRR • 75% revenue surge • 50% cloud cost reduction • YC Wingathon Winner",
      roles: [
        {
          title: "Product Lead",
          subtitle: "Strategy, GTM & Business Growth",
          period: "Oct '25 - Jun '26",
          bullets: [
            "Scaled business from $0 to $6K MRR by structuring GTM, dynamic pricing, customer acquisition, and monetization strategy alongside the Founder.",
            "Drove 75% revenue growth by partnering directly with the Founder to formulate and execute agile GTM campaigns.",
            "Doubled user engagement by prioritizing high-impact product campaigns that accelerated feature adoption and retained core accounts.",
            "Increased platform traffic by 25% through performance marketing, precise market segmentation, and inbound acquisition funnels.",
            "Cut overall cloud infrastructure cost by 50% by evaluating two strategic partnerships and negotiating with ACE Cloud and Google.",
            "Saved 90+ manual hours/month by building custom AI agents to automate financial data reconciliation and variance reporting.",
            "Increased client satisfaction by 21% by implementing an automated customer feedback and rapid resolution pipeline.",
          ],
        },
        {
          title: "Tech Lead (Product)",
          subtitle: "Infrastructure, Cost & Team Leadership",
          period: "Jan '26 - Jun '26",
          bullets: [
            "Reduced operational costs by 30% by orchestrating seamless migration of AWS and GCP workloads to ACE Cloud with zero business downtime.",
            "Represented the company at VibeCon Hackathon in Bangalore (Top 10 out of 30,000+ applicants) and won the YC-affiliated Wingathon.",
            "Formulated the company's first KPI-driven engineering performance framework to establish accountability and track output.",
            "Improved sprint efficiency by 20% by integrating Jira workflows, sprint forecasting, and asynchronous execution tracking.",
          ],
        },
        {
          title: "Software Engineer",
          subtitle: "AI Platforms & Content Architecture",
          period: "Oct '25 - Jan '26",
          bullets: [
            "Architected an AI SaaS LMS and a high-throughput Voice Agent platform for large-scale enterprise content delivery and real-time streaming.",
          ],
        },
      ],
    },
    {
      id: "ciena",
      company: "Ciena",
      shortName: "CIENA",
      location: "Gurugram, India",
      period: "Jan '24 - Oct '25",
      isCurrent: false,
      highlight: "Saved 4+ hrs daily across 5+ global teams • $30K+ software savings • EDST Customer's First Award",
      roles: [
        {
          title: "IT Applications Analyst",
          subtitle: "Communications, Collaborations & AI Governance",
          period: "Jul '24 - Oct '25",
          bullets: [
            "Saved 4+ hours daily across 5+ global teams by formulating automated Government Relations & robotic process workflows.",
            "Produced 30+ promotional knowledge base videos, enabling self-directed onboarding and driving enterprise tool adoption at scale.",
            "Reduced SLA breaches by 35% by redesigning ticket escalation workflows and strengthening cross-functional governance.",
            "Eliminated $30K+ in recurring annual software costs by auditing enterprise software licenses and de-provisioning inactive accounts.",
            "Optimized enterprise software spend by evaluating application ROI and leading procurement recommendations for leadership.",
            "Enhanced EDST visibility of Collaboration initiatives by presenting across enterprise-wide global intranet forums.",
            "Strengthened AI governance by coordinating with Government Relations & Security teams to audit and upgrade enterprise AI policies.",
          ],
        },
        {
          title: "IT / Ops Intern",
          subtitle: "Enterprise Automation & Tool Administration",
          period: "Jan '24 - Jun '24",
          bullets: [
            "Supported 300+ enterprise users by resolving 100+ critical operational requests and administering 8 enterprise collaboration suites.",
            "Saved 3+ hours of daily repetitive work by automating Excel and data processing pipelines using Python scripts adopted across 9 teams (180 employees).",
          ],
        },
      ],
    },
    {
      id: "isro",
      company: "Ingenious Research Solutions",
      shortName: "RESEARCH INTERN",
      location: "Noida, India",
      period: "Jun '23 - Jul '23",
      isCurrent: false,
      highlight: "Supported ISRO's project for distributed data security using blockchain prototypes.",
      roles: [
        {
          title: "Research Intern",
          period: "Jun '23 - Jul '23",
          bullets: [
            "Supported ISRO's project for introducing a blockchain-based prototype improving data security in distributed systems.",
            "Benchmarked cryptographic performance and network throughput for mission-critical consensus protocols.",
          ],
        },
      ],
    },
  ] as ExperienceItem[],

  projects: [
    {
      id: "synappses",
      title: "Synappses",
      role: "Co-Founder",
      subtitle: "AI SaaS LMS for B2B Coaching Centers",
      period: "Apr '26 - Jun '26",
      metrics: "$0 -> $6K MRR • 20-Member Team",
      description: "Comprehensive AI-driven LMS empowering education coaching centers to digitalize curriculum, automate evaluation, and stream live interactive classes.",
      bullets: [
        "Bootstrapped and scaled from 0 to $6K MRR by leading a 20-member cross-functional team spanning product, sales, and engineering.",
        "Built dynamic AI assessment tools and automated content generation workflows for coaching institutes.",
        "Authored investor pitch decks, financial forecasts, and managed early-stage institutional investor conversations.",
      ],
      tags: ["AI SaaS", "EdTech", "B2B LMS", "Next.js", "GTM"],
      featured: true,
    },
    {
      id: "trucost",
      title: "TruCost",
      role: "Co-Founder",
      subtitle: "In-Transit AdTech & Smart Cab Mobility",
      period: "Jan '26 - Jun '26",
      metrics: "₹2,50,000 Contract • Full App Suite",
      description: "An innovative mobility and transportation network featuring targeted digital advertising displays integrated into driver seat headrests.",
      bullets: [
        "Secured a ₹2,50,000 contract for end-to-end R&D, GTM market strategy, and software delivery of the complete cab-service ecosystem.",
        "Spearheaded commercialization, unit economics, rider-driver matching logic, and advertiser onboarding portal.",
      ],
      tags: ["AdTech", "Mobility", "Product Ops", "Hardware Integration"],
      featured: true,
    },
    {
      id: "dropshipping",
      title: "11.2L D2C Dropshipping",
      role: "Founder",
      subtitle: "E-Commerce Venture @ Masters' Union",
      period: "2026",
      metrics: "₹11.2L Revenue • 100% Automated Ops",
      description: "Built and scaled a profitable D2C e-commerce dropshipping brand from scratch as part of Masters' Union hands-on venture challenge.",
      bullets: [
        "Generated ₹11.2 Lakhs in gross revenue through high-converting ad creatives, viral hooks, and funnel optimization.",
        "Automated fulfillment, inventory syncing, and customer support with webhook pipelines.",
      ],
      tags: ["D2C", "E-Commerce", "Growth Marketing", "Automations"],
      featured: true,
    },
  ] as ProjectItem[],

  education: [
    {
      institution: "Masters' Union",
      degree: "PGP in Technology & Business Management",
      period: "2026 - Present",
      location: "Gurugram, India",
      highlights: [
        "Locked Core Member, Netflix Fraternity (Selected 4 out of 430 candidates)",
        "Built ₹11.2 Lakh revenue dropshipping business",
        "Built & scaled a 200+ member community, enabling problem solvers through a custom tech web platform",
      ],
    },
    {
      institution: "Amity University",
      degree: "Masters of Computer Applications (MCA)",
      period: "2022 - 2024",
      location: "Noida, India",
      highlights: [
        "8.04 / 10 CGPA",
        "Rank 1 Coder Candidate (1 out of 400+ students)",
        "Secured prestigious Day-0 campus placement at Ciena",
      ],
    },
    {
      institution: "Ramjas College, Delhi University",
      degree: "Bachelor's of Sciences (B.Sc)",
      period: "2019 - 2022",
      location: "Delhi, India",
      highlights: [
        "7.712 CGPA",
        "Head Choreographer - Ramjas Dance Society",
        "Winner of 10+ Inter-College Dance competitions nationwide",
      ],
    },
    {
      institution: "St. Dominic's Sr. Sec. School",
      degree: "CBSE PCM (Class 12: 91% | Class 10: 8.8 CGPA)",
      period: "2018 - 2019",
      location: "Mathura, India",
      highlights: [
        "House Captain & All-Batch Top 10% Topper",
        "Badminton Gold-Medalist",
      ],
    },
  ] as EducationItem[],

  achievements: [
    {
      title: "Winner, YC Wingathon Hackathon",
      organization: "Y Combinator affiliated / VibeCon",
      year: "2026",
      description: "Built and pitched the best product in 24 hours at the national hackathon (Top 10 out of 30,000+ applicants).",
      badge: "National Winner",
    },
    {
      title: "Employee of the Year (2025)",
      organization: "Newral - CSXExplained",
      year: "2025",
      description: "Recognized and awarded as the #1 best Employee of the Year across the entire organization.",
      badge: "Top Performer",
    },
    {
      title: "EDST Customer's First Award",
      organization: "Ciena",
      year: "2024",
      description: "First ever New Grad in company history to win the annual enterprise-wide award (4 selected out of 14,000+ employees globally).",
      badge: "4 / 14,000 Global",
    },
    {
      title: "Super 30 Hacker House Fellow",
      organization: "100xSchool (Funded by YC)",
      year: "2025 - 2026",
      description: "Selected as 1 of 30 builders nationwide in the elite builder-intensive hacker house.",
      badge: "1 of 30 Nationwide",
    },
    {
      title: "World Finalist - Top 16 Global",
      organization: "Chicago Footworkology",
      year: "2021",
      description: "Represented India on the international world stage in Chicago Footworkology World Final (Top 16).",
      badge: "World Top 16",
    },
    {
      title: "Top 10 Winner, CienaGPT AI Hackathon",
      organization: "Ciena Global",
      year: "2024",
      description: "Won company-wide AI agent hackathon amongst 800+ engineers and technologists.",
      badge: "Top 10 / 800",
    },
  ] as AchievementItem[],

  leadership: [
    {
      title: "Outstation Fest Head",
      organization: "Ramjas Dance Society",
      description: "Coordinated 10+ outstation fests, managing travel, slots, hotel accommodations, and university compliance.",
    },
    {
      title: "Students Affairs Head",
      organization: "100xSchool Super 30 2.0 Cohort",
      description: "Mentored 30+ students to crack Google Summer of Code (GSoC 2026) by refining contributions and technical portfolios.",
    },
  ],

  nowPlaying: {
    title: "Golden Hour",
    artist: "JVKE",
    albumArt: "/images/album-art.jpg",
    status: "NOW PLAYING",
    trackDuration: "3:29",
  },
};
