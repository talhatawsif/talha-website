import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { certifications, cv, education, experience, profile, projects, skills } from "../content/site";
import { og } from "./og-tokens";

Font.registerHyphenationCallback((w) => [w]); // no mid-word breaks, ATS-friendly

const s = StyleSheet.create({
  page: { paddingTop: 34, paddingBottom: 34, paddingHorizontal: 40, fontFamily: "Helvetica", fontSize: 9, lineHeight: 1.35, color: "#000000" },
  name: { fontSize: 20, lineHeight: 1.2, fontFamily: "Helvetica-Bold" },
  role: { fontSize: 11, color: og.accent, marginTop: 3 },
  contact: { marginTop: 4, fontSize: 8.5 },
  avail: { marginTop: 2, fontSize: 8.5 },
  heading: { fontFamily: "Helvetica-Bold", fontSize: 10, color: og.accent, textTransform: "uppercase", letterSpacing: 0.5, borderBottomWidth: 0.5, borderBottomColor: "#999999", paddingBottom: 2, marginTop: 10, marginBottom: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  title: { fontFamily: "Helvetica-Bold", flex: 1 },
  date: { textAlign: "right" },
  sub: { color: "#333333", marginTop: 1 },
  entry: { marginBottom: 5 },
  bullet: { flexDirection: "row", marginTop: 1.5 },
  dot: { width: 8 },
  bulletText: { flex: 1 },
});

const strip = (u: string) => u.replace(/^https?:\/\//, "");
const Bullets = ({ items }: { items: string[] }) => (
  <>
    {items.map((t) => (
      <View key={t} style={s.bullet} wrap={false}>
        <Text style={s.dot}>•</Text>
        <Text style={s.bulletText}>{t}</Text>
      </View>
    ))}
  </>
);

/** An entry never splits across pages; a section heading stays with its first entry. */
const Entry = ({ title, date, sub, bullets, heading }: { title: string; date?: string; sub?: string; bullets?: string[]; heading?: string }) => (
  <View wrap={false} style={s.entry}>
    {heading && <Text style={s.heading}>{heading}</Text>}
    <View style={s.row}>
      <Text style={s.title}>{title}</Text>
      {date && <Text style={s.date}>{date}</Text>}
    </View>
    {sub && <Text style={s.sub}>{sub}</Text>}
    {bullets && <Bullets items={bullets} />}
  </View>
);

export function CvDocument() {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  const contact = [profile.location.replace(", Australia", "").replace("Victoria", "VIC"), profile.email, strip(profile.linkedin), strip(profile.github), site && strip(site)].filter(Boolean).join(" · ");
  const cert = certifications[0];
  return (
    <Document title={`${profile.name} CV`} author={profile.name} language="en-AU">
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{profile.name}</Text>
        <Text style={s.role}>{profile.role}</Text>
        <Text style={s.contact}>{contact}</Text>
        <Text style={s.avail}>{cv.availability}</Text>

        <View wrap={false}>
          <Text style={s.heading}>Summary</Text>
          <Text>{cv.summary}</Text>
        </View>

        {projects.map((p, i) => (
          <Entry key={p.slug} heading={i === 0 ? "Projects" : undefined} title={`${p.name}: ${p.tagline}`} date={p.cvDates} sub={`${strip(p.liveUrl)} · ${p.caseStudy.stackLine.split(" · ").join(", ")}`} bullets={p.cvBullets} />
        ))}

        {experience.map((e, i) => (
          <Entry key={e.role} heading={i === 0 ? "Experience" : undefined} title={e.role} date={e.dates} sub={e.organisation} bullets={[e.did]} />
        ))}

        {education.map((e, i) => (
          <Entry key={e.qualification} heading={i === 0 ? "Education" : undefined} title={`${e.qualification}, ${e.institutionLabel}`} date={e.dates} bullets={[e.notes]} />
        ))}

        <Entry heading="Certification" title={`${cert.name}, ${cert.issuer}`} date={cert.date} bullets={[`Five courses: ${cert.courses.join("; ")}. ${cert.credits} credits.`]} />

        <View wrap={false}>
          <Text style={s.heading}>Skills</Text>
          {skills.map((g) => (
            <Text key={g.group} style={{ marginTop: 1.5 }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>{g.group}: </Text>
              {g.items.join(", ")}
            </Text>
          ))}
          <Text style={{ marginTop: 1.5 }}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Languages: </Text>
            {cv.languages}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
