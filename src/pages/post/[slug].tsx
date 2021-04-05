/* eslint-disable react/no-danger */
import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import Head from 'next/head';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';

import Header from '../../components/Header';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  // console.log(post.data.content);
  return (
    <>
      <Head>
        <title>Home | {post.data.title}</title>
      </Head>
      <Header />
      <main className={styles.container}>
        <article>
          <img src="/Banner.png" alt="banner" />

          <div className={`${commonStyles.size} ${styles.content}`}>
            <h1>{post.data.title}</h1>
            <div className={styles.postInfo}>
              <div>
                <FiCalendar />
                <span>{post.first_publication_date}</span>
              </div>
              <div>
                <FiUser />
                <span>{post.data.author}</span>
              </div>
              <div>
                <FiClock />
                <span>4 min</span>
              </div>
            </div>

            {post.data.content.map(section => {
              return (
                <>
                  <h1>{section.heading}</h1>
                  <div dangerouslySetInnerHTML={{ __html: section.body }} />
                </>
              );
            })}
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.Predicates.at('document.type', 'post')
  );

  // const pathsList = posts.results.map(post => post.slugs);

  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    slug,
    first_publication_date: format(
      new Date(response.first_publication_date),
      'dd MMM yyyy',
      {
        locale: ptBR,
      }
    ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner,
      },
      author: response.data.author,
      content: response.data.content.map(section => {
        return {
          heading: section.heading,
          body: RichText.asHtml(section.body),
        };
      }),
    },
  };

  console.log(JSON.stringify(post, null, 2));

  return {
    props: { post },
    redirect: 60 * 30,
  };
};
