import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Gamepad2, Wind, Circle, Grid, MousePointer2, Move, Droplets, Palette, Quote, X, RefreshCw, Zap, Target, Timer, MousePointerClick, Boxes, Trophy } from 'lucide-react';

interface RelaxationGamesProps {
    onClose: () => void;
    initialGame?: string | null;
}

type GameType = 'breath' | 'bubble' | 'memory' | 'particles' | 'zen-draw' | 'balloon' | 'fidget' | 'color-spot' | 'whack' | 'quote' | 'snake' | 'tetris' | 'reaction' | 'clicker' | 'tile-merge';

const RelaxationGames: React.FC<RelaxationGamesProps> = ({ onClose, initialGame }) => {
    const [activeGame, setActiveGame] = useState<GameType | null>(initialGame as GameType || null);

    const games = [
        // Stress Relief Games
        { id: 'breath', title: 'Breathing', icon: <Wind className="w-6 h-6 text-blue-400" />, desc: '4-7-8 Guide', category: 'relax' },
        { id: 'bubble', title: 'Bubble Wrap', icon: <Circle className="w-6 h-6 text-pink-400" />, desc: 'Pop bubbles', category: 'relax' },
        { id: 'zen-draw', title: 'Zen Draw', icon: <Palette className="w-6 h-6 text-purple-400" />, desc: 'Vanish ink', category: 'relax' },
        { id: 'fidget', title: 'Spin It', icon: <RefreshCw className="w-6 h-6 text-orange-400" />, desc: 'Fidget Spin', category: 'relax' },
        { id: 'quote', title: 'Daily Zen', icon: <Quote className="w-6 h-6 text-gray-400" />, desc: 'Wisdom', category: 'relax' },
        { id: 'particles', title: 'Particles', icon: <MousePointer2 className="w-6 h-6 text-yellow-400" />, desc: 'Visual flow', category: 'relax' },
        // Addictive Games
        { id: 'snake', title: '🐍 Snake', icon: <Target className="w-6 h-6 text-green-500" />, desc: 'Classic game', category: 'addictive' },
        { id: 'tetris', title: 'Tetris', icon: <Boxes className="w-6 h-6 text-cyan-400" />, desc: 'Block puzzle', category: 'addictive' },
        { id: 'tile-merge', title: '2048', icon: <Grid className="w-6 h-6 text-amber-400" />, desc: 'Merge tiles', category: 'addictive' },
        { id: 'reaction', title: 'Reaction', icon: <Timer className="w-6 h-6 text-red-400" />, desc: 'Test speed', category: 'addictive' },
        { id: 'clicker', title: 'Clicker', icon: <MousePointerClick className="w-6 h-6 text-emerald-400" />, desc: 'Click fast!', category: 'addictive' },
        // Brain Games
        { id: 'memory', title: 'Mind Match', icon: <Grid className="w-6 h-6 text-green-400" />, desc: 'Memory flip', category: 'brain' },
        { id: 'color-spot', title: 'Color Spot', icon: <Droplets className="w-6 h-6 text-teal-400" />, desc: 'Find odd one', category: 'brain' },
        { id: 'whack', title: 'Stress Bugs', icon: <Zap className="w-6 h-6 text-indigo-400" />, desc: 'Zap bugs', category: 'brain' },
        { id: 'balloon', title: 'Balloon Rise', icon: <Move className="w-6 h-6 text-red-400" />, desc: 'Pop rising', category: 'brain' },
    ];

    return (
        <div className="absolute inset-0 z-50 bg-bgDark flex flex-col animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-bgInput">
                <div className="flex items-center gap-2">
                    <Gamepad2 className="w-5 h-5 text-green-400" />
                    <h3 className="font-bold text-white">Relaxation Zone</h3>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#0f0f16]">
                {!activeGame ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-4">
                        <div className="col-span-2 md:col-span-3 text-center mb-4">
                            <p className="text-gray-400 text-sm">Select a mini-game to de-stress.</p>
                        </div>
                        {games.map((game) => (
                            <button
                                key={game.id}
                                onClick={() => setActiveGame(game.id as GameType)}
                                className="bg-bgCard hover:bg-white/5 border border-white/5 hover:border-green-500/30 p-4 rounded-xl transition-all duration-300 group text-left flex flex-col items-center justify-center text-center gap-3 aspect-square"
                            >
                                <div className="bg-bgInput w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-black/20">
                                    {game.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">{game.title}</h3>
                                    <p className="text-[10px] text-gray-500">{game.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <button 
                                onClick={() => setActiveGame(null)}
                                className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                            >
                                ← Back to Games
                            </button>
                            <span className="text-sm font-bold text-accent">{games.find(g => g.id === activeGame)?.title}</span>
                        </div>
                        <div className="flex-1 bg-bgCard rounded-2xl border border-white/5 overflow-hidden relative shadow-inner shadow-black/50">
                            {activeGame === 'breath' && <BreathGame />}
                            {activeGame === 'bubble' && <BubbleGame />}
                            {activeGame === 'memory' && <MemoryGame />}
                            {activeGame === 'particles' && <ParticleGame />}
                            {activeGame === 'zen-draw' && <ZenDrawGame />}
                            {activeGame === 'balloon' && <BalloonGame />}
                            {activeGame === 'fidget' && <FidgetGame />}
                            {activeGame === 'color-spot' && <ColorSpotGame />}
                            {activeGame === 'whack' && <WhackGame />}
                            {activeGame === 'quote' && <QuoteGame />}
                            {activeGame === 'snake' && <SnakeGame />}
                            {activeGame === 'tetris' && <TetrisGame />}
                            {activeGame === 'tile-merge' && <TileMergeGame />}
                            {activeGame === 'reaction' && <ReactionGame />}
                            {activeGame === 'clicker' && <ClickerGame />}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- SUB COMPONENTS FOR GAMES ---

const BreathGame = () => {
    const [phase, setPhase] = useState('Inhale');
    
    useEffect(() => {
        const inhale = setTimeout(() => setPhase('Hold'), 4000);
        const hold = setTimeout(() => setPhase('Exhale'), 11000); // 4 + 7
        const exhale = setTimeout(() => setPhase('Inhale'), 19000); // 4 + 7 + 8
        
        const interval = setInterval(() => {
            setPhase('Inhale');
            setTimeout(() => setPhase('Hold'), 4000);
            setTimeout(() => setPhase('Exhale'), 11000);
        }, 19000);

        return () => {
            clearTimeout(inhale);
            clearTimeout(hold);
            clearTimeout(exhale);
            clearInterval(interval);
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-b from-blue-900/20 to-bgCard">
            <div className={`
                w-48 h-48 rounded-full border-4 border-blue-400 flex items-center justify-center text-2xl font-bold text-white transition-all duration-[4000ms] ease-in-out shadow-[0_0_30px_rgba(59,130,246,0.3)]
                ${phase === 'Inhale' ? 'scale-110 bg-blue-500/20' : phase === 'Hold' ? 'scale-110 bg-blue-500/40 border-blue-300' : 'scale-75 bg-transparent'}
            `}>
                {phase}
            </div>
            <p className="mt-8 text-gray-400 text-sm">4s In • 7s Hold • 8s Out</p>
        </div>
    );
}

const BubbleGame = () => {
    const [bubbles, setBubbles] = useState(Array(30).fill(false));

    const pop = (idx: number) => {
        if (!bubbles[idx]) {
            const newBubbles = [...bubbles];
            newBubbles[idx] = true;
            setBubbles(newBubbles);
        }
    };

    const reset = () => setBubbles(Array(30).fill(false));

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="grid grid-cols-5 gap-3 mb-6">
                {bubbles.map((popped, idx) => (
                    <button
                        key={idx}
                        onClick={() => pop(idx)}
                        className={`w-10 h-10 rounded-full shadow-inner transition-all duration-200 ${
                            popped 
                            ? 'bg-transparent border-2 border-white/10 scale-90' 
                            : 'bg-gradient-to-br from-pink-400 to-purple-500 hover:scale-105 shadow-pink-500/20'
                        }`}
                    ></button>
                ))}
            </div>
            <button onClick={reset} className="px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-sm">
                Reset Wrap
            </button>
        </div>
    );
}

const MemoryGame = () => {
    const icons = ['🌙', '⭐', '🌈', '🍄', '🍀', '🦋', '🌸', '🌊'];
    const [cards, setCards] = useState<{id: number, icon: string, flipped: boolean, matched: boolean}[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);

    useEffect(() => {
        const shuffled = [...icons, ...icons]
            .sort(() => Math.random() - 0.5)
            .map((icon, id) => ({ id, icon, flipped: false, matched: false }));
        setCards(shuffled);
    }, []);

    const handleFlip = (idx: number) => {
        if (flipped.length === 2 || cards[idx].flipped || cards[idx].matched) return;
        
        const newCards = [...cards];
        newCards[idx].flipped = true;
        setCards(newCards);
        
        const newFlipped = [...flipped, idx];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            const [first, second] = newFlipped;
            if (cards[first].icon === cards[second].icon) {
                newCards[first].matched = true;
                newCards[second].matched = true;
                setCards(newCards);
                setFlipped([]);
            } else {
                setTimeout(() => {
                    setCards(prev => prev.map((c, i) => (i === first || i === second) ? { ...c, flipped: false } : c));
                    setFlipped([]);
                }, 1000);
            }
        }
    };

    return (
        <div className="flex items-center justify-center h-full">
            <div className="grid grid-cols-4 gap-2">
                {cards.map((card, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleFlip(idx)}
                        className={`w-14 h-16 rounded-lg text-2xl flex items-center justify-center transition-all duration-500 transform ${
                            card.flipped || card.matched ? 'bg-white text-black rotate-y-180' : 'bg-accent/50 text-transparent'
                        }`}
                    >
                        {(card.flipped || card.matched) ? card.icon : '?'}
                    </button>
                ))}
            </div>
        </div>
    );
}

const ParticleGame = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        let particles: {x: number, y: number, vx: number, vy: number, color: string}[] = [];
        const colors = ['#6c5ce7', '#a29bfe', '#fd79a8', '#00b894'];

        for(let i=0; i<40; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        let animationFrameId: number;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if(p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();

                // Connect nearby
                particles.forEach(p2 => {
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 80) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255,255,255,${0.2 - dist/400})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            particles.forEach(p => {
                const dx = p.x - x;
                const dy = p.y - y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 100) {
                    p.vx += dx / 50;
                    p.vy += dy / 50;
                }
            });
        };

        canvas.addEventListener('mousemove', handleMouseMove);

        return () => {
            cancelAnimationFrame(animationFrameId);
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full cursor-none" />;
}

const ZenDrawGame = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2;

        let trails: {x: number, y: number, age: number}[] = [];
        let animationFrameId: number;

        const handleMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            trails.push({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                age: 50
            });
        };

        canvas.addEventListener('mousemove', handleMove);

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = trails.length - 1; i >= 0; i--) {
                const t = trails[i];
                t.age -= 1;
                
                if (t.age <= 0) {
                    trails.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.arc(t.x, t.y, t.age/2, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${t.age * 5 + 200}, 70%, 60%, ${t.age/50})`;
                ctx.fill();
            }
            animationFrameId = requestAnimationFrame(render);
        };
        render();

        return () => {
            canvas.removeEventListener('mousemove', handleMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="w-full h-full relative">
            <div className="absolute top-4 left-0 w-full text-center text-gray-500 pointer-events-none text-xs">
                Paint with light (Mouse move)
            </div>
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
}

const BalloonGame = () => {
    const [balloons, setBalloons] = useState<{id: number, left: number, speed: number, color: string}[]>([]);
    const nextId = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setBalloons(prev => [
                ...prev, 
                {
                    id: nextId.current++,
                    left: Math.random() * 80 + 10,
                    speed: 2 + Math.random() * 3,
                    color: `hsl(${Math.random() * 360}, 70%, 60%)`
                }
            ].slice(-8)); 
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    const pop = (id: number) => {
        setBalloons(prev => prev.filter(b => b.id !== id));
    };

    return (
        <div className="w-full h-full relative overflow-hidden bg-gradient-to-t from-bgCard to-blue-900/10">
            {balloons.map(b => (
                <div
                    key={b.id}
                    onClick={() => pop(b.id)}
                    className="absolute w-12 h-16 rounded-full cursor-pointer flex items-center justify-center shadow-lg"
                    style={{
                        left: `${b.left}%`,
                        backgroundColor: b.color,
                        bottom: '-80px',
                        animation: `floatUp ${10/b.speed}s linear forwards`
                    }}
                >
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full absolute top-3 left-3"></div>
                    <div className="w-0.5 h-6 bg-white/50 absolute top-full"></div>
                </div>
            ))}
            <style>{`
                @keyframes floatUp {
                    from { bottom: -80px; }
                    to { bottom: 120%; }
                }
            `}</style>
        </div>
    );
}

const FidgetGame = () => {
    const [rotation, setRotation] = useState(0);
    const [velocity, setVelocity] = useState(0);
    const reqRef = useRef<number>(0);

    const spin = () => {
        setVelocity(prev => Math.min(prev + 20, 60));
    };

    useEffect(() => {
        const loop = () => {
            setRotation(prev => prev + velocity);
            setVelocity(prev => Math.max(0, prev * 0.97)); 
            reqRef.current = requestAnimationFrame(loop);
        };
        loop();
        return () => cancelAnimationFrame(reqRef.current!);
    }, [velocity]);

    return (
        <div className="flex flex-col items-center justify-center h-full gap-8">
            <div 
                onClick={spin}
                className="w-48 h-48 relative cursor-pointer"
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-24 bg-accent rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-24 bg-accent rounded-full rotate-60"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-24 bg-accent rounded-full -rotate-60"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full border-4 border-gray-200 shadow-xl z-10 flex items-center justify-center">
                    <div className="w-2 h-2 bg-black/20 rounded-full"></div>
                </div>
            </div>
            <p className="text-gray-400 text-xs">Tap to spin</p>
        </div>
    );
}

const ColorSpotGame = () => {
    const [score, setScore] = useState(0);
    const [grid, setGrid] = useState(2);
    const [diff, setDiff] = useState(0);
    const [baseColor, setBaseColor] = useState('');

    const generateLevel = () => {
        const h = Math.floor(Math.random() * 360);
        const s = 60 + Math.random() * 20;
        const l = 40 + Math.random() * 20;
        setBaseColor(`hsl(${h}, ${s}%, ${l}%)`);
        setDiff(Math.floor(Math.random() * (grid * grid)));
    };

    useEffect(() => {
        generateLevel();
    }, [score]);

    const handleSelect = (idx: number) => {
        if (idx === diff) {
            setScore(score + 1);
            if(score > 0 && score % 2 === 0) setGrid(Math.min(grid + 1, 5));
        } else {
            setScore(0);
            setGrid(2);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <h3 className="text-lg font-bold">Score: {score}</h3>
            <div 
                className="grid gap-2 bg-white/5 p-2 rounded-xl"
                style={{ gridTemplateColumns: `repeat(${grid}, minmax(0, 1fr))` }}
            >
                {Array(grid * grid).fill(0).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => handleSelect(i)}
                        className="w-12 h-12 rounded-lg transition-transform hover:scale-105"
                        style={{ 
                            backgroundColor: baseColor,
                            opacity: i === diff ? 0.7 + (score * 0.02) : 1 
                        }}
                    ></button>
                ))}
            </div>
        </div>
    );
}

const WhackGame = () => {
    const [pos, setPos] = useState({ top: '50%', left: '50%' });
    const [score, setScore] = useState(0);

    const move = () => {
        setPos({
            top: `${10 + Math.random() * 80}%`,
            left: `${10 + Math.random() * 80}%`
        });
    };

    const whack = () => {
        setScore(prev => prev + 1);
        move();
    };

    return (
        <div className="w-full h-full relative">
            <div className="absolute top-4 right-4 text-lg font-bold text-yellow-400">Score: {score}</div>
            <button
                onClick={whack}
                className="absolute w-10 h-10 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)] flex items-center justify-center animate-bounce transition-all duration-75 active:scale-90"
                style={{ top: pos.top, left: pos.left }}
            >
                <Zap className="w-5 h-5 text-white" />
            </button>
        </div>
    );
}

const QuoteGame = () => {
    const quotes = [
        "Quiet the mind, and the soul will speak.",
        "Almost everything will work again if you unplug it for a few minutes, including you.",
        "Breathe. It’s just a bad day, not a bad life.",
        "Do not anticipate trouble, or worry about what may never happen.",
        "Within you, there is a stillness and a sanctuary to which you can retreat at any time.",
        "Tension is who you think you should be. Relaxation is who you are.",
        "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.",
        "You don't always need a plan. Sometimes you just need to breathe, trust, let go, and see what happens."
    ];
    
    const [idx, setIdx] = useState(0);

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-sm mx-auto text-center px-6">
            <Quote className="w-10 h-10 text-gray-600 mb-6" />
            <p className="text-xl font-serif text-white mb-8 leading-relaxed">
                "{quotes[idx]}"
            </p>
            <button
                onClick={() => setIdx((idx + 1) % quotes.length)}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-sm"
            >
                Next
            </button>
        </div>
    );
}

// ============================================================================
// 🐍 SNAKE GAME - Classic addictive game
// ============================================================================
const SnakeGame = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('snakeHighScore') || '0'));
    const [gameOver, setGameOver] = useState(false);
    const gridSize = 20, cellSize = 15;
    const directionRef = useRef({ x: 1, y: 0 });
    const snakeRef = useRef([{ x: 10, y: 10 }]);
    const foodRef = useRef({ x: 15, y: 15 });

    const resetGame = () => { snakeRef.current = [{ x: 10, y: 10 }]; directionRef.current = { x: 1, y: 0 }; foodRef.current = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) }; setScore(0); setGameOver(false); };

    const gameLoop = useCallback(() => {
        if (gameOver) return;
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d'); if (!ctx) return;
        const snake = snakeRef.current, dir = directionRef.current, food = foodRef.current;
        const newHead = { x: (snake[0].x + dir.x + gridSize) % gridSize, y: (snake[0].y + dir.y + gridSize) % gridSize };
        if (snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) { setGameOver(true); if (score > highScore) { setHighScore(score); localStorage.setItem('snakeHighScore', score.toString()); } return; }
        snake.unshift(newHead);
        if (newHead.x === food.x && newHead.y === food.y) { setScore(s => s + 10); foodRef.current = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) }; } else { snake.pop(); }
        ctx.fillStyle = '#0a0a0f'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        snake.forEach((seg, i) => { ctx.fillStyle = i === 0 ? '#4ade80' : '#22c55e'; ctx.fillRect(seg.x * cellSize + 1, seg.y * cellSize + 1, cellSize - 2, cellSize - 2); });
        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(food.x * cellSize + cellSize/2, food.y * cellSize + cellSize/2, cellSize/2 - 2, 0, Math.PI * 2); ctx.fill();
    }, [gameOver, score, highScore]);

    useEffect(() => { const interval = setInterval(gameLoop, 100); return () => clearInterval(interval); }, [gameLoop]);
    useEffect(() => { const handleKey = (e: KeyboardEvent) => { const dir = directionRef.current; switch(e.key) { case 'ArrowUp': case 'w': if (dir.y !== 1) directionRef.current = { x: 0, y: -1 }; break; case 'ArrowDown': case 's': if (dir.y !== -1) directionRef.current = { x: 0, y: 1 }; break; case 'ArrowLeft': case 'a': if (dir.x !== 1) directionRef.current = { x: -1, y: 0 }; break; case 'ArrowRight': case 'd': if (dir.x !== -1) directionRef.current = { x: 1, y: 0 }; break; }}; window.addEventListener('keydown', handleKey); return () => window.removeEventListener('keydown', handleKey); }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="flex gap-8 text-sm"><span className="text-green-400">Score: {score}</span><span className="text-yellow-400">Best: {highScore}</span></div>
            <canvas ref={canvasRef} width={gridSize * cellSize} height={gridSize * cellSize} className="border border-white/10 rounded-lg" />
            {gameOver && (<div className="text-center"><p className="text-red-400 mb-2">Game Over!</p><button onClick={resetGame} className="px-4 py-2 bg-green-500 rounded-lg">Play Again</button></div>)}
            <div className="flex flex-col gap-1"><button onClick={() => directionRef.current = { x: 0, y: -1 }} className="p-2 bg-white/10 rounded mx-auto">↑</button><div className="flex gap-1"><button onClick={() => directionRef.current = { x: -1, y: 0 }} className="p-2 bg-white/10 rounded">←</button><button onClick={() => directionRef.current = { x: 0, y: 1 }} className="p-2 bg-white/10 rounded">↓</button><button onClick={() => directionRef.current = { x: 1, y: 0 }} className="p-2 bg-white/10 rounded">→</button></div></div>
        </div>
    );
};

// ============================================================================
// 🔢 2048 TILE MERGE GAME
// ============================================================================
const TileMergeGame = () => {
    const initGrid = () => { const g = Array(4).fill(null).map(() => Array(4).fill(0)); const add = (gr: number[][]) => { const empty: [number, number][] = []; gr.forEach((row, i) => row.forEach((cell, j) => { if (cell === 0) empty.push([i, j]); })); if (empty.length > 0) { const [i, j] = empty[Math.floor(Math.random() * empty.length)]; gr[i][j] = Math.random() < 0.9 ? 2 : 4; }}; add(g); add(g); return g; };
    const [grid, setGrid] = useState<number[][]>(initGrid);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const move = useCallback((dir: 'up' | 'down' | 'left' | 'right') => {
        if (gameOver) return;
        let newGrid = grid.map(row => [...row]); let points = 0;
        const slide = (arr: number[]) => { const filtered = arr.filter(x => x !== 0); const result: number[] = []; for (let i = 0; i < filtered.length; i++) { if (filtered[i] === filtered[i + 1]) { result.push(filtered[i] * 2); points += filtered[i] * 2; i++; } else { result.push(filtered[i]); }} while (result.length < 4) result.push(0); return result; };
        if (dir === 'left') newGrid = newGrid.map(row => slide(row));
        else if (dir === 'right') newGrid = newGrid.map(row => slide(row.reverse()).reverse());
        else if (dir === 'up') { for (let j = 0; j < 4; j++) { const col = [newGrid[0][j], newGrid[1][j], newGrid[2][j], newGrid[3][j]]; const slid = slide(col); for (let i = 0; i < 4; i++) newGrid[i][j] = slid[i]; }}
        else if (dir === 'down') { for (let j = 0; j < 4; j++) { const col = [newGrid[3][j], newGrid[2][j], newGrid[1][j], newGrid[0][j]]; const slid = slide(col); for (let i = 0; i < 4; i++) newGrid[3 - i][j] = slid[i]; }}
        if (JSON.stringify(newGrid) !== JSON.stringify(grid)) { const empty: [number, number][] = []; newGrid.forEach((row, i) => row.forEach((cell, j) => { if (cell === 0) empty.push([i, j]); })); if (empty.length > 0) { const [i, j] = empty[Math.floor(Math.random() * empty.length)]; newGrid[i][j] = Math.random() < 0.9 ? 2 : 4; }}
        setGrid(newGrid); setScore(s => s + points);
        const hasEmpty = newGrid.some(row => row.some(cell => cell === 0)); const canMerge = newGrid.some((row, i) => row.some((cell, j) => (j < 3 && cell === row[j + 1]) || (i < 3 && cell === newGrid[i + 1][j]))); if (!hasEmpty && !canMerge) setGameOver(true);
    }, [grid, gameOver]);

    useEffect(() => { const handleKey = (e: KeyboardEvent) => { switch(e.key) { case 'ArrowUp': case 'w': move('up'); break; case 'ArrowDown': case 's': move('down'); break; case 'ArrowLeft': case 'a': move('left'); break; case 'ArrowRight': case 'd': move('right'); break; }}; window.addEventListener('keydown', handleKey); return () => window.removeEventListener('keydown', handleKey); }, [move]);
    const getTileColor = (val: number) => { const c: {[k: number]: string} = { 0: 'bg-white/5', 2: 'bg-amber-100 text-gray-800', 4: 'bg-amber-200 text-gray-800', 8: 'bg-orange-300 text-white', 16: 'bg-orange-400 text-white', 32: 'bg-orange-500 text-white', 64: 'bg-red-500 text-white', 128: 'bg-yellow-400 text-white', 256: 'bg-yellow-500 text-white', 512: 'bg-yellow-600 text-white', 1024: 'bg-amber-500 text-white', 2048: 'bg-amber-600 text-white' }; return c[val] || 'bg-purple-600 text-white'; };
    const resetGame = () => { setGrid(initGrid()); setScore(0); setGameOver(false); };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="text-amber-400 font-bold text-xl">Score: {score}</div>
            <div className="grid grid-cols-4 gap-2 bg-white/10 p-3 rounded-xl">{grid.flat().map((val, i) => (<div key={i} className={`w-14 h-14 rounded-lg flex items-center justify-center font-bold text-lg ${getTileColor(val)}`}>{val || ''}</div>))}</div>
            {gameOver && (<div className="text-center"><p className="text-red-400 mb-2">Game Over!</p><button onClick={resetGame} className="px-4 py-2 bg-amber-500 rounded-lg">New Game</button></div>)}
            <div className="flex flex-col gap-1"><button onClick={() => move('up')} className="p-2 bg-white/10 rounded mx-auto">↑</button><div className="flex gap-1"><button onClick={() => move('left')} className="p-2 bg-white/10 rounded">←</button><button onClick={() => move('down')} className="p-2 bg-white/10 rounded">↓</button><button onClick={() => move('right')} className="p-2 bg-white/10 rounded">→</button></div></div>
        </div>
    );
};

// ============================================================================
// 🧱 TETRIS GAME
// ============================================================================
const TetrisGame = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const cols = 10, rows = 20, cellSize = 18;
    const boardRef = useRef<number[][]>(Array(rows).fill(null).map(() => Array(cols).fill(0)));
    const pieceRef = useRef<{shape: number[][], x: number, y: number, color: number} | null>(null);
    const shapes = [[[1,1,1,1]], [[1,1],[1,1]], [[0,1,0],[1,1,1]], [[1,0,0],[1,1,1]], [[0,0,1],[1,1,1]], [[0,1,1],[1,1,0]], [[1,1,0],[0,1,1]]];
    const colors = ['#00f5ff', '#ffff00', '#a855f7', '#ff8c00', '#3b82f6', '#22c55e', '#ef4444'];

    const spawnPiece = useCallback(() => { const idx = Math.floor(Math.random() * shapes.length); pieceRef.current = { shape: shapes[idx], x: Math.floor(cols / 2) - 1, y: 0, color: idx }; }, []);
    const canMove = (dx: number, dy: number, shape?: number[][]) => { const piece = pieceRef.current; if (!piece) return false; const s = shape || piece.shape; for (let y = 0; y < s.length; y++) { for (let x = 0; x < s[y].length; x++) { if (s[y][x]) { const newX = piece.x + x + dx; const newY = piece.y + y + dy; if (newX < 0 || newX >= cols || newY >= rows) return false; if (newY >= 0 && boardRef.current[newY][newX]) return false; }}} return true; };
    const rotate = () => { const piece = pieceRef.current; if (!piece) return; const rotated = piece.shape[0].map((_, i) => piece.shape.map(row => row[i]).reverse()); if (canMove(0, 0, rotated)) piece.shape = rotated; };

    const draw = useCallback(() => { const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return; ctx.fillStyle = '#0a0a0f'; ctx.fillRect(0, 0, canvas.width, canvas.height); boardRef.current.forEach((row, y) => { row.forEach((cell, x) => { if (cell) { ctx.fillStyle = colors[cell - 1]; ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2); } ctx.strokeStyle = '#ffffff10'; ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize); }); }); const piece = pieceRef.current; if (piece) { ctx.fillStyle = colors[piece.color]; piece.shape.forEach((row, y) => { row.forEach((val, x) => { if (val) { ctx.fillRect((piece.x + x) * cellSize + 1, (piece.y + y) * cellSize + 1, cellSize - 2, cellSize - 2); }}); }); }}, []);
    
    const gameLoop = useCallback(() => { if (gameOver) return; if (!pieceRef.current) { spawnPiece(); if (!canMove(0, 0)) { setGameOver(true); return; }} if (canMove(0, 1)) { pieceRef.current!.y++; } else { const piece = pieceRef.current!; piece.shape.forEach((row, y) => { row.forEach((val, x) => { if (val && piece.y + y >= 0) { boardRef.current[piece.y + y][piece.x + x] = piece.color + 1; }}); }); let cleared = 0; for (let y = rows - 1; y >= 0; y--) { if (boardRef.current[y].every(cell => cell !== 0)) { boardRef.current.splice(y, 1); boardRef.current.unshift(Array(cols).fill(0)); cleared++; y++; }} if (cleared > 0) setScore(s => s + cleared * 100); pieceRef.current = null; } draw(); }, [gameOver, spawnPiece, draw]);
    
    useEffect(() => { const interval = setInterval(gameLoop, 400); return () => clearInterval(interval); }, [gameLoop]);
    useEffect(() => { const handleKey = (e: KeyboardEvent) => { if (gameOver || !pieceRef.current) return; switch(e.key) { case 'ArrowLeft': case 'a': if (canMove(-1, 0)) pieceRef.current.x--; break; case 'ArrowRight': case 'd': if (canMove(1, 0)) pieceRef.current.x++; break; case 'ArrowDown': case 's': if (canMove(0, 1)) pieceRef.current.y++; break; case 'ArrowUp': case 'w': rotate(); break; } draw(); }; window.addEventListener('keydown', handleKey); return () => window.removeEventListener('keydown', handleKey); }, [gameOver, draw]);
    const resetGame = () => { boardRef.current = Array(rows).fill(null).map(() => Array(cols).fill(0)); pieceRef.current = null; setScore(0); setGameOver(false); };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-2">
            <div className="text-cyan-400 font-bold">Score: {score}</div>
            <canvas ref={canvasRef} width={cols * cellSize} height={rows * cellSize} className="border border-white/10 rounded-lg" />
            {gameOver && (<div className="text-center"><p className="text-red-400 mb-2">Game Over!</p><button onClick={resetGame} className="px-4 py-2 bg-cyan-500 rounded-lg">Play Again</button></div>)}
            <div className="flex gap-2"><button onClick={() => { if (canMove(-1, 0) && pieceRef.current) { pieceRef.current.x--; draw(); }}} className="p-2 bg-white/10 rounded">←</button><button onClick={() => { rotate(); draw(); }} className="p-2 bg-white/10 rounded">↻</button><button onClick={() => { if (canMove(1, 0) && pieceRef.current) { pieceRef.current.x++; draw(); }}} className="p-2 bg-white/10 rounded">→</button><button onClick={() => { if (canMove(0, 1) && pieceRef.current) { pieceRef.current.y++; draw(); }}} className="p-2 bg-white/10 rounded">↓</button></div>
        </div>
    );
};

// ============================================================================
// ⚡ REACTION TIME TEST
// ============================================================================
const ReactionGame = () => {
    const [state, setState] = useState<'waiting' | 'ready' | 'go' | 'result'>('waiting');
    const [reactionTime, setReactionTime] = useState(0);
    const [bestTime, setBestTime] = useState(() => parseInt(localStorage.getItem('reactionBest') || '999'));
    const startTimeRef = useRef(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

    const start = () => { setState('ready'); timeoutRef.current = setTimeout(() => { setState('go'); startTimeRef.current = Date.now(); }, 2000 + Math.random() * 3000); };
    const click = () => { if (state === 'ready') { clearTimeout(timeoutRef.current); setState('waiting'); } else if (state === 'go') { const time = Date.now() - startTimeRef.current; setReactionTime(time); if (time < bestTime) { setBestTime(time); localStorage.setItem('reactionBest', time.toString()); } setState('result'); }};

    return (
        <div className="flex flex-col items-center justify-center h-full gap-6">
            <h3 className="text-xl font-bold">⚡ Reaction Test</h3>
            <button onClick={state === 'waiting' || state === 'result' ? start : click} className={`w-48 h-48 rounded-full text-white font-bold text-lg shadow-2xl ${state === 'waiting' ? 'bg-blue-500' : state === 'ready' ? 'bg-red-500 animate-pulse' : state === 'go' ? 'bg-green-500' : 'bg-purple-500'}`}>
                {state === 'waiting' && 'Click to Start'}{state === 'ready' && 'Wait...'}{state === 'go' && 'CLICK!'}{state === 'result' && `${reactionTime}ms`}
            </button>
            <div className="flex gap-6 text-sm"><div className="text-center"><p className="text-gray-500">Best</p><p className="text-green-400 font-bold">{bestTime}ms</p></div></div>
            {state === 'result' && (<button onClick={start} className="px-6 py-2 bg-white/10 rounded-full">Try Again</button>)}
        </div>
    );
};

// ============================================================================
// 🖱️ CLICKER GAME
// ============================================================================
const ClickerGame = () => {
    const [clicks, setClicks] = useState(() => parseInt(localStorage.getItem('clickerScore') || '0'));
    const [clickPower, setClickPower] = useState(() => parseInt(localStorage.getItem('clickerPower') || '1'));
    const [autoClick, setAutoClick] = useState(() => parseInt(localStorage.getItem('clickerAuto') || '0'));

    useEffect(() => { localStorage.setItem('clickerScore', clicks.toString()); }, [clicks]);
    useEffect(() => { if (autoClick > 0) { const interval = setInterval(() => { setClicks(c => c + autoClick); }, 1000); return () => clearInterval(interval); }}, [autoClick]);

    const handleClick = () => { setClicks(c => c + clickPower); };
    const buyUpgrade = (cost: number, type: 'power' | 'auto') => { if (clicks >= cost) { setClicks(c => c - cost); if (type === 'power') { setClickPower(p => { const n = p + 1; localStorage.setItem('clickerPower', n.toString()); return n; }); } else { setAutoClick(a => { const n = a + 1; localStorage.setItem('clickerAuto', n.toString()); return n; }); }}};
    const powerCost = clickPower * 50, autoCost = (autoClick + 1) * 100;

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="text-center"><p className="text-4xl font-bold text-emerald-400">{clicks.toLocaleString()}</p><p className="text-gray-500 text-sm">clicks</p></div>
            <button onClick={handleClick} className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"><MousePointerClick className="w-12 h-12 text-white" /></button>
            <div className="flex gap-3 mt-4">
                <button onClick={() => buyUpgrade(powerCost, 'power')} disabled={clicks < powerCost} className={`px-4 py-2 rounded-lg text-sm ${clicks >= powerCost ? 'bg-blue-500' : 'bg-gray-700 opacity-50'}`}><p className="font-bold">+1 Power</p><p className="text-xs">{powerCost}</p></button>
                <button onClick={() => buyUpgrade(autoCost, 'auto')} disabled={clicks < autoCost} className={`px-4 py-2 rounded-lg text-sm ${clicks >= autoCost ? 'bg-purple-500' : 'bg-gray-700 opacity-50'}`}><p className="font-bold">+1 Auto/s</p><p className="text-xs">{autoCost}</p></button>
            </div>
            <div className="text-xs text-gray-500">Power: {clickPower}/click • Auto: {autoClick}/sec</div>
        </div>
    );
};

export default RelaxationGames;