import { Inter } from 'next/font/google';
import Header from '@/components/header';
import { GetServerSideProps } from 'next';
import { sanityClient } from '@/sanity';
import { Post } from '@/typings';

const inter = Inter({ subsets: ['latin'] });

interface Props {
  posts: Post[]
}

export default function Home({posts}: Props) {
  console.log(posts);
  return (<div className='max-w-7xl mx-auto'>
    <Header />

    <div className='flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-0'>
      <div className='px-10 space-y-5'>
        <h1 className='text-6xl max-w-xl font-serif'>
          <span className='underline decoration-black decoration-4'>Medium</span> is a place to write, read and connect
        </h1>
        <h2>
          It's easy and free to post your thinking on any topic and connect with millions of readers.
        </h2>
      </div>
      <img
        src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
        alt="Medium Logo" 
        className='hidden md:inline-flex h-32 md:h-64 lg:h-full'
      />
    </div>

    {/** POSTS */}

  </div>);
}

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `* [_type == "post"]{
    _id,
    title,
    author -> {
      name,
      image
    },
      description,
      mainImage,
      slug
  }`;
  
  const posts: Post[] = await sanityClient.fetch(query);
  console.log(posts);
  return {
    props: {posts}
  };
}
