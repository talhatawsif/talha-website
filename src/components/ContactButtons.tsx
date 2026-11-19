import { Download, Mail, Phone } from "lucide-react";
import { profile } from "@/content/site";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { LinkButton } from "./Button";

/** LinkedIn, GitHub, Email and Call me, each with its logo; optionally the CV button. */
export function ContactButtons({ cv }: { cv?: boolean }) {
  return (
    <>
      <LinkButton href={profile.linkedin}><LinkedinIcon />LinkedIn</LinkButton>
      <LinkButton href={profile.github}><GithubIcon />GitHub</LinkButton>
      <LinkButton href={`mailto:${profile.email}`}><Mail size={16} strokeWidth={1.5} aria-hidden="true" />Email</LinkButton>
      <LinkButton href={`tel:${profile.phone}`}><Phone size={16} strokeWidth={1.5} aria-hidden="true" />Call me</LinkButton>
      {cv && (
        <LinkButton href={profile.cvUrl} variant="primary" download><Download size={16} strokeWidth={1.5} aria-hidden="true" />Download CV</LinkButton>
      )}
    </>
  );
}
