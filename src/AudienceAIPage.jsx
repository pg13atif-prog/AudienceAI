import './index.css';
import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard/Dashboard';
import SceneEditor from './pages/SceneEditor/SceneEditor';
import Simulation from './pages/Simulation/Simulation';
import Insights from './pages/Insights/Insights';
import History from './pages/History/History';
import Settings from './pages/Settings/Settings';
import TopNav from './components/Common/TopNav';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import VisualPreferencesModal from './components/Common/VisualPreferencesModal';
import { sceneService } from './services/sceneService';
import { DEMO_SCENES, DEMO_SCENE } from './data/demoScene';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
  )},
  { id: 'editor', label: 'Scene Editor', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
  )},
  { id: 'simulation', label: 'Simulate', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
  )},
  { id: 'insights', label: 'Insights', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
  )},
  { id: 'history', label: 'History', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
  )}
];

function AudienceAIContent() {
  const { theme, glassSettings } = useTheme();

  // -- App State --
  const [scenes, setScenes] = useState([]);
  const [activeSceneId, setActiveSceneId] = useState(null);
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [vpModalOpen, setVpModalOpen] = useState(false);

  useEffect(() => {
    async function loadScenes() {
      try {
        const loaded = await sceneService.getScenes();
        setScenes(loaded);
        if (loaded.length > 0) setActiveSceneId(loaded[0].id);
      } catch (err) {
        console.error('Error loading scenes:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadScenes();
  }, []);

  const activeScene = scenes.find(s => s.id === activeSceneId) || scenes[0] || null;

  const handleSelectScene = (scene) => {
    if (scene) setActiveSceneId(scene.id);
  };

  const handleLoadDemoScene = async (demo, targetRoute = 'editor') => {
    try {
      const exists = scenes.find(s => s.id === demo.id);
      let targetScene = exists;
      if (!exists) {
        targetScene = await sceneService.saveScene(demo);
        setScenes(prev => [targetScene, ...prev.filter(s => s.id !== demo.id)]);
      }
      setActiveSceneId(targetScene.id);
      setIsDemoMode(true);
      setActiveRoute(targetRoute);
    } catch (err) {
      console.error('Failed to load demo scene:', err);
    }
  };

  const handleToggleDemoMode = async () => {
    const nextIndex = isDemoMode ? (currentDemoIndex + 1) % (DEMO_SCENES.length || 1) : 0;
    const targetDemo = DEMO_SCENES[nextIndex] || DEMO_SCENE;
    setCurrentDemoIndex(nextIndex);
    await handleLoadDemoScene(targetDemo, 'editor');
  };

  const handleNewSimulation = async () => {
    try {
      const newScene = await sceneService.createScene({
        title: '',
        subtitle: `Act I â€¢ Scene ${scenes.length + 1}`,
        genre: 'Drama / Fiction',
        context: '',
        characters: ['Protagonist'],
        content: ''
      });
      setScenes(prev => [newScene, ...prev]);
      setActiveSceneId(newScene.id);
      setIsDemoMode(false);
      setActiveRoute('editor');
    } catch (err) {
      console.error('Failed to create new scene:', err);
    }
  };

  const handleSimulateScene = async (scene) => {
    if (scene) {
      const saved = await sceneService.saveScene(scene);
      setScenes(prev => prev.map(s => s.id === saved.id ? saved : s));
      setActiveSceneId(saved.id);
    }
    setActiveRoute('simulation');
  };

  const handleViewInsights = (scene) => {
    if (scene) setActiveSceneId(scene.id);
    setActiveRoute('insights');
  };

  const handleUpdateScene = async (updatedScene) => {
    try {
      const saved = await sceneService.saveScene(updatedScene);
      setScenes(prev => prev.map(s => s.id === saved.id ? saved : s));
      return saved;
    } catch (err) {
      console.error('Failed to update scene:', err);
    }
  };

  const renderCurrentPage = () => {
    if (isLoading) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '350px', gap: '16px', color: '#8492a6' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p>Loading AudienceAI workspace...</p>
        </div>
      );
    }

    switch (activeRoute) {
      case 'dashboard':
        return (
          <Dashboard
            scenes={scenes}
            activeScene={activeScene}
            onSelectScene={(scene) => { handleSelectScene(scene); setActiveRoute('editor'); }}
            onNewSimulation={handleNewSimulation}
            onSimulate={handleSimulateScene}
            onViewInsights={handleViewInsights}
            onLoadDemo={handleLoadDemoScene}
          />
        );
      case 'editor':
        return (
          <SceneEditor
            activeScene={activeScene}
            onUpdateScene={handleUpdateScene}
            onSimulate={handleSimulateScene}
          />
        );
      case 'simulation':
        return (
          <Simulation
            activeScene={activeScene}
            onNavigate={setActiveRoute}
            onViewInsights={handleViewInsights}
            onUpdateScene={handleUpdateScene}
          />
        );
      case 'insights':
        return (
          <Insights
            activeScene={activeScene}
            onNavigate={setActiveRoute}
            onSimulate={handleSimulateScene}
            onUpdateScene={handleUpdateScene}
          />
        );
      case 'history':
        return (
          <History
            scenes={scenes}
            onSelectScene={(scene) => { handleSelectScene(scene); setActiveRoute('editor'); }}
            onSimulate={handleSimulateScene}
            onViewInsights={handleViewInsights}
            onUpdateScene={handleUpdateScene}
          />
        );
      case 'settings':
        return <Settings />;
      default:
        return (
          <Dashboard
            scenes={scenes}
            activeScene={activeScene}
            onSelectScene={handleSelectScene}
            onNewSimulation={handleNewSimulation}
            onSimulate={handleSimulateScene}
            onViewInsights={handleViewInsights}
            onLoadDemo={handleLoadDemoScene}
          />
        );
    }
  };

  const layoutStyle = {
    '--glass-blur-value': `${glassSettings?.backdropBlur || 20}px`,
    '--glass-opacity-value': glassSettings?.surfaceOpacity || 0.75,
  };

  return (
    <div className={`aai-layout ${theme === 'deepsea' ? 'theme-deepsea' : ''}`} style={layoutStyle}>
      {/* Exact Sidebar matching screenshot */}
      <aside className="aai-exact-sidebar glass-panel">
        <div className="aai-exact-sidebar__brand">
          <div className="aai-exact-sidebar__logo">A</div>
          <span className="aai-exact-sidebar__brand-name">AudienceAI</span>
        </div>
        
        <button className="aai-exact-sidebar__new-btn" onClick={handleNewSimulation}>
          + New Simulation
        </button>
        
        <nav className="aai-exact-sidebar__nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`aai-exact-sidebar__nav-item ${activeRoute === item.id ? 'aai-exact-sidebar__nav-item--active' : ''}`}
              onClick={() => setActiveRoute(item.id)}
            >
              {activeRoute === item.id && <span className="aai-sidebar-active-dot"></span>}
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="aai-exact-sidebar__bottom">
          <button 
            className={`aai-exact-sidebar__nav-item ${activeRoute === 'settings' ? 'aai-exact-sidebar__nav-item--active' : ''}`}
            onClick={() => setActiveRoute('settings')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            <span>Settings</span>
          </button>
          <button className="aai-exact-sidebar__nav-item" onClick={handleToggleDemoMode} title="Load Demo Scene">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
            <span>{isDemoMode ? 'Demo Active' : 'Demo Mode'}</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="aai-exact-main">
        <TopNav />
        {renderCurrentPage()}
      </main>

      <VisualPreferencesModal isOpen={vpModalOpen} onClose={() => setVpModalOpen(false)} />
    </div>
  );
}

export default function AudienceAIPage() {
  return (
    <ThemeProvider>
      <AudienceAIContent />
    </ThemeProvider>
  );
}
