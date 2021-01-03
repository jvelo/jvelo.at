/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import Head from "next/head";
import SiteLayout from "../components/SiteLayout";
import { PageTitle } from "../components/PageTitle/PageTitle";

function About(): JSX.Element {
  return (
    <SiteLayout>
      <Head>
        <title>About – Jérôme Velociter</title>
      </Head>

      <PageTitle>About</PageTitle>

      <p>
        I present myself as a general purpose hacker, in a reference to general
        purpose computers – in particular personal computers – first introduced
        to the world as machines designed to give power to their owners and help
        them solve a wide variety of problems. I'm pursuing this idea in my
        practice as a software developer and manager of engineering teams and
        projects. I thrive in diversity – of technologies, of problem spaces, of
        peers.
      </p>

      <p>
        Another way to put it would be to say I'm a technology factotum. I can
        play with most things I throw my heart at, but intimately master few of
        those. I'm most at home building web applications and backends, and
        accompanying teams in such endeavours.
      </p>
    </SiteLayout>
  );
}

export default About;
