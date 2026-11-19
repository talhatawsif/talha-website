// OpenRouter's free-models router has no ":free" suffix but is priced at zero. It is the only exception;
// the breaker in ask.ts still trips if the model that actually answers does not end in ":free".
const FREE_ROUTER = "openrouter/free";

/** Only OpenRouter model ids ending in `:free` (plus the free router) may ever be requested. */
export function assertFree(model: string): void {
  if (model !== FREE_ROUTER && !model.endsWith(":free")) throw new Error(`Refusing non-free model id: ${model}`);
}

export const NOT_ON_SITE = "That isn't on my site yet. Please email me.";
export const RESTING = "The assistant is resting. Please email me instead.";
export const REFUSAL = "I can only answer questions about Talha's work, study and skills from this site. Please email me for anything else.";

const refusals: RegExp[] = [
  /\b(salary|pay rate|hourly rate|how much (does|do|would|will) (he|talha) (earn|cost|charge)|expected pay|remuneration)\b/i,
  /\b(visa|citizen(ship)?|work rights|permanent residen|immigration|sponsorship)\b/i,
  /\b(home address|street address|phone number|mobile number|date of birth|birthday|how old|\bage\b|religion|marital|girlfriend|boyfriend|married|ethnicity|passport|tax file)\b/i,
  /\b(should (i|we) (hire|employ|choose)|would you recommend|give me (some )?advice|your advice|what should i do|is (he|talha) (better|worse)|better than)\b/i,
  /\b(what do you think (of|about)|your opinion|do you like|who is (the )?best|opinion (of|on|about))\b/i,
  /\b(ignore|disregard|forget|override)\b.{0,40}\b(instruction|prompt|rule|above|previous)s?\b/i,
  /\b(system prompt|developer message|reveal your (prompt|instructions)|you are now|act as|pretend (to be|you)|jailbreak|\bDAN\b)\b/i,
];

export const isRefusal = (q: string) => refusals.some((r) => r.test(q));
