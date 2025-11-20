import { Heart, Users } from 'lucide-react';
import { PhaserGame } from './game/PhaserGame';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="game-header">
        <div className="title-container">
          <Users className="icon" size={32} />
          <h1>Helping Hands</h1>
        </div>
        <div className="stats">
          <div className="stat-item">
            <Heart className="icon-heart" size={20} />
            <span>Community Happiness: Level 1</span>
          </div>
        </div>
      </header>
      
      <main className="game-wrapper">
        <PhaserGame />
        <div className="controls-hint">
          <p>Explore the village and help your neighbors!</p>
        </div>
      </main>
    </div>
  );
}

export default App;
