import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './pages/Dashboard/Dashboard';
import SceneEditor from './pages/SceneEditor/SceneEditor';
import Simulation from './pages/Simulation/Simulation';
import Insights from './pages/Insights/Insights';
import History from './pages/History/History';
import Settings from './pages/Settings/Settings';
import { sceneService, normalizeScene } from './services/sceneService';
import { DEMO_SCENE } from './data/demoScene';

export default function App() {
  const [scenes, setScenes] = useState([]);
  const [activeSceneId, setActiveSceneId] = useState(null);
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize scenes from persistent service
  useEffect(() => {
    async function loadScenes() {
      try {
        const loaded = await sceneService.getScenes();
        setScenes(loaded);
        if (loaded.length > 0) {
          setActiveSceneId(loaded[0].id);
        }
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
    if (scene) {
      setActiveSceneId(scene.id);
    }
  };

  // Toggle Demo Mode with "The Betrayal"
  const handleToggleDemoMode = async () => {
    if (!isDemoMode) {
      // Activate Demo Mode: ensure DEMO_SCENE is available
      const exists = scenes.find(s => s.id === DEMO_SCENE.id);
      if (!exists) {
        const savedDemo = await sceneService.saveScene(DEMO_SCENE);
        setScenes(prev => [savedDemo, ...prev.filter(s => s.id !== DEMO_SCENE.id)]);
      }
      setActiveSceneId(DEMO_SCENE.id);
      setIsDemoMode(true);
      setActiveRoute('editor');
    } else {
      setIsDemoMode(false);
    }
  };

  // Create brand new blank scene workflow
  const handleNewSimulation = async () => {
    try {
      const newScene = await sceneService.createScene({
        title: '',
        subtitle: `Act I • Scene ${scenes.length + 1}`,
        genre: 'Drama / Fiction',
        context: '',
        characters: ['Protagonist'],
        content: ''
      });

      setScenes(prev => [newScene, ...prev]);
      setActiveSceneId(newScene.id);
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

  // Dynamic Route Renderer
  const renderCurrentPage = () => {
    if (isLoading) {
      return (
        <div className="loading-container glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Loading story workspace...</p>
        </div>
      );
    }

    switch (activeRoute) {
      case 'dashboard':
        return (
          <Dashboard
            scenes={scenes}
            onSelectScene={(scene) => {
              handleSelectScene(scene);
              setActiveRoute('editor');
            }}
            onNewSimulation={handleNewSimulation}
            onSimulate={handleSimulateScene}
            onViewInsights={handleViewInsights}
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
            onSelectScene={(scene) => {
              handleSelectScene(scene);
              setActiveRoute('editor');
            }}
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
            onSelectScene={handleSelectScene}
            onNewSimulation={handleNewSimulation}
            onSimulate={handleSimulateScene}
            onViewInsights={handleViewInsights}
          />
        );
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeRoute={activeRoute}
        onNavigate={setActiveRoute}
        onNewSimulation={handleNewSimulation}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Layout */}
      <div className="main-wrapper">
        {/* Top Navbar */}
        <Navbar
          activeRoute={activeRoute}
          onNavigate={setActiveRoute}
          activeScene={activeScene}
          allScenes={scenes}
          onSelectScene={handleSelectScene}
          onToggleMobileMenu={() => setMobileSidebarOpen(true)}
          isDemoMode={isDemoMode}
          onToggleDemoMode={handleToggleDemoMode}
        />

        {/* Page Content Viewport */}
        <main className="page-container" key={activeRoute}>
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}
