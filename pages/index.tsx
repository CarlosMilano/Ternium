import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Ternium</title>
        <meta
          name='description'
          content='This is a software created for the dynamic visualization of the company talent'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <p>Esta es la app de Ternium Talent, esta vista esta en desarrollo</p>
    </>
  );
}
