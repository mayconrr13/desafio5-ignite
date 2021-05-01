import { useEffect, useRef } from 'react';
import commonStyles from '../../styles/common.module.scss';

export const Comments = (): JSX.Element => {
  const commentBox = useRef(null);

  useEffect(() => {
    const scriptEl = document.createElement('script');
    scriptEl.setAttribute('src', 'https://utteranc.es/client.js');
    scriptEl.setAttribute('crossorigin', 'anonymous');
    scriptEl.setAttribute('async', 'true');
    scriptEl.setAttribute('repo', 'mayconrr13/space-traveller-comments');
    scriptEl.setAttribute('issue-term', 'pathname');
    scriptEl.setAttribute('theme', 'github-dark');
    commentBox.current.appendChild(scriptEl);
  }, []);

  return (
    <div ref={commentBox} id="commentsSection" className={commonStyles.size} />
  );
};
