import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import Head from 'next/head';
import Link from 'next/link';

import { FiCalendar, FiUser } from 'react-icons/fi';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { useState } from 'react';
import Header from '../components/Header/index';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  // console.log(postsPagination.next_page);
  const [nextPageAvailable, setNextPageAvailable] = useState<string | null>(
    postsPagination.next_page
  );

  const [availablePosts, setAvailablePosts] = useState<Post[]>([
    ...postsPagination.results,
  ]);

  async function handleMorePosts(): Promise<void> {
    const response = await fetch(nextPageAvailable);
    const { next_page, results } = await response.json();

    setNextPageAvailable(next_page);
    setAvailablePosts([...availablePosts, ...results]);
  }

  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>
      <Header />
      <main className={`${commonStyles.size} ${styles.container}`}>
        <div className={styles.posts}>
          {availablePosts &&
            availablePosts.map(post => {
              return (
                <Link key={post.uid} href={`/post/${post.uid}`}>
                  <a>
                    <h1>{post.data.title}</h1>
                    <p>{post.data.subtitle}</p>
                    <div className={styles.postInfo}>
                      <div>
                        <FiCalendar />
                        <span>
                          {format(
                            new Date(post.first_publication_date),
                            'dd MMM yyyy',
                            {
                              locale: ptBR,
                            }
                          )}
                        </span>
                      </div>
                      <div>
                        <FiUser />
                        <span>{post.data.author}</span>
                      </div>
                    </div>
                  </a>
                </Link>
              );
            })}
        </div>

        {nextPageAvailable && (
          <button
            className={styles.loadButton}
            type="button"
            onClick={handleMorePosts}
          >
            Carregar mais posts
          </button>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.Predicates.at('document.type', 'post'),
    { pageSize: 2 }
  );

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results.map(result => {
      return {
        uid: result.uid,
        first_publication_date: result.first_publication_date,
        data: {
          title: result.data.title,
          subtitle: result.data.subtitle,
          author: result.data.author,
        },
      };
    }),
  };

  return {
    props: { postsPagination },
  };
};
