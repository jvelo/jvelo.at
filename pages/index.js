import Head from 'next/head'
import Link from 'next/link'
import SiteLayout from '../components/SiteLayout'
import Hero from '../components/Hero/Hero'

export default function Home() {
    return (
        <SiteLayout>
            <Head>
                <title>Jérôme Velociter – General Purpose Hacker</title>
            </Head>

            Ahoy! – my name is Jérôme Velociter and I'm a

            <Hero>General purpose hacker</Hero>

            <p>Well, that's how I present myself online anyway.</p>

            <p>I've been building web sites and applications for the past 20 years, a good part of them professionally.
                I'm currently invested in urban farming with <a href={'https://agricool.co'}>Agricool</a>, as technical director for software engineering.</p>

            <p>From here, you can find out more <Link href='/about'>about me</Link>, checkout what I'm <Link href='/now'>up to now</Link>,
                find out about <Link href={'/uses'}>stuff I use</Link>, and why not <Link href={'/connect'}>connect and say hi ?</Link></p>
        </SiteLayout>
    )
}
