/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import Head from "next/head";
import SiteLayout from "../components/SiteLayout";
import { PageTitle } from "../components/PageTitle/PageTitle";

function Uses(): JSX.Element {
  return (
    <SiteLayout>
      <Head>
        <title>Uses – Jérôme Velociter</title>
      </Head>

      <PageTitle>Uses</PageTitle>

      <p>
        This <a href={"https://uses.tech/"}>uses page</a> is a place to share
        one's favorite tools or gear (le{" "}
        <a href={"https://www.youtube.com/watch?v=2ixJfa8nMm0"}>"matos"</a>).
      </p>

      <h2>Hardware</h2>
      <p>
        I got fed up with the disastrous experience of recent macbook butterfly
        keyboards, so while in covid solitary, I went back to an old 21.5-inch
        iMac of late 2013. It has only 8G of RAM, but still provides more calm
        than the frustrations of a broken keyboard.
      </p>
      <p>
        I now carry a <a href={"https://shop.fairphone.com/en/"}>Fairphone 3</a>{" "}
        running <a href={"https://e.foundation/"}>/e/</a>. It's a solid phone,
        with replaceable parts and built atop a child-labor free and fair supply
        chain. The experience of a stock Android free of Google services is
        refreshing – sometimes a bit rough around the edges, though I try and
        take it calmly and think about the enormous advantages a monopoly gets
        and the courage of those challenging it.
      </p>

      <h2>Software</h2>
      <p>
        I use JetBrains IDEs with little customization besides setting a high
        contrast theme. I'm a big fan of Figma for the little graphic design
        needs I have.
      </p>
      <p>I place pixels in Aseprite, and use Petmate for Petscii art.</p>
      <p>
        For personal mail I haven't found better than Thunderbird, but am
        waiting for my Hey invite.
      </p>
      <p>I sometimes write in iA Writer.</p>
      <p>My terminal emulator is Hyper.app, again with little customization.</p>
      <p>
        My browser of choice is now Firefox again, and I use their
        synchronization tools.
      </p>
    </SiteLayout>
  );
}

export default Uses;
