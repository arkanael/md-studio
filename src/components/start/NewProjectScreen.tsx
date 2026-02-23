import React, { useState } from 'react';
import './NewProjectScreen.css';

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  recommended?: boolean;
}

const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'blank',
    name: 'Projeto em Branco',
    description: 'Comece do zero com uma cena vazia.',
    icon: '📄',
  },
  {
    id: 'platformer',
    name: 'Plataforma (Sample)',
    description: 'Projeto exemplo com cenas, atores e eventos configurados para um jogo de plataforma Mega Drive.',
    icon: '🎮',
    recommended: true,
  },
  {
    id: 'rpg',
    name: 'RPG Top-Down',
    description: 'Template RPG com mapa de tiles, NPCs e sistema de diálogo para Mega Drive.',
    icon: '🗺️',
  },
  {
    id: 'shooter',
    name: 'Shooter Horizontal',
    description: 'Template para shoot em up com scroll lateral e sistema de inimigos.',
    icon: '🚀',
  },
];

interface NewProjectScreenProps {
  onCreateProject: (name: string, path: string, templateId: string) => void;
  onOpenProject: () => void;
}

const NewProjectScreen: React.FC<NewProjectScreenProps> = ({
  onCreateProject,
  onOpenProject,
}) => {
  const [projectName, setProjectName] = useState('MeuJogoMD');
  const [projectPath, setProjectPath] = useState('/home/usuario/Documentos/');
  const [selectedTemplate, setSelectedTemplate] = useState('platformer');

  const handleCreate = () => {
    if (!projectName.trim()) return;
    onCreateProject(projectName.trim(), projectPath, selectedTemplate);
  };

  const handleBrowsePath = () => {
    // No Electron, isso dispara o dialog de diretório via IPC
    if (window.mdStudio?.selectDirectory) {
      window.mdStudio.selectDirectory().then((dir: string) => {
        if (dir) setProjectPath(dir);
      });
    }
  };

  return (
    <div className="new-project-screen">
      <div className="new-project-sidebar">
        <div className="new-project-logo">
          <span className="logo-icon">🎯</span>
          <span className="logo-text">MD Studio</span>
          <span className="logo-version">v0.1.0-alpha</span>
        </div>
        <div className="new-project-sidebar-actions">
          <button className="sidebar-action-btn primary" onClick={handleCreate}>
            ✨ Novo Projeto
          </button>
          <button className="sidebar-action-btn" onClick={onOpenProject}>
            📂 Abrir Projeto
          </button>
        </div>
        <div className="new-project-sidebar-info">
          <p>Crie jogos para o <strong>Sega Mega Drive</strong> visualmente.</p>
          <p>Baseado no fluxo do GB Studio, adaptado para o <strong>SGDK</strong>.</p>
        </div>
      </div>

      <div className="new-project-main">
        <h1 className="new-project-title">Novo Projeto</h1>

        <div className="new-project-form">
          <div className="form-group">
            <label htmlFor="project-name">Nome do Projeto</label>
            <input
              id="project-name"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="MeuJogoMD"
              className="form-input"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="project-path">Pasta</label>
            <div className="path-input-group">
              <input
                id="project-path"
                type="text"
                value={projectPath}
                onChange={(e) => setProjectPath(e.target.value)}
                className="form-input"
              />
              <button
                className="browse-btn"
                onClick={handleBrowsePath}
                title="Selecionar pasta"
              >
                ···
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Template</label>
            <div className="template-grid">
              {PROJECT_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  className={`template-card ${
                    selectedTemplate === template.id ? 'selected' : ''
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <span className="template-icon">{template.icon}</span>
                  <span className="template-name">{template.name}</span>
                  {template.recommended && (
                    <span className="template-badge">Recomendado</span>
                  )}
                  <span className="template-desc">{template.description}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedTemplate === 'platformer' && (
            <div className="template-tip">
              💡 <strong>Dica:</strong> O template de Plataforma já vem com cenas, atores e eventos configurados.
              Clique em Criar Projeto e use o botão ▶ para compilar e rodar com o SGDK.
            </div>
          )}
        </div>

        <div className="new-project-actions">
          <button
            className="create-btn"
            onClick={handleCreate}
            disabled={!projectName.trim()}
          >
            Criar Projeto
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewProjectScreen;
