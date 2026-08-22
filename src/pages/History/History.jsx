import React, { useState, useEffect } from 'react';
import { 
  History as HistoryIcon, 
  Play, 
  BarChart3, 
  Clock, 
  FileText, 
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Users,
  Search,
  Filter,
  Eye,
  RotateCcw
} from '../../components/Common/Icons';
import PageHeader from '../../components/Common/PageHeader';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import SceneVersionHistoryModal from '../../components/History/SceneVersionHistoryModal';
import { historyService } from '../../services/historyService';
import './History.css';

/**
 * History Page - Past Scene Tests, Simulation Logs, and Multi-Version Archives
 * @param {Object} props
 * @param {Array} props.scenes
 * @param {Function} props.onSelectScene
 * @param {Function} props.onSimulate
 * @param {Function} props.onViewInsights
 * @param {Function} props.onUpdateScene
 */
export default function History({
  scenes = [],
  onSelectScene,
  onSimulate,
  onViewInsights,
  onUpdateScene
}) {
  const [historyList, setHistoryList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSceneForVersions, setSelectedSceneForVersions] = useState(null);

  useEffect(() => {
    async function loadHistory() {
      const records = await historyService.getSimulationHistory();
      setHistoryList(records);
    }
    loadHistory();
  }, [scenes]);

  const getBadgeVariant = (status) => {
    switch (status) {
      case 'Completed': return 'emerald';
      case 'Needs Review': return 'amber';
      case 'Draft': return 'indigo';
      default: return 'muted';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#34d399';
    if (score >= 65) return '#fbbf24';
    return '#f87171';
  };

  // Filter history entries
  const filteredHistory = historyList.filter(item => {
    const matchesSearch = !searchQuery || 
      item.sceneTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.primaryIssue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genre?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenSimulation = (historyItem) => {
    const matchingScene = scenes.find(s => s.id === historyItem.sceneId) || scenes[0];
    if (matchingScene) {
      onViewInsights?.(matchingScene);
    }
  };

  return (
    <div className="history-page">
      <PageHeader
        title="Simulation History & Archives"
        subtitle="Chronological log of tested scenes, audience feedback passes, and multi-version story evolutions."
        tagline="AudienceAI Suite"
      />

      {/* Filter and Search Controls Toolbar */}
      <div className="history-toolbar glass-panel">
        <div className="history-search-box">
          <Search size={15} className="text-muted" />
          <input
            type="text"
            className="history-search-input"
            placeholder="Search by scene title, primary issue, or genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="history-filter-group">
          <span className="filter-label">Filter:</span>
          <div className="filter-tabs">
            <button
              type="button"
              className={`filter-tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All Runs ({historyList.length})
            </button>
            <button
              type="button"
              className={`filter-tab-btn ${statusFilter === 'Completed' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Completed')}
            >
              Completed
            </button>
            <button
              type="button"
              className={`filter-tab-btn ${statusFilter === 'Needs Review' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Needs Review')}
            >
              Needs Review
            </button>
          </div>
        </div>
      </div>

      {/* History Table Container */}
      <div className="history-table-container glass-panel">
        <div className="history-table-header">
          <span className="col-scene">Scene Title</span>
          <span className="col-time">Last Simulation</span>
          <span className="col-audience">Audience Count</span>
          <span className="col-issue">Primary Issue</span>
          <span className="col-score">Overall Score</span>
          <span className="col-status">Status</span>
          <span className="col-actions">Actions</span>
        </div>

        <div className="history-table-body">
          {filteredHistory.length === 0 ? (
            <div className="history-empty-row">
              <Clock size={24} className="text-muted" />
              <p>No simulation records matching your filter criteria.</p>
            </div>
          ) : (
            filteredHistory.map((item) => {
              const matchingScene = scenes.find(s => s.id === item.sceneId);

              return (
                <div key={item.id} className="history-row">
                  {/* Scene Title & Subtitle */}
                  <div className="col-scene">
                    <span 
                      className="row-scene-title" 
                      onClick={() => handleOpenSimulation(item)}
                      title="Open simulation insights"
                    >
                      {item.sceneTitle}
                    </span>
                    <span className="row-scene-sub">{item.sceneSubtitle || item.genre}</span>
                  </div>

                  {/* Last Simulation Timestamp */}
                  <div className="col-time">
                    <span className="row-time-text">
                      <Clock size={12} />
                      {item.formattedDate || item.timestamp}
                    </span>
                  </div>

                  {/* Audience Count */}
                  <div className="col-audience">
                    <div className="audience-pill">
                      <Users size={12} />
                      <span>{item.audienceCount || 4} Viewpoints</span>
                    </div>
                  </div>

                  {/* Primary Issue Detected */}
                  <div className="col-issue">
                    <span className="primary-issue-tag">
                      ⚠️ {item.primaryIssue || 'Pacing'}
                    </span>
                  </div>

                  {/* Overall Score */}
                  <div className="col-score">
                    <div className="history-score-badge">
                      <span 
                        className="score-number"
                        style={{ color: getScoreColor(item.overallScore || 75) }}
                      >
                        {item.overallScore || 75}
                      </span>
                      <span className="score-denom">/100</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-status">
                    <Badge variant={getBadgeVariant(item.status)} size="sm">
                      {item.status}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="col-actions">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<BarChart3 size={13} />}
                      onClick={() => handleOpenSimulation(item)}
                      title="Open previous simulation"
                    >
                      Insights
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<HistoryIcon size={12} />}
                      onClick={() => {
                        const sceneToInspect = matchingScene || scenes[0];
                        setSelectedSceneForVersions(sceneToInspect);
                      }}
                      title="Compare scene version history"
                    >
                      Versions
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Multi-Version Scene History Modal */}
      {selectedSceneForVersions && (
        <SceneVersionHistoryModal
          isOpen={Boolean(selectedSceneForVersions)}
          onClose={() => setSelectedSceneForVersions(null)}
          scene={selectedSceneForVersions}
          onRestoreVersion={async (restoredContent) => {
            if (onUpdateScene && selectedSceneForVersions) {
              const updated = {
                ...selectedSceneForVersions,
                content: restoredContent,
                scriptContent: restoredContent,
                updatedAt: new Date().toISOString()
              };
              await onUpdateScene(updated);
            }
          }}
        />
      )}
    </div>
  );
}
