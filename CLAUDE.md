# Talha Tawsif portfolio — rules for Claude Code

- The full brief is `PORTFOLIO_SPEC.md`. Read it before any work; it wins over defaults.
- Never invent facts, numbers, dates, employers or skills. Use `[TODO: …]` and report it.
- Secrets: the OpenRouter key lives only in `.env.local` (git-ignored) and in Vercel environment variables as `OPENROUTER_API_KEY`. Never print it, log it, commit it or put it in client code. Make sure `.env*` is in `.gitignore` before the first commit.
- Only OpenRouter model ids ending in `:free`, enforced in code.
- Design: ClinIQ's tokens and rules in the spec. No gradients, emoji, purple, or big rounded shadowed cards.
- Australian English, sentence case, dates as `Mon YYYY`.
- Commit after each step with a clear message. Run lint, typecheck, build and tests before saying a step is done.
- Work order: `BUILD_PLAN.md`, one phase per session. Stop and report after each phase.
