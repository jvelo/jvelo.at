import type { FC } from 'hono/jsx';

interface ExpertiseItem {
  title: string;
  description: string[];
}

const ExpertiseCard: FC<ExpertiseItem> = ({ title, description }) => {
  return (
    <div class="expertise-card">
      <h3 class="expertise-title">{title}</h3>
      <hr class="expertise-divider" />
      <div class="expertise-description">
        {description.map((p) => (
          <p>{p}</p>
        ))}
      </div>
    </div>
  );
};

export const Expertise: FC = () => {
  const items: ExpertiseItem[] = [
    {
      title: "Product engineering",
      description: [
        "I design, build, and ship software products — from early prototypes to production systems.",
        "Frontend, backend, infrastructure.",
        "I work across the full stack and own the outcome.",
      ],
    },
    {
      title: "Tech leadership",
      description: [
        "I help engineering teams deliver better.",
        "Architecture decisions, development practices, team structure.",
        "I can step in as a hands-on lead or advise from the side.",
      ],
    },
  ];

  return (
    <section class="expertise">
      <h2 class="section-title">EXPERTISE</h2>
      <div class="expertise-grid">
        {items.map((item) => (
          <ExpertiseCard {...item} />
        ))}
      </div>
    </section>
  );
};
