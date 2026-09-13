import type { FC } from 'hono/jsx';

interface Project {
  title: string;
  description: string;
  image: string;
  imagePosition?: string;
  link: string;
}

const ProjectCard: FC<Project> = ({ title, description, image, imagePosition, link }) => {
  return (
    <a href={link} class="work-card">
      <div class="project-image border-backdrop">
        <img src={image} alt={title} style={imagePosition ? `object-position: ${imagePosition}` : ''} />
      </div>
      <div class="project-content">
        <h3 class="project-title">{title}</h3>
        <p class="project-description">{description}</p>
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
    description: "A rich-text editor framework that stays fast on novel-length documents.",
    image: "/images/typebar.png",
    imagePosition: "top",
    link: "/typebar"
  },
  {
    title: "Mayocat Shop",
    description: "A multi-tenant e-commerce platform for building storefronts and marketplaces.",
    image: "/images/mayocat-card2.png",
    link: "/mayocat-shop"
  },
  {
    title: "Savannah",
    description: "A desktop writing app for long-form writers, built on Typebar.",
    image: "/images/savannah-card.png",
    link: "/savannah"
  },
  {
    title: "Gravilab",
    description: "Control software for a gravity simulator that grows plants under Moon, Mars, and microgravity conditions.",
    image: "/images/gravilab.jpg",
    imagePosition: "center 40%",
    link: "/gravilab"
  },
  {
    title: "Tapemark",
    description: "An open source SQLite browser and admin panel that embeds in your own application.",
    image: "/images/tapemark-card.png",
    link: "/tapemark"
  },
];

export const SelectedWorks: FC = () => {
  return (
    <section class="selected-works">
      <h2 class="section-title">Selected works</h2>
      <div class="works-grid">
        {projects.map((project) => (
          <ProjectCard {...project} />
        ))}
      </div>
    </section>
  );
};
