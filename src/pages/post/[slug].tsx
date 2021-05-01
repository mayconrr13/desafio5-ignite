/* eslint-disable react/no-danger */
import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import PrismicDOM from 'prismic-dom';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';
import Link from 'next/link';
import { getPrismicClient } from '../../services/prismic';

import Header from '../../components/Header';
import { Comments } from '../../components/Comments';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  uid: string;
  first_publication_date: string | null;
  last_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string | null;
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

interface SidePostsProps {
  title: string;
  uid: string;
}

interface PostProps {
  post: Post;
  nextPostInfo: SidePostsProps | null;
  previousPostInfo: SidePostsProps | null;
  preview: boolean;
}

export default function Post({
  post,
  nextPostInfo,
  previousPostInfo,
  preview,
}: PostProps): JSX.Element {
  const { isFallback } = useRouter();

  if (isFallback) {
    return <div>Carregando...</div>;
  }

  const formatedFirstPublicationDate = format(
    new Date(post.first_publication_date),
    'dd MMM yyyy',
    {
      locale: ptBR,
    }
  );
  const formatedLastPublicationDate = format(
    new Date(post.last_publication_date),
    "'* editado em' dd MMM yyyy, 'às' HH:mm",
    {
      locale: ptBR,
    }
  );

  // reading time calc
  const postContent = post.data.content
    .map(item => {
      const content = [item.heading, PrismicDOM.RichText.asText(item.body)];
      return content.join(' ');
    })
    .join(' ');
  const numberOfWords = postContent.split(' ').length;
  const readingTime = Math.ceil(numberOfWords / 200);

  return (
    <>
      <Head>
        <title>Post | {post.data.title}</title>
      </Head>
      <Header />
      <main className={styles.container}>
        <article>
          <img
            src={post.data.banner.url}
            alt={post.data.title}
            className={styles.banner}
          />

          <div className={`${commonStyles.size} ${styles.content}`}>
            <h1>{post.data.title}</h1>
            <div className={styles.postInfo}>
              <div>
                <FiCalendar />
                <span>{formatedFirstPublicationDate}</span>
              </div>
              <div>
                <FiUser />
                <span>{post.data.author}</span>
              </div>
              <div>
                <FiClock />
                <span>{readingTime} min</span>
              </div>
            </div>
            <span>{formatedLastPublicationDate}</span>

            {post.data.content.map(section => {
              return (
                <section key={section.heading}>
                  <h1>{section.heading}</h1>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: RichText.asHtml(section.body),
                    }}
                  />
                </section>
              );
            })}
          </div>
        </article>

        <span className={`${commonStyles.size} ${styles.line}`} />

        <div className={`${commonStyles.size} ${styles.links}`}>
          {previousPostInfo && (
            <div className={styles.previous}>
              <p>{previousPostInfo.title}</p>
              <Link href={`/post/${previousPostInfo.uid}`}>
                <a>Post anterior</a>
              </Link>
            </div>
          )}
          {nextPostInfo && (
            <div className={styles.next}>
              <p>{nextPostInfo.title}</p>
              <Link href={`/post/${nextPostInfo.uid}`}>
                <a>Próximo post</a>
              </Link>
            </div>
          )}
        </div>

        <Comments />

        {preview && (
          <aside>
            <Link href="/api/exit-preview">
              <a className={`${commonStyles.size} ${styles.exitPreview}`}>
                Sair do modo Preview
              </a>
            </Link>
          </aside>
        )}
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.Predicates.at('document.type', 'post'),
    {
      pageSize: 2,
    }
  );

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
  previewData,
}) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {
    ref: previewData?.ref ?? null,
  });

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      banner: response.data.banner,
      content: response.data.content.map(section => {
        return {
          heading: section.heading,
          body: section.body,
        };
      }),
    },
  };

  const postsResponse = await prismic.query(
    Prismic.Predicates.at('document.type', 'post')
  );

  const allPosts = postsResponse.results;
  const currentPostIndex = allPosts.findIndex(
    postItem => postItem.uid === response.uid
  );

  const nextPostInfo = allPosts[currentPostIndex + 1]
    ? {
        title: allPosts[currentPostIndex + 1].data.title,
        uid: allPosts[currentPostIndex + 1].uid,
      }
    : null;
  const previousPostInfo = allPosts[currentPostIndex - 1]
    ? {
        title: allPosts[currentPostIndex - 1].data.title,
        uid: allPosts[currentPostIndex - 1].uid,
      }
    : null;

  return {
    props: {
      post,
      nextPostInfo,
      previousPostInfo,
      preview,
    },
    redirect: 60 * 30,
  };
};
