import Link from 'next/link';
import theme from '../styles/theme';
import Header from './Header';

import css from './Layout.module.css';
import Text from './Text';

const Layout = (props) => {
  return (
    <div className={css.container}>
      <Header />
      <div className={css.main}>{props.children}</div>
      <div className={css.footer}>
        <Link href={'https://github.com/bangtoven/crypto-composer'}>
          <a>
            <Text t4 color={theme.lightBlue}>
              Copyright © 2022, Jungho Bang.
            </Text>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Layout;
