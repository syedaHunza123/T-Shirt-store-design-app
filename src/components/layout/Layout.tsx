import { ReactNode } from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

type LayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

export default function Layout({ 
  children, 
  title = 'TeeDesign - Custom T-Shirt Designer',
  description = 'Design your own custom t-shirts online. Choose colors, add images and text, and order your unique creation.'
}: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}