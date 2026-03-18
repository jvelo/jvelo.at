import type { FC } from 'hono/jsx';

interface Project {
  title: string;
  description: string;
  image: string;
  badge?: string;
  link: string;
}

const ProjectCard: FC<Project> = ({ title, description, image, badge, link }) => {
  return (
    <a href={link} class="work-card">
      <div class="project-image border-backdrop">
        <img src={image} alt={title} />
      </div>
      <div class="project-content">
        <div class="project-header">
          <h3 class="project-title">{title}</h3>
          {badge && <span class="project-badge">{badge}</span>}
        </div>
        <p class="project-description">{description}</p>
        <span class="project-link">Learn more <span aria-hidden="true">→</span></span>
      </div>
    </a>
  );
};

export const SelectedWorks: FC = () => {
  const projects: Project[] = [
    {
      title: "BiomeOS",
      description: "An extensible controlled environment platform for agronomic research and indoor farming production",
      image: "/images/biomeos.png",
      link: "/biomeos"
    },
    {
      title: "Typebar",
      description: "A rich-text editor framework for building delightful writing experiences. Built on the HTML canvas element, written in TypeScript with zero dependencies.",
      image: "/images/typebar.png",
      badge: "private beta",
      link: "/typebar"
    },
    {
      title: "Mayocat Shop",
      description: "An open source e-commerce and marketplace platform. Self-contained," +
          " multi-tenant, themeable.",
      image: "/images/mayocat-card2.png",
      link: "/mayocat-shop"
    },
  ];

  return (
    <section class="selected-works">
      <h2 class="section-title">SELECTED WORKS</h2>
      <div class="works-grid">
        {projects.map((project) => (
          <ProjectCard {...project} />
        ))}
      </div>
    </section>
  );
};
