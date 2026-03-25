import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/InvestigationScene.css';

const InvestigationScene = ({ 
  caseData, 
  onCollectClue, 
  onQuestionSuspect, 
  onReturnToMenu,
  onSolveCase 
}) => {
  const { t } = useTranslation();

  if (!caseData) {
    return (
      <div className="investigation-scene loading">
        <p>Loading case data...</p>
      </div>
    );
  }

  const { clues, suspects, progress } = caseData;

  return (
    <div className="investigation-scene">
      {/* 顶部信息栏 */}
      <div className="case-header">
        <div className="case-title">
          <h2>{t('case.title', { number: caseData.number, name: caseData.name })}</h2>
          <p className="case-theme">Theme: {caseData.theme.replace('_', ' ')}</p>
        </div>
        
        <div className="case-stats">
          <div className="stat">
            <span className="stat-icon">🔍</span>
            <span className="stat-value">{clues.found}/{clues.total}</span>
            <span className="stat-label">{t('case.clues')}</span>
          </div>
          
          <div className="stat">
            <span className="stat-icon">👥</span>
            <span className="stat-value">{suspects.questioned}/{suspects.total}</span>
            <span className="stat-label">{t('case.suspects')}</span>
          </div>
          
          <div className="stat">
            <span className="stat-icon">📊</span>
            <span className="stat-value">{progress}%</span>
            <span className="stat-label">{t('case.progress', { percent: progress })}</span>
          </div>
        </div>
      </div>

      {/* 进度条 */}
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="progress-text">
          {t('case.progress', { percent: progress })}
        </div>
      </div>

      {/* 线索区域 - 确保内容显示 */}
      <div className="evidence-section">
        <h3 className="section-title">
          <span className="section-icon">🔍</span>
          {t('case.clues')} - Collect Evidence
        </h3>
        
        <div className="clues-grid">
          {clues.items.map(clue => (
            <div 
              key={clue.id}
              className={`clue-item ${clue.collected ? 'collected' : 'available'}`}
              onClick={() => !clue.collected && onCollectClue(clue.id)}
            >
              <div className="clue-icon">
                {clue.collected ? '✅' : '🔎'}
              </div>
              <div className="clue-info">
                <h4>{clue.name}</h4>
                <p>{clue.collected ? 'Collected' : 'Click to collect'}</p>
              </div>
              {!clue.collected && (
                <button className="collect-button">
                  {t('ui.collect')}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 嫌疑人区域 - 确保内容显示 */}
      <div className="suspects-section">
        <h3 className="section-title">
          <span className="section-icon">👥</span>
          {t('case.suspects')} - Question Persons of Interest
        </h3>
        
        <div className="suspects-grid">
          {suspects.persons.map(suspect => (
            <div 
              key={suspect.id}
              className={`suspect-item ${suspect.questioned ? 'questioned' : 'available'}`}
              onClick={() => !suspect.questioned && onQuestionSuspect(suspect.id)}
            >
              <div className="suspect-avatar">
                {suspect.questioned ? '🗣️' : '👤'}
              </div>
              <div className="suspect-info">
                <h4>{suspect.name}</h4>
                <p className="suspect-role">{suspect.role}</p>
                <p className="suspect-status">
                  {suspect.questioned ? 'Questioned' : 'Ready for questioning'}
                </p>
              </div>
              {!suspect.questioned && (
                <button className="question-button">
                  {t('ui.question')}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="control-buttons">
        <button 
          className="control-button back"
          onClick={onReturnToMenu}
        >
          <span className="button-icon">←</span>
          {t('ui.back')}
        </button>
        
        <button 
          className="control-button hint"
          onClick={() => alert('Hint: Check all evidence before accusing!')}
        >
          <span className="button-icon">💡</span>
          {t('ui.hint')}
        </button>
        
        <button 
          className="control-button solve"
          onClick={onSolveCase}
          disabled={progress < 100}
        >
          <span className="button-icon">⚖️</span>
          {t('case.solve')}
        </button>
      </div>

      {/* 调试信息 - 确保内容显示 */}
      <div className="debug-info">
        <p>✅ Investigation scene loaded successfully</p>
        <p>📊 Displaying: {clues.total} clues + {suspects.total} suspects</p>
        <p>🎯 Progress: {progress}% complete</p>
        <p>🌐 Built with React - No Phaser scene switching issues</p>
      </div>
    </div>
  );
};

export default InvestigationScene;