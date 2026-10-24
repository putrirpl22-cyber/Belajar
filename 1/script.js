const canvas = document.getElementById("universe");
const ctx = canvas.getContext("2d");
const button = document.getElementById("loveButton");
const message = document.getElementById("message");

let width = 0;
let height = 0;
let dpr = 1;
let heartActive = false;
let words = [];
let particles = [];
let mouse = { x: -1000, y: -1000 };
let sparkles = [];


let giantHeartParticles = [];

// Membuat ribuan partikel yang mengisi bentuk hati raksasa
function createGiantHeart() {
    giantHeartParticles = [];

    const count = Math.min(
        1800,
        Math.max(900, Math.floor((width * height) / 600))
    );

    // Ukuran hati raksasa, lebih besar dari hati I LOVE YOU
    const scale = Math.min(width / 32, height / 27, 22);

    for (let i = 0; i < count; i++) {
        const t = Math.random() * Math.PI * 2;

        // Rumus siluet hati
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy =
            13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t);

        // Mengisi bagian dalam hati dengan lapisan partikel
        const fill = Math.sqrt(Math.random());
        const targetX = width / 2 + hx * scale * fill;
        const targetY = height / 2 - hy * scale * fill;

        giantHeartParticles.push({
            x: targetX + (Math.random() - 0.5) * 100,
            y: targetY + (Math.random() - 0.5) * 100,
            targetX,
            targetY,
            vx: 0,
            vy: 0,
            size: Math.random() * 1.5 + 0.5,
            phase: Math.random() * Math.PI * 2,
            alpha: Math.random() * 0.55 + 0.2
        });
    }
}

// Animasi partikel hati raksasa
function drawGiantHeart() {
    const time = performance.now() / 1000;

    for (const p of giantHeartParticles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distance = Math.hypot(dx, dy);

        // Partikel menjauh dari kursor
        if (distance < 115 && distance > 0) {
            const force = (115 - distance) / 115;
            p.vx += (dx / distance) * force * 2.2;
            p.vy += (dy / distance) * force * 2.2;
        }

        // Gaya untuk mengembalikan partikel ke bentuk hati
        p.vx += (p.targetX - p.x) * 0.012;
        p.vy += (p.targetY - p.y) * 0.012;

        // Gesekan agar gerakan halus
        p.vx *= 0.91;
        p.vy *= 0.91;

        p.x += p.vx;
        p.y += p.vy;

        // Kilauan dan denyut yang lembut
        const pulse =
            0.72 + Math.sin(time * 2 + p.phase) * 0.25;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * pulse, 0, Math.PI * 2);

        ctx.fillStyle =
            `rgba(238, 126, 183, ${p.alpha * pulse})`;

        ctx.fill();
    }
}


function createSparkles() {
    sparkles = [];

    for (let i = 0; i < 65; i++) {
        sparkles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 0.5,
            phase: Math.random() * Math.PI * 2
        });
    }
}

function drawSparkles() {
    const time = performance.now() / 1000;

    for (const s of sparkles) {
        const glow = (
            Math.sin(time * 2.5 + s.phase) + 1
        ) / 2;

        ctx.globalAlpha = 0.15 + glow * 0.65;
        ctx.fillStyle = "#fff0fa";

        ctx.beginPath();
        ctx.arc(
            s.x,
            s.y,
            s.size * (0.7 + glow),
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    ctx.globalAlpha = 1;
}

// Mengatur ukuran canvas agar sesuai layar
function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    createParticles();
    createGiantHeart();
    createSparkles();

    if (heartActive) {
        createHeart();
    }
}

// Membuat partikel kecil di seluruh layar
function createParticles() {
    const count = Math.min(
        150,
        Math.floor((width * height) / 6500)
    );

    particles = [];

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: 0,
            vy: 0,
            radius: Math.random() * 1.8 + 0.5,
            alpha: Math.random() * 0.5 + 0.2
        });
    }
}

// Rumus matematika untuk membuat bentuk hati
function createHeart() {
    words = [];

    const count = Math.min(
        145,
        Math.max(65, Math.floor(width / 5))
    );

    const scale = Math.min(width / 36, height / 31, 15);
    const centerX = width / 2;
    const centerY = height / 2;

    for (let i = 0; i < count; i++) {
        const t = (Math.PI * 2 * i) / count;

        const heartX = 16 * Math.pow(Math.sin(t), 3);
        const heartY =
            13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t);

        const targetX = centerX + heartX * scale;
        const targetY = centerY - heartY * scale;

        words.push({
            x: Math.random() * width,
            y: Math.random() * height,
            targetX,
            targetY,
            delay: Math.random() * 100,
            alpha: 0
        });
    }
}

// Ketika tombol diklik, kata-kata mulai membentuk hati
button.addEventListener("click", () => {
    heartActive = true;
    createHeart();

    button.textContent = "Send more love ♥";
    message.textContent = "I LOVE YOU, over and over ♡";
});

// Membaca posisi kursor
window.addEventListener("pointermove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener("pointerleave", () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

// Animasi seluruh elemen
function animate() {
    ctx.clearRect(0, 0, width, height);

    // Hati raksasa menjadi lapisan latar belakang
    drawGiantHeart();

    // Menggerakkan partikel agar menghindari kursor
    for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 100 && distance > 0) {
            const force = (100 - distance) / 100;
            p.vx += (dx / distance) * force * 0.8;
            p.vy += (dy / distance) * force * 0.8;
        }

        // Gerakan alami yang lembut
        p.vx += (Math.random() - 0.5) * 0.025;
        p.vy += (Math.random() - 0.5) * 0.025;

        p.vx *= 0.97;
        p.vy *= 0.97;

        p.x += p.vx;
        p.y += p.vy;

        // Muncul kembali dari sisi berlawanan layar
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 174, 210, ${p.alpha})`;
        ctx.fill();
    }

    // Menggerakkan kata-kata menuju titik pembentuk hati
    if (heartActive) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "600 10px Segoe UI, sans-serif";

        for (const word of words) {
            if (word.delay > 0) {
                word.delay--;
                continue;
            }

            word.x += (word.targetX - word.x) * 0.055;
            word.y += (word.targetY - word.y) * 0.055;
            word.alpha = Math.min(1, word.alpha + 0.025);

            // Kilau lembut pada kata
            const glow = 0.7 + Math.sin(
                performance.now() / 350 + word.targetX
            ) * 0.3;

            ctx.globalAlpha = word.alpha * glow;
            ctx.fillStyle = "#f5a6cb";
            ctx.fillText("I LOVE YOU", word.x, word.y);
        }

        ctx.globalAlpha = 1;
    }

    requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
animate();

