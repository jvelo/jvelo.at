import type { FC } from 'hono/jsx';

interface Territory {
  title: string;
  description: string;
  examples: string[];
}

const territories: Territory[] = [
  {
    title: "Product engineering",
    description: "Turning product ideas into reliable software, from early decisions to launch and continued evolution.",
    examples: ["SaaS", "AI", "Apps", "E-commerce", "Internal tools"],
  },
  {
    title: "Data & infrastructure",
    description: "Data collection and infrastructure with the observability needed to keep systems understandable and reliable.",
    examples: ["Cloud", "Observability", "Security", "IaC"],
  },
  {
    title: "Machines & field systems",
    description: "Software bridging IT and OT, from controlling and monitoring equipment in the field to integrating it with cloud services.",
    examples: ["Embedded Linux", "Edge gateways", "Industrial protocols", "IT/OT"],
  },
  {
    title: "Teams & direction",
    description: "Setting technical direction, shaping roadmaps, and hiring and coaching teams while keeping delivery moving.",
    examples: ["Startups", "International teams", "Open source"],
  },
];

export const Range: FC = () => {
  return (
    <section class="range">
      <h2 class="section-title">Range</h2>
      <p class="range-heading">Software rarely stays in one lane.</p>
      <p class="range-intro">
        Since 2006, I’ve worked across software products, data and infrastructure, systems that control
        physical machines, and the teams building them. I’m at home in each of these areas, and especially
        useful when a project spans more than one. I bring product judgment as much as code.
      </p>
      <div class="range-grid">
        {territories.map(({ title, description, examples }) => (
          <div class="range-cell">
            <h3 class="range-title">{title}</h3>
            <p class="range-description">{description}</p>
            <ul class="range-tags">
              {examples.map((e) => (
                <li>{e}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};
