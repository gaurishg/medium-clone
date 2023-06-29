import Header from "@/components/header";
import { sanityClient, urlFor } from "@/sanity";
import { Post, PostWithComments } from "@/typings";
import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import { PortableText } from "@portabletext/react";
import ReactPortableText from "react-portable-text";

interface Props {
  post: PostWithComments;
}

export default function Post({ post }: Props) {
  const [postCreationTime, setPostCreationTime] = useState("");
  useEffect(() => {
    setPostCreationTime(new Date(post._createdAt).toLocaleString());
  }, [post._createdAt]);
  return (
    <main>
      <Header />
      <img
        src={urlFor(post.mainImage).url()}
        alt=""
        className="w-full h-40 object-cover"
      />

      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">
          {post.description}
        </h2>

        <div>
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()}
            alt=""
          />
          <p className="font-extralight text-sm">
            Blog post by {post.author.name} - Published at {postCreationTime}
          </p>
        </div>

        <div className="mt-10">
          <ReactPortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="text-xl font-bold my-5" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              image: (props: any) => <img src={urlFor(props).url()} />,
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
              blockquote: ({children}: any) => (<blockquote className="p-4 my-4 border-l-4 border-gray-300">
              <p className="text-xl italic font-medium leading-relaxed text-gray-900">{children}</p>
          </blockquote>)
            }}
          />
        </div>
      </article>

      <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />

      <form className="flex flex-col p-5 max-w-2xl mx-auto mb-10">
        <h3 className="text-sm text-yellow-500">Enjoyed this article</h3>
        <h4 className="text-3xl font-bold">Leave a comment below!</h4>
        <hr className="py-3 mt-2"/>
        <label className="block mb-5">
          <span className="text-gray-700">Name</span>
          <input className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500" type="text" placeholder="John Appleseed"/>
        </label>
        <label className="block mb-5">
          <span className="text-gray-700">Email</span>
          <input className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500" type="text"  placeholder="John Appleseed"/>
        </label>
        <label className="block mb-5">
          <span className="text-gray-700">Comment</span>
          <textarea className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring" placeholder="John Appleseed" rows={8}/>
        </label>
      </form>
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const query = `* [_type == "post"]{
        _id,
        slug {
          current
        }
      }`;
  const posts: { _id: string; slug: { current: string } }[] =
    await sanityClient.fetch(query);

  const paths: { params: ParsedUrlQuery }[] = posts.map((post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths: paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `
        * [_type == "post" && slug.current == $slug][0] {
            _id,
            _createdAt,
            title,
            author -> {
                name,
                image
            },
            'comments': *[
                _type == "comment" &&
                post._ref == ^._id &&
                approved
            ],
            description,
            mainImage,
            slug,
            body
        }
    `;

  const post: PostWithComments = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return { notFound: true };
  }

  return {
    props: { post },
    revalidate: 60,
  };
};
