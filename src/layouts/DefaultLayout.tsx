import { Outlet } from "react-router-dom";
import Nav from "./nav";
import NewsletterFooter from "./NewsletterFooter";
const DefaultLayout = () => {
  return (
    <>
      <header>
        {/* Header content */}
        <Nav />
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="bg-sky-50">
        {/* Footer content */}
        <NewsletterFooter />
      </footer>


      
      
    </>
  );
};

export default DefaultLayout;
