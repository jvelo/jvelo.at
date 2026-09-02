import type { FC } from 'hono/jsx';

export const Hero: FC = () => {
  return (
    <section class="hero">
      <img src="/images/jvelo.png" alt="Jérôme Velociter" class="hero-photo border-backdrop" width="80" height="80" />
      <div class="hero-text">
        <h1 class="hero-title">Bonjour, I’m Jérôme, a <strong>freelance <span class="nowrap">Tech &amp; Product Lead</span></strong>.</h1>
        <p class="hero-lead">I help startups shape and ship ambitious software, either as a senior engineer or a hands‑on manager.</p>
        <p class="hero-cta"><a href="#contact">Let’s talk.</a></p>
      </div>
    </section>
  );
};
