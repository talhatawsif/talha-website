"use client";

import { useState } from "react";

type Seg = "MSH" | "PID" | "OBR" | "OBX";

const hl7: [Seg, string][] = [
  ["MSH", "MSH|^~\\&|LAB|SYNTHLAB|CLINIQ|DEMO|20250301101500+1100||ORU^R01|MSG0001|P|2.4"],
  ["PID", "PID|1||12345^^^SYNTHLAB^MR||Citizen^Sample||19800101|F"],
  ["OBR", "OBR|1|ORD0001||14682-9^Creatinine^LN|||20250301093000+1100"],
  ["OBX", "OBX|1|NM|14682-9^Creatinine^LN||82|umol/L|45-90|N|||F"],
];

const fhir: [string, Seg[]][] = [
  ["{", []],
  ['  "resourceType": "Observation",', []],
  ['  "id": "synthlab-ord0001-12345",', ["MSH", "OBR", "PID"]],
  ['  "status": "final",', ["OBX"]],
  ['  "code": { "coding": [{ "system": "http://loinc.org", "code": "14682-9",', ["OBX"]],
  ['    "display": "Creatinine [Moles/volume] in Serum or Plasma" }] },', ["OBX"]],
  ['  "subject": { "reference": "Patient/12345" },', ["PID"]],
  ['  "effectiveDateTime": "2025-03-01T09:30:00+11:00",', ["OBR"]],
  ['  "issued": "2025-03-01T10:15:00+11:00",', ["MSH"]],
  ['  "valueQuantity": { "value": 82, "unit": "umol/L",', ["OBX"]],
  ['    "system": "http://unitsofmeasure.org", "code": "umol/L" },', ["OBX"]],
  ['  "referenceRange": [{ "text": "45-90" }],', ["OBX"]],
  ['  "interpretation": [{ "coding": [{ "code": "N" }] }]', ["OBX"]],
  ["}", []],
];

const caption: Record<Seg, string> = {
  MSH: "MSH names the sender and the message time. The sender, with the order and patient, forms the Observation id, so a resend updates the same record. The time becomes issued.",
  PID: "PID identifies the patient. The medical record number becomes the Patient reference; ClinIQ also cross-checks date of birth before it accepts a result.",
  OBR: "OBR is the order. Its number feeds the Observation id, and the observation time becomes effectiveDateTime.",
  OBX: "OBX is the result itself: the LOINC code, value and unit, reference range, abnormal flag and result status.",
};

export function Hl7Explainer() {
  const [active, setActive] = useState<Seg | null>(null);
  return (
    <div>
      <p className="mb-2 text-sm text-text-muted">Synthetic sample. Hover or focus a segment to see where it goes.</p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <h3 className="mb-1 text-sm font-medium">HL7 v2 ORU^R01 (synthetic sample)</h3>
          <div className="rounded-sm border border-border bg-sunken p-2 font-mono text-xs">
            {hl7.map(([seg, line]) => (
              <button
                key={seg}
                type="button"
                onMouseEnter={() => setActive(seg)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(seg)}
                onBlur={() => setActive(null)}
                aria-describedby="hl7-caption"
                className={`block w-full whitespace-pre-wrap [overflow-wrap:anywhere] rounded-sm px-1.5 py-1 text-left transition-opacity duration-150 ${active && active !== seg ? "opacity-50" : ""} ${active === seg ? "bg-surface outline outline-1 outline-accent" : ""}`}
              >
                {line}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-1 text-sm font-medium">FHIR R4 Observation</h3>
          <pre className="whitespace-pre-wrap rounded-sm border border-border bg-sunken p-2 font-mono text-xs [overflow-wrap:anywhere]" aria-label="FHIR Observation">
            {fhir.map(([line, segs], i) => {
              const on = active && segs.includes(active);
              return (
                <span key={i} className={`block whitespace-pre-wrap border-l-2 pl-1.5 transition-opacity duration-150 ${on ? "border-accent" : "border-transparent"} ${active && !on ? "opacity-40" : ""}`}>
                  {line}
                </span>
              );
            })}
          </pre>
        </div>
      </div>
      <p id="hl7-caption" role="status" className="mt-2 min-h-[3.2em] text-sm">{active ? caption[active] : "Four segments become one Observation."}</p>
    </div>
  );
}
