import Header from "@/components/Header";
import BookingTabs from "@/components/BookingTabs";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f8f8' }}>
      <Header />
      
      {/* Search Bar Section */}
      <section 
        className="bg-white"
        
      >
        <div className="container w-full mx-auto">
          <BookingTabs />
        </div>
      </section>

      {/* Add spacing below */}
      <div style={{ height: '2.78vw' }}></div>
    </div>
  );
}
