
export interface DorkPattern {
  name: string;
  pattern: string;
  description: string;
  sites?: string[];
}

export const GOOGLE_DORK_PATTERNS = {
  // Contact information patterns
  CONTACT_INFO: [
    {
      name: 'Email Directories',
      pattern: 'intext:"@{domain}" AND intext:"{role}" AND intext:"{location}"',
      description: 'Find email addresses with specific roles and locations'
    },
    {
      name: 'Contact Pages',
      pattern: 'inurl:contact AND intext:"{industry}" AND intext:"{location}"',
      description: 'Contact pages for specific industries'
    }
  ],

  // Professional networks
  PROFESSIONAL: [
    {
      name: 'LinkedIn Profiles',
      pattern: 'site:linkedin.com/in AND intext:"{role}" AND intext:"{location}" AND intext:"{industry}"',
      description: 'LinkedIn profiles matching criteria',
      sites: ['linkedin.com']
    },
    {
      name: 'LinkedIn Company Pages',
      pattern: 'site:linkedin.com/company AND intext:"{industry}" AND intext:"{location}"',
      description: 'LinkedIn company pages',
      sites: ['linkedin.com']
    }
  ],

  // Social media platforms
  SOCIAL: [
    {
      name: 'Reddit Posts',
      pattern: 'site:reddit.com AND intext:"{role}" AND intext:"{location}" AND intext:"hiring"',
      description: 'Reddit posts about hiring or job opportunities',
      sites: ['reddit.com']
    },
    {
      name: 'Reddit Job Subreddits',
      pattern: 'site:reddit.com/r/jobs OR site:reddit.com/r/forhire AND intext:"{industry}" AND intext:"{location}"',
      description: 'Reddit job and hiring subreddits',
      sites: ['reddit.com']
    },
    {
      name: 'Twitter Profiles',
      pattern: 'site:twitter.com AND intext:"{role}" AND intext:"{location}" AND intext:"email"',
      description: 'Twitter profiles with contact info',
      sites: ['twitter.com']
    },
    {
      name: 'Twitter Job Posts',
      pattern: 'site:twitter.com AND intext:"hiring" AND intext:"{industry}" AND intext:"{location}"',
      description: 'Twitter job postings',
      sites: ['twitter.com']
    }
  ],

  // Business directories
  DIRECTORIES: [
    {
      name: 'Business Listings',
      pattern: 'site:yellowpages.com OR site:yelp.com AND intext:"{industry}" AND intext:"{location}"',
      description: 'Business directory listings',
      sites: ['yellowpages.com', 'yelp.com']
    }
  ]
};

export const CONTACT_DORKS = [
  'intext:"email" AND intext:"phone"',
  'intext:"contact us" AND intext:"@"',
  'intext:"reach out" AND intext:"call"',
  'inurl:contact AND intext:"@"'
];

export const LOCATION_MODIFIERS = [
  'intext:"{city}"',
  'intext:"{city}, {state}"',
  'intext:"{state}"',
  'near "{city}"'
];

export const ROLE_PATTERNS = [
  'intitle:"{role}"',
  'intext:"{role}"',
  'intext:"{role} at"'
];
