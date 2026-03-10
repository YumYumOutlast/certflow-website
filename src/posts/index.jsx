export const posts = [
  {
    slug: "coi-edge-cases-trucking-insurance-agency",
    title: "The 15 COI Edge Cases That Trip Up Every Trucking Insurance Agency",
    date: "2026-03-10",
    metaDescription: "From MCS-90 endorsements to Canal Insurance quirks — the 15 certificate of insurance edge cases that cause delays, errors, and E&O exposure at trucking agencies.",
    primaryKeyword: "COI edge cases trucking insurance",
    tags: ["coi-automation", "trucking-insurance", "acord-25", "mcs-90"],
    readTime: "7 min read",
    author: "Dylan Brown",
    sections: [
      {
        heading: "Why COI Processing Is Harder Than It Looks",
        body: "If you run a small trucking insurance agency, you already know the drill. A client needs a certificate before they can haul. Their broker calls. Their dispatcher texts. Your CSR drops everything and starts building the ACORD 25 from scratch. Then something is off. The carrier has a quirk nobody documented. It goes back and forth three times and the truck sits. These patterns repeat dozens of times a week at agencies handling trucking accounts.",
      },
      {
        heading: "1. MCS-90 Endorsements on Non-Standard Carriers",
        body: "The MCS-90 is a federal endorsement required for motor carriers in interstate commerce. Carriers like Progressive and Canal attach it differently — sometimes embedded in the declarations, sometimes as a standalone form. If your CSR doesn't know where to look, they either miss it or double-list it.",
      },
      {
        heading: "2. CG 20 01 vs CG 20 37 — The Wrong Additional Insured Form",
        body: "These two forms are not interchangeable. CG 20 01 covers ongoing operations. CG 20 37 covers completed operations. Shippers and brokers often request one when they mean the other. Issuing the wrong one creates E&O exposure nobody wants.",
      },
      {
        heading: "3. Canal Insurance's Endorsement Attachment Style",
        body: "Canal attaches certain endorsements including CA 04 44 as policy amendments rather than separate forms. Your system may not flag them as present even when they are. Canal accounts require a separate verification step most CSRs don't know to do.",
      },
      {
        heading: "4. CA 04 44 — Waiver of Subrogation Confusion",
        body: "The CA 04 44 waiver of subrogation endorsement is frequently requested by shippers but isn't always included by default. Some carriers require a separate endorsement request. Issuing a cert that shows it when it hasn't been formally added is a serious E&O risk.",
      },
      {
        heading: "5-10: Volume, Limits, and Owner-Operators",
        body: "Northland frequently writes trucking accounts with split policies — one for auto liability, one for cargo — and both need to be correctly represented without doubling limits. Progressive uses a non-standard policy number format that's easy to transcribe incorrectly. Same-day certificates with pending endorsements force judgment calls with real E&O implications. Aggregate vs per-occurrence limit confusion regularly invalidates contracts. Owner-operators on fleet policies need certificates that correctly reflect the named insured structure or they can't haul.",
      },
      {
        heading: "11-15: Endorsements, Regional Carriers, and Cert Holder Requirements",
        body: "Hired and non-owned auto endorsements are requested constantly but aren't always on the base policy — one of the most common E&O sources. CNA's extended reporting period language affects how claims-made policies appear on certificates. Midwest regional carriers with limited AMS integration force manual data entry under pressure. NL&F and Sentry use endorsement form numbers that differ from standard ACORD references. Auto-Owners has specific requirements for how certificate holders must be listed — a minor variation gets the cert rejected.",
      },
      {
        heading: "What This Means for Your Agency",
        body: "None of these are hypothetical. They're patterns documented across hundreds of actual trucking COI requests. Manual knowledge doesn't scale. It walks out the door when your best CSR leaves. It slows down under volume. The agencies moving fastest are treating COI processing like a repeatable system, not a tribal knowledge exercise.",
      },
    ],
    faq: [
      {
        question: "What is a COI edge case in trucking insurance?",
        answer: "A COI edge case is any certificate of insurance request that falls outside standard processing — unusual endorsements, carrier-specific formatting quirks, split policies, or conflicting limit requirements. Trucking accounts have far more edge cases than standard commercial lines.",
      },
      {
        question: "What endorsements are most commonly requested on trucking COIs?",
        answer: "MCS-90, CG 20 01, CG 20 37, CA 04 44, and hired/non-owned auto are the most common. Each has carrier-specific variations that affect how they appear on the certificate.",
      },
      {
        question: "How does CertFlow handle carrier-specific COI quirks?",
        answer: "CertFlow is trained on carrier-specific behaviors for Progressive, Canal, Northland, Great West, CNA, NL&F, Sentry, Auto-Owners, and Midwest regional carriers — each with documented processing rules.",
      },
    ],
    cta: "If your team is spending significant time on certificate requests, we're happy to show you exactly how CertFlow handles these edge cases in a live 20-minute demo. Book at certflo.io or reach out to dylan@certflo.io.",
  },
];

export function getPostBySlug(slug) {
  return posts.find(p => p.slug === slug) || null;
}

export function getAllPosts() {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}
