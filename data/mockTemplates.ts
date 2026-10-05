/**
 * Mock advice-generation templates, keyed by category slug.
 * Each category has enough variety that different questions in the
 * same category don't all read identically. A future backend can
 * replace `generateAdvicePoints` with a real API call without the
 * UI needing to change (see services/adviceService.ts).
 */
export const mockTemplates: Record<string, string[]> = {
  career: [
    'Weigh the cost of staying against the cost of switching — both have one.',
    'Talk to three people already doing the new path before you commit.',
    'A trial project beats a leap of faith. Test it in a low-stakes way first.',
    'Give yourself a fixed decision date so this doesn\u2019t drift for years.',
  ],
  business: [
    'Validate demand before you build anything — a landing page and 10 real conversations beat a prototype.',
    'Charge for it early, even a small amount. Free interest isn\u2019t the same as paid interest.',
    'Set a fixed testing window so the idea doesn\u2019t quietly become a permanent side project.',
    'Look for one repeatable channel to reach customers before scaling anything else.',
  ],
  finance: [
    'A rough 50/30/20 split (needs/wants/savings) is a starting point, not a rule — adjust to your reality.',
    'Automate the saving step so it doesn\u2019t depend on willpower each month.',
    'Build a small emergency buffer before optimizing for growth or returns.',
    'List every recurring cost once a quarter — subscriptions creep quietly.',
  ],
  relationships: [
    'Boundaries are about your own behavior, not controlling someone else\u2019s.',
    'State the boundary plainly, once, without over-explaining or apologizing for it.',
    'Expect some discomfort right after — that\u2019s normal, not a sign you did it wrong.',
    'Revisit the relationship\u2019s patterns after a few weeks, not in the heat of one moment.',
  ],
  growth: [
    'Attach the new habit to something you already do reliably, rather than to willpower.',
    'Make the first version embarrassingly small — smaller than feels worth doing.',
    'Track consistency, not intensity, for the first few weeks.',
    'Expect a slump around week three — plan for it instead of being surprised by it.',
  ],
  technology: [
    'It\u2019s rarely too late — the timeline is longer than people expect either way.',
    'Pick one focused project instead of scattering across many tutorials.',
    'Consistency over months beats intensity over days.',
    'Build in public in some small way — feedback speeds up learning a lot.',
  ],
  college: [
    'Pick a direction that keeps options open rather than the "perfect" choice.',
    'Talk to people two years ahead of you in that path about the actual day-to-day.',
    'You can change course later — switching rarely costs as much as it feels like it will.',
    'Weigh workload and energy fit as heavily as interest.',
  ],
  jobs: [
    'Anchor your answer in one specific result you produced, not general traits.',
    'Connect what you\u2019ve done to what the role actually needs, in their language.',
    'Keep it under 90 seconds — specific and short beats broad and long.',
    'Prepare two or three stories you can adapt to different questions.',
  ],
  lifestyle: [
    'Anchor the routine to a fixed time, not to feeling motivated.',
    'Design for your worst mornings, not your best ones.',
    'Review and adjust every couple of weeks instead of trying to get it perfect immediately.',
    'Remove one piece of friction rather than adding more willpower.',
  ],
  study: [
    'Space it out — three shorter sessions beat one long cram, even with the same total time.',
    'Test yourself actively instead of re-reading notes passively.',
    'Sleep before the exam matters more than the last hour of review.',
    'Study the topics you\u2019re avoiding first, while your focus is freshest.',
  ],
  productivity: [
    'Protect one deep-focus block a day rather than scattering focus across the whole day.',
    'Write tomorrow\u2019s top three tasks the night before.',
    'Batch shallow work (email, admin) instead of letting it interrupt deep work.',
    'Review what actually got done weekly, not just what got planned.',
  ],
  entrepreneurship: [
    'Talk to potential customers before writing a single line of code.',
    'Ship an intentionally rough first version to learn faster.',
    'Track one metric that actually reflects whether people want this.',
    'Give yourself permission to kill the idea if the signal is clearly negative.',
  ],
};

export function generateAdvicePoints(category: string): string[] {
  return mockTemplates[category] ?? mockTemplates.growth;
}
