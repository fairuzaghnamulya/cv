// --- FORCE SCROLL TO TOP ON REFRESH ---
// Uncomment the line below to force the page to scroll to the top every time it is refreshed.
history.scrollRestoration = 'manual';
// --- END ---

document.addEventListener('DOMContentLoaded', () => {
    // Script by Fairuz Aghna Mulya
    
    // Typing animation
    const typingTextElement = document.getElementById('typing-text');
    const words = [
      "Full-Stack Game Developer",
      "Creative Front-End Engineer",
      "UI/UX Design Specialist",
      "3D Interaction Developer",
      "Digital Product Designer",
      "Illustration & Graphic Designer",
      "Software Engineer for Games",
      "Interactive Systems Architect",
      "Realtime Graphics Engineer",
      "Visual Storytelling Expert"
    ];

    let wordIndex = 0, charIndex = 0, isDeleting = false;
    
    function type() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            typingTextElement.textContent = currentWord.substring(0, charIndex--);
            if (charIndex < 0) { 
                isDeleting = false; 
                wordIndex = (wordIndex + 1) % words.length; 
            }
        } else {
            typingTextElement.textContent = currentWord.substring(0, charIndex++);
            if (charIndex > currentWord.length) { 
                isDeleting = true; 
                setTimeout(type, 2000); 
                return; 
            }
        }
        setTimeout(type, isDeleting ? 75 : 150);
    }
    setTimeout(type, 500);

    // Intersection Observer for reveal animations and counters
    const observer = new IntersectionObserver(async (entries, observerInstance) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                const target = entry.target;
                target.classList.add('visible');

                // If the visible element is the stats section, fetch, update, and then animate
                if (target.id === 'animated-stats') {
                    try {
                        // Fetch Projects Page
                        const projectResponse = await fetch('pages/projects/project.html');
                        const projectHTML = await projectResponse.text();
                        const projectDoc = new DOMParser().parseFromString(projectHTML, 'text/html');
                        const projectCount = projectDoc.querySelectorAll('.interactive-card').length;

                        // Fetch Certificates Page
                        const certResponse = await fetch('pages/certificate/certificate.html');
                        const certHTML = await certResponse.text();
                        const certDoc = new DOMParser().parseFromString(certHTML, 'text/html');
                        const certCount = certDoc.querySelectorAll('.interactive-card').length;

                        // Update data-target attributes
                        const projectCounter = target.querySelector('.project-counter');
                        const certCounter = target.querySelector('.cert-counter');

                        if (projectCounter) projectCounter.dataset.target = projectCount;
                        if (certCounter) certCounter.dataset.target = certCount;

                    } catch (error) {
                        console.error('Failed to fetch dynamic stats:', error);
                    }
                }
                
                // Handle counter animations for all stat-counters within the revealed section
                const counters = target.querySelectorAll('.stat-counter');
                counters.forEach(counter => {
                    if (counter.animated) return;
                    counter.animated = true;
                    
                    const targetValue = +counter.dataset.target;
                    let current = 0;
                    // Calculate increment dynamically, ensuring it's at least 1
                    const increment = Math.max(1, Math.ceil(targetValue / 100));
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < targetValue) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = targetValue;
                        }
                    };
                    
                    updateCounter();
                });

                // We've handled this entry, so we can unobserve it
                observerInstance.unobserve(target);
            }
        }
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Staggered animation for skill cards
    document.querySelectorAll('.skill-card').forEach((card, index) => {
        card.style.setProperty('--delay', `${index * 100}ms`);
    });
    
    // Modal functionality
    const modal = document.getElementById('modal');
    const modalContent = modal.querySelector('.modal-content');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTechContainer = document.getElementById('modal-tech-container');
    const modalIssuerContainer = document.getElementById('modal-issuer-container');
    const modalDownloadBtn = document.getElementById('modal-download-btn');

    // Open modal handler
    document.querySelectorAll('.open-modal-btn').forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.interactive-card');
            const modalType = card.dataset.modalType;

            modalImg.src = card.dataset.img;
            modalTitle.textContent = card.dataset.title;
            modalDesc.textContent = card.dataset.desc || '';

            if (modalType === 'project') {
                modalTechContainer.classList.remove('hidden');
                modalIssuerContainer.classList.add('hidden');
                modalDownloadBtn.classList.add('hidden');
                
                modalTechContainer.innerHTML = '';
                card.dataset.tech.split(',').forEach(tech => {
                    const tag = document.createElement('span');
                    tag.className = 'bg-blue-500/20 text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full';
                    tag.textContent = tech.trim();
                    modalTechContainer.appendChild(tag);
                });
            } else if (modalType === 'certificate') {
                modalTechContainer.classList.add('hidden');
                modalIssuerContainer.classList.remove('hidden');
                
                modalIssuerContainer.innerHTML = `${card.dataset.issuer}, <span>${card.dataset.year}</span>`;
                
                const pdfUrl = card.dataset.pdfUrl;
                if (pdfUrl && pdfUrl !== '#') {
                    modalDownloadBtn.href = pdfUrl;
                    modalDownloadBtn.classList.remove('hidden');
                } else {
                    modalDownloadBtn.classList.add('hidden');
                }
            }

            modal.classList.remove('invisible', 'opacity-0');
            modalContent.classList.add('scale-100');
        });
    });

    // Close modal
    const closeModal = () => {
        modal.classList.add('invisible', 'opacity-0');
        modalContent.classList.remove('scale-100');
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { 
        if (e.target === modal) closeModal(); 
    });

    // 3D card effect
    document.querySelectorAll('.interactive-card').forEach(card => {
        const inner = card.querySelector('.card-inner');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            inner.style.transform = 'none';
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent page reload

        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch(contactForm.action, {
                method: contactForm.method,
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                formSuccess.classList.remove('hidden');
                contactForm.reset();
                setTimeout(() => formSuccess.classList.add('hidden'), 4000);
            } else {
                alert("Terjadi kesalahan, coba lagi.");
            }
        } catch (error) {
            alert("Terjadi kesalahan, coba lagi.");
        }
    });

    // Page transition logic
    document.body.classList.remove('is-entering');

    const pageLinks = document.querySelectorAll('a[href="pages/projects/project.html"], a[href="pages/certificate/certificate.html"]');
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const destination = this.href;
            document.body.classList.add('is-leaving');
            setTimeout(() => {
                window.location.href = destination;
            }, 400);
        });
    });

    // Contact form character counter
    const messageArea = document.querySelector('textarea[name="message"]');
    const charCounter = document.getElementById('char-counter');
    const maxLength = 250;

    if (messageArea && charCounter) {
        messageArea.addEventListener('input', () => {
            const currentLength = messageArea.value.length;
            charCounter.textContent = `${currentLength} / ${maxLength}`;
        });
    }

    // Randomize profile picture
    const profilePic = document.getElementById('profile-pic');
    if (profilePic) {
        const images = ['./assets/img/profile.jpg', './assets/img/profile.jpeg'];
        const randomIndex = Math.floor(Math.random() * images.length);
        profilePic.src = images[randomIndex];
    }
});

