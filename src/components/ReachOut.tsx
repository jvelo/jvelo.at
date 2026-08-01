import type { FC } from 'hono/jsx';

export const ReachOut: FC = () => {
  return (
    <section class="reach-out">
      <h2 class="section-title">REACH OUT</h2>
      <p class="accent">Working on an ambitious software product?</p>
      <p>If you need senior hands-on engineering help, I'd be glad to hear about it.</p>
      <p class="cta"><a href="#contact" class="cta-link" onclick="event.preventDefault(); document.querySelector('contact-form').open();">Let's talk →</a></p>
      <p>I usually reply within 2 business days.</p>
      <p>Or reach out via <a href="https://www.linkedin.com/in/jvelociter/">LinkedIn</a> or <a href="/connect">email</a>.</p>
    </section>
  );
};
