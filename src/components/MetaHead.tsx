
import { Helmet } from "react-helmet";

function MetaHead() {
  return (
    <Helmet>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href="https://www.coderesite.com" />

      {/* Title - Set first to prevent any temporary titles */}
      <title>CodeResite – AI Tools, Automation, Web Development & Cybersecurity</title>

      {/* Favicon & Web App Icons */}
      <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/assets/favicon-96x96.png" />
      <link rel="icon" type="image/x-icon" href="/assets/favicon.ico" />
      <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />

      {/* Web App Manifest */}
      <link rel="manifest" href="/assets/site.webmanifest" />

      {/* Optional PWA Icons */}
      <link rel="icon" type="image/png" sizes="192x192" href="/assets/web-app-manifest-192x192.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/assets/web-app-manifest-512x512.png" />

      {/* Bing Site Verification (optional) */}
      <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" />

      {/* Meta Description & Keywords */}
      <meta
        name="description"
        content="CodeResite is an AI-powered platform offering cutting-edge tools like PPT generators, report creators, and lead generation. We also provide services in AI automation, web/app development, and cybersecurity for students, developers, and businesses."
      />
      <meta
        name="keywords"
        content="CodeResite, Codify Club, AI Tools, PPT Generator, Report Generator, Lead Generation, Automation, Web Development, App Development, Cybersecurity, Signature Tools, Student Tools"
      />
      <meta name="author" content="Sanskar Dubey" />

      {/* Open Graph */}
      <meta property="og:title" content="CodeResite – AI Tools & Services" />
      <meta
        property="og:description"
        content="Explore AI automation, cybersecurity, website & app development, and intelligent tools like the PPT builder. Ideal for students, creators, and startups."
      />
      <meta property="og:url" content="https://www.coderesite.com" />
      <meta property="og:image" content="https://www.coderesite.com/assets/og-image.jpg" />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@CodeResite" />
      <meta name="twitter:title" content="CodeResite – AI Automation, Web Development & More" />
      <meta
        name="twitter:description"
        content="Join CodeResite to explore powerful AI tools, cybersecurity solutions, and development services."
      />
      <meta name="twitter:image" content="https://www.coderesite.com/assets/og-image.jpg" />
      <meta
        name="twitter:hashtags"
        content="CodeResite,AIPlatform,Automation,WebDev,AppDev,CyberSecurity,StudentTools,PPTGenerator,CodifyClub"
      />

      {/* Remix Icon */}
      <link
        href="https://cdn.jsdelivr.net/npm/remixicon@4.1.0/fonts/remixicon.css"
        rel="stylesheet"
      />

      {/* Main CSS */}
      <link rel="stylesheet" href="/styles.css" />
    </Helmet>
  );
}

export default MetaHead;