const snakeGame = {
    canvas: null,
    context: null,
    modal: null,
    closeBtn: null,
    scoreEl: null,
    grid: 20,
    loopId: null,
    score: 0,
    player: null,
    food: null,
    isInitialized: false,
    gameSpeed: 8, // Higher number = slower game
    frameCount: 0,

    init() {
        if (this.isInitialized) return;
        this.modal = document.getElementById('game-modal');
        this.closeBtn = document.getElementById('game-modal-close');
        this.canvas = document.getElementById('game-canvas');
        this.context = this.canvas.getContext('2d');
        this.scoreEl = document.getElementById('score');

        this.closeBtn.addEventListener('click', () => this.stop());
        this.isInitialized = true;
    },

    reset() {
        this.score = 0;
        this.updateScore();
        this.player = {
            x: 10 * this.grid,
            y: 10 * this.grid,
            dx: this.grid,
            dy: 0,
            cells: [],
            maxCells: 4
        };
        this.placeFood();
    },

    placeFood() {
        this.food = {
            x: Math.floor(Math.random() * (this.canvas.width / this.grid)) * this.grid,
            y: Math.floor(Math.random() * (this.canvas.height / this.grid)) * this.grid
        };
    },

    updateScore() {
        this.scoreEl.textContent = this.score;
    },

    start() {
        this.init();
        this.reset();
        this.modal.classList.remove('opacity-0', 'invisible');
        document.addEventListener('keydown', this.handleInput.bind(this));
        this.loopId = requestAnimationFrame(this.loop.bind(this));
    },

    stop() {
        this.modal.classList.add('opacity-0', 'invisible');
        document.removeEventListener('keydown', this.handleInput.bind(this));
        cancelAnimationFrame(this.loopId);
        this.loopId = null;
    },

    handleInput(e) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }

        if (e.key === 'ArrowLeft' && this.player.dx === 0) {
            this.player.dx = -this.grid; this.player.dy = 0;
        } else if (e.key === 'ArrowUp' && this.player.dy === 0) {
            this.player.dy = -this.grid; this.player.dx = 0;
        } else if (e.key === 'ArrowRight' && this.player.dx === 0) {
            this.player.dx = this.grid; this.player.dy = 0;
        } else if (e.key === 'ArrowDown' && this.player.dy === 0) {
            this.player.dy = this.grid; this.player.dx = 0;
        }
    },

    loop() {
        this.loopId = requestAnimationFrame(this.loop.bind(this));

        if (++this.frameCount < this.gameSpeed) {
            return;
        }
        this.frameCount = 0;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.player.x += this.player.dx;
        this.player.y += this.player.dy;

        if (this.player.x < 0) this.player.x = this.canvas.width - this.grid;
        else if (this.player.x >= this.canvas.width) this.player.x = 0;
        if (this.player.y < 0) this.player.y = this.canvas.height - this.grid;
        else if (this.player.y >= this.canvas.height) this.player.y = 0;

        this.player.cells.unshift({ x: this.player.x, y: this.player.y });
        if (this.player.cells.length > this.player.maxCells) {
            this.player.cells.pop();
        }

        this.context.fillStyle = '#f9e2af'; // Food color
        this.context.fillRect(this.food.x, this.food.y, this.grid - 1, this.grid - 1);

        this.context.fillStyle = '#a6e3a1'; // Snake color
        this.player.cells.forEach((cell, index) => {
            this.context.fillRect(cell.x, cell.y, this.grid - 1, this.grid - 1);
            if (cell.x === this.food.x && cell.y === this.food.y) {
                this.player.maxCells++;
                this.score++;
                this.updateScore();
                this.placeFood();
            }
            for (let i = index + 1; i < this.player.cells.length; i++) {
                if (cell.x === this.player.cells[i].x && cell.y === this.player.cells[i].y) {
                    this.reset();
                }
            }
        });
    }
};

