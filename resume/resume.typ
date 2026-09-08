// Jérôme Velociter, resume.
// TODO: *builder* *AI*
// Build: typst compile resume.typ
// Deliver: typst compile resume.typ Jerome_Velociter_Tech_Product_Lead_2026.pdf

#let ink = rgb("#181818")
#let muted = rgb("#6F6A66")
#let accent = rgb("#E5B93A")
#let rule = rgb("#D9D4CE")

#let condensed(weight: 700, size: 10pt, body) = text(
  font: "IBM Plex Sans", stretch: 75%, weight: weight, size: size, body,
)
#let mono(body) = text(font: "Departure Mono", size: 8.5pt, fill: rgb("#4A4643"), body)
#let meta(body) = text(size: 8.5pt, fill: muted, body)

#set document(title: "Jérôme Velociter, Tech & Product Lead", author: "Jérôme Velociter")
#set page(
  paper: "a4",
  margin: (x: 16mm, top: 14mm, bottom: 14mm),
  footer: context {
    let n = counter(page).get().first()
    if n > 1 {
      align(right, meta[Jérôme Velociter · #n/2])
    }
  },
)
#set text(font: "IBM Plex Sans", size: 10pt, fill: ink, lang: "en")
#set par(leading: 0.72em, spacing: 0.82em)
#set list(marker: text(fill: accent)[•], indent: 0em, body-indent: 0.6em, spacing: 1.05em)

#show heading.where(level: 1): it => block(sticky: true, above: 1.4em, below: 0.8em)[
  #condensed(size: 9pt, weight: 700, upper(it.body))
  #v(-0.55em)
  #line(length: 100%, stroke: 0.6pt + rule)
]

#let tile(logo, inset: 0mm) = box(
  width: 7.5mm, height: 7.5mm, radius: 1mm, clip: true,
  stroke: 0.5pt + rule, inset: inset,
  image(logo, width: 100%, height: 100%, fit: "contain"),
)

// One company or item. `body` holds the roles and bullets.
#let entry(dates, logo: none, logo-inset: 0mm, breakable: false, body) = block(breakable: breakable, below: 1.4em)[
  #grid(
    columns: (27mm, 1fr),
    column-gutter: 4mm,
    [
      #if logo != none [#tile(logo, inset: logo-inset) #v(0.1em)]
      #meta[#dates]
    ],
    body,
  )
]

// A role line inside an entry. Trailing dates only when a company had several roles.
#let role(title, org: none, place: none, dates: none) = block(below: 0.85em)[
  #text(weight: 600)[#title]
  #if org != none [#text(fill: muted)[·] #org#if place != none [ #text(fill: muted)[· #place]]]
  #if dates != none [#h(1fr) #meta[#dates]]
]

// Header

#condensed(size: 21pt)[Jérôme Velociter] \
#v(0.1em)
#box(fill: accent, inset: (x: 4pt, y: 3pt), outset: (y: 0pt))[#text(size: 11.5pt, weight: 700)[Freelance Tech & Product Lead]]
#v(0.5em)
#mono[
  #link("mailto:jerome@velociter.fr")[jerome\@velociter.fr] · #link("https://jvelo.at")[www.jvelo.at] · #link("https://linkedin.com/in/jvelociter")[linkedin.com/in/jvelociter] · #link("https://github.com/jvelo")[github.com/jvelo]
]

#v(1.2em)

Tech and product lead with 20 years of experience building web products and industrial software, including 10 as a founder. I help teams take products from architecture to production, evolve existing systems and solve hard engineering problems. I combine product ownership with hands-on engineering in TypeScript, Python and Go, across cloud and edge infrastructure.

#v(0.3em)
#text(size: 9pt, fill: muted)[Toulouse, France · Open to full-time or fractional engagements \
  Remote or hybrid · Available for regular travel to Paris, London and Amsterdam]

= Experience

#entry("2026 – present", logo: "symbol.svg", logo-inset: 1.6mm)[
  #role("Freelance Tech & Product Lead")
  Product engineering, technical leadership and team coaching in AI-assisted development. Practical guidance on integrating coding agents into delivery workflows, from task scoping and architectural decisions to code review and verification.
]

#entry("2021 – 2026", logo: "logos/orius-gray.png")[
  #role("Co-founder — Software, Product & Marketing", org: "Orius", place: "Toulouse, FR")
  Turnkey systems for growing high-value plants indoors. Selected for France 2030 funding.
  - Built the software stack from scratch, then led a small team running it in production: growth chamber (phytotron) automation, #box[IT/OT] monitoring, and #link("https://jvelo.at/biomeos")[BiomeOS], the cloud and data platform. Dozens of growth units across three continents on an offline-first architecture, so each site keeps operating through connectivity loss.
  - Built the control and data software for two projects with CNES, the French space agency: prototype greenhouses for lunar and Martian habitats, and Gravilab, a gravity simulator for plant biology.
  - Translated agronomic requirements into executable control protocols, including calibrated lighting and nutrient management.
  - Owned BiomeOS as a product and designed its interfaces: what to build, in what order, for which users, from research labs to production sites.
  - Led marketing: brand identity, website and sales collateral.
  - Co-led a €4M funding round, owning the investment narrative and investor materials.
]

