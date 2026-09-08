import type { FC } from 'hono/jsx';
import { Layout, SocialLinks } from './Layout';
import type { ResumeData, ResumeEntry, ResumeRole } from '../types';

const PDF_PATH = '/Jerome_Velociter_Tech_Product_Lead_2026.pdf';

const SECTIONS: [string, string][] = [
  ['experience', 'Experience'],
  ['projects', 'Projects'],
  ['publications', 'Publications'],
  ['skills', 'Skills'],
  ['education', 'Education & Languages'],
];

const Html: FC<{ html: string }> = ({ html }) => <span dangerouslySetInnerHTML={{ __html: html }} />;

const Role: FC<{ role: ResumeRole }> = ({ role }) => (
  <div class="resume-role">
    <h3 class="resume-role-title">
      {role.url ? <a href={role.url}>{role.title}</a> : role.title}
      {role.org && (
        <>
          <span class="resume-role-sep"> · </span>
          <span class="resume-role-org">{role.org}{role.place && ` · ${role.place}`}</span>
        </>
      )}
      {role.dates && <span class="resume-role-dates">{role.dates}</span>}
    </h3>
    {role.summary && <p><Html html={role.summary} /></p>}
    {role.bullets && role.bullets.length > 0 && (
      <ul>
        {role.bullets.map((b) => (
          <li><Html html={b} /></li>
        ))}
      </ul>
    )}
  </div>
);

const Entry: FC<{ entry: ResumeEntry }> = ({ entry }) => (
  <section class="resume-entry">
    <div class="resume-gutter">
      {entry.logo && (
        <span class="resume-logo" style={entry.logo_inset ? `--inset: ${entry.logo_inset}` : undefined}>
          <img src={`/images/resume/${entry.logo}`} alt="" data-no-gallery />
        </span>
      )}
      <p class="resume-dates">{entry.dates}</p>
    </div>
    <div class="resume-entry-body">
      {entry.roles.map((role) => <Role role={role} />)}
    </div>
  </section>
);

export const ResumePage: FC<{ resume: ResumeData; turnstileSiteKey?: string }> = ({ resume, turnstileSiteKey }) => (
  <Layout title="Résumé" description={`${resume.name}, ${resume.headline}`} path="/resume" turnstileSiteKey={turnstileSiteKey}>
    <article class="resume">
      <div class="page-header">
        <h1 class="page-title">Résumé</h1>
        <div class="resume-subtitle-row">
          <p class="page-subtitle">{resume.name} · {resume.headline}</p>
          <span class="resume-social"><SocialLinks /></span>
        </div>
      </div>
      <p class="resume-actions">
        <a href={PDF_PATH} class="cta-link">Download as PDF →</a>
      </p>
      <div class="content-with-aside resume-layout">
      <div class="content-primary prose resume-body">
        <p><Html html={resume.summary} /></p>
        <p class="resume-availability">
          {resume.availability.map((line, i) => (
            <>
              {i > 0 && <br />}
              {line}
            </>
          ))}
        </p>

        <h2 id="experience">Experience</h2>
        {resume.experience.map((entry) => <Entry entry={entry} />)}

        <h2 id="projects">Projects</h2>
        {resume.projects.map((p) => (
          <Entry entry={{ dates: p.dates, roles: [{ title: p.title, url: p.url, summary: p.summary }] }} />
        ))}

        <h2 id="publications">Publications</h2>
        {resume.publications.map((p) => (
          <div class="resume-publication">
            <p class="resume-publication-title">{p.title}</p>
            <p class="resume-publication-meta">
              {p.contribution} · {p.venue}, {p.year} · <a href={`https://doi.org/${p.doi}`}>doi.org/{p.doi}</a>
            </p>
          </div>
        ))}

        <h2 id="skills">Skills</h2>
        <dl class="resume-skills">
          {resume.skills.map((s) => (
            <>
              <dt>{s.label}</dt>
              <dd>{s.items}</dd>
            </>
          ))}
        </dl>

        <h2 id="education">Education &amp; Languages</h2>
        <dl class="resume-skills">
          <dt>Degree</dt>
          <dd>{resume.education}</dd>
          <dt>Languages</dt>
          <dd>{resume.languages}</dd>
        </dl>
      </div>
      <aside class="content-aside">
        <section class="toc">
          <h2 class="aside-heading">Contents</h2>
          <nav>
            {SECTIONS.map(([id, label]) => <a href={`#${id}`} class="toc-link">{label}</a>)}
          </nav>
        </section>
        <hr class="aside-divider" />
        <section class="aside-section">
          <h2 class="aside-heading">Download</h2>
          <p class="aside-meta"><a href={PDF_PATH} class="aside-link">PDF, two pages</a></p>
        </section>
      </aside>
      </div>
    </article>
  </Layout>
);
