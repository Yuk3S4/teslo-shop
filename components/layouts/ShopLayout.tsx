import { FC, PropsWithChildren } from "react"
import Head from "next/head"
import { Navbar, SideMenu } from "../ui"

interface Props {
    title: string
    pageDescription: string
    imageFullUrl?: string
}

export const ShopLayout: FC<PropsWithChildren<Props>> = ({ children, title, pageDescription, imageFullUrl }) => {
  return (
    <>
        <Head>
            <title>{ title }</title>
            <meta name="description" content={ pageDescription } />

            {/* Para que redes sociales muestren el contenido de la página */}
            <meta name="og:title" content={ title } />
            <meta name="og:description" content={ pageDescription } />

            { 
                imageFullUrl && (
                    <meta name="og:image" content={ imageFullUrl } />
                )
            }

        </Head>

        <nav>
            <Navbar />
        </nav>

        <SideMenu />

        <main style={{ 
            margin: '80px auto',
            maxWidth: '1440px',
            padding: '0px 30px'
        }}>
            { children }
        </main>

        {/* Footer */}
        <footer>
            {/* TODO: Custom footer */}
        </footer>
    </>
  )
}
