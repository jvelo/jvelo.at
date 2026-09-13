import type { FC } from 'hono/jsx';

export const ReachOut: FC = () => {
  return (
    <section class="reach-out">
      <h2 class="section-title">Reach out</h2>
      <p class="accent">Working on an ambitious software product?</p>
      <p>I work alongside startup teams, building the product and leading the technical work when needed. Depending on the role, I can join full-time, part-time, or as a fractional CTO.</p>
      <p>I’m based in Toulouse and available for regular travel to Paris, London, Amsterdam, and a few other cities.</p>
      <p class="cta"><a href="#contact">Let's talk →</a></p>
      <p>I usually reply within 2 business days.</p>
      <p>See my <a href="/resume">résumé</a>, or reach me on <a href="https://www.linkedin.com/in/jvelociter/">LinkedIn</a> or by <a href="/connect">email</a>.</p>
    </section>
  );
};
