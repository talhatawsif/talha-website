import { CertificationsSection, ContactSection, EducationSection, ExperienceSection, ProjectsSection, SkillsSection, SummarySection } from "@/components/HomeSections";
import { JsonLd } from "@/components/JsonLd";
import { profile } from "@/content/site";
import { AskPanel } from "@/components/AskPanel";
import { IdentityBanner } from "@/components/IdentityBanner";

export default function Home() {
  return (
    <main id="main">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: profile.name,
          jobTitle: "Software developer",
          alumniOf: ["Kent Institute Australia", "Swinburne University of Technology", "BRAC University", "Stanford University School of Medicine"].map((name) => ({ "@type": "EducationalOrganization", name })),
          knowsAbout: ["FHIR", "HL7 v2", "SNOMED CT-AU", "Health informatics", "TypeScript", "Next.js", "PostgreSQL"],
          sameAs: [profile.linkedin, profile.github],
        }}
      />
      <IdentityBanner />
      <SummarySection />
      <ProjectsSection />
      <ExperienceSection />
      <EducationSection />
      <CertificationsSection />
      <SkillsSection />
      <AskPanel />
      <ContactSection />
    </main>
  );
}
