/**
 * Interactive Script for Didik Rabihni's Cyber Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- AUDIO SYSTEM (Web Audio API Synthesizer) ---
    let audioCtx = null;
    let isMuted = true;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // Capture first user gesture to unlock audio
    window.addEventListener('click', () => {
        if (!isMuted) {
            initAudio();
        }
    }, { once: true });

    // Synthesize simple synthesizer sound effects
    function playSynthBeep(freq, type, duration, volume) {
        if (isMuted) return;
        try {
            initAudio();
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            osc.type = type || 'sine'; // sine, square, sawtooth, triangle
            osc.frequency.setValueAtTime(freq || 440, audioCtx.currentTime);
            
            gainNode.gain.setValueAtTime(volume || 0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.error("Audio error:", e);
        }
    }

    // Quick sound helpers
    const playClick = () => playSynthBeep(1200, 'sine', 0.05, 0.05);
    const playTick = () => playSynthBeep(2500, 'triangle', 0.02, 0.02);
    const playAccessGranted = () => {
        playSynthBeep(523.25, 'sine', 0.1, 0.1); // C5
        setTimeout(() => playSynthBeep(659.25, 'sine', 0.1, 0.1), 80); // E5
        setTimeout(() => playSynthBeep(783.99, 'sine', 0.15, 0.15), 160); // G5
        setTimeout(() => playSynthBeep(1046.50, 'sine', 0.3, 0.2), 240); // C6
    };
    const playWarning = () => {
        playSynthBeep(220, 'sawtooth', 0.15, 0.15); // A3
        setTimeout(() => playSynthBeep(220, 'sawtooth', 0.15, 0.15), 200);
    };
    const playBypassSound = () => {
        playSynthBeep(150, 'sawtooth', 0.1, 0.2);
        setTimeout(() => playSynthBeep(300, 'sawtooth', 0.1, 0.2), 100);
        setTimeout(() => playSynthBeep(600, 'sine', 0.4, 0.3), 200);
    };

    // Sound toggle UI logic
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    soundToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid triggering window click
        isMuted = !isMuted;
        if (!isMuted) {
            initAudio();
            soundToggleBtn.innerHTML = '<span class="icon">🔊</span> <span class="label">UNMUTED</span>';
            soundToggleBtn.classList.add('glow-green-text');
            playAccessGranted();
        } else {
            soundToggleBtn.innerHTML = '<span class="icon">🔇</span> <span class="label">MUTED</span>';
            soundToggleBtn.classList.remove('glow-green-text');
        }
    });

    // --- MATRIX DIGITAL RAIN CANVAS ---
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');

    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const matrixChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ*#$@&%+";
    const fontSize = 14;
    let columns = Math.floor(canvasWidth / fontSize);
    let rainDrops = Array(columns).fill(1);

    window.addEventListener('resize', () => {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        columns = Math.floor(canvasWidth / fontSize);
        rainDrops = Array(columns).fill(1);
    });

    function drawMatrixRain() {
        ctx.fillStyle = 'rgba(3, 8, 5, 0.05)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.fillStyle = '#33ff33';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < rainDrops.length; i++) {
            const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            const x = i * fontSize;
            const y = rainDrops[i] * fontSize;

            if (Math.random() > 0.98) {
                ctx.fillStyle = '#ffffff';
            } else {
                ctx.fillStyle = '#33ff33';
            }

            ctx.fillText(text, x, y);

            if (y > canvasHeight && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    }
    
    let matrixInterval = setInterval(drawMatrixRain, 30);


    // --- DECRYPTION / TEXT SCRAMBLER EFFECT ---
    function decryptText(element, finalValue, duration = 1000) {
        if (!element) return;
        const chars = '!@#$%^&*()_+{}|:"<>?-=[]\\;\',./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const start = Date.now();
        const length = finalValue.length;
        
        element.textContent = '';
        
        const interval = setInterval(() => {
            const timePassed = Date.now() - start;
            const progress = timePassed / duration;
            
            if (progress >= 1) {
                clearInterval(interval);
                element.textContent = finalValue;
                return;
            }
            
            let currentStr = '';
            for (let i = 0; i < length; i++) {
                if (i / length < progress) {
                    currentStr += finalValue[i];
                } else {
                    currentStr += chars[Math.floor(Math.random() * chars.length)];
                }
            }
            element.textContent = currentStr;
            if (Math.random() > 0.7) playTick();
        }, 35);
    }


    // --- BOOT LOADER LOG SEQUENCE (FAST AUTOMATED) ---
    const bootLog = document.getElementById('boot-log');
    const bootScreen = document.getElementById('boot-screen');
    const bootInteraction = document.getElementById('boot-interaction');
    const dashboardWrapper = document.getElementById('dashboard-wrapper');

    const logStatements = [
        { text: "CRITICAL: BOOTING SECURE_PORTFOLIO SHELL...", delay: 80, type: "info" },
        { text: "LOCATING MAIN OPERATOR ARCHIVE...", delay: 100, type: "info" },
        { text: "ESTABLISHING LOOPBACK CONNECTION...", delay: 120, type: "info" },
        { text: "[ OK ] SIEM Wazuh Agent Stack Active", delay: 90, type: "success" },
        { text: "[ OK ] Cowrie Honeypot Sandbox check", delay: 80, type: "success" },
        { text: "[ OK ] Active Directory online", delay: 90, type: "success" },
        { text: "DECRYPTING BIO SCHEMAS & DATABASE DATA...", delay: 150, type: "info" },
        { text: "CHECKSUM SUCCESSFUL: A6B3E9012F4D", delay: 80, type: "success" },
        { text: "SYS_STATUS: AUTO REDIRECT INITIATED.", delay: 150, type: "success" }
    ];

    let logIndex = 0;

    function runBootSequence() {
        if (logIndex < logStatements.length) {
            const statement = logStatements[logIndex];
            const p = document.createElement('p');
            p.classList.add('log-line');
            if (statement.type) p.classList.add(statement.type);
            p.textContent = statement.text;
            bootLog.appendChild(p);
            bootLog.scrollTop = bootLog.scrollHeight;
            
            if (Math.random() > 0.4) playTick();

            logIndex++;
            setTimeout(runBootSequence, statement.delay);
        } else {
            // Log completes, transition automatically
            bootInteraction.style.display = 'block';
            const decryptTitle = bootInteraction.querySelector('.decrypt-title');
            decryptText(decryptTitle, decryptTitle.getAttribute('data-decrypt'), 800);
            
            // Auto transition after 1 second of "Access Decrypted" status
            setTimeout(autoTransitionToDashboard, 1100);
        }
    }

    function autoTransitionToDashboard() {
        playBypassSound();

        bootScreen.style.transition = 'all 0.6s cubic-bezier(0.1, 0.9, 0.2, 1)';
        bootScreen.style.opacity = '0';
        bootScreen.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            bootScreen.style.display = 'none';
            dashboardWrapper.classList.remove('hidden');
            
            // Decrypt header title
            const mainTitle = document.getElementById('main-title');
            decryptText(mainTitle, mainTitle.getAttribute('data-decrypt'), 1200);
            
            // Decrypt section titles in view
            document.querySelectorAll('.section-card .panel-title').forEach(title => {
                decryptText(title, title.textContent, 1000);
            });
            
            // Initialize terminal logs
            terminalOutput.innerHTML = '';
            printTerminalLine("System initialized. Secure database connection established.");
            printTerminalLine("Type <span class='text-highlight'>/help</span> to view active command listing.");
        }, 650);
    }

    // Trigger boot sequence start
    setTimeout(runBootSequence, 200);


    // --- Ticking live system clock ---
    const liveClock = document.getElementById('live-clock');
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        liveClock.textContent = `${hours}:${minutes}:${seconds}`;
    }
    setInterval(updateClock, 1000);
    updateClock();





    // --- DECRYPT & DOWNLOAD CV LOGIC ---
    const decryptCvBtn = document.getElementById('decrypt-cv-btn');
    const cvProgressContainer = document.getElementById('cv-progress-container');
    const cvProgressFill = document.getElementById('cv-progress-fill');
    const progressPct = document.getElementById('progress-pct');
    const cvDownloadLink = document.getElementById('cv-download-link');

    decryptCvBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        decryptCvBtn.style.display = 'none';
        cvProgressContainer.style.display = 'block';
        cvProgressFill.style.width = '0%';
        progressPct.textContent = '0%';
        
        playSynthBeep(400, 'triangle', 0.2, 0.1);
        printTerminalLine("Decryption payload initialization: CV_DIDIK_RABIHNI.PDF");

        let pct = 0;
        const interval = setInterval(() => {
            pct += Math.floor(Math.random() * 8) + 4;
            if (pct >= 100) {
                pct = 100;
                clearInterval(interval);
                
                cvProgressFill.style.width = '100%';
                progressPct.textContent = '100%';
                
                playAccessGranted();
                printTerminalLine("SUCCESS: CV Payload decryption complete. Triggering download pipeline...");
                
                setTimeout(() => {
                    cvDownloadLink.click();
                    cvProgressContainer.style.display = 'none';
                    decryptCvBtn.style.display = 'block';
                }, 800);
            } else {
                cvProgressFill.style.width = `${pct}%`;
                progressPct.textContent = `${pct}%`;
                if (pct % 4 === 0) {
                    playTick();
                    printTerminalLine(`Pipe decrypt stream... block offset: 0x${(pct * 4).toString(16).toUpperCase()}`);
                }
            }
        }, 80);
    });


    // --- SECURE TERMINAL CONSOLE EMULATOR ---
    const terminalForm = document.getElementById('terminal-form');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalBody = document.getElementById('terminal-body');
    const shortcutBtns = document.querySelectorAll('.shortcut-btn');

    function printTerminalLine(text, className = "system-resp") {
        const p = document.createElement('p');
        p.classList.add('output-line', className);
        p.innerHTML = text;
        terminalOutput.appendChild(p);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function processCommand(cmdText) {
        const cleanCmd = cmdText.trim().toLowerCase();
        
        printTerminalLine(`guest@didik-rabihni:~# ${cmdText}`, 'cmd-echo');
        playClick();

        if (cleanCmd === '') return;

        if (cleanCmd === '/help' || cleanCmd === 'help') {
            printTerminalLine(`Available CLI Commands:
  <span class="text-highlight">/help</span>       - Display current active command interface
  <span class="text-highlight">/about</span>      - Identity summary & credentials file
  <span class="text-highlight">/skills</span>     - Load security technical matrix
  <span class="text-highlight">/exp</span>        - Fetch PT Lintasarta internship logs
  <span class="text-highlight">/projects</span>   - SIEM (Wazuh) setup specification
  <span class="text-highlight">/certs</span>      - Fetch Cisco certifications & honors
  <span class="text-highlight">/activities</span>  - Fetch academic seminars & volunteer logs
  <span class="text-highlight">/contact</span>    - Expose operators contact sockets
  <span class="text-highlight">/clear</span>    - Wipe console logs cache`);
        } 
        else if (cleanCmd === '/about' || cleanCmd === '/identity' || cleanCmd === 'about') {
            printTerminalLine(`OPERATOR BIO LOG:
  - Name: Didik Rabihni
  - Education: S1 Teknik Informatika (Universitas Bina Nusantara, 2022-Present)
  - Degree: Sarjana Komputer (S.Kom in Cyber Security)
  - Focus: Cybersecurity, Systems Exploitation, SIEM & Lab Audits`);
            document.querySelector('section:nth-of-type(1)').scrollIntoView({ behavior: 'smooth' });
        } 
        else if (cleanCmd === '/skills' || cleanCmd === 'skills') {
            printTerminalLine(`LOADING SKILLS MATRIX DATA...
  - [SIMULATED_DEPLOYMENT] Wazuh SIEM, AD Lab Audit, Cowrie Honeypots, ELK Stack Configuration
  - [SIMULATED_LAB_TESTED] Penetration Testing & Exploitation (HTB, CTF platforms)
  - [SECURE_DEVELOPMENT] Cryptography & E2EE Design, OWASP Top 10 & DAST Audit
  - [CODE_AUTOMATION] Automation & Scripting (Bash & Python)`);
            document.querySelector('section:nth-of-type(2)').scrollIntoView({ behavior: 'smooth' });
        } 
        else if (cleanCmd === '/exp' || cleanCmd === 'exp') {
            printTerminalLine(`RETRIEVING INTERNSHIP RECORD...
  - Location: PT Aplikanusa Lintasarta
  - Role: Cyber Intelligence Officer
  - Supervisor: Hendra Nuryuliansyah
  - Period: 3 Feb 2025 - 3 Feb 2026
  - Focus: AD Safe Lab, Wazuh, ELK Stack, Honeypots (Cowrie) intrusion tracking`);
            document.querySelector('section:nth-of-type(3)').scrollIntoView({ behavior: 'smooth' });
        } 
        else if (cleanCmd === '/projects' || cleanCmd === 'projects') {
            printTerminalLine(`LOADING PORTFOLIO PROJECTS...
  - [01] WAZUH_SIEM: Centralized monitoring via Docker containers in WSL2.
  - [02] SECUREVAULT: End-to-End Encrypted Zero-Knowledge cloud storage.
         Features client-side cryptography, digital signature login, 2FA,
         and has passed 32 DAST scan scenarios mapping to OWASP Top 10:2025.`);
            document.querySelector('section:nth-of-type(4)').scrollIntoView({ behavior: 'smooth' });
        } 
        else if (cleanCmd === '/certs' || cleanCmd === 'certs') {
            printTerminalLine(`RETRIEVING CERTIFICATIONS & RECOGNITIONS...
  - Professional Cert: Cisco Cyber Threat Management (CERT003783)
  - E-Sports Honors: Participant at Rector Cup 2023 Mobile Legends`);
            document.querySelector('section:nth-of-type(5)').scrollIntoView({ behavior: 'smooth' });
        }
        else if (cleanCmd === '/activities' || cleanCmd === 'activities') {
            printTerminalLine(`RETRIEVING STUDENT ACTIVITIES & VOLUNTEER LOGS...
  - Tech/Career Seminars: Bank BRI IaC implementation, OOP fundamentals, Blockchain fundamentals, Danamon Career Day
  - Volunteering: Greener Day (TFI), Autoimun @Mabes TNIAL, Anti-Bullying (KAPAK), Pengecatan Trotoar`);
            document.querySelector('section:nth-of-type(6)').scrollIntoView({ behavior: 'smooth' });
        }
        else if (cleanCmd === '/contact' || cleanCmd === 'contact') {
            printTerminalLine(`ESTABLISHING OUTBOUND Sockets...
  - Personal Email: <a href="mailto:d.rabihni@gmail.com" class="text-highlight">d.rabihni@gmail.com</a>
  - Academic Email: <a href="mailto:didik.rabihni@binus.ac.id" class="text-highlight">didik.rabihni@binus.ac.id</a>
  - Phone socket: <a href="tel:+6281213304147" class="text-highlight">+62 812-1330-4147</a>
  - LinkedIn port: <a href="https://www.linkedin.com/in/didik-rabihni-3a0600252" target="_blank" class="text-highlight">LinkedIn Profile</a>`);
        } 
        else if (cleanCmd === '/clear' || cleanCmd === 'clear') {
            terminalOutput.innerHTML = '';
            printTerminalLine("Console logs cleared. Ready.");
        } 
        else if (cleanCmd === '/matrix' || cleanCmd === 'matrix') {
            printTerminalLine("Warning: Matrix rain cycle speed boosted.");
            clearInterval(matrixInterval);
            matrixInterval = setInterval(drawMatrixRain, 15);
            setTimeout(() => {
                clearInterval(matrixInterval);
                matrixInterval = setInterval(drawMatrixRain, 30);
            }, 3000);
        }
        else if (cleanCmd.includes('hack') || cleanCmd.includes('nmap') || cleanCmd.includes('exploit')) {
            printTerminalLine("SIMULATING PENETRATION SEQUENCE...", 'output-line text-muted');
            playSynthBeep(300, 'sawtooth', 0.4, 0.1);
            setTimeout(() => printTerminalLine("[*] Scanning targets for vulnerabilities..."), 150);
            setTimeout(() => printTerminalLine("[*] Active Directory host response detected on 10.0.12.55"), 400);
            setTimeout(() => printTerminalLine("[+] Found weak Kerberoasting accounts: krbtgt"), 700);
            setTimeout(() => printTerminalLine("WARNING: SIEM agent Wazuh detected intrusion. Terminating shell session..."), 1000);
            setTimeout(() => playWarning(), 1050);
        }
        else {
            printTerminalLine(`Command not recognized: "${cmdText}". Type <span class="text-highlight">/help</span> for available commands.`, 'error-resp');
            playWarning();
        }
    }

    terminalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cmd = terminalInput.value;
        processCommand(cmd);
        terminalInput.value = '';
    });

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') {
            playSynthBeep(1800, 'triangle', 0.015, 0.015);
        }
    });

    shortcutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const cmd = btn.getAttribute('data-cmd');
            processCommand(cmd);
        });
    });

    terminalBody.addEventListener('click', (e) => {
        e.stopPropagation();
        terminalInput.focus();
    });
});
