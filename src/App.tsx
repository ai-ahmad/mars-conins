import { useEffect, useState } from 'react';
import './index.css';
import Arrow from './icons/Arrow';

const App = () => {
  const [points, setPoints] = useState(0);
  const [energy, setEnergy] = useState(2532);
  const [marsCoins, setMarsCoins] = useState(() => {
    return parseInt(localStorage.getItem('marsCoins')) || 0;
  });
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const [isShopOpen, setIsShopOpen] = useState(false); // State for opening/closing shop modal
  const pointsToAdd = 12;
  const energyToReduce = 12;

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (energy < energyToReduce) {
      return; // Prevent clicking if not enough energy
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPoints(points + pointsToAdd);
    setEnergy(prevEnergy => Math.max(prevEnergy - energyToReduce, 0));
    setClicks([...clicks, { id: Date.now(), x, y }]);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  const toggleShop = () => {
    setIsShopOpen(!isShopOpen); // Toggle shop modal
  };

  const exchangePointsForMarsCoins = () => {
    if (points >= 100) {
      setMarsCoins(marsCoins + 1);
      setPoints(points - 100);
      localStorage.setItem('marsCoins', (marsCoins + 1).toString());
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy(prevEnergy => {
        const newEnergy = Math.min(prevEnergy + 1, 6500);
        // Save energy to localStorage if needed
        return newEnergy;
      });
    }, 1000); // Restore 1 energy point every second

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  useEffect(() => {
    localStorage.setItem('marsCoins', marsCoins.toString()); // Update marsCoins in localStorage
  }, [marsCoins]);

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen px-4 flex flex-col items-center text-white font-medium">

      <div className="absolute inset-0 h-1/2 bg-gradient-to-b from-black to-transparent z-0"></div>
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="radial-gradient-overlay"></div>
      </div>

      <div className="w-full z-10 min-h-screen flex flex-col items-center text-white">

        <div className="fixed top-0 left-0 w-full px-4 pt-8 z-10 flex flex-col items-center text-white">
          <div className="w-full cursor-pointer">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-center py-2 rounded-xl shadow-md">
              <p className="text-lg font-semibold">Join squad <Arrow size={18} className="ml-0 mb-1 inline-block" /></p>
            </div>
          </div>
          <div className="mt-12 text-5xl font-bold flex items-center">
            <img src={coin} width={44} height={44} />
            <span className="ml-2">{points.toLocaleString()}</span>
          </div>
          <div className="text-base mt-2 flex items-center">
            <img src={trophy} width={24} height={24} />
            <span className="ml-1">Gold <Arrow size={18} className="ml-0 mb-1 inline-block" /></span>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full px-4 pb-4 z-10">
          <div className="w-full flex justify-between gap-2">
            <div className="w-1/3 flex items-center justify-start max-w-32">
              <div className="flex items-center justify-center">
                <img src={highVoltage} width={44} height={44} alt="High Voltage" />
                <div className="ml-2 text-left">
                  <span className="text-white text-2xl font-bold block">{energy}</span>
                  <span className="text-white text-large opacity-75">/ 6500</span>
                </div>
              </div>
            </div>
            <div className="flex-grow flex items-center max-w-60 text-sm">
              <div className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 py-4 rounded-2xl flex justify-around shadow-lg">
                <button className="flex flex-col items-center gap-1" onClick={toggleShop}>
                  <img src="https://cdn-icons-png.flaticon.com/512/4396/4396935.png" width={24} height={24} alt="Shop" />
                  <span>Shop</span>
                </button>
              </div>
            </div>
          </div>
          <div className="w-full bg-yellow-500 rounded-full mt-4">
            <div className="bg-gradient-to-r from-yellow-300 to-yellow-600 h-4 rounded-full transition-all duration-300" style={{ width: `${(energy / 6500) * 100}%` }}></div>
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center">
          <div className="relative mt-4" onClick={handleClick}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0c/Mars_-_August_30_2021_-_Flickr_-_Kevin_M._Gill.png" className='rounded-[50%] shadow-md' width={256} height={256} alt="notcoin" />
            {clicks.map((click) => (
              <div
                key={click.id}
                className="absolute text-5xl font-bold opacity-0 animate-bounce"
                style={{
                  top: `${click.y - 42}px`,
                  left: `${click.x - 28}px`,
                  animation: `float 1s ease-out`
                }}
                onAnimationEnd={() => handleAnimationEnd(click.id)}
              >
                12
              </div>
            ))}
          </div>
        </div>

        {isShopOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20 transition-all duration-300">
            <div className="bg-gray-800 p-6 rounded-lg text-white w-80 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-center">Mars Shop</h2>
              <p className="text-lg text-center">You have <span className="font-semibold">{marsCoins}</span> Mars Coins</p>
              <button 
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-3 mt-4 rounded-full shadow-lg w-full text-center font-semibold text-black hover:bg-yellow-600 transition-all"
                onClick={exchangePointsForMarsCoins}
              >
                Exchange 100 Points for 1 Mars Coin
              </button>
              <button 
                className="bg-gray-700 px-4 py-2 mt-4 rounded-lg w-full text-center hover:bg-gray-600 transition-all"
                onClick={toggleShop}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
