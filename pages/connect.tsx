/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import Head from "next/head";
import SiteLayout from "../components/SiteLayout";
import { PageTitle } from "../components/PageTitle/PageTitle";

function Connect(): JSX.Element {
  return (
    <SiteLayout>
      <Head>
        <title>Connect – Jérôme Velociter</title>
      </Head>

      <PageTitle>Connect</PageTitle>

      <p>
        My preferred way of connecting is through email. My mail is my first
        name AT my last name DOT fr.
      </p>

      <p>You can also find me on those sites:</p>
      <ul>
        <li>
          <a href={"https://twitter.com/jvelo"}>Twitter</a>
        </li>
        <li>
          <a href={"https://github.com/jvelo"}>GitHub</a>
        </li>
        <li>
          <a href={"https://www.linkedin.com/in/jvelociter/"}>LinkedIn</a>
        </li>
      </ul>
    </SiteLayout>
  );
}

export default Connect;
