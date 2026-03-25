import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Tutorial.css';

const Tutorial = ({ onClose, onStartGame }) => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: '🎯',
      title: t('tutorial.step1.title', '游戏目标'),
      description: t('tutorial.step1.desc', '作为侦探，你的目标是收集证据、询问嫌疑人，最终破解案件。每个案件都是AI生成的，独一无二！')
    },
    {
      icon: '🔍',
      title: t('tutorial.step2.title', '收集线索'),
      description: t('tutorial.step2.desc', '点击场景中的线索图标（放大镜）收集证据。每个案件有5个关键线索需要找到。')
    },
    {
      icon: '👥',
      title: t('tutorial.step3.title', '询问嫌疑人'),
      description: t('tutorial.step3.desc', '点击嫌疑人图标进行询问。通过对话获取信息，找出矛盾点。')
    },
    {
      icon: '📊',
      title: t('tutorial.step4.title', '进度追踪'),
      description: t('tutorial.step4.desc', '顶部进度条显示案件完成度。收集所有线索并询问所有嫌疑人后，即可破解案件。')
    },
    {
      icon: '💡',
      title: t('tutorial.step5.title', '使用提示'),
      description: t('tutorial.step5.desc', '卡住时可以使用提示功能。提示包可通过游戏内购买获得。')
    },
    {
      icon: '🌍',
      title: t('tutorial.step6.title', '多语言'),
      description: t('tutorial.step6.desc', '点击顶部国旗切换语言。支持英语、西班牙语、中文、法语。')
    }
  ];

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-container">
        <div className="tutorial-header">
          <h1>🕵️‍♂️ {t('tutorial.title', '侦探游戏教程')}</h1>
          <p className="tutorial-subtitle">
            {t('tutorial.subtitle', '学习如何成为顶级侦探')}
          </p>
        </div>

        <div className="tutorial-steps">
          {steps.map((step, index) => (
            <div key={index} className="tutorial-step">
              <div className="step-number">{index + 1}</div>
              <div className="step-icon">{step.icon}</div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="tutorial-demo">
          <h3>🎮 {t('tutorial.demo.title', '快速演示')}</h3>
          <div className="demo-steps">
            <div className="demo-step">
              <div className="demo-icon">🏠</div>
              <div className="demo-text">
                <strong>1. {t('tutorial.demo.step1', '主菜单')}</strong>
                <p>{t('tutorial.demo.step1_desc', '点击"开始新案件"按钮')}</p>
              </div>
            </div>
            <div className="demo-step">
              <div className="demo-icon">🔍</div>
              <div className="demo-text">
                <strong>2. {t('tutorial.demo.step2', '调查场景')}</strong>
                <p>{t('tutorial.demo.step2_desc', '点击线索和嫌疑人收集信息')}</p>
              </div>
            </div>
            <div className="demo-step">
              <div className="demo-icon">⚖️</div>
              <div className="demo-text">
                <strong>3. {t('tutorial.demo.step3', '破解案件')}</strong>
                <p>{t('tutorial.demo.step3_desc', '进度100%后点击"破解案件"')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="tutorial-controls">
          <button 
            className="tutorial-button skip"
            onClick={onClose}
          >
            {t('tutorial.skip', '跳过教程')}
          </button>
          <button 
            className="tutorial-button start"
            onClick={onStartGame}
          >
            {t('tutorial.start', '开始游戏')}
          </button>
          <button 
            className="tutorial-button watch"
            onClick={() => alert('视频教程功能开发中...')}
          >
            {t('tutorial.watch', '观看视频教程')}
          </button>
        </div>

        <div className="tutorial-tips">
          <h4>💡 {t('tutorial.tips.title', '游戏技巧')}</h4>
          <ul>
            <li>{t('tutorial.tips.tip1', '仔细检查每个线索 - 细节决定成败')}</li>
            <li>{t('tutorial.tips.tip2', '注意嫌疑人之间的矛盾陈述')}</li>
            <li>{t('tutorial.tips.tip3', '使用笔记本记录重要信息')}</li>
            <li>{t('tutorial.tips.tip4', '不要急于下结论 - 收集所有证据')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;