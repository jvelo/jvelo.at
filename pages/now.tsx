import Head from "next/head";
import SiteLayout from "../components/SiteLayout";
import { PageTitle } from "../components/PageTitle/PageTitle";

function Now(): JSX.Element {
  return (
    <SiteLayout>
      <Head>
        <title>Now – Jérôme Velociter</title>
      </Head>

      <PageTitle>Now</PageTitle>

      <p>
        This <a href={"https://nownownow.com/about"}>now page</a> is a place to
        share personal updates on one's own website rather than Facebook or
        twitter.
      </p>

      <p>
        {" "}
        I recently started working on the basics of reading Japanese. I'm level
        2 on <a href={"https://www.wanikani.com/"}>WaniKani</a> and trying to
        keep up with the lessons and reviews everyday. WaniKani makes it pretty
        entertaining ; it feels really natural going back to the site for more
        every day. Their{" "}
        <a href={"https://knowledge.wanikani.com/wanikani/srs/"}>
          spaced-repetition algorithm
        </a>{" "}
        works wonders, and if this sticks, I'll be a happy customer after level
        3.
      </p>

      <p>
        {" "}
        With the confinement, I started playing StarCraft II again, after a two
        years break. It's a hard, unforgiving game, yet stimulating and one that
        can occasionally deliver a good adrenaline rush. I'm a{" "}
        <a
          href={
            "https://www.rankedftw.com/team/701113/#td=world&ty=c&ra=best&tyz=0&tx=a&tl=1"
          }
        >
          pretty average player
        </a>
        , at <s>platinum</s> low diamond level ; though I believe my
        understanding of the game improved a bit since the last time I played.
      </p>

      <p>
        {" "}
        I'm also building this website, and this time I'm happy enough with the
        design, so I have a good feeling it won't go to waste like the previous
        attempts. I've sketched it in{" "}
        <a href={"https://www.figma.com/"}>Figma</a>, and it was a joy. This
        software is so refreshing to use, and knowing it's a web view leaves me
        in awe. It's the final nail on the coffin of the old idea you can't do
        anything serious in a web view,{" "}
        <a href={"https://lichess.org/mobile"}>Lichess.org mobile app</a> being
        second to that.
      </p>

      <p>
        I've been doing a couple of petscii and pixel artwork while stuck at
        home, I might upload some on this site one day.
      </p>

      <p>
        I'm currently reading Du Coté de Chez Swann (Swann's Way) and
        L'explosion De La Tortue. I've recently finished{" "}
        <a href={"https://en.wikipedia.org/wiki/What_the_Dormouse_Said"}>
          What the Dormouse Said
        </a>
        , and I'd recommend it to anyone using a personal computer.
      </p>
    </SiteLayout>
  );
}

export default Now;
