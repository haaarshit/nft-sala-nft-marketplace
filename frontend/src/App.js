import './App.css';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes
} from "react-router-dom";
import SellNft from './components/SellNft';
import Navbar from './components/Navbar';
import Home from './components/Home';
import NFTPage from './components/NFTPage';
import Profile from './components/Profile';

function App() {
  return (
    <div className="App min-h-[100vh]  bg-[rgb(24,24,24)] text-white relative justify-center ">
      <Router>
      <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/sellnft' element={<SellNft/>}/>
          <Route path='/nftpage/:id' element={<NFTPage/>}/>
          <Route path='/profile' element={<Profile/>}/>
        </Routes>
      </Router>
      <div className='h-[20vh] w-[20vh] bg-gradient-to-r from-indigo-600 to-green-400 rounded-full blur-[150px] absolute top-[1px]'></div>
    </div>
  );
}

export default App;