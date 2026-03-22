import { readFileSync } from "fs";

interface MediaEntry {
  media_url_https: string;
  video_info?: unknown;
  sizes: {
    medium: { w: number; h: number };
  };
}

interface Tweet {
  id: string;
  created_at: string;
  extended_entities: {
    media?: MediaEntry[];
  } | null;
}

const data: Tweet[] = JSON.parse(
  readFileSync(process.argv[2] || `${process.env.HOME}/Databases/twitter_like.json`, "utf-8")
);

const withImages = data.filter((t) => {
  const media = t.extended_entities?.media;
  if (!media || media.length === 0) return false;
  return !media[0].video_info;
});

const escape = (s: string): string => `'${s.replace(/'/g, "''")}'`;

const BATCH_SIZE = 50;

for (let i = 0; i < withImages.length; i += BATCH_SIZE) {
  const batch = withImages.slice(i, i + BATCH_SIZE);
  const values = batch.map((t) => {
    const media = t.extended_entities!.media![0];
    return `(${escape(t.id)}, ${escape(t.created_at)}, ${escape(media.media_url_https)}, ${media.sizes.medium.w}, ${media.sizes.medium.h})`;
  });

  console.log(
    `INSERT INTO starred_media (id, created_at, media_url, media_width, media_height) VALUES\n${values.join(",\n")};\n`
  );
}

console.error(`Imported ${withImages.length} images (out of ${data.length} total tweets)`);
