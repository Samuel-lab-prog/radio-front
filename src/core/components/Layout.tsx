import { Link, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <>
      <header className="shell nav">
        <Link className="brand" to="/">
          AURORA <span>FM</span>
        </Link>
        <nav className="navlinks">
          <Link to="/news">Notícias</Link>
          <Link to="/admin/news">Administração</Link>
        </nav>
      </header>
      <Outlet />
    </>
  );
}
