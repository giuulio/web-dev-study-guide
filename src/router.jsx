import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import HtmlGuide from "./pages/guides/HtmlGuide.jsx";
import CssGuide from "./pages/guides/CssGuide.jsx";
import JsGuide from "./pages/guides/JsGuide.jsx";
import GitGuide from "./pages/guides/GitGuide.jsx";
import AsyncGuide from "./pages/guides/AsyncGuide.jsx";
import ReactGuide from "./pages/guides/ReactGuide.jsx";
import ReduxGuide from "./pages/guides/ReduxGuide.jsx";
import TsGuide from "./pages/guides/TsGuide.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "guides/html", element: <HtmlGuide /> },
      { path: "guides/css", element: <CssGuide /> },
      { path: "guides/javascript", element: <JsGuide /> },
      { path: "guides/git", element: <GitGuide /> },
      { path: "guides/async", element: <AsyncGuide /> },
      { path: "guides/react", element: <ReactGuide /> },
      { path: "guides/redux", element: <ReduxGuide /> },
      { path: "guides/typescript", element: <TsGuide /> },
    ],
  },
]);
