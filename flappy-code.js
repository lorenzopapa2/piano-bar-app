class FlappyCode {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        this.gameState = 'start';
        // this.score = 0;
        // this.bestScore = localStorage.getItem('flappyCodeBest') || 0;
        //
        // this.selectedCharacter = 'terminal';
        this.characterEmojis = {
            terminal: '💻',
            bug: '🐛',
            rocket: '🚀',
            robot: '🤖'
        };
        
        this.player = {
            x: 150,
            y: this.height / 2,
            width: 50,
            height: 50,
            velocity: 0,
            gravity: 0.5,
            jumpPower: -10,
            rotation: 0
        };
        
        this.pipes = [];
        this.pipeWidth = 80;
        this.pipeGap = 180;
        this.pipeSpeed = 3;
        this.pipeInterval = 2000;
        this.lastPipeTime = 0;
        
        this.particles = [];
        this.powerUps = [];
        this.activePowerUps = [];
        
        this.codeElements = [
            'function()', 'class{}', 'if()', 'for()', 'while()', 
            'const', 'let', 'var', 'return', 'async', 'await',
            '=> {', '};', '[]', '{}', '</>','npm', 'git', 'API'
        ];
        
        this.powerUpTypes = {
            shield: { emoji: '🛡️', duration: 5000, color: '#00ff88' },
            slowTime: { emoji: '⏰', duration: 3000, color: '#00ddff' },
            doublePoints: { emoji: '💎', duration: 8000, color: '#ff00ff' },
            magnet: { emoji: '🧲', duration: 6000, color: '#ffff00' }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateBestScore();
        this.gameLoop();
    }
    
    setupEventListeners() {
        document.getElementById('playButton').addEventListener('click', () => this.startGame());
        document.getElementById('retryButton').addEventListener('click', () => this.startGame());
        
        document.querySelectorAll('.character-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.character-option').forEach(o => o.classList.remove('selected'));
                e.target.classList.add('selected');
                this.selectedCharacter = e.target.dataset.character;
            });
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.gameState === 'playing') {
                e.preventDefault();
                this.jump();
            }
        });
        
        document.addEventListener('click', (e) => {
            if (this.gameState === 'playing' && !e.target.closest('.play-button')) {
                this.jump();
            }
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.pipes = [];
        this.particles = [];
        this.powerUps = [];
        this.activePowerUps = [];
        this.lastPipeTime = Date.now();
        
        this.player.y = this.height / 2;
        this.player.velocity = 0;
        this.player.rotation = 0;
        
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('score').textContent = '0';
    }
    
    jump() {
        if (this.gameState === 'playing') {
            this.player.velocity = this.player.jumpPower;
            this.createJumpParticles();
        }
    }
    
    createJumpParticles() {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: this.player.x,
                y: this.player.y + this.player.height / 2,
                vx: Math.random() * 4 - 2,
                vy: Math.random() * 2 + 1,
                size: Math.random() * 3 + 2,
                color: `hsl(${Math.random() * 60 + 120}, 100%, 50%)`,
                life: 1
            });
        }
    }
    
    updatePlayer() {
        this.player.velocity += this.player.gravity;
        this.player.y += this.player.velocity;
        
        this.player.rotation = Math.min(Math.max(this.player.velocity * 3, -30), 30);
        
        if (this.player.y < 0) {
            this.player.y = 0;
            this.player.velocity = 0;
        }
        
        if (this.player.y + this.player.height > this.height) {
            this.gameOver();
        }
    }
    
    createPipe() {
        const now = Date.now();
        if (now - this.lastPipeTime > this.pipeInterval) {
            const minHeight = 100;
            const maxHeight = this.height - this.pipeGap - minHeight;
            const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
            
            this.pipes.push({
                x: this.width,
                topHeight: topHeight,
                bottomY: topHeight + this.pipeGap,
                passed: false,
                codeElement: this.codeElements[Math.floor(Math.random() * this.codeElements.length)]
            });
            
            if (Math.random() < 0.3) {
                const powerUpType = Object.keys(this.powerUpTypes)[Math.floor(Math.random() * Object.keys(this.powerUpTypes).length)];
                this.powerUps.push({
                    x: this.width + this.pipeWidth / 2,
                    y: topHeight + this.pipeGap / 2,
                    type: powerUpType,
                    collected: false
                });
            }
            
            this.lastPipeTime = now;
        }
    }
    
    updatePipes() {
        const speedMultiplier = this.hasActivePowerUp('slowTime') ? 0.5 : 1;
        
        this.pipes = this.pipes.filter(pipe => {
            pipe.x -= this.pipeSpeed * speedMultiplier;
            
            if (!pipe.passed && pipe.x + this.pipeWidth < this.player.x) {
                pipe.passed = true;
                const points = this.hasActivePowerUp('doublePoints') ? 2 : 1;
                this.score += points;
                document.getElementById('score').textContent = this.score;
                this.createScoreParticles(points);
            }
            
            return pipe.x + this.pipeWidth > 0;
        });
    }
    
    updatePowerUps() {
        const speedMultiplier = this.hasActivePowerUp('slowTime') ? 0.5 : 1;
        
        this.powerUps = this.powerUps.filter(powerUp => {
            powerUp.x -= this.pipeSpeed * speedMultiplier;
            
            if (this.hasActivePowerUp('magnet')) {
                const dx = this.player.x - powerUp.x;
                const dy = this.player.y - powerUp.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    powerUp.x += dx * 0.1;
                    powerUp.y += dy * 0.1;
                }
            }
            
            if (this.checkPowerUpCollision(powerUp)) {
                this.collectPowerUp(powerUp);
                return false;
            }
            
            return powerUp.x > -50;
        });
        
        this.activePowerUps = this.activePowerUps.filter(power => {
            return Date.now() - power.startTime < this.powerUpTypes[power.type].duration;
        });
        
        this.updatePowerUpUI();
    }
    
    collectPowerUp(powerUp) {
        this.activePowerUps.push({
            type: powerUp.type,
            startTime: Date.now()
        });
        
        this.createPowerUpParticles(powerUp.x, powerUp.y, this.powerUpTypes[powerUp.type].color);
    }
    
    hasActivePowerUp(type) {
        return this.activePowerUps.some(p => p.type === type);
    }
    
    updatePowerUpUI() {
        const slots = [document.getElementById('powerUp1'), document.getElementById('powerUp2')];
        
        slots.forEach(slot => {
            slot.textContent = '';
            slot.classList.remove('active');
        });
        
        this.activePowerUps.slice(0, 2).forEach((power, index) => {
            if (slots[index]) {
                slots[index].textContent = this.powerUpTypes[power.type].emoji;
                slots[index].classList.add('active');
            }
        });
    }
    
    checkCollision() {
        if (this.hasActivePowerUp('shield')) return false;
        
        for (let pipe of this.pipes) {
            if (this.player.x < pipe.x + this.pipeWidth &&
                this.player.x + this.player.width > pipe.x) {
                if (this.player.y < pipe.topHeight ||
                    this.player.y + this.player.height > pipe.bottomY) {
                    return true;
                }
            }
        }
        return false;
    }
    
    checkPowerUpCollision(powerUp) {
        const distance = Math.sqrt(
            Math.pow(this.player.x + this.player.width/2 - powerUp.x, 2) +
            Math.pow(this.player.y + this.player.height/2 - powerUp.y, 2)
        );
        return distance < 40;
    }
    
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.2;
            particle.life -= 0.02;
            
            return particle.life > 0;
        });
    }
    
    createScoreParticles(points) {
        const colors = ['#00ff88', '#00ddff', '#ff00ff', '#ffff00'];
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: this.player.x + this.player.width,
                y: this.player.y + this.player.height / 2,
                vx: Math.random() * 6 - 3,
                vy: Math.random() * 6 - 3,
                size: Math.random() * 4 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1
            });
        }
    }
    
    createPowerUpParticles(x, y, color) {
        for (let i = 0; i < 30; i++) {
            const angle = (Math.PI * 2 * i) / 30;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * 5,
                vy: Math.sin(angle) * 5,
                size: Math.random() * 3 + 3,
                color: color,
                life: 1
            });
        }
    }
    
    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0f3460');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        for (let i = 0; i < 50; i++) {
            const x = (Date.now() / 100 + i * 20) % (this.width + 100) - 50;
            const y = Math.sin(i) * 100 + this.height / 2;
            this.ctx.fillRect(x, y, 2, 2);
        }
    }
    
    drawPlayer() {
        this.ctx.save();
        this.ctx.translate(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
        this.ctx.rotate(this.player.rotation * Math.PI / 180);
        
        if (this.hasActivePowerUp('shield')) {
            this.ctx.strokeStyle = '#00ff88';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, this.player.width / 2 + 10, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        this.ctx.font = `${this.player.width}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.characterEmojis[this.selectedCharacter], 0, 0);
        
        this.ctx.restore();
    }
    
    drawPipes() {
        this.pipes.forEach(pipe => {
            const gradient = this.ctx.createLinearGradient(pipe.x, 0, pipe.x + this.pipeWidth, 0);
            gradient.addColorStop(0, '#2d3561');
            gradient.addColorStop(0.5, '#3e4580');
            gradient.addColorStop(1, '#2d3561');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.topHeight);
            this.ctx.fillRect(pipe.x, pipe.bottomY, this.pipeWidth, this.height - pipe.bottomY);
            
            this.ctx.strokeStyle = '#00ff88';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(pipe.x, 0, this.pipeWidth, pipe.topHeight);
            this.ctx.strokeRect(pipe.x, pipe.bottomY, this.pipeWidth, this.height - pipe.bottomY);
            
            this.ctx.save();
            this.ctx.font = '20px JetBrains Mono';
            this.ctx.fillStyle = '#00ff88';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            const codeY = pipe.topHeight / 2;
            this.ctx.translate(pipe.x + this.pipeWidth / 2, codeY);
            this.ctx.rotate(-Math.PI / 2);
            this.ctx.fillText(pipe.codeElement, 0, 0);
            this.ctx.restore();
        });
    }
    
    drawPowerUps() {
        this.powerUps.forEach(powerUp => {
            const type = this.powerUpTypes[powerUp.type];
            const pulse = Math.sin(Date.now() / 200) * 5;
            
            this.ctx.save();
            this.ctx.translate(powerUp.x, powerUp.y);
            
            this.ctx.strokeStyle = type.color;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 25 + pulse, 0, Math.PI * 2);
            this.ctx.stroke();
            
            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(type.emoji, 0, 0);
            
            this.ctx.restore();
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('flappyCodeBest', this.bestScore);
            this.updateBestScore();
        }
        
        document.getElementById('finalScore').textContent = `Score: ${this.score}`;
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }
    
    updateBestScore() {
        document.getElementById('bestScore').textContent = `Best: ${this.bestScore}`;
    }
    
    update() {
        if (this.gameState === 'playing') {
            this.updatePlayer();
            this.createPipe();
            this.updatePipes();
            this.updatePowerUps();
            this.updateParticles();
            
            if (this.checkCollision()) {
                this.gameOver();
            }
            
            if (this.score > 0 && this.score % 10 === 0 && this.pipeSpeed < 6) {
                this.pipeSpeed += 0.1;
            }
        }
    }
    
    draw() {
        this.drawBackground();
        this.drawPipes();
        this.drawPowerUps();
        this.drawPlayer();
        this.drawParticles();
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

const game = new FlappyCode();