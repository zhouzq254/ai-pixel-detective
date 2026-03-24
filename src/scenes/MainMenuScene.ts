import Phaser from 'phaser';

export class MainMenuScene extends Phaser.Scene {
    private titleText!: Phaser.GameObjects.Text;
    
    constructor() {
        super('MainMenuScene');
    }
    
    create(): void {
        console.log('🎮 创建主菜单场景');
        
        // 创建背景
        this.createBackground();
        
        // 创建标题
        this.createTitle();
        
        // 创建按钮
        this.createMenuButtons();
        
        // 创建版本信息
        this.createVersionInfo();
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
        
        // 装饰性元素
        this.add.rectangle(200, 150, 100, 100, 0x4a4aff, 0.3);
        this.add.rectangle(600, 450, 100, 100, 0x4affaa, 0.3);
        this.add.rectangle(400, 300, 150, 150, 0xff4af0, 0.2);
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
            { text: '🆕 开始新案件', y: 250, action: () => this.startNewCase() },
            { text: '📂 继续案件', y: 310, action: () => this.continueCase() },
            { text: '📊 案件记录', y: 370, action: () => this.showCaseRecords() },
            { text: '⚙️ 游戏设置', y: 430, action: () => this.openSettings() },
            { text: '❓ 游戏说明', y: 490, action: () => this.showInstructions() }
        ];
        
        buttonConfigs.forEach((config, index) => {
            // 创建按钮背景
            const button = this.add.rectangle(400, config.y, 300, 50, 0x000000, 0.7);
            button.setStrokeStyle(2, 0x4a4aff);
            button.setInteractive({ useHandCursor: true });
            
            // 按钮文字
            const buttonText = this.add.text(400, config.y, config.text, {
                fontSize: '20px',
                color: '#ffffff'
            }).setOrigin(0.5);
            
            // 悬停效果
            button.on('pointerover', () => {
                button.setFillStyle(0x4a4aff, 0.9);
                button.setStrokeStyle(2, 0x4affaa);
                buttonText.setColor('#4affaa');
            });
            
            button.on('pointerout', () => {
                button.setFillStyle(0x000000, 0.7);
                button.setStrokeStyle(2, 0x4a4aff);
                buttonText.setColor('#ffffff');
            });
            
            // 点击事件
            button.on('pointerdown', () => {
                this.animateButtonClick(button, buttonText, config.action);
            });
            
            // 按钮入场动画
            this.tweens.add({
                targets: [button, buttonText],
                x: { from: 800, to: 400 },
                duration: 500,
                delay: index * 100,
                ease: 'Back.easeOut'
            });
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
    private animateButtonClick(button: Phaser.GameObjects.Rectangle, text: Phaser.GameObjects.Text, action: Function): void {
        // 点击动画
        this.tweens.add({
            targets: [button, text],
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