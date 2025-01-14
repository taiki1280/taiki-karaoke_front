import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className='basis-12 flex items-center text-2xl font-sans underline underline-offset-2'>
      <Link
        className='basis-32 text-center text-blue-500'
        to='/'
      >
        Top
      </Link>
      <Link
        className='basis-32 text-center text-blue-500'
        to='/score'
      >
        点数一覧
      </Link>
    </nav>
  );
};

export default Nav;
