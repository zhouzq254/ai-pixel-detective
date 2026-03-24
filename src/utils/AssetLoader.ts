// 简化版资源加载器
export class AssetLoader {
    private scene: Phaser.Scene;
    
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }
    
    // 预加载所有资源
    preload(): void {
        console.log('📦 加载游戏资源...');
        
        // 加载基础资源
        this.loadBasicResources();
    }
    
    private loadBasicResources(): void {
        // 基础UI资源
        this.scene.load.image('icon_clue', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAkElEQVQ4jWNgGAWjYBSMglEwCkbBKBgFo2AUjAJiACPWQHj48CHDv3//GJ4/f87w8+dPhn///jH8//+fgYGBgYGRkZGBiYmJgZWVlYGDg4OBh4eHgY2NjYGRkZEBLwOePXvG8P37d4Zv374x/P79m+Hfv38MDAwMDAwMDAyMjIwMTExMDCwsLAzs7OwMPDw8/wHxI8YoGAWjYBSMglEwCkbBKBgFo2AUjAIyAADe6gU9W0SdQwAAAABJRU5ErkJggg==');
        this.scene.load.image('icon_suspect', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAm0lEQVQ4jWNgGAWjYBSMglEwCkbBKBgFo2AUjAJiACPWQHj48CHDv3//GJ4/f87w8+dPhn//+fgYGBgYGRkZGBiYmJgZWVlYGDg4OBh4eHgY2NjYGRkZEBLwOePXvG8P37d4Zv374x/P79m+Hfv38MDAwMDAwMDAyMjIwMTExMDCwsLAzs7OwMPDw8/wHxI8YoGAWjYBSMglEwCkbBKBgFo2AUjAIyAADe6gU9W0SdQwAAAABJRU5ErkJggg==');
        this.scene.load.image('icon_detective', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAp0lEQVQ4jWNgGAWjYBSMglEwCkbBKBgFo2AUjAJiACPWQHj48CHDv3//GJ4/f87w8+dPhn///jH8//+fgYGBgYGRkZGBiYmJgZWVlYGDg4OBh4eHgY2NjYGRkZEBLwOePXvG8P37d4Zv374x/P79m+Hfv38MDAwMDAwMDAyMjIwMTExMDCwsLAzs7OwMPDw8/wHxI8YoGAWjYBSMglEwCkbBKBgFo2AUjAIyAADe6gU9W0SdQwAAAABJRU5ErkJggg==');
        
        // 粒子效果
        this.scene.load.image('particle_glow', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAI0lEQVQ4jWNkYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYADhAQDqHgU9W0SdQwAAAABJRU5ErkJggg==');
        
        console.log('✅ 基础资源加载完成');
    }
    
    // 创建动画
    createAnimations(): void {
        console.log('🎬 创建基础动画...');
        // 简化版本，暂时不创建复杂动画
    }
}