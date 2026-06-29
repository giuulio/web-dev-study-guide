import { Link } from "react-router-dom";

export default function Home() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/guides/html">HTML</Link>
        </li>
        <li>
          <Link to="/guides/css">CSS</Link>
        </li>
        <li>
          <Link to="/guides/javascript">JavaScript</Link>
        </li>
        <li>
          <Link to="/guides/git">Git &amp; GitHub</Link>
        </li>
        <li>
          <Link to="/guides/async">Async &amp; HTTP</Link>
        </li>
        <li>
          <Link to="/guides/react">React</Link>
        </li>
        <li>
          <Link to="/guides/redux">Redux</Link>
        </li>
        <li>
          <Link to="/guides/typescript">TypeScript</Link>
        </li>
      </ul>
    </nav>
  );
}
