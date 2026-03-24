import Phaser from 'phaser';
import { AssetLoader } from '../utils/AssetLoader';

export class MainMenuScene extends Phaser.Scene {
    private titleText!: Phaser.GameObjects.Text;
    private assetLoader!: AssetLoader;
    
    constructor() {
        super('MainMenuScene');
    }
    
    preload(): void {
        console.log('📦 主菜单场景预加载');
        
        // 初始化资源加载器
        this.assetLoader = new AssetLoader(this);
        this.assetLoader.preload();
        
        // 加载进度显示
        this.createLoadingUI();
    }
    
    create(): void {
        console.log('🎮 创建主菜单场景');
        
        // 创建动画
        this.assetLoader.createAnimations();
        
        // 创建背景
        this.createBackground();
        
        // 创建标题
        this.createTitle();
        
        // 创建按钮
        this.createMenuButtons();
        
        // 创建装饰元素
        this.createDecorations();
        
        // 创建版本信息
        this.createVersionInfo();
        
        console.log('✅ 主菜单场景创建完成');
    }
    
    private createLoadingUI(): void {
        // 加载进度条背景
        const progressBarBg = this.add.rectangle(400, 300, 300, 20, 0x000000, 0.7);
        progressBarBg.setStrokeStyle(2, 0x4a4aff);
        
        // 加载进度条
        const progressBar = this.add.rectangle(250, 300, 0, 16, 0x4affaa);
        
        // 加载文本
        const loadingText = this.add.text(400, 270, '加载像素资源...', {
            fontSize: '16px',
            color: '#a0a0ff'
        }).setOrigin(0.5);
        
        // 进度更新
        this.load.on('progress', (value: number) => {
            progressBar.width = 300 * value;
            loadingText.setText(`加载像素资源... ${Math.round(value * 100)}%`);
        });
        
        // 加载完成
        this.load.on('complete', () => {
            console.log('✅ 所有资源加载完成');
            loadingText.setText('资源加载完成！');
            
            // 淡出效果
            this.tweens.add({
                targets: [progressBarBg, progressBar, loadingText],
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    progressBarBg.destroy();
                    progressBar.destroy();
                    loadingText.destroy();
                }
            });
        });
    }
    
    private createBackground(): void {
        // 渐变背景
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
        graphics.fillRect(0, 0, 800, 600);
        
        // 网格线
        graphics.lineStyle(1, 0x4a4aff, 0.1);
        for (let x = 0; x < 800; x += 32) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, 600);
        }
        for (let y = 0; y < 600; y += 32) {
            graphics.moveTo(0, y);
            graphics.lineTo(800, y);
        }
        graphics.strokePath();
    }
    
    private createTitle(): void {
        // 主标题
        this.titleText = this.add.text(400, 100, '🕵️‍♂️ AI像素侦探社', {
            fontSize: '48px',
            color: '#4affaa',
            stroke: '#000',
            strokeThickness: 6,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000',
                blur: 4,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5);
        
        // 副标题
        this.add.text(400, 160, '全球首个AI生成的侦探推理游戏', {
            fontSize: '20px',
            color: '#a0a0ff',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // 标题动画
        this.tweens.add({
            targets: this.titleText,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    private createMenuButtons(): void {
        const buttonConfigs = [
            { 
                text: '🆕 开始新案件', 
                y: 250, 
                icon: 'icon_detective',
                action: () => this.startNewCase(),
                color: 0x4a4aff
            },
            { 
                text: '📂 继续案件', 
                y: 310, 
                icon: 'icon_clue',
                action: () => this.continueCase(),
                color: 0x4affaa
            },
            { 
                text: '📊 案件记录', 
                y: 370, 
                icon: 'icon_suspect',
                action: () => this.showCaseRecords(),
                color: 0xff4af0
            },
            { 
                text: '⚙️ 游戏设置', 
                y: 430, 
                icon: 'icon_clue',
                action: () => this.openSettings(),
                color: 0xffaa00
            },
            { 
                text: '❓ 游戏说明', 
                y: 490, 
                icon: 'icon_detective',
                action: () => this.showInstructions(),
                color: 0xa0a0ff
            }
        ];
        
        buttonConfigs.forEach((config, index) => {
            this.createMenuButton(config, index);
        });
    }
    
    private createMenuButton(config: any, index: number): void {
        // 按钮背景
        const button = this.add.rectangle(400, config.y, 300, 50, 0x000000, 0.7);
        button.setStrokeStyle(2, config.color);
        button.setInteractive({ useHandCursor: true });
        
        // 按钮图标
        const icon = this.add.sprite(340, config.y, config.icon);
        icon.setScale(0.8);
        icon.setTint(config.color);
        
        // 按钮文字
        const buttonText = this.add.text(380, config.y, config.text, {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        
        // 悬停效果
        button.on('pointerover', () => {
            button.setFillStyle(config.color, 0.9);
            button.setStrokeStyle(2, 0xffffff);
            buttonText.setColor('#ffffff');
            icon.setTint(0xffffff);
            
            // 图标动画
            this.tweens.add({
                targets: icon,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });
        
        button.on('pointerout', () => {
            button.setFillStyle(0x000000, 0.7);
            button.setStrokeStyle(2, config.color);
            buttonText.setColor('#ffffff');
            icon.setTint(config.color);
            
            // 图标动画
            this.tweens.add({
                targets: icon,
                scaleX: 0.8,
                scaleY: 0.8,
                duration: 200,
                ease: 'Back.easeIn'
            });
        });
        
        // 点击事件
        button.on('pointerdown', () => {
            this.animateButtonClick(button, buttonText, icon, config.action);
        });
        
        // 按钮入场动画
        this.tweens.add({
            targets: [button, buttonText, icon],
            x: { from: 800, to: button.x },
            duration: 500,
            delay: index * 100,
            ease: 'Back.easeOut'
        });
    }
    
    private createDecorations(): void {
        // 左侧装饰
        const leftDecor = this.add.sprite(100, 200, 'icon_detective');
        leftDecor.setScale(2);
        leftDecor.setTint(0x4a4aff);
        
        // 右侧装饰
        const rightDecor = this.add.sprite(700, 200, 'icon_suspect');
        rightDecor.setScale(2);
        rightDecor.setTint(0xff4af0);
        
        // 装饰动画
        this.tweens.add({
            targets: leftDecor,
            y: 220,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        this.tweens.add({
            targets: rightDecor,
            y: 180,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: 500
        });
    }
    
    private createVersionInfo(): void {
        // 版本号
        this.add.text(400, 570, 'v1.0.0 Alpha', {
            fontSize: '12px',
            color: '#8888cc'
        }).setOrigin(0.5);
        
        // 技术栈
        this.add.text(400, 590, 'Phaser.js • TypeScript • DeepSeek AI', {
            fontSize: '10px',
            color: '#666699'
        }).setOrigin(0.5);
        
        // 在线状态
        const onlineStatus = this.add.text(750, 590, '● 在线', {
            fontSize: '10px',
            color: '#4affaa'
        }).setOrigin(1, 0.5);
        
        // 闪烁动画
        this.tweens.add({
            targets: onlineStatus,
            alpha: 0.5,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }
    
    // 按钮动作
    private startNewCase(): void {
        console.log('🆕 开始新案件');
        this.scene.start('SimpleInvestigationScene');
    }
    
    private continueCase(): void {
        console.log('📂 继续案件');
        this.showNotification('继续案件功能开发中', 'info');
    }
    
    private showCaseRecords(): void {
        console.log('📊 显示案件记录');
        this.showNotification('案件记录功能开发中', 'info');
    }
    
    private openSettings(): void {
        console.log('⚙️ 打开设置');
        this.showNotification('设置功能开发中', 'info');
    }
    
    private showInstructions(): void {
        console.log('❓ 显示游戏说明');
        this.showNotification('游戏说明功能开发中', 'info');
    }
    
    // 工具方法
    private animateButtonClick(button: Phaser.GameObjects.Rectangle, text: Phaser.GameObjects.Text, icon: Phaser.GameObjects.Sprite, action: Function): void {
        // 点击动画
        this.tweens.add({
            targets: [button, text, icon],
            scaleX: 0.95,
            scaleY: 0.95,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                action();
            }
        });
    }
    
    private showNotification(message: string, type: 'info' | 'success' | 'error' = 'info'): void {
        const color = type === 'success' ? '#4affaa' : type === 'error' ? '#ff5555' : '#4a4aff';
        
        const notification = this.add.text(400, 300, message, {
            fontSize: '20px',
            color: color,
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: notification,
            y: 280,
            alpha: 0,
            duration: 2000,
            onComplete: () => notification.destroy()
        });
    }
    
    update(): void {
        // 空实现
    }
}