        returnButton.on('pointerdown', () => {
            console.log('🔙 返回主菜单（成功界面）');
            this.scene.start('MainMenuScene');
        });
    }
    
    update(): void {
        // 空实现
    }
}