// Jérôme Velociter, resume. Content lives in resume.yaml; this file is layout only.
// Build with `pnpm run resume` from the repo root.
// TODO: *builder* *AI*

#let data = yaml("resume.yaml")

#let ink = rgb("#181818")
#let muted = rgb("#6F6A66")
#let accent = rgb("#E5B93A")
#let rule = rgb("#D9D4CE")

#let condensed(weight: 700, size: 10pt, body) = text(
  font: "IBM Plex Sans", stretch: 75%, weight: weight, size: size, body,
)
#let mono(body) = text(font: "Departure Mono", size: 8.5pt, fill: rgb("#4A4643"), body)
#let meta(body) = text(size: 8.5pt, fill: muted, body)

// Render the Markdown links in a data string; everything else is plain text.
#let md(s) = {
  let re = regex("\\[([^\\]]+)\\]\\(([^)]+)\\)")
  let out = ()
  let pos = 0
  for m in s.matches(re) {
    out.push(s.slice(pos, m.start))
    out.push(link(m.captures.at(1), m.captures.at(0)))
    pos = m.end
  }
  out.push(s.slice(pos))
  out.join()
}

#set document(title: data.name + ", " + data.headline, author: data.name)
#set page(
  paper: "a4",
  margin: (x: 16mm, top: 14mm, bottom: 14mm),
  footer: context {
    let n = counter(page).get().first()
    if n > 1 {
      align(right, meta[#data.name · #n/2])
    }
  },
)
#set text(font: "IBM Plex Sans", size: 10pt, fill: ink, lang: "en")
#set par(leading: 0.72em, spacing: 0.82em)
#set list(marker: text(fill: accent)[•], indent: 0em, body-indent: 0.6em, spacing: 1.05em)
#show "IT/OT": it => box(it)

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

#let role-line(r) = block(below: 0.85em)[
  #text(weight: 600)[#r.title]
  #if "org" in r [#text(fill: muted)[·] #r.org#if "place" in r [ #text(fill: muted)[· #r.place]]]
  #if "dates" in r [#h(1fr) #meta[#r.dates]]
]

#let role-body(r) = {
  role-line(r)
  if "summary" in r { md(r.summary) }
  let bullets = r.at("bullets", default: ())
  if bullets.len() > 0 { list(..bullets.map(md)) }
}

// One company or project: logo and dates in the gutter, roles on the right.
// An entry with several roles may break between them; each role stays whole.
#let entry(e) = {
  let multi = e.roles.len() > 1
  block(breakable: multi, below: 1.4em)[
    #grid(
      columns: (27mm, 1fr),
      column-gutter: 4mm,
      [
        #if "logo" in e [#tile(e.logo, inset: e.at("logo_inset_mm", default: 0) * 1mm) #v(0.1em)]
        #meta[#e.dates]
      ],
      [
        #for (i, r) in e.roles.enumerate() {
          if i > 0 { v(0.3em) }
          block(breakable: false, role-body(r))
        }
      ],
    )
  ]
}

// Header

#condensed(size: 21pt)[#data.name] \
#v(0.1em)
#box(fill: accent, inset: (x: 4pt, y: 3pt), outset: (y: 0pt))[#text(size: 11.5pt, weight: 700)[#data.headline]]
#v(0.5em)
#mono[#data.contacts.map(c => link(c.url)[#c.label]).join([ · ])]

#v(1.2em)

#md(data.summary)

#v(0.3em)
#text(size: 9pt, fill: muted)[#data.availability.join(linebreak())]

= Experience

#for e in data.experience { entry(e) }

= Projects

#for p in data.projects {
  let title = if "url" in p { link(p.url)[#p.title] } else { p.title }
  entry((dates: p.dates, roles: ((title: title, summary: p.summary),)))
}

= Publications

#for p in data.publications {
  block(below: 0.9em)[
    #text(weight: 600)[#p.title] \
    #meta[#p.contribution · #p.venue, #p.year · #link("https://doi.org/" + p.doi)[doi.org/#p.doi]]
  ]
}

= Skills

#grid(
  columns: (27mm, 1fr),
  column-gutter: 4mm,
  row-gutter: 0.68em,
  ..data.skills.map(s => (meta[#s.label], [#s.items])).flatten(),
)

= Education & Languages

#block(breakable: false)[
  #data.education #h(1.5em) #text(fill: muted)[·] #h(1.5em) #data.languages
]

#context assert(counter(page).final().first() <= 2, message: "resume exceeds two pages")
