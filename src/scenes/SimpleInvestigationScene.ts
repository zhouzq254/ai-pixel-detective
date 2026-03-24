import Phaser from 'phaser';

export class SimpleInvestigationScene extends Phaser.Scene {
    private caseTitle: string = '珠宝店失窃案';
    private cluesFound: number = 0;
    private totalClues: number = 5;
    private suspectsQuestioned: number = 0;
    private totalSuspects: number = 3;
    
    // UI元素
    private titleText!: Phaser.GameObjects.Text;
    private clueText!: Phaser.GameObjects.Text;
    private suspectText!: Phaser.GameObjects.Text;
    private progressText!: Phaser.GameObjects.Text;
    
    constructor() {
        super('SimpleInvestigationScene');
    }
    
    preload(): void {
        console.log('📦 加载简单调查场景');
    }
    
    create(): void {
        console.log('🎮 创建简单调查场景');
        
        // 创建背景
        this.createBackground();
        
        // 创建UI
        this.createUI();
        
        // 创建交互元素
        this.createInteractiveElements();
        
        // 显示案件信息
        this.showCaseInfo();
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
    
    private createUI(): void {
        // 顶部信息栏
        const topBar = this.add.rectangle(400, 40, 700, 60, 0x000000, 0.7);
        topBar.setStrokeStyle(2, 0x4a4aff);
        
        // 案件标题
        this.titleText = this.add.text(400, 40, `🕵️‍♂️ ${this.caseTitle}`, {
            fontSize: '24px',
            color: '#4affaa',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // 线索计数
        this.clueText = this.add.text(200, 40, `🔍 线索: ${this.cluesFound}/${this.totalClues}`, {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // 嫌疑人计数
        this.suspectText = this.add.text(600, 40, `👥 嫌疑人: ${this.suspectsQuestioned}/${this.totalSuspects}`, {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // 进度条
        this.createProgressBar();
    }
    
    private createProgressBar(): void {
        // 进度条背景
        const progressBg = this.add.rectangle(400, 90, 300, 20, 0x000000, 0.5);
        progressBg.setStrokeStyle(1, 0x4a4aff);
        
        // 进度文本
        this.progressText = this.add.text(400, 90, `进度: 0%`, {
            fontSize: '14px',
            color: '#ffffff'
        }).setOrigin(0.5);
    }
    
    private createInteractiveElements(): void {
        // 创建线索（5个）
        const cluePositions = [
            { x: 200, y: 200 },
            { x: 400, y: 250 },
            { x: 600, y: 200 },
            { x: 300, y: 400 },
            { x: 500, y: 400 }
        ];
        
        cluePositions.forEach((pos, index) => {
            this.createClue(pos.x, pos.y, index + 1);
        });
        
        // 创建嫌疑人（3个）
        const suspectPositions = [
            { x: 150, y: 300, name: '店员小王', color: 0xff5555 },
            { x: 400, y: 300, name: '清洁工老李', color: 0x4a4aff },
            { x: 650, y: 300, name: '顾客张太太', color: 0x4affaa }
        ];
        
        suspectPositions.forEach((pos, index) => {
            this.createSuspect(pos.x, pos.y, pos.name, pos.color, index + 1);
        });
        
        // 控制按钮
        this.createControlButtons();
    }
    
    private createClue(x: number, y: number, number: number): void {
        // 线索图标
        const clue = this.add.circle(x, y, 20, 0x4affaa);
        clue.setInteractive({ useHandCursor: true });
        
        // 线索编号
        this.add.text(x, y, `${number}`, {
            fontSize: '16px',
            color: '#000000'
        }).setOrigin(0.5);
        
        // 闪烁动画
        this.tweens.add({
            targets: clue,
            alpha: 0.5,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        
        // 点击事件
        clue.on('pointerdown', () => {
            this.collectClue(clue, number);
        });
    }
    
    private createSuspect(x: number, y: number, name: string, color: number, number: number): void {
        // 嫌疑人图标
        const suspect = this.add.rectangle(x, y, 40, 60, color);
        suspect.setInteractive({ useHandCursor: true });
        
        // 嫌疑人名字
        this.add.text(x, y + 50, name, {
            fontSize: '14px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 5, y: 2 }
        }).setOrigin(0.5);
        
        // 呼吸动画
        this.tweens.add({
            targets: suspect,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // 点击事件
        suspect.on('pointerdown', () => {
            this.questionSuspect(suspect, name, number);
        });
    }
    
    private createControlButtons(): void {
        // 返回按钮
        const backButton = this.add.rectangle(100, 550, 120, 40, 0x4a4aff);
        backButton.setInteractive({ useHandCursor: true });
        
        this.add.text(100, 550, '返回菜单', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        backButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
        
        // 提示按钮
        const hintButton = this.add.rectangle(400, 550, 120, 40, 0xffaa00);
        hintButton.setInteractive({ useHandCursor: true });
        
        this.add.text(400, 550, '获取提示', {
            fontSize: '16px',
            color: '#000000'
        }).setOrigin(0.5);
        
        hintButton.on('pointerdown', () => {
            this.showHint();
        });
        
        // 推理按钮
        const deduceButton = this.add.rectangle(700, 550, 120, 40, 0x4affaa);
        deduceButton.setInteractive({ useHandCursor: true });
        
        this.add.text(700, 550, '开始推理', {
            fontSize: '16px',
            color: '#000000'
        }).setOrigin(0.5);
        
        deduceButton.on('pointerdown', () => {
            this.startDeduction();
        });
    }
    
    private showCaseInfo(): void {
        // 案件描述
        const infoPanel = this.add.rectangle(400, 150, 500, 80, 0x000000, 0.8);
        infoPanel.setStrokeStyle(2, 0x4a4aff);
        
        const description = this.add.text(400, 150, '珠宝店发生失窃，钻石项链不翼而飞。调查现场收集线索，询问嫌疑人找出真凶！', {
            fontSize: '16px',
            color: '#a0a0ff',
            wordWrap: { width: 450 },
            align: 'center'
        }).setOrigin(0.5);
        
        // 3秒后淡出
        this.tweens.add({
            targets: [infoPanel, description],
            alpha: 0,
            duration: 1000,
            delay: 3000,
            onComplete: () => {
                infoPanel.destroy();
                description.destroy();
            }
        });
    }
    
    private collectClue(clue: Phaser.GameObjects.Shape, clueNumber: number): void {
        if (this.cluesFound >= this.totalClues) return;
        
        console.log(`🔍 收集线索 ${clueNumber}`);
        this.cluesFound++;
        this.updateUI();
        
        // 收集特效
        this.tweens.add({
            targets: clue,
            scaleX: 0,
            scaleY: 0,
            alpha: 0,
            duration: 500,
            onComplete: () => clue.destroy()
        });
        
        this.showNotification(`找到线索 ${clueNumber}！`, 'success');
        this.checkCompletion();
    }
    
    private questionSuspect(suspect: Phaser.GameObjects.Shape, name: string, suspectNumber: number): void {
        if (this.suspectsQuestioned >= this.totalSuspects) return;
        
        console.log(`🗣️ 询问嫌疑人: ${name}`);
        this.suspectsQuestioned++;
        this.updateUI();
        
        this.showDialogue(name);
        this.checkCompletion();
    }
    
    private updateUI(): void {
        this.clueText.setText(`🔍 线索: ${this.cluesFound}/${this.totalClues}`);
        this.suspectText.setText(`👥 嫌疑人: ${this.suspectsQuestioned}/${this.totalSuspects}`);
        
        const progress = (this.cluesFound + this.suspectsQuestioned) / (this.totalClues + this.totalSuspects);
        this.progressText.setText(`进度: ${Math.round(progress * 100)}%`);
    }
    
    private showNotification(message: string, type: 'success' | 'info' | 'error' = 'info'): void {
        const color = type === 'success' ? '#4affaa' : type === 'error' ? '#ff5555' : '#4a4aff';
        
        const notification = this.add.text(400, 500, message, {
            fontSize: '18px',
            color: color,
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: notification,
            y: 480,
            alpha: 0,
            duration: 2000,
            onComplete: () => notification.destroy()
        });
    }
    
    private showDialogue(name: string): void {
        const panel = this.add.rectangle(400, 300, 400, 200, 0x000000, 0.9);
        panel.setStrokeStyle(3, 0x4a4aff);
        
        this.add.text(400, 250, `🗣️ ${name}`, {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        const dialogues = [
            '案发时我在整理货架。',
            '我什么也没看到。',
            '我只是个普通顾客。',
            '这和我没关系。'
        ];
        
        const dialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
        
        this.add.text(400, 280, `"${dialogue}"`, {
            fontSize: '16px',
            color: '#a0a0ff',
            wordWrap: { width: 350 },
            align: 'center'
        }).setOrigin(0.5);
        
        const closeButton = this.add.rectangle(400, 350, 100, 40, 0x666666);
        closeButton.setInteractive({ useHandCursor: true });
        
        this.add.text(400, 350, '关闭', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        closeButton.on('pointerdown', () => {
            panel.destroy();
            closeButton.destroy();
        });
        
        this.time.delayedCall(3000, () => {
            if (panel.active) {
                panel.destroy();
                closeButton.destroy();
            }
        });
    }
    
    private showHint(): void {
        let hint = '';
        if (this.cluesFound < 3) {
            hint = '提示：点击闪烁的线索图标收集证据';
        } else if (this.suspectsQuestioned < 2) {
            hint = '提示：与呼吸动画的嫌疑人对话获取信息';
        } else {
            hint = '提示：收集所有线索和对话后，点击"开始推理"';
        }
        this.showNotification(hint, 'info');
    }
    
    private startDeduction(): void {
        if (this.cluesFound < this.totalClues || this.suspectsQuestioned < this.totalSuspects) {
            this.showNotification('请先收集所有线索和完成所有对话！', 'error');
            return;
        }
        
        this.showNotification('开始推理... 真凶是店员小王！', 'success');
        
        // 3秒后显示成功界面
        this.time.delayedCall(3000, () => {
            this.showSuccessScreen();
        });
    }
    
    private checkCompletion(): void {
        if (this.cluesFound === this.totalClues && this.suspectsQuestioned === this.totalSuspects) {
            this.showNotification('已收集所有证据，可以开始推理！', 'success');
        }
    }
    
    private showSuccessScreen(): void {
        // 清空场景
        this.children.removeAll();
        
        // 成功背景
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x4affaa, 0x4affaa, 0x4a4aff, 0x4a4aff, 1);
        graphics.fillRect(0, 0, 800, 600);
        
        // 成功消息
        this.add.text(400, 200, '🎉 案件解决！', {
            fontSize: '48px',
            color: '#000000',
            stroke: '#ffffff',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        this.add.text(400, 280, '你成功找出了真凶：店员小王', {
            fontSize: '24px',
            color: '#000000'
        }).setOrigin(0.5);
        
        this.add.text(400, 320, '评分：★★★★☆', {
            fontSize: '32px',
            color: '#ffaa00'
        }).setOrigin(0.5);
        
        // 返回按钮
        const returnButton = this.add.rectangle(400, 450, 200, 60, 0x000000);
        returnButton.setInteractive({ useHandCursor: true });
        
        this.add.text(400, 450, '返回主菜单', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        returnButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
    
    update(): void {
        // 空实现
    }
}