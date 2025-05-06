//import styling fot the react application 
import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PostForm from './components/PostForm';
import CardGroup from './components/CardGroup'

import { CustomButton, handleAlert, handleRedirect, useToggle } from './components/buttons';


//default function of the app page(landing page of the application)
function App() {
  //use of the predifed toggle hook
  const [isToggled, toggle] = useToggle()

   // Sample Data for Card Groups
   const cardData1 = [
    {
        title: "Card 1",
        description: "This is the first card in the group.",
        imageUrl: "https://via.placeholder.com/300",
    },
    {
        title: "Card 2",
        description: "This is the second card in the group.",
        imageUrl: "https://via.placeholder.com/300",
    },
    {
        title: "Card 3",
        description: "This is the third card in the group.",
        imageUrl: "https://via.placeholder.com/300",
    },
];

const cardData2 = [
    {
        title: "Project A",
        description: "A project about web development.",
    },
    {
        title: "Project B",
        description: "A project about mobile app development.",
    },
    {
        title: "Project C",
        description: "A project about AI and machine learning.",
    },
];

  return (
    <div className="App">
      <Navbar />
      <div className='container'>
        <Sidebar />
        <main className='content'>
          <div className='form-container'>
            <PostForm />
          </div>
          <div className='card-container'>
            <h1 style={{ textAlign: "center", marginTop: "20px" }}>Card Group Example</h1>

            {/* First Card Group */}
            <h2 style={{ textAlign: "center", marginTop: "40px" }}>Card Group 1</h2>
            <CardGroup cards={cardData1} />

            {/* Second Card Group */}
            <h2 style={{ textAlign: "center", marginTop: "40px" }}>Card Group 2</h2>
            <CardGroup cards={cardData2} />
          </div>
        </main>
      </div>

      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Reusable Buttons with Different Functionalities</h1>

        {/* Alert Button */}
        <CustomButton label="Show Alert" onClick={handleAlert} />

        {/* Redirect Button */}
        <CustomButton label="Redirect to Home" onClick={handleRedirect("/home")} />

        {/* Toggle Button */}
        <CustomButton label="Toggle State" onClick={toggle} />
        <p>Toggle State: {isToggled ? "ON" : "OFF"}</p>

        {/* Custom Button with Inline Functionality */}
        <CustomButton
          label="Log to Console"
          onClick={() => console.log("Button clicked!")}
        />
      </div>
    </div>
  );
}

export default App;
