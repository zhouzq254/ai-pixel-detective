import Phaser from 'phaser';
import { MainMenuScene } from '../scenes/MainMenuScene';
import { SimpleInvestigationScene } from '../scenes/SimpleInvestigationScene';
import { configManager } from '../utils/ConfigManager';

export class Game {
    private phaserGame: Phaser.Game | null = null;
    private isInitialized: boolean = false;
    
    constructor() {
        console.log('🎮 初始化AI像素侦探社游戏...');
        
        // 初始化Phaser游戏
        this.initPhaserGame();
        
        this.isInitialized = true;
        console.log('✅ 游戏初始化完成');
    }
    
    private initPhaserGame(): void {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: 'game-canvas',
            width: 800,
            height: 600,
            backgroundColor: '#0a0a1a',
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            scene: [MainMenuScene, SimpleInvestigationScene],
            physics: {
                default: 'arcade',
                arcade: {
                    debug: configManager.get('debug') || false,
                    gravity: { y: 0 }
                }
            },
            render: {
                pixelArt: true,
                antialias: false,
                roundPixels: true
            }
        };
        
        this.phaserGame = new Phaser.Game(config);
        
        console.log('🎮 Phaser游戏引擎启动成功');
    }
    
    // 游戏控制方法
    public startNewCase(): void {
        console.log('🆕 开始新案件');
        
        if (!this.isInitialized || !this.phaserGame) {
            console.error('游戏未初始化');
            return;
        }
        
        // 切换到调查场景
        this.phaserGame.scene.start('SimpleInvestigationScene');
    }
    
    public saveGame(): void {
        console.log('💾 游戏保存功能');
        this.showNotification('游戏保存功能开发中', 'info');
    }
    
    public loadGame(): void {
        console.log('📂 游戏加载功能');
        this.showNotification('游戏加载功能开发中', 'info');
    }
    
    public toggleSound(): boolean {
        console.log('🔊 切换音效');
        const current = configManager.get('soundEnabled') || true;
        const newValue = !current;
        configManager.set('soundEnabled', newValue);
        
        // 更新Phaser registry
        if (this.phaserGame) {
            this.phaserGame.registry.set('soundEnabled', newValue);
        }
        
        this.showNotification(`音效: ${newValue ? '开启' : '关闭'}`, 'info');
        return newValue;
    }
    
    public checkSavedGame(): void {
        console.log('🔍 检查存档');
        // 简单实现
        const saved = localStorage.getItem('ai_pixel_detective_save');
        if (saved) {
            this.showNotification('发现存档，点击"继续案件"', 'info');
        }
    }
    
    public configureApi(apiKey: string): boolean {
        console.log('🔑 配置API');
        try {
            configManager.setApiKey(apiKey);
            this.showNotification('API配置成功！', 'success');
            return true;
        } catch (error) {
            console.error('API配置失败:', error);
            this.showNotification('API配置失败', 'error');
            return false;
        }
    }
    
    private showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
        console.log(`${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'} ${message}`);
        
        // 简单的浏览器通知
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            new Notification('AI像素侦探社', { body: message });
        }
    }
    
    // 公共方法供外部调用
    public getGameInstance(): Phaser.Game | null {
        return this.phaserGame;
    }
}