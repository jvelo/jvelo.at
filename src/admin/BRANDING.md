# Naming — Working Notes

## What the project is

A generic SQLite admin panel: browse, edit, sync databases. CLI-first (point at a .db file, get a UI), embeddable in any framework (Hono, Next, Express, Koa). Dark, monospace aesthetic (Departure Mono). Zero-dependency core.

## Inspiration

**Datasette** (Simon Willison) — cassette, a storage medium. Our project overlaps in philosophy (SQLite-first, instant UI, CLI-driven). Both support reading and writing. Datasette leans more toward exploration, publishing, and visualization with a plugin ecosystem. Ours focuses equally on browsing and editing, adds schema-aware configuration, multi-environment sync, and embeds into existing apps as a sub-route.

## Naming direction

We want a name that:
- Hints at data/databases without being generic (`data-admin`, `db-panel`)
- Has personality — fits the retro-technical, monospace, control-panel aesthetic
- Is distinct from Datasette — not another "storage medium you plug in"
- Is unique enough to own in search results and npm — ideally a green field, a "creation"
- Works as a CLI command: `npx <name> serve data.db`
- Short — ideally 2 syllables, max 3

## Metaphors explored

### Port/dock (data arrives, syncs, ships out)
- Dataport, Datadock — good but both already in use
- Datapier ✓ — where data lands, unique
- Databerth, Datamoor — too obscure

### Storage media (retro tech, parallel to Datasette)
- Cartridge ✓ — plug-in metaphor fits perfectly (adapters, self-contained lib, slot in a .db file). But too close to Datasette — both are "physical media you insert into a machine." Ruled out.
- Punchcard ✓ — evocative, retro, but implies input/encoding more than browsing
- Datadisc ✓ — clean, easy to say, but feels like a backup product

### Microform family (archival, browsing records)
Datasette = cassette (storage medium). Microform = browsing/viewing records. Different activity, same era. Good differentiation.
- Microfiche ✓ — the browsing metaphor is perfect. Nerdy librarian energy. Might be hard to spell.
- Microform ✓ — the whole category, not one format. Double meaning: micro (lightweight) + form (schema, data forms). Best overall balance.
- Microfilm — too common a word, lost in search results
- Microcard — nice but generic-sounding

### Teleprinter/communication (retro tech, transmission)
- Telex ✓ — great fit (teleprinter exchange, retro, monospace energy) but crowded: WordPress/Automattic's AI tool, Telex.hu (Hungarian news site), npm taken. Ruled out.
- Punchtape ✓ — punch tape from teleprinters. Good but longish (9 chars, 2 syllables).

### Keypunch family (data entry machines)
- Keypunch ✓ — strong retro identity, everyone can spell it, the metaphor works (keypunch operators entered data into systems). npm taken (inactive logging module), GNOME typing app uses the name on GitHub. Not a green field.

### Created words / blends
Goal: a unique creation that can't collide with existing projects.
- Datatap ✓ — data + tap (tap into your data). Short, verb-like, clear. But: Zensors has a `datatap-python` library, two companies use the name (DataTap Technologies, DataTap Solutions).
- Tapemark ✓ — a real term from tape computing (marker between records on magnetic tape). Unused as software name. Retro, technical, precise. `npx tapemark serve data.db`
- Tablix — table + ix. Rejected — doesn't feel right.
- Perfora — Latin for "to pierce through" (what a keypunch does). Unique but too obscure.
- Keyform — key + form. Sounds like a keyboard thing.

## Shortlist (current)

| Name | Strengths | Concerns |
|------|-----------|----------|
| **Keypunch** | Best retro identity, clear metaphor, everyone gets it | npm taken (inactive), GNOME app on GitHub, not a green field |
| **Tapemark** | Real computing term, unused as software, unique, precise | Less immediately obvious meaning |
| **Datatap** | Short, verb-like, clear | Zensors library, two companies |
| **Microform** | Double meaning (micro + form), covers whole category | Slightly academic |
| **Microfiche** | Perfect browsing metaphor, unique as software name | Spelling, niche reference |
| **Datapier** | Immediately says "data", unique | Less personality |
| **Punchcard** | Strong retro energy | Implies input more than browsing |
| **Punchtape** | Teleprinter reference, retro | A bit long |

## Decision: Tapemark

### The name

**Tapemark** — a special recorded pattern on magnetic tape that serves as a delimiter between logical groups of data. Two consecutive tapemarks signal the end of all data on a tape volume.

### Why it works

- **Real computing term** — documented in IBM mainframe systems (z/OS, z/VM), Library of Congress MARC 21 specifications, and Wikipedia. Not an invention, but a term niche enough that no software project has claimed it.
- **The metaphor maps precisely** — a tapemark is a navigation marker between data groups (tables), a control record rather than content (admin tooling, not the data itself), and a structural delimiter (pagination, browsing).
- **Fits the aesthetic** — mainframe-era, monospace, technical. Matches the Departure Mono control panel personality.
- **Green field** — npm (`tapemark` and `tape-mark`) both available. GitHub effectively unclaimed. No startups or active companies using the name.
- **Short** — 8 characters, 2 syllables. `npx tapemark serve data.db` reads clean.

### Availability (verified)

- **npm**: `tapemark` available, `tape-mark` available
- **GitHub**: only one repo (`karikraus/tapemark`) — a digital humanities project about Nanni Balestrini's "Tape Mark I" (1961), an early computer-generated poem on an IBM 7070. Not a software tool.
- **Companies/startups**: none found

### References

The term "tape mark" is documented in:

- **IBM z/OS** — WTM (Write Tape Mark) function: [IBM Docs](https://www.ibm.com/docs/SSXJAV_14.1.0/com.ibm.filemanager.doc_14.1/base/wtmfun.html)
- **IBM z/VM** — "Tape marks are conventional end-of-data signals": [IBM z/VM Docs](https://www.ibm.com/docs/en/zvm/7.2.0?topic=formats-tape-marks-tape-dump-tapes)
- **Wikipedia** — "The end of a file was designated by a special recorded pattern called a tape mark": [Magnetic-tape data storage](https://en.wikipedia.org/wiki/Magnetic-tape_data_storage)
- **Library of Congress MARC 21** — physical format spec: "a gap of approximately 3.5 inches of tape followed by a single byte": [MARC 21 Tape Transfer](https://www.loc.gov/marc/specifications/specexchtape1.html)
- **Nanni Balestrini's "Tape Mark I" (1961)** — one of the earliest computer-generated poems, created on an IBM 7070. A nice cultural connection.
