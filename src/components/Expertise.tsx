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
      title: "End-to-end product engineering",
      description: [
        "I design, build, and ship software products from first implementation to production.",
        "Frontend, backend, infrastructure, and the glue in between.",
        "I help turn product and technical direction into working software.",
      ],
    },
    {
      title: "Technical leadership for teams and products",
      description: [
        "I help teams make better technical decisions and work together more effectively.",
        "Architecture matters, as do clarity, ownership, and the way a team works together.",
        "I can step in as a lead, a senior individual contributor, or a close technical partner.",
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
