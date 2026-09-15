import type { FC } from 'hono/jsx';

interface Project {
  title: string;
  description: string;
  /** Path under /public/images without extension; 480 and 960 pixel WebP variants exist. */
  image: string;
  imagePosition?: string;
  link: string;
}

const ProjectCard: FC<Project & { lazy: boolean }> = ({ title, description, image, imagePosition, link, lazy }) => {
  return (
    <a href={link} class="work-card">
      <div class="project-image border-backdrop">
        <img
          src={`${image}-480.webp`}
          srcset={`${image}-480.webp 480w, ${image}-960.webp 960w`}
          sizes="(max-width: 575px) 100vw, 18rem"
          alt={title}
          loading={lazy ? 'lazy' : undefined}
          decoding="async"
          style={imagePosition ? `object-position: ${imagePosition}` : ''}
        />
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
    image: "/images/biomeos-touchscreen",
    link: "/biomeos"
  },
  {
    title: "Typebar",
    description: "A rich-text editor framework that stays fast on novel-length documents.",
    image: "/images/typebar",
    imagePosition: "top",
    link: "/typebar"
  },
  {
    title: "Tapemark",
    description: "An open source SQLite browser and admin panel that embeds in your own application.",
    image: "/images/tapemark-card",
    link: "/tapemark"
  },
  {
    title: "Savannah",
    description: "A desktop writing app for long-form writers, built on Typebar.",
    image: "/images/savannah-card",
    link: "/savannah"
  },
  {
    title: "Gravilab",
    description: "Control software for a gravity simulator that grows plants under Moon, Mars, and microgravity conditions.",
    image: "/images/gravilab",
    imagePosition: "center 40%",
    link: "/gravilab"
  },
  {
    title: "Mayocat Shop",
    description: "A multi-tenant e-commerce platform for building storefronts and marketplaces.",
    image: "/images/mayocat-card2",
    link: "/mayocat-shop"
  },
];

export const SelectedWorks: FC = () => {
  return (
    <section class="selected-works" id="work">
      <h2 class="section-title">Selected works</h2>
      <div class="works-grid">
        {projects.map((project, i) => (
          <ProjectCard {...project} lazy={i >= 3} />
        ))}
      </div>
    </section>
  );
};
