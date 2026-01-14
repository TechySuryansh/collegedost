import Navbar from './components/Navbar';
import Hero from './components/Hero';
import NewsSection from './components/NewsSection';
import Section from './components/Section';
import Footer from './components/Footer';
import { featuredColleges, examCategories } from './data';
import './App.css'; 

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <NewsSection />
      
      <div className="main-content">
        <Section 
          title="Explore by Category" 
          items={examCategories} 
          type="category" 
        />
        
        <Section 
          title="Featured Colleges" 
          items={featuredColleges} 
          type="card" 
        />
      </div>
      
      <Footer />
    </div>
  )
}

export default App
