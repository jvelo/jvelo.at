import SiteLayout from "../components/SiteLayout";
import Head from "next/head";
import React from "react";
import { GetServerSideProps } from "next";
import mysql from "mysql2";

const conn = mysql.createConnection(
  process.env.DATABASE_URL || "mysql://user:@127.0.0.1/db"
);

type Props = {
  links: [
    {
      slug: string;
      link: string;
    }
  ];
};

const LinksPage: React.FC<Props> = ({ links }) => {
  return (
    <SiteLayout>
      <Head>
        <title>Links</title>
      </Head>

      <h1>Links</h1>
      <ul>
        {links.map((link) => (
          <li key={link.slug}>
            <a href={link.link}>{link.slug}</a>
          </li>
        ))}
      </ul>
    </SiteLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const [links] = await conn.promise().query("select * from link");
  return {
    props: {
      links,
    },
  };
};

export default LinksPage;
