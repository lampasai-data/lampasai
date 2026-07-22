import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Insights from "./components/Insights";
import Team from "./components/Team";
import Partners from "./components/Partners";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Nav />
      <Hero />
      <main>
        <About />
        <Insights />
        <Team />
        <Partners />
        <Services />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
