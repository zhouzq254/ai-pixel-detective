import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MainMenu from './components/MainMenu';
import InvestigationScene from './components/InvestigationScene';
import './styles/App.css';

function App() {
  const { t, i18n } = useTranslation();
  const [currentScene, setCurrentScene] = useState('mainMenu');
  const [language, setLanguage] = useState('en');
  const [caseData, setCaseData] = useState(null);

  // 初始化语言
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  // 生成新案件
  const generateNewCase = () => {
    const themes = [
      'jewelry_heist',
      'art_theft', 
      'corporate_espionage',
      'cold_case',
      'cyber_crime'
    ];
    
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    
    const newCase = {
      id: Date.now(),
      number: Math.floor(Math.random() * 100) + 1,
      name: t(`themes.${randomTheme}`),
      theme: randomTheme,
      clues: {
        total: 5,
        found: 0,
        items: [
          { id: 1, name: 'Fingerprint', collected: false },
          { id: 2, name: 'Security Footage', collected: false },
          { id: 3, name: 'Mysterious Note', collected: false },
          { id: 4, name: 'DNA Sample', collected: false },
          { id: 5, name: 'Digital Evidence', collected: false }
        ]
      },
      suspects: {
        total: 3,
        questioned: 0,
        persons: [
          { id: 1, name: 'Alex Johnson', role: 'Security Guard', questioned: false },
          { id: 2, name: 'Maria Garcia', role: 'Curator', questioned: false },
          { id: 3, name: 'David Chen', role: 'IT Specialist', questioned: false }
        ]
      },
      progress: 0
    };
    
    setCaseData(newCase);
    setCurrentScene('investigation');
  };

  // 收集线索
  const collectClue = (clueId) => {
    if (!caseData) return;
    
    const updatedClues = caseData.clues.items.map(clue => 
      clue.id === clueId ? { ...clue, collected: true } : clue
    );
    
    const foundCount = updatedClues.filter(c => c.collected).length;
    const questionedCount = caseData.suspects.persons.filter(s => s.questioned).length;
    const totalItems = caseData.clues.total + caseData.suspects.total;
    const progress = Math.round(((foundCount + questionedCount) / totalItems) * 100);
    
    setCaseData({
      ...caseData,
      clues: {
        ...caseData.clues,
        found: foundCount,
        items: updatedClues
      },
      progress
    });
  };

  // 询问嫌疑人
  const questionSuspect = (suspectId) => {
    if (!caseData) return;
    
    const updatedSuspects = caseData.suspects.persons.map(suspect => 
      suspect.id === suspectId ? { ...suspect, questioned: true } : suspect
    );
    
    const foundCount = caseData.clues.items.filter(c => c.collected).length;
    const questionedCount = updatedSuspects.filter(s => s.questioned).length;
    const totalItems = caseData.clues.total + caseData.suspects.total;
    const progress = Math.round(((foundCount + questionedCount) / totalItems) * 100);
    
    setCaseData({
      ...caseData,
      suspects: {
        ...caseData.suspects,
        questioned: questionedCount,
        persons: updatedSuspects
      },
      progress
    });
  };

  // 返回主菜单
  const returnToMenu = () => {
    setCurrentScene('mainMenu');
    setCaseData(null);
  };

  // 切换语言
  const changeLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>{t('app.title')}</h1>
        <p className="subtitle">{t('app.subtitle')}</p>
        
        <div className="language-selector">
          <button 
            className={language === 'en' ? 'active' : ''}
            onClick={() => changeLanguage('en')}
          >
            🇺🇸 English
          </button>
          <button 
            className={language === 'es' ? 'active' : ''}
            onClick={() => changeLanguage('es')}
          >
            🇪🇸 Español
          </button>
          <button 
            className={language === 'zh' ? 'active' : ''}
            onClick={() => changeLanguage('zh')}
          >
            🇨🇳 中文
          </button>
          <button 
            className={language === 'fr' ? 'active' : ''}
            onClick={() => changeLanguage('fr')}
          >
            🇫🇷 Français
          </button>
        </div>
      </header>

      <main className="app-main">
        {currentScene === 'mainMenu' ? (
          <MainMenu 
            onStartNewCase={generateNewCase}
            onContinueCase={() => {/* TODO: Load saved game */}}
            onSettings={() => {/* TODO: Settings modal */}}
          />
        ) : (
          <InvestigationScene 
            caseData={caseData}
            onCollectClue={collectClue}
            onQuestionSuspect={questionSuspect}
            onReturnToMenu={returnToMenu}
            onSolveCase={() => {
              // TODO: Solve case logic
              alert('Case solved! The culprit was Alex Johnson!');
              returnToMenu();
            }}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2026 Global Detective Agency. All rights reserved.</p>
        <div className="monetization-notice">
          <p>Free to play • In-app purchases available • No ads for subscribers</p>
        </div>
      </footer>
    </div>
  );
}

export default App;