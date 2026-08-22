import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Sparkles, 
  Save, 
  FileText, 
  Users, 
  Info, 
  Tag, 
  Layers, 
  Compass, 
  HelpCircle,
  Plus,
  Check,
  AlertCircle,
  Eye,
  FileEdit,
  ArrowRight,
  History as HistoryIcon
} from '../../components/Common/Icons';
import PageHeader from '../../components/Common/PageHeader';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import SceneVersionHistoryModal from '../../components/History/SceneVersionHistoryModal';
import './SceneEditor.css';

/**
 * Functional Scene Editor with Validation, Preview, and Save Lifecycle
 * @param {Object} props
 * @param {Object} props.activeScene
 * @param {Function} props.onUpdateScene
 * @param {Function} props.onSimulate
 */
export default function SceneEditor({
  activeScene,
  onUpdateScene,
  onSimulate
}) {
  // Mode: 'edit' | 'preview'
  const [editorMode, setEditorMode] = useState('edit');

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [genre, setGenre] = useState('');
  const [context, setContext] = useState('');
  const [characters, setCharacters] = useState([]);
  const [content, setContent] = useState('');
  const [newCharInput, setNewCharInput] = useState('');

  // Validation & Save UI States
  const [touched, setTouched] = useState({ title: false, content: false });
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved'
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [showValidationBanner, setShowValidationBanner] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);

  // Sync state whenever activeScene changes
  useEffect(() => {
    if (activeScene) {
      setTitle(activeScene.title || '');
      setSubtitle(activeScene.subtitle || 'Act I • Scene 1');
      setGenre(activeScene.genre || 'Drama / Fiction');
      setContext(activeScene.context || '');
      setCharacters(Array.isArray(activeScene.characters) ? [...activeScene.characters] : ['Protagonist']);
      setContent(activeScene.content || activeScene.scriptContent || '');
      setTouched({ title: false, content: false });
      setShowValidationBanner(false);
      setSaveStatus('idle');
      if (activeScene.updatedAt) {
        const d = new Date(activeScene.updatedAt);
        setLastSavedTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    }
  }, [activeScene?.id]);

  // Derived metrics & validation
  const wordCount = content.trim() ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  const readTimeEst = Math.max(1, Math.ceil(wordCount / 200));

  const isTitleValid = title.trim().length > 0;
  const isContentValid = content.trim().length > 0;
  const isFormValid = isTitleValid && isContentValid;

  // Multi-character handlers
  const handleAddCharacter = (e) => {
    if (e) e.preventDefault();
    const trimmed = newCharInput.trim();
    if (trimmed && !characters.includes(trimmed)) {
      setCharacters(prev => [...prev, trimmed]);
      setNewCharInput('');
    }
  };

  const handleKeyDownCharacter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCharacter();
    }
  };

  const handleRemoveCharacter = (nameToRemove) => {
    setCharacters(prev => prev.filter(c => c !== nameToRemove));
  };

  // Quick screenplay tag helpers
  const insertScriptTemplate = (snippet) => {
    setContent(prev => {
      const separator = prev.trim().length > 0 ? '\n\n' : '';
      return prev + separator + snippet;
    });
  };

  // Construct current scene data object
  const getCurrentSceneData = () => ({
    ...(activeScene || {}),
    id: activeScene?.id || `scene-${Date.now()}`,
    title: title.trim() || 'Untitled Scene',
    subtitle: subtitle.trim() || 'Act I • Scene 1',
    genre: genre.trim() || 'Drama / Fiction',
    context: context.trim(),
    characters: characters,
    content: content,
    scriptContent: content, // Keep backwards compatibility
    wordCount: wordCount,
    updatedAt: new Date().toISOString(),
    status: activeScene?.status || 'Draft'
  });

  // Save Draft Handler
  const handleSaveDraft = async () => {
    setSaveStatus('saving');
    const updated = getCurrentSceneData();
    if (onUpdateScene) {
      await onUpdateScene(updated);
    }
    const now = new Date();
    setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setSaveStatus('saved');
    setTimeout(() => {
      setSaveStatus('idle');
    }, 2500);
  };

  // Simulate Audience Handler with strict validation
  const handleSimulateAudience = () => {
    setTouched({ title: true, content: true });

    if (!isFormValid) {
      setShowValidationBanner(true);
      return;
    }

    setShowValidationBanner(false);
    const updated = getCurrentSceneData();
    if (onUpdateScene) {
      onUpdateScene(updated);
    }
    if (onSimulate) {
      onSimulate(updated);
    }
  };

  return (
    <div className="scene-editor-page">
      {/* Top Actions & Mode Switcher Bar */}
      <div className="editor-top-actions glass-panel">
        <div className="editor-status-info">
          {/* View Mode Tabs: Edit vs Preview */}
          <div className="editor-mode-toggle">
            <button
              type="button"
              className={`mode-toggle-btn ${editorMode === 'edit' ? 'active' : ''}`}
              onClick={() => setEditorMode('edit')}
              title="Edit scene content and settings"
            >
              <FileEdit size={14} />
              <span>Edit Mode</span>
            </button>
            <button
              type="button"
              className={`mode-toggle-btn ${editorMode === 'preview' ? 'active' : ''}`}
              onClick={() => setEditorMode('preview')}
              title="Preview audience-ready scene"
            >
              <Eye size={14} />
              <span>Preview Mode</span>
            </button>
          </div>

          <div className="editor-metric-divider" />

          <span className="editor-metric-pill">
            <FileText size={13} />
            <span>{wordCount} words</span>
          </span>
          <span className="editor-metric-pill">
            <span>~{readTimeEst} min read</span>
          </span>

          {lastSavedTime && (
            <span className="editor-saved-indicator">
              <Check size={12} className="text-emerald" />
              <span>Saved at {lastSavedTime}</span>
            </span>
          )}
        </div>

        <div className="editor-btn-group">
          {/* Version History Button */}
          <Button
            variant="ghost"
            size="md"
            icon={<HistoryIcon size={14} />}
            onClick={() => setIsVersionModalOpen(true)}
            title="Inspect and compare previous draft versions"
          >
            Version History
          </Button>

          {/* Save Draft CTA */}
          <Button
            variant="secondary"
            size="md"
            icon={saveStatus === 'saved' ? <Check size={15} /> : <Save size={15} />}
            onClick={handleSaveDraft}
            disabled={saveStatus === 'saving'}
            title="Save current scene draft to storage"
          >
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Draft Saved!' : 'Save Draft'}
          </Button>

          {/* Simulate Audience CTA (Required validation) */}
          <Button
            variant="primary"
            size="md"
            icon={<Play size={15} />}
            onClick={handleSimulateAudience}
            className="simulate-audience-cta"
            title="Submit scene to 4 audience personas"
          >
            Simulate Audience
          </Button>
        </div>
      </div>

      {/* Validation Alert Banner if user attempts to simulate with empty required fields */}
      {showValidationBanner && !isFormValid && (
        <div className="validation-alert-banner">
          <div className="validation-alert-content">
            <AlertCircle size={18} className="validation-alert-icon" />
            <div>
              <h4 className="validation-alert-title">Required Fields Missing</h4>
              <p className="validation-alert-desc">
                {!isTitleValid && !isContentValid
                  ? 'Please enter a Scene Title and Scene Content before simulating audience reaction.'
                  : !isTitleValid
                  ? 'Please provide a Scene Title to proceed with simulation.'
                  : 'Please write or paste your Scene Content before simulating.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="validation-alert-close"
            onClick={() => setShowValidationBanner(false)}
          >
            ×
          </button>
        </div>
      )}

      {/* =========================================================================
          EDIT MODE VIEW
          ========================================================================= */}
      {editorMode === 'edit' ? (
        <div className="editor-workspace-grid">
          {/* Left Column: Title, Metadata, and Screenplay Content Editor */}
          <div className="editor-main-panel glass-panel">
            {/* Scene Title Section */}
            <div className="scene-title-section">
              <div className="scene-input-group">
                <div className="label-with-hint">
                  <label className="editor-field-label">
                    Scene Title <span className="field-required">*</span>
                  </label>
                  {touched.title && !isTitleValid && (
                    <span className="field-error-text">Scene title is required</span>
                  )}
                </div>
                <input
                  type="text"
                  className={`scene-title-input ${touched.title && !isTitleValid ? 'input-error' : ''}`}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!touched.title) setTouched(prev => ({ ...prev, title: true }));
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, title: true }))}
                  placeholder="Enter scene title (e.g. The Betrayal at Sunken Wharf)"
                />
              </div>

              <div className="scene-meta-row">
                <div className="scene-input-group meta-field">
                  <label className="editor-field-label">Act / Sequence</label>
                  <input
                    type="text"
                    className="scene-meta-input"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. Act II • Scene 4"
                  />
                </div>

                <div className="scene-input-group meta-field">
                  <label className="editor-field-label">Genre & Tone</label>
                  <input
                    type="text"
                    className="scene-meta-input"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="e.g. Dark Fantasy / Thriller"
                  />
                </div>
              </div>
            </div>

            {/* Screenplay Content Editor */}
            <div className="script-editor-container">
              <div className="script-toolbar">
                <div className="script-toolbar-left">
                  <span className="script-toolbar-label">
                    Scene Content <span className="field-required">*</span>
                  </span>
                  {touched.content && !isContentValid && (
                    <span className="field-error-text">Content cannot be empty</span>
                  )}
                </div>

                <div className="script-quick-tags">
                  <button 
                    type="button" 
                    className="quick-tag-btn"
                    onClick={() => insertScriptTemplate('INT. LOCATION - NIGHT')}
                    title="Insert Scene Heading"
                  >
                    + SCENE HEADING
                  </button>
                  <button 
                    type="button" 
                    className="quick-tag-btn"
                    onClick={() => insertScriptTemplate('CHARACTER NAME\n(whispering)\nDialogue line...')}
                    title="Insert Character Dialogue"
                  >
                    + DIALOGUE
                  </button>
                  <button 
                    type="button" 
                    className="quick-tag-btn"
                    onClick={() => insertScriptTemplate('Action beat describing physical movement and environmental tension.')}
                    title="Insert Action Beat"
                  >
                    + ACTION BEAT
                  </button>
                </div>
              </div>

              {/* Textarea */}
              <div className="script-textarea-wrapper">
                <textarea
                  className={`script-content-editor ${touched.content && !isContentValid ? 'input-error' : ''}`}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (!touched.content) setTouched(prev => ({ ...prev, content: true }));
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, content: true }))}
                  placeholder="Write or paste your scene here... Include character dialogue, actions, and environmental descriptions."
                  rows={20}
                  spellCheck="false"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Context, Characters & UX Guidance */}
          <div className="editor-side-panel">
            {/* 1. Story Context / World Lore */}
            <div className="context-card glass-panel">
              <div className="card-section-header">
                <div className="card-header-icon-box">
                  <Compass size={16} />
                </div>
                <div>
                  <h3 className="card-section-title">Story Context</h3>
                  <span className="card-section-subtitle">What the audience needs to know</span>
                </div>
              </div>

              <textarea
                className="context-textarea"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Provide background story context, preceding events, stakes, and hidden character agendas..."
                rows={4}
              />
            </div>

            {/* 2. Multi-Character Entry */}
            <div className="characters-card glass-panel">
              <div className="card-section-header">
                <div className="card-header-icon-box">
                  <Users size={16} />
                </div>
                <div>
                  <h3 className="card-section-title">Characters</h3>
                  <span className="card-section-subtitle">Key players present in scene</span>
                </div>
              </div>

              <div className="character-tags-list">
                {characters.length === 0 ? (
                  <span className="character-empty-hint">No characters added yet</span>
                ) : (
                  characters.map((char, index) => (
                    <div key={index} className="character-tag-pill">
                      <span className="character-tag-avatar">{char.charAt(0).toUpperCase()}</span>
                      <span className="character-tag-name">{char}</span>
                      <button
                        type="button"
                        className="character-tag-remove"
                        onClick={() => handleRemoveCharacter(char)}
                        title={`Remove ${char}`}
                        aria-label={`Remove ${char}`}
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add character input form */}
              <form onSubmit={handleAddCharacter} className="add-character-form">
                <input
                  type="text"
                  className="add-character-input"
                  value={newCharInput}
                  onChange={(e) => setNewCharInput(e.target.value)}
                  onKeyDown={handleKeyDownCharacter}
                  placeholder="Enter character name (e.g. Alex)..."
                />
                <Button 
                  variant="secondary" 
                  size="sm" 
                  type="submit" 
                  icon={<Plus size={14} />}
                  disabled={!newCharInput.trim()}
                >
                  Add
                </Button>
              </form>
            </div>

            {/* 3. UX Guidance Box: "What happens when I click Simulate?" */}
            <div className="ux-guidance-card glass-panel">
              <div className="card-section-header">
                <div className="card-header-icon-box amber-glow">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="card-section-title">Audience AI Simulation</h3>
                  <span className="card-section-subtitle">How simulation evaluates your scene</span>
                </div>
              </div>

              <div className="ux-guidance-body">
                <p className="ux-guidance-item">
                  <strong>What will the audience see?</strong>
                  <span> The 4 personas receive your scene title, context lore, characters, and dialogue text.</span>
                </p>
                <p className="ux-guidance-item">
                  <strong>What happens when you simulate?</strong>
                  <span> Gathers distinct viewpoint reactions from Casual Viewers, Story Critics, Lore Enthusiasts, and Emotional Fans.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
           PREVIEW MODE VIEW
           ========================================================================= */
        <div className="scene-preview-container glass-panel">
          <div className="preview-hero-bar">
            <div>
              <div className="preview-meta-row">
                <Badge variant="amber" size="sm">Audience View Preview</Badge>
                <span className="preview-act-tag">{subtitle || 'Act I • Scene 1'}</span>
                <span className="preview-genre-tag">{genre || 'Drama'}</span>
              </div>
              <h2 className="preview-title">{title || 'Untitled Scene'}</h2>
            </div>

            <div className="preview-actions">
              <Button
                variant="secondary"
                size="sm"
                icon={<FileEdit size={14} />}
                onClick={() => setEditorMode('edit')}
              >
                Back to Edit
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Play size={14} />}
                onClick={handleSimulateAudience}
              >
                Simulate Now
              </Button>
            </div>
          </div>

          {/* Context Banner in Preview */}
          {context && (
            <div className="preview-context-box">
              <span className="preview-section-heading">Story Background & World Context:</span>
              <p className="preview-context-text">{context}</p>
            </div>
          )}

          {/* Characters in Preview */}
          {characters.length > 0 && (
            <div className="preview-characters-box">
              <span className="preview-section-heading">Characters Present:</span>
              <div className="preview-char-pills">
                {characters.map((char, idx) => (
                  <span key={idx} className="preview-char-pill">
                    <span className="char-dot" />
                    {char}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Formatted Screenplay Preview */}
          <div className="preview-screenplay-body">
            <span className="preview-section-heading">Scene Screenplay:</span>
            {content.trim() ? (
              <pre className="screenplay-formatted-text">{content}</pre>
            ) : (
              <div className="preview-empty-placeholder">
                <FileText size={24} />
                <p>Scene content is currently empty. Switch to Edit Mode to write your scene.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {isVersionModalOpen && (
        <SceneVersionHistoryModal
          isOpen={isVersionModalOpen}
          onClose={() => setIsVersionModalOpen(false)}
          scene={activeScene}
          onRestoreVersion={async (restoredContent) => {
            setContent(restoredContent);
            const updated = {
              ...getCurrentSceneData(),
              content: restoredContent,
              scriptContent: restoredContent,
              updatedAt: new Date().toISOString()
            };
            if (onUpdateScene) {
              await onUpdateScene(updated);
            }
          }}
        />
      )}
    </div>
  );
}
