import { useState } from 'react';
import { LangProvider } from './context/LangContext';
import Hero from './components/Hero';
import NavTabs from './components/NavTabs';
import Overview from './components/Overview';
import Countdown from './components/Countdown';
import Schedule from './components/Schedule';
import Photos from './components/Photos';
import Guests from './components/Guests';
import Venue from './components/Venue';
import Wishes from './components/Wishes';
import BackgroundMusic from './components/BackgroundMusic';
import './App.css';

const TABS = [
  { id: 'overview'  },
  { id: 'countdown' },
  { id: 'venue'     },
  { id: 'schedule'  },
  { id: 'photos'    },
  { id: 'wishes'    },
  { id: 'guests'    },
];

function AppInner() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':  return <Overview />;
      case 'countdown': return <Countdown />;
      case 'music':     return <Music />;
      case 'venue':     return <Venue />;
      case 'schedule':  return <Schedule />;
      case 'photos':    return <Photos />;
      case 'memories':  return <Memories />;
      case 'wishes':    return <Wishes />;
      case 'guests':    return <Guests />;
      default:          return <Overview />;
    }
  };

  return (
    <div className="app">
      <Hero />
      <NavTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">
        {renderTab()}
      </main>
      <BackgroundMusic />
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <AppInner />
    </LangProvider>
  );
}
