import type { FC } from 'hono/jsx';

export const Hero: FC = () => {
  return (
    <section class="hero">
      <img src="/images/jvelo.png" alt="Jérôme Velociter" class="hero-photo border-backdrop" width="80" height="80" />
      <div class="hero-text">
        <h1 class="hero-name">Jérôme Velociter</h1>
        <p class="hero-meta">Freelance <span class="nowrap">Product Engineer &amp; Tech Lead</span></p>
        <p class="hero-lead">I build software alongside startup teams, from early product conversations onward.</p>
        <p class="hero-cta">
          <a href="#contact">Let’s talk.</a>
          <a href="/about" class="hero-about">More about me →</a>
        </p>
      </div>
    </section>
  );
};
