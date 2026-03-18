import type { FC } from 'hono/jsx';

export const ReachOut: FC = () => {
  return (
    <section class="reach-out">
      <h2 class="section-title">REACH OUT</h2>
        <p class="accent">Let's build something ambitious.</p>
        <p>If you need help with product engineering or tech leadership,
            I'd love to hear about it.</p>
      <p class="cta"><a href="#contact" class="cta-link" onclick="event.preventDefault(); document.querySelector('contact-form').open();">Work with me →</a></p>
      <p>Or reach out via <a href="https://www.linkedin.com/in/jvelociter/">LinkedIn</a> or <a href="/connect">email</a></p>
    </section>
  );
};