// Konami Code Listener
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
window.addEventListener('keydown', (e) => {
    // Only proceed if konamiIndex is within the bounds of konamiCode
    if (konamiIndex < konamiCode.length && e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase()) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            konamiIndex = 0; // Reset for future use
            snakeGame.start(); // Trigger the game
        }
    } else {
        // If the key doesn't match or konamiIndex is out of bounds, reset
        konamiIndex = 0;
    }
});

// --- MUSIC PLAYER EASTER EGG ---
document.addEventListener('DOMContentLoaded', () => {
    const contactMessageInput = document.querySelector('textarea[name="message"]');
    const musicPlayerOverlay = document.getElementById('music-player-overlay');
    const musicPlayerContainer = document.getElementById('music-player-container');
    const musicCloseButton = document.getElementById('music-player-close');
    const audioPlayer = document.createElement('audio');
    audioPlayer.id = 'audio-player';
    const playlistItems = document.querySelectorAll('#playlist li');
    
    
    
    // Player elements
    const playPauseBtn = document.getElementById('player-btn-play-pause');
    const prevBtn = document.getElementById('player-btn-prev');
    const nextBtn = document.getElementById('player-btn-next');
    const shuffleBtn = document.getElementById('player-btn-shuffle');
    const loopBtn = document.getElementById('player-btn-loop');
    const progressBar = document.querySelector('.progress-bar');
    const progress = document.querySelector('.progress');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const currentSongTitle = document.getElementById('current-song-title');
    const currentSongArtist = document.getElementById('current-song-artist');
    const searchBox = document.getElementById('music-search');
    const shuffleStatus = document.getElementById('shuffle-status');
    const loopStatus = document.getElementById('loop-status');

    // Player state
    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffle = false;
    let isLoop = false;

    // Add audio player to DOM
    if (playPauseBtn) {
        playPauseBtn.parentNode.insertBefore(audioPlayer, playPauseBtn.nextSibling);
    }

    const openMusicPlayer = () => {
        document.body.classList.add('modal-open');
        if (musicPlayerOverlay) {
            musicPlayerOverlay.classList.remove('invisible', 'opacity-0');
        }
        if (musicPlayerContainer) {
            musicPlayerContainer.classList.add('scale-100');
        }
    };

    const closeMusicPlayer = () => {
        document.body.classList.remove('modal-open');
        if (musicPlayerOverlay) {
            musicPlayerOverlay.classList.add('invisible', 'opacity-0');
        }
        if (musicPlayerContainer) {
            musicPlayerContainer.classList.remove('scale-100');
        }
        if (audioPlayer) {
            audioPlayer.pause();
        }
        isPlaying = false;
        updatePlayPauseButton();
    };

    

    // Show player when typing the magic words
    if (contactMessageInput) {
        console.log('Contact message input found');
        contactMessageInput.addEventListener('input', (e) => {
            console.log('Input value:', e.target.value);
            if (e.target.value.toLowerCase().includes('my playlist')) {
                console.log('Opening music player');
                openMusicPlayer();
                e.target.value = ''; // Clear the textarea
            }
        });
    } else {
        console.log('Contact message input not found');
    }

    // Close player listeners
    if (musicCloseButton) {
        musicCloseButton.addEventListener('click', closeMusicPlayer);
    }
    if (musicPlayerOverlay) {
        musicPlayerOverlay.addEventListener('click', (e) => { 
            if (e.target === musicPlayerOverlay) closeMusicPlayer(); 
        });
    }

    

    // Auto-resize textarea
    const resizeTextarea = (textarea) => {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
    };

    // Format timestamp
    const formatTime = () => {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Send AI chat message
    const sendAIChatMessage = () => {
        if (!aiChatInput || !aiChatMessages) return;
        
        const message = aiChatInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'message user-message';
        userMessageDiv.innerHTML = `
            <div class="bubble">
                <p>${message}</p>
                <div class="timestamp">${formatTime()}</div>
            </div>
        `;
        aiChatMessages.appendChild(userMessageDiv);
        
        // Clear input and reset height
        aiChatInput.value = '';
        aiChatInput.style.height = 'auto';
        
        // Scroll to bottom
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
        
        // Show typing indicator
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.classList.remove('hidden');
            aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
        }
        
        // Simulate AI response (since we don't have a real API key)
        setTimeout(() => {
            // Hide typing indicator
            if (typingIndicator) {
                typingIndicator.classList.add('hidden');
            }
            
            const aiResponseDiv = document.createElement('div');
            aiResponseDiv.className = 'message assistant-message';
            
            // Custom responses that mention Fairuz Aghna Mulya as the creator in 2025
            let response;
            if (message.toLowerCase().includes('who are you') || message.toLowerCase().includes('what are you')) {
                response = "I'm an AI assistant created by Fairuz Aghna Mulya in 2025. I'm designed to help answer questions and provide information.";
            } else if (message.toLowerCase().includes('who created you') || message.toLowerCase().includes('who made you')) {
                response = "I was created by Fairuz Aghna Mulya in 2025 as part of his portfolio website. He's a creative developer with a passion for interactive experiences.";
            } else if (message.toLowerCase().includes('when were you created') || message.toLowerCase().includes('when were you made')) {
                response = "I was created in 2025 by Fairuz Aghna Mulya. He developed me as an easter egg for his portfolio website.";
            } else if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
                response = "Hello! I'm an AI assistant created by Fairuz Aghna Mulya in 2025. How can I help you today?";
            } else if (message.toLowerCase().includes('thank')) {
                response = "You're welcome! I'm here to help. Is there anything else you'd like to know?";
            } else if (message.toLowerCase().includes('name')) {
                response = "I'm an AI assistant created by Fairuz Aghna Mulya in 2025. You can call me Foresight!";
            } else if (message.toLowerCase().includes('portfolio') || message.toLowerCase().includes('website')) {
                response = "This portfolio website was created by Fairuz Aghna Mulya in 2025. It showcases his work as a creative developer and game designer.";
            } else {
                // Default responses
                const responses = [
                    "That's an interesting question! As an AI created by Fairuz Aghna Mulya in 2025, I'm designed to help with various inquiries.",
                    "I was programmed by Fairuz Aghna Mulya in 2025 to assist visitors to his portfolio website. How else can I help?",
                    "Thanks for your message! I'm an AI assistant developed by Fairuz Aghna Mulya as part of his 2025 portfolio project.",
                    "I appreciate your interest! Fairuz Aghna Mulya created me in 2025 to enhance the interactive experience on his portfolio site.",
                    "As an AI assistant from 2025 created by Fairuz Aghna Mulya, I'm here to provide helpful responses to your questions."
                ];
                response = responses[Math.floor(Math.random() * responses.length)];
            }
            
            aiResponseDiv.innerHTML = `
                <div class="bubble">
                    <p>${response}</p>
                    <div class="timestamp">${formatTime()}</div>
                </div>
            `;
            aiChatMessages.appendChild(aiResponseDiv);
            
            // Scroll to bottom
            aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
        }, 1500);
    };

    if (aiChatSendButton) {
        aiChatSendButton.addEventListener('click', sendAIChatMessage);
    }
    
    if (aiChatInput) {
        aiChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendAIChatMessage();
            }
        });
        
        aiChatInput.addEventListener('input', () => {
            resizeTextarea(aiChatInput);
            
            // Enable/disable send button
            if (aiChatSendButton) {
                aiChatSendButton.disabled = !aiChatInput.value.trim();
            }
        });
        
        // Initial state of send button
        aiChatSendButton.disabled = true;
    }

    // Update play/pause button icon
    const updatePlayPauseButton = () => {
        if (!playPauseBtn) return;
        const icon = playPauseBtn.querySelector('i');
        if (icon) {
            if (isPlaying) {
                icon.className = 'fas fa-pause';
            } else {
                icon.className = 'fas fa-play';
            }
        }
        
        // Update progress indicator
        if (progress) {
            const progressBarContainer = progress.parentElement;
            if (isPlaying) {
                progressBarContainer.classList.add('show-indicator');
            } else {
                progressBarContainer.classList.remove('show-indicator');
            }
        }
    };

    // Update mode indicators
    const updateModeIndicators = () => {
        // Update shuffle status
        if (shuffleStatus) {
            shuffleStatus.textContent = isShuffle ? 'On' : 'Off';
            if (isShuffle) {
                shuffleStatus.classList.add('status-active');
            } else {
                shuffleStatus.classList.remove('status-active');
            }
        }
        
        // Update loop status
        if (loopStatus) {
            loopStatus.textContent = isLoop ? 'On' : 'Off';
            if (isLoop) {
                loopStatus.classList.add('status-active');
            } else {
                loopStatus.classList.remove('status-active');
            }
        }
        
        // Update button active states
        if (shuffleBtn) {
            if (isShuffle) {
                shuffleBtn.classList.add('active');
            } else {
                shuffleBtn.classList.remove('active');
            }
        }
        
        if (loopBtn) {
            if (isLoop) {
                loopBtn.classList.add('active');
            } else {
                loopBtn.classList.remove('active');
            }
        }
    };

    // Format time (seconds to mm:ss)
    const formatTimeAudio = (seconds) => {
        if (isNaN(seconds)) return "0:00";
        
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Update progress bar
    const updateProgress = () => {
        if (!audioPlayer || !progress) return;
        const { duration, currentTime } = audioPlayer;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        
        // Update time display
        if (currentTimeEl) currentTimeEl.textContent = formatTimeAudio(currentTime);
        if (totalTimeEl) totalTimeEl.textContent = formatTimeAudio(duration);
        
        // Update position indicator
        const indicator = progress.querySelector('.current-position-indicator');
        if (indicator) {
            if (isPlaying) {
                progress.parentElement.classList.add('show-indicator');
            } else {
                progress.parentElement.classList.remove('show-indicator');
            }
        }
    };

    // Set progress bar
    const setProgress = (e) => {
        if (!progressBar || !audioPlayer) return;
        const width = progressBar.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        
        audioPlayer.currentTime = (clickX / width) * duration;
    };

    // Load and play song
    const loadSong = (index) => {
        if (!playlistItems[index]) return;
        const song = playlistItems[index];
        const songSrc = song.getAttribute('data-src');
        const songTitle = song.getAttribute('data-title');
        const songArtist = song.getAttribute('data-artist');
        
        if (audioPlayer) {
            audioPlayer.src = songSrc;
        }
        if (currentSongTitle) {
            currentSongTitle.textContent = songTitle || 'Unknown Title';
        }
        if (currentSongArtist) {
            currentSongArtist.textContent = songArtist || 'Unknown Artist';
        }
        
        // Update playing class
        playlistItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('playing');
            } else {
                item.classList.remove('playing');
            }
        });
        
        // Reset progress bar when loading new song
        if (progress) {
            progress.style.width = '0%';
            if (currentTimeEl) currentTimeEl.textContent = '0:00';
        }
        
        currentSongIndex = index;
    };

    // Play song
    const playSong = () => {
        if (audioPlayer) {
            audioPlayer.play();
        }
        isPlaying = true;
        updatePlayPauseButton();
    };

    // Pause song
    const pauseSong = () => {
        if (audioPlayer) {
            audioPlayer.pause();
        }
        isPlaying = false;
        updatePlayPauseButton();
    };

    // Previous song
    const prevSong = () => {
        if (isShuffle) {
            currentSongIndex = Math.floor(Math.random() * playlistItems.length);
        } else {
            currentSongIndex--;
            if (currentSongIndex < 0) {
                currentSongIndex = playlistItems.length - 1;
            }
        }
        loadSong(currentSongIndex);
        playSong();
    };

    // Next song
    const nextSong = () => {
        if (isShuffle) {
            currentSongIndex = Math.floor(Math.random() * playlistItems.length);
        } else {
            currentSongIndex++;
            if (currentSongIndex > playlistItems.length - 1) {
                currentSongIndex = 0;
            }
        }
        loadSong(currentSongIndex);
        playSong();
    };

    // Toggle shuffle
    const toggleShuffle = () => {
        isShuffle = !isShuffle;
        updateModeIndicators();
    };

    // Toggle loop
    const toggleLoop = () => {
        isLoop = !isLoop;
        updateModeIndicators();
    };

    // Filter playlist based on search
    const filterPlaylist = () => {
        if (!searchBox) return;
        const searchTerm = searchBox.value.toLowerCase();
        playlistItems.forEach(item => {
            const title = item.getAttribute('data-title').toLowerCase();
            const artist = item.getAttribute('data-artist').toLowerCase();
            if (title.includes(searchTerm) || artist.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Ensure playlist container maintains fixed height
        const playlistContainer = document.querySelector('.playlist-container');
        if (playlistContainer) {
            // Force reflow to maintain consistent height
            playlistContainer.style.height = '16rem';
        }
    };

    // Event listeners
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (isPlaying) {
                pauseSong();
            } else {
                if (audioPlayer && audioPlayer.src) {
                    playSong();
                } else {
                    // If no song is loaded, load and play the first song
                    loadSong(0);
                    playSong();
                }
            }
        });
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSong);
    if (nextBtn) nextBtn.addEventListener('click', nextSong);
    if (shuffleBtn) shuffleBtn.addEventListener('click', toggleShuffle);
    if (loopBtn) loopBtn.addEventListener('click', toggleLoop);
    
    if (progressBar) progressBar.addEventListener('click', setProgress);
    
    if (audioPlayer) {
        audioPlayer.addEventListener('timeupdate', updateProgress);
        audioPlayer.addEventListener('ended', () => {
            if (isLoop) {
                // Replay the same song when loop is enabled
                playSong();
            } else {
                // Move to next song when loop is disabled
                nextSong();
            }
        });
    }
    
    if (searchBox) searchBox.addEventListener('input', filterPlaylist);

    // Handle playlist clicks
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            loadSong(index);
            playSong();
        });
    });
    
    // Initialize mode indicators
    updateModeIndicators();
});