#entry("2016 – 2021", logo: "logos/agricool-gray.png", breakable: true)[
  #role("Director of Software Engineering", org: "Agricool", place: "Paris, FR", dates: "2018 – 2021")
  - Grew the engineering team from one engineer to eight, across embedded software, microservices, full-stack, DevOps and data science.
  - Built and ran the platform operating several dozen container farms in France and the UAE, used daily by growers, operations and sales: edge and cloud infrastructure, data and analytics, back-office and mobile apps, with failsafes for remote operation.
  - Shipped on the hardware construction calendar, so software never delayed a planting.
  - Led the rewrite from a Kotlin monolith to Go microservices as farms moved from shared servers to dedicated compute per container, limiting the impact of a server failure to one container instead of eight. Delivered on schedule.
  #v(0.3em)
  #block(breakable: false)[
    #role("Lead Software Engineer", dates: "2016 – 2018")
    - Owned the first generations of the proprietary farming software, from industrial IoT automation to agronomic domain modelling.
    - Delivered remote crop management for year-round, commercial-scale indoor strawberry production, including a pilot farm in Dubai operated over 4G.
  ]
]

#entry("2011 – 2016", logo: "logos/46cl-gray.png")[
  #role("Co-founder & Technical Director", org: "46cl", place: "Lyon, FR")
  - Co-founded a web, mobile and UX agency and ran it for six years with a team of developers and designers, for clients from communications agencies to corporations.
  - Created and led development of #link("https://github.com/jvelo/mayocat-shop")[Mayocat Shop], an open source multi-tenant commerce platform on the JVM spanning storefronts, merchant administration, payments and content management. Production sites still run on it 12+ years later.
]

#entry("2007 – 2011", logo: "logos/xwiki-gray.png")[
  #role("Software Engineer", org: "XWiki", place: "Paris, FR")
  - Core committer on the XWiki open source platform, from back-end services to user-facing features, including the Bespin editor integration and Markdown rendering support.
  - Bootstrapped the Iași office in Romania on site over 18 months: hired, trained and managed its development team.
  - Led customer and partner projects from pre-sales to delivery. Mentor for Google Summer of Code in 2008.
]

#entry("2005 – 2006", logo: "logos/frog-gray.png")[
  #role("Software Developer Intern", org: "Frog Navigation Systems (now Oceaneering)", place: "Utrecht, NL")
  Black-box QA suite in Python for the AGVs' embedded computers, log mining for fault patterns, and CORBA services in Java.
]

= Projects

#entry("2025 – present")[
  #role(link("https://jvelo.at/typebar")[Typebar])
  Canvas-native rich-text engine with its own layout, text measurement, IME input and undo/redo, built for consistent performance on large documents. TypeScript with zero runtime dependencies. Private beta.
]

#entry("2025 – present")[
  #role("Savannah")
  Desktop writing app built on Typebar with Electron.
]

#entry("2026 – present")[
  #role(link("https://github.com/jvelo/tapemark")[Tapemark])
  Designed and built an open source SQLite administration toolkit with an embeddable web UI and a CLI, running on Node.js and Cloudflare D1 through a framework-independent core.
]

= Publications

#let paper(title, doi) = block(below: 0.9em)[
  #text(weight: 600)[#title] \
  #meta[Co-author · International Conference on Environmental Systems, 2026 · #link("https://doi.org/" + doi)[doi.org/#doi]]
]

#paper("Development of a Modular and Deployable Plant Production System for Lunar and Martian Habitats", "10.32865/2346/108859")
#paper("Gravilab: An Advanced Random Positioning Machine for Arbitrary Gravity Simulation", "10.32865/2346/108860")

= Skills

#grid(
  columns: (27mm, 1fr),
  column-gutter: 4mm,
  row-gutter: 0.68em,
  meta[Programming], [TypeScript, Python, Go, Java, Kotlin],
  meta[Frontend], [React, Next.js, Lit, Web APIs, canvas, PWA],
  meta[Backend], [GraphQL, PostgreSQL, microservices, offline-first architectures],
  meta[Architecture], [Library and framework design, extensible platforms, developer tooling],
  meta[Infrastructure], [Docker, Ansible, Terraform, CI/CD, Cloudflare Workers, Prometheus, Loki, Grafana],
  meta[Industrial], [Embedded Linux, IoT automation, Modbus, MQTT, IT/OT integration],
  meta[Product], [Product design, UX, discovery, brand and marketing],
  meta[Leadership], [Hiring, mentoring, team management, stakeholder management],
  meta[Workflow], [Claude Code, Codex, agent-assisted development, automated testing],
)

= Education & Languages

#block(breakable: false)[
  IMT Nord Europe, engineering degree (MSc), 2007 #h(1.5em) #text(fill: muted)[·] #h(1.5em) French, native · English, fluent
]

#context assert(counter(page).final().first() <= 2, message: "resume exceeds two pages")
