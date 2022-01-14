import Header from './Header';

import css from './Layout.module.css';

const Layout = (props) => {
  return (
    <div>
      <Header />
      <div className={css.main}>{props.children}</div>
    </div>
  );
};

export default Layout;
