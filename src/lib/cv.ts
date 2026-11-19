import { existsSync } from "node:fs";
import { join } from "node:path";
import { profile } from "@/content/site";

/** True when the CV PDF exists in /public at build time. */
export const hasCv = () => existsSync(join(process.cwd(), "public", profile.cvUrl));
