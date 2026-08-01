import type { FC } from 'hono/jsx';

interface Project {
  title: string;
  description: string;
  image: string;
  imagePosition?: string;
  badge?: string;
  link: string;
}

const ProjectCard: FC<Project> = ({ title, description, image, imagePosition, badge, link }) => {
  return (
    <a href={link} class="work-card">
      <div class="project-image border-backdrop">
        <img src={image} alt={title} style={imagePosition ? `object-position: ${imagePosition}` : ''} />
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

const projects: Project[] = [
  {
    title: "BiomeOS",
    description: "A mission-critical platform for controlled-environment agriculture research and indoor farming at scale.",
    image: "/images/biomeos-touchscreen.png",
    link: "/biomeos"
  },
  {
    title: "Typebar",
    description: "A rich-text editor framework focused on performance and extensibility",
    image: "/images/typebar.png",
    imagePosition: "top",
    badge: "private beta",
    link: "/typebar"
  },
  {
    title: "Mayocat Shop",
    description: "A multi-tenant e-commerce platform for building storefronts and marketplaces",
    image: "/images/mayocat-card2.png",
    link: "/mayocat-shop"
  },
];

export const SelectedWorks: FC = () => {
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
