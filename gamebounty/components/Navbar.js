import Link from 'next/link';

const NavBar = () => {
  return (
    <header>
      <h1>GamerBounty</h1>
      <nav>
        <ul>
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href="/submit">
              <a>Submit</a>
            </Link>
          </li>
          <li>
            <Link href="/my-profile">
              <a>My Profile</a>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
