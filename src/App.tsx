import { useEffect, useState } from 'react';
import './index.css';
import Arrow from './icons/Arrow';
import { coin, highVoltage, trophy } from './images';

const App = () => {
  const [points, setPoints] = useState(() => {
    const storedPoints = localStorage.getItem('points');
    return storedPoints ? parseInt(storedPoints) : 0;
  });
  const [energy, setEnergy] = useState(2532);
  const [marsCoins, setMarsCoins] = useState(() => {
    const storedCoins = localStorage.getItem('marsCoins');
    return storedCoins ? parseInt(storedCoins) : 0;
  });
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const pointsToAdd = 12;
  const energyToReduce = 12;

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (energy < energyToReduce) {
      return; // Prevent clicking if not enough energy
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update points
    const newPoints = points + pointsToAdd;
    setPoints(newPoints);
    setEnergy(Math.max(energy - energyToReduce, 0)); // Ensure energy doesn't go below zero
    setClicks([...clicks, { id: Date.now(), x, y }]);

    // Check if the user can earn a Mars coin
    if (newPoints >= 100) {
      const newMarsCoins = marsCoins + 1;
      setMarsCoins(newMarsCoins);
      setPoints(newPoints - 100); // Deduct points for the Mars coin
      localStorage.setItem('marsCoins', newMarsCoins.toString()); // Save to localStorage
    }
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  const toggleShop = () => {
    setIsShopOpen(!isShopOpen);
  };

  // Define the function to exchange points for Mars coins
  const exchangePointsForMarsCoins = () => {
    if (points >= 100) {
      const newMarsCoins = marsCoins + 1;
      setMarsCoins(newMarsCoins);
      setPoints(points - 100); // Deduct points for the Mars coin
      localStorage.setItem('marsCoins', newMarsCoins.toString()); // Save to localStorage
      localStorage.setItem('points', (points - 100).toString()); // Update points in localStorage
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prevEnergy) => Math.min(prevEnergy + 1, 6500));
    }, 1000); // Restore 1 energy point every second

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  // Save points to localStorage whenever points change
  useEffect(() => {
    localStorage.setItem('points', points.toString());
  }, [points]);

  return (
    <div className="bg-gradient-main min-h-screen px-4 flex flex-col items-center text-white font-medium">

      <div className="absolute inset-0 h-1/2 bg-gradient-overlay z-0"></div>
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="radial-gradient-overlay"></div>
      </div>

      <div className="w-full z-10 min-h-screen flex flex-col items-center text-white">

        <div className="fixed top-0 left-0 w-full px-4 pt-8 z-10 flex flex-col items-center text-white">
          <div className="w-full cursor-pointer">
            <div className="bg-[#1f1f1f] text-center py-2 rounded-xl">
              <p className="text-lg">Join squad <Arrow size={18} className="ml-0 mb-1 inline-block" /></p>
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
              <div className="w-full bg-[#fad258] py-4 rounded-2xl flex justify-around">
                <button className="flex flex-col items-center gap-1" onClick={toggleShop}>
                  <img src="https://cdn-icons-png.flaticon.com/512/4396/4396935.png" width={24} height={24} alt="Shop" />
                  <span>Shop</span>
                </button>
              </div>
            </div>
          </div>
          <div className="w-full bg-[#f9c035] rounded-full mt-4">
            <div className="bg-gradient-to-r from-[#f3c45a] to-[#fffad0] h-4 rounded-full" style={{ width: `${(energy / 6500) * 100}%` }}></div>
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center">
          <div className="relative mt-4" onClick={handleClick}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0c/Mars_-_August_30_2021_-_Flickr_-_Kevin_M._Gill.png" className='rounded-[50%]' width={256} height={256} alt="notcoin" />
            {clicks.map((click) => (
              <div
                key={click.id}
                className="absolute text-5xl font-bold opacity-0"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-4 rounded-lg text-black w-80">
              <h2 className="text-2xl font-bold mb-4">Shop</h2>
              <p>You have {marsCoins} Mars Coins</p>
              <button className="bg-yellow-500 px-4 py-2 mt-4 rounded-lg" onClick={exchangePointsForMarsCoins}>
                Exchange 100 Points for 1 Mars Coin
              </button>
              <button className="bg-gray-300 px-4 py-2 mt-4 rounded-lg" onClick={toggleShop}>
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
