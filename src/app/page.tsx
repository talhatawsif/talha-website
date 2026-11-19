import { CertificationsSection, ContactSection, EducationSection, ExperienceSection, ProjectsSection, SkillsSection, SummarySection } from "@/components/HomeSections";
import { IdentityBanner } from "@/components/IdentityBanner";

export default function Home() {
  return (
    <main id="main">
      <IdentityBanner />
      <SummarySection />
      <ProjectsSection />
      <ExperienceSection />
      <EducationSection />
      <SkillsSection />
      <CertificationsSection />
      <ContactSection />
    </main>
  );
}
