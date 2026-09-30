// Quotes Database (Rotates hourly or on refresh)
const wisdomQuotes = [
    { quote: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra" },
    { quote: "Data is the new oil, but analytics is the combustion engine.", author: "Clive Humby" },
    { quote: "Perseverance is power. (継続は力なり)", author: "Japanese Proverb" },
    { quote: "Without big data analytics, companies are blind and deaf.", author: "Geoffrey Moore" },
    { quote: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
    { quote: "Fall seven times, stand up eight. (七転び八起き)", author: "Japanese Zen Wisdom" },
    { quote: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { quote: "Errors using inadequate data are much less than those using no data at all.", author: "Charles Babbage" }
];

function updateQuote() {
    const now = new Date();
    const hourlyIndex = (now.getDate() * 24 + now.getHours()) % wisdomQuotes.length;
    const q = wisdomQuotes[hourlyIndex];
    document.getElementById('quote-text').innerText = `"${q.quote}"`;
    document.getElementById('quote-author').innerText = `— ${q.author}`;
}

let currentCustomQuote = 0;
function rotateQuote() {
    currentCustomQuote = (currentCustomQuote + 1) % wisdomQuotes.length;
    const q = wisdomQuotes[currentCustomQuote];
    document.getElementById('quote-text').innerText = `"${q.quote}"`;
    document.getElementById('quote-author').innerText = `— ${q.author}`;
}

// Dark Mode Logic (Default Start Mode = LIGHT)
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.getElementById('theme-icon');
    
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    } else {
        document.documentElement.classList.remove('dark');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
}

function toggleDarkMode() {
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
}

// Scroll Observer for Smooth Right-to-Left Triggers
function setupScrollObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
}

// Initialize components on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateQuote();
    setupScrollObserver();
});

// Floating Sakura Canvas Animation
const canvas = document.getElementById('sakura-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const petals = [];
const petalCount = 32;

class Petal {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 8 + 6;
        this.speedY = Math.random() * 1.2 + 0.8;
        this.speedX = Math.random() * 0.8 - 0.4;
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
        this.angle += this.spin;

        if (this.y > canvas.height) {
            this.y = -20;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.angle * Math.PI) / 180);
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.fillStyle = "#FADBD8";
        ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
}

for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal());
}

function animateSakura() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateSakura);
}
animateSakura();

// Audio Player Logic with Web Audio Synthesizer Fallback
const bgMusic = document.getElementById('bg-music');
const musicIcon = document.getElementById('music-icon');
const musicStatus = document.getElementById('music-status');
const visualizer = document.getElementById('visualizer');
let isPlaying = false;
let audioCtx = null;
let synthInterval = null;

function playKotoSynth() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    synthInterval = setInterval(() => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const freq = notes[Math.floor(Math.random() * notes.length)];
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.5);
    }, 600);
}

function stopKotoSynth() {
    if (synthInterval) clearInterval(synthInterval);
}

function toggleAudio() {
    if (isPlaying) {
        bgMusic.pause();
        stopKotoSynth();
        musicIcon.classList.remove('fa-pause');
        musicIcon.classList.add('fa-play');
        musicStatus.innerText = "Music Paused";
        visualizer.classList.add('paused');
        isPlaying = false;
    } else {
        musicStatus.innerText = "Playing Sound...";
        bgMusic.play().then(() => {
            musicIcon.classList.remove('fa-play');
            musicIcon.classList.add('fa-pause');
            musicStatus.innerText = "Playing Koto Ambient";
            visualizer.classList.remove('paused');
            isPlaying = true;
        }).catch(() => {
            playKotoSynth();
            musicIcon.classList.remove('fa-play');
            musicIcon.classList.add('fa-pause');
            musicStatus.innerText = "Playing Traditional Koto";
            visualizer.classList.remove('paused');
            isPlaying = true;
        });
    }
}

// Project Category Filtering
function filterProjects(category) {
    const cards = document.querySelectorAll('.project-card');
    const buttons = document.querySelectorAll('.project-filter-btn');

    buttons.forEach(btn => {
        btn.classList.remove('bg-vermilion', 'text-white');
        btn.classList.add('bg-white', 'dark:bg-darkCard', 'text-slate-700', 'dark:text-slate-200');
    });

    event.target.classList.remove('bg-white', 'dark:bg-darkCard', 'text-slate-700', 'dark:text-slate-200');
    event.target.classList.add('bg-vermilion', 'text-white');

    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Form Submission Simulation
function handleFormSubmit(e) {
    e.preventDefault();
    alert("送信完了！ Message transmitted successfully to Fares Ayman.");
    e.target.reset();
}