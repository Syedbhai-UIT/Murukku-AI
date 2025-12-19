import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, Wind, Circle, Grid, MousePointer2, Move, Droplets, Palette, Quote, X, RefreshCw, Zap } from 'lucide-react';

interface RelaxationGamesProps {
    onClose: () => void;
}

type GameType = 'breath' | 'bubble' | 'memory' | 'particles' | 'zen-draw' | 'balloon' | 'fidget' | 'color-spot' | 'whack' | 'quote';

const RelaxationGames: React.FC<RelaxationGamesProps> = ({ onClose }) => {
    const [activeGame, setActiveGame] = useState<GameType | null>(null);

    const games = [
        { id: 'breath', title: 'Breathing', icon: <Wind className="w-6 h-6 text-blue-400" />, desc: '4-7-8 Guide' },
        { id: 'bubble', title: 'Bubble Wrap', icon: <Circle className="w-6 h-6 text-pink-400" />, desc: 'Pop bubbles' },
        { id: 'memory', title: 'Mind Match', icon: <Grid className="w-6 h-6 text-green-400" />, desc: 'Memory flip' },
        { id: 'particles', title: 'Particles', icon: <MousePointer2 className="w-6 h-6 text-yellow-400" />, desc: 'Visual flow' },
        { id: 'zen-draw', title: 'Zen Draw', icon: <Palette className="w-6 h-6 text-purple-400" />, desc: 'Vanish ink' },
        { id: 'balloon', title: 'Balloon Rise', icon: <Move className="w-6 h-6 text-red-400" />, desc: 'Pop rising' },
        { id: 'fidget', title: 'Spin It', icon: <RefreshCw className="w-6 h-6 text-orange-400" />, desc: 'Fidget Spin' },
        { id: 'color-spot', title: 'Color Spot', icon: <Droplets className="w-6 h-6 text-teal-400" />, desc: 'Find odd one' },
        { id: 'whack', title: 'Stress Bugs', icon: <Zap className="w-6 h-6 text-indigo-400" />, desc: 'Zap bugs' },
        { id: 'quote', title: 'Daily Zen', icon: <Quote className="w-6 h-6 text-gray-400" />, desc: 'Wisdom' },
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

export default RelaxationGames;