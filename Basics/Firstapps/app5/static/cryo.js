document.addEventListener('DOMContentLoaded', function () {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (!cursor || !cursorFollower) return;

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        // Add a slight delay to follower for smooth effect
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 50);
    });

    // Handle cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .btn, .card, .project-card, .interest-card, .social-icon, input, textarea, select, .nav-link, .theme-toggle');

    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorFollower.style.width = '32px';
            cursorFollower.style.height = '32px';
            cursorFollower.style.borderWidth = '2px';
            cursorFollower.style.opacity = '0.5';
        });

        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.width = '24px';
            cursorFollower.style.height = '24px';
            cursorFollower.style.borderWidth = '1px';
            cursorFollower.style.opacity = '1';
        });
    });

    // Handle cursor visibility when leaving/entering the window
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
    });

    // Typewriter effect
    const typewriterText = document.getElementById('typewriter-text');
    const phrases = [
        'Explore the dark secrets',
        'Learn about information warfare',
        'Beware of social engineering',
        'Learn OSINT from free sources',
        'Explore our courses',
        'Become a framework member',
        'Contribute to nature',
        'Safeguard Earth',
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 70;

    function typeWriter() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typewriterText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typewriterText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 70;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 500; // Pause at the end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 300; // Pause before typing next phrase
        }

        setTimeout(typeWriter, typingSpeed);
    }

    typeWriter();

    // Animate stats counter
    const stats = document.querySelectorAll('.stat-number');

    function animateStats() {
        const stats = document.querySelectorAll('.stat-number');

        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            let current = 0;
            const duration = 2000; // Animation duration in milliseconds
            const frameDuration = 1000 / 60; // 60fps
            const totalFrames = Math.round(duration / frameDuration);
            let frame = 0;

            // Use requestAnimationFrame for smoother animation
            function animate() {
                frame++;
                // Use easeOutQuad easing function for a natural slowdown effect
                const progress = frame / totalFrames;
                const easing = 1 - Math.pow(1 - progress, 3); // Cubic ease out
                current = Math.round(easing * target);

                // Format the number with commas for thousands
                stat.textContent = current.toLocaleString();

                if (frame < totalFrames) {
                    requestAnimationFrame(animate);
                } else {
                    stat.textContent = target.toLocaleString();
                }
            }

            // Start the animation
            requestAnimationFrame(animate);
        });
    }

    // Initialize the animation when the stats section is in view
    function initStatsAnimation() {
        const statsSection = document.querySelector('.about-stats');
        if (!statsSection) return;

        // Use Intersection Observer to trigger animation when scrolled into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, { threshold: 0.2 }); // Trigger when 20% of the element is visible

        observer.observe(statsSection);
    }

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function () {
        initStatsAnimation();
    });

    // Animate skill bars
    const skillLevels = document.querySelectorAll('.skill-level');

    function animateSkillBars() {
        skillLevels.forEach(skill => {
            const level = skill.getAttribute('data-level') + '%';
            skill.style.width = level;
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'about') {
                    animateStats();
                } else if (entry.target.id === 'skills') {
                    animateSkillBars();
                }
            }
        });
    }, observerOptions);

    observer.observe(document.getElementById('about'));
    observer.observe(document.getElementById('skills'));

    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    themeToggle.addEventListener('click', function () {
        if (body.getAttribute('data-theme') === 'light') {
            body.removeAttribute('data-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            body.setAttribute('data-theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('header');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Form submission handling
    const contactForm = document.querySelector('.contact-form form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }

            // Here you would typically send the form data to a server
            // For demo purposes, we'll just show a success message

            // Reset form
            contactForm.reset();

            // Show success message
            alert('Message sent successfully! (Demo only)');
        });
    }

    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.project-card, .skill-item, .interest-category');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        revealObserver.observe(element);
    });

    // Terminal typing effect
    const terminalCommands = document.querySelectorAll('.terminal .command:not(.blink)');

    terminalCommands.forEach(command => {
        const text = command.textContent;
        command.textContent = '';

        let i = 0;
        const typeCommand = () => {
            if (i < text.length) {
                command.textContent += text.charAt(i);
                i++;
                setTimeout(typeCommand, Math.random() * 50 + 50);
            }
        };

        setTimeout(typeCommand, 500);
    });

    // Mouse parallax effect for hero section
    const heroSection = document.getElementById('hero');

    heroSection.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        const depth = 20;
        const terminal = document.querySelector('.hero-image .terminal');

        if (terminal) {
            terminal.style.transform = `perspective(1000px) rotateY(${-mouseX * depth}deg) rotateX(${mouseY * depth}deg)`;
        }
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.createElement('div');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';

    const nav = document.querySelector('nav');

    // Only add mobile menu for smaller screens
    if (window.innerWidth <= 768) {
        header.querySelector('.container').insertBefore(mobileMenuToggle, nav);

        mobileMenuToggle.addEventListener('click', function () {
            nav.classList.toggle('active');

            if (nav.classList.contains('active')) {
                mobileMenuToggle.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });

        // Close mobile menu when clicking a nav link
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function () {
                nav.classList.remove('active');
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }

    // Add CSS for mobile menu
    if (window.innerWidth <= 768) {
        const style = document.createElement('style');
        style.textContent = `
            .mobile-menu-toggle {
                display: block;
                font-size: 1.5rem;
                cursor: pointer;
                color: #fff;
                z-index: 1001;
            }

            nav {
                position: fixed;
                top: 0;
                right: -100%;
                width: 70%;
                height: 100vh;
                background-color: rgba(15, 15, 18, 0.95);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                transition: right 0.3s ease;
                z-index: 1000;
            }

            nav.active {
                right: 0;
            }

            nav ul {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 2rem;
            }

            nav ul li {
                margin: 0;
            }

            nav ul li a {
                font-size: 1.2rem;
            }
        `;
        document.head.appendChild(style);
    }

    // Preloader
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="logo-text">Framework<span class="accent">-221E</span></div><br>
            <p class="description-text">Build : 0.1</p>
            <div class="loading-bar">
                <div class="loading-progress"></div>
            </div>
        </div>
    `;
    document.body.appendChild(preloader);

    // Add CSS for preloader
    const preloaderStyle = document.createElement('style');
    preloaderStyle.textContent = `
        .preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--bg-primary);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }

        .preloader-content {
            text-align: center;
        }

        .preloader .logo-text {
            font-family: var(--font-mono);
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 2rem;
            background: linear-gradient(to right, var(--text-primary), var(--accent-primary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .loading-bar {
            width: 200px;
            height: 4px;
            background-color: var(--bg-secondary);
            border-radius: 2px;
            overflow: hidden;
            margin: 0 auto;
        }

        .loading-progress {
            height: 100%;
            width: 0;
            background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
            animation: loading 1.5s ease forwards;
        }

        @keyframes loading {
            0% { width: 0; }
            100% { width: 100%; }
        }
    `;
    document.head.appendChild(preloaderStyle);

    // Hide preloader after loading
    window.addEventListener('load', function () {
        setTimeout(function () {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 1000);
    });
});

// Initialize skill sliders for proper infinite scrolling
function initSkillSliders() {
    const sliders = document.querySelectorAll('.skills-slider');

    sliders.forEach(slider => {
        const track = slider.querySelector('.skills-track');
        const direction = slider.getAttribute('data-direction');

        // Calculate the width of the first set of cards
        const cards = track.querySelectorAll('.skill-card');
        const firstSetCount = cards.length / 2;
        const firstSetWidth = Array.from(cards)
            .slice(0, firstSetCount)
            .reduce((width, card) => {
                return width + card.offsetWidth + parseInt(getComputedStyle(card).marginLeft) +
                    parseInt(getComputedStyle(card).marginRight);
            }, 0);

        // Set the animation keyframes dynamically
        const keyframes = direction === 'left'
            ? `@keyframes scroll-left { 0% { transform: translateX(0); } 100% { transform: translateX(-${firstSetWidth}px); } }`
            : `@keyframes scroll-right { 0% { transform: translateX(-${firstSetWidth}px); } 100% { transform: translateX(0); } }`;

        // Add the keyframes to the document
        const styleSheet = document.createElement('style');
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);
    });
}

// Call this after the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Wait for images to load before initializing sliders
    window.addEventListener('load', initSkillSliders);
});

// Handle interest card flipping
document.addEventListener('DOMContentLoaded', function () {
    // Initialize interest cards
    function initInterestCards() {
        const interestCards = document.querySelectorAll('.interest-card');

        interestCards.forEach(card => {
            card.addEventListener('click', function () {
                // Remove the flipped class from all other cards
                interestCards.forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.classList.remove('flipped');
                    }
                });

                // Toggle the flipped class on the clicked card
                this.classList.toggle('flipped');
            });
        });
    }


    initInterestCards();

    // Animate music visualizers
    const musicCards = document.querySelectorAll('.music-items .interest-item');

    musicCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            const visualizer = this.querySelector('.music-visualizer');

            if (visualizer) {
                visualizer.querySelectorAll('span').forEach(bar => {
                    // Reset animation
                    bar.style.animation = 'none';
                    setTimeout(() => {
                        bar.style.animation = '';
                    }, 10);
                });
            }
        });
    });

    // Add parallax effect to interest cards
    const interestsSection = document.getElementById('interests');

    interestsSection.addEventListener('mousemove', function (e) {
        // Only apply parallax to cards that are NOT flipped
        const cards = document.querySelectorAll('.interest-card:not(.flipped) .interest-card-inner');

        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;

            const offsetX = (e.clientX - cardCenterX) / 30;
            const offsetY = (e.clientY - cardCenterY) / 30;

            card.style.transform = `rotateY(${offsetX}deg) rotateX(${-offsetY}deg)`;
        });
    });

    interestsSection.addEventListener('mouseleave', function () {
        // Reset transform for non-flipped cards only
        const cards = document.querySelectorAll('.interest-card:not(.flipped) .interest-card-inner');

        cards.forEach(card => {
            card.style.transform = 'rotateY(0deg) rotateX(0deg)';
        });
    });
});

function initMusicCard() {
    const musicCard = document.querySelector('.music-card-back');
    if (!musicCard) return;

    const visualizerBars = musicCard.querySelectorAll('.visualizer-bar');
    const playButton = musicCard.querySelector('.spotify-play-button');
    const pauseButton = musicCard.querySelector('.fa-pause');
    const albumCover = musicCard.querySelector('.spotify-album img');

    // Function to randomize visualizer heights
    function randomizeVisualizer() {
        visualizerBars.forEach(bar => {
            // Generate random height between 10% and 90%
            const randomHeight = Math.floor(Math.random() * 80) + 10;
            bar.style.height = `${randomHeight}%`;
        });
    }

    // Initial randomization
    randomizeVisualizer();

    // Set interval for continuous randomization
    let visualizerInterval;

    // Toggle play/pause
    let isPlaying = false;

    function togglePlay() {
        isPlaying = !isPlaying;

        if (isPlaying) {
            // Start visualizer animation
            visualizerInterval = setInterval(randomizeVisualizer, 100);

            // Update UI to show playing state
            playButton.innerHTML = '<i class="fas fa-pause"></i>';
            pauseButton.classList.remove('fa-pause');
            pauseButton.classList.add('fa-play');

            // Add pulsing effect to album
            albumCover.style.animation = 'pulse 1.5s infinite ease-in-out';
        } else {
            // Stop visualizer animation
            clearInterval(visualizerInterval);

            // Reset visualizer bars
            visualizerBars.forEach(bar => {
                bar.style.height = '10%';
            });

            // Update UI to show paused state
            playButton.innerHTML = '<i class="fas fa-play"></i>';
            pauseButton.classList.remove('fa-play');
            pauseButton.classList.add('fa-pause');

            // Remove pulsing effect
            albumCover.style.animation = 'none';
        }
    }

    // Event listeners
    playButton.addEventListener('click', function (e) {
        e.stopPropagation();
        togglePlay();
    });

    pauseButton.addEventListener('click', function (e) {
        e.stopPropagation();
        togglePlay();
    });

    // Add pulse animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
    `;
    document.head.appendChild(style);

    // Clean up when card is flipped back
    const interestCard = musicCard.closest('.interest-card');
    interestCard.addEventListener('click', function () {
        if (!this.classList.contains('flipped') && isPlaying) {
            togglePlay();
        }
    });
}

// Initialize music card when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initMusicCard();
});

// Function to update Altbot follower count
function updateAltbotFollowerCount() {
    // Create a proxy URL to avoid CORS issues
    // You can use a service like allorigins.win or cors-anywhere
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const badgeUrl = 'https://img.shields.io/mastodon/follow/113183205946060973?domain=fuzzies.wtf&style=social';
    const encodedBadgeUrl = encodeURIComponent(badgeUrl);

    fetch(proxyUrl + encodedBadgeUrl)
        .then(response => response.text())
        .then(svgText => {
            // Parse the SVG to extract the follower count
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

            // Find the text element with the follower count
            const textElements = svgDoc.querySelectorAll('text');
            let followerCount = null;

            // Look through all text elements to find the one with the count
            textElements.forEach(element => {
                const content = element.textContent.trim();
                // The follower count typically has "k" for thousands
                if (content.includes('k') || /^\d+$/.test(content)) {
                    followerCount = content;
                }
            });

            if (followerCount) {
                // Update the project stat element with the new count
                const projectCards = document.querySelectorAll('.project-card');
                projectCards.forEach(card => {
                    const titleElement = card.querySelector('h3');
                    if (titleElement && titleElement.textContent.trim() === 'Altbot') {
                        const statElement = card.querySelector('.project-stat:first-child');
                        if (statElement) {
                            statElement.innerHTML = `<i class="fas fa-user-group"></i> ${followerCount}`;
                            console.log('Updated Altbot follower count to:', followerCount);
                        }
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error fetching Altbot follower count:', error);
        });
}

// Update the follower count when the page loads
document.addEventListener('DOMContentLoaded', function () {
    updateAltbotFollowerCount();

    // Optionally, update the count periodically (every hour)
    setInterval(updateAltbotFollowerCount, 3600000);
});

// Terminal Hacker Easter Egg
function createTerminalEasterEgg() {
    const micr0Card = document.querySelector('.micr0Card');
    const takeThereLink = document.querySelector('.take-there-link');

    // Unlink the "Take me there!" link
    takeThereLink.removeAttribute('href');

    let isTerminalActive = false;
    let terminalContainer;

    takeThereLink.addEventListener('click', function (e) {
        toggleTerminal();
    });

    function toggleTerminal() {
        if (isTerminalActive) {
            // Remove terminal
            terminalContainer.remove();
            micr0Card.classList.remove('terminal-active');
            isTerminalActive = false;
        } else {
            // Create terminal
            isTerminalActive = true;
            micr0Card.classList.add('terminal-active');

            // Save original content
            const originalContent = micr0Card.querySelector('.project-content').innerHTML;

            // Create terminal container
            terminalContainer = document.createElement('div');
            terminalContainer.classList.add('terminal-container');

            // Terminal header
            const terminalHeader = document.createElement('div');
            terminalHeader.classList.add('terminal-header');
            terminalHeader.innerHTML = `
                <div class="terminal-buttons">
                    <span class="terminal-close"></span>
                    <span class="terminal-minimize"></span>
                    <span class="terminal-maximize"></span>
                </div>
                <div class="terminal-title">micr0@dev:~</div>
            `;

            // Terminal content
            const terminalContent = document.createElement('div');
            terminalContent.classList.add('terminal-content');

            terminalContainer.appendChild(terminalHeader);
            terminalContainer.appendChild(terminalContent);

            // Replace card content with terminal
            micr0Card.querySelector('.project-content').innerHTML = '';
            micr0Card.querySelector('.project-content').appendChild(terminalContainer);

            // Add close button handler
            terminalHeader.querySelector('.terminal-close').addEventListener('click', function () {
                // Restore original content
                micr0Card.querySelector('.project-content').innerHTML = originalContent;
                micr0Card.classList.remove('terminal-active');
                isTerminalActive = false;
            });

            // Start typing animation
            const commands = [
                { text: "micr0@dev:~ $ ls -la", delay: 100 },
                { text: "total 42drwxr-xr-x  5 micr0 dev  4096 Feb 27 2025 .drwxr-xr-x 22 micr0 dev  4096 Feb 27 2025 ..-rw-r--r--  1 micr0 dev   220 Feb 27 2025 .bash_logout-rw-r--r--  1 micr0 dev  3771 Feb 27 2025 .bashrcdrwx------  2 micr0 dev  4096 Feb 27 2025 .cache-rw-r--r--  1 micr0 dev   807 Feb 27 2025 .profiledrwxr-xr-x  2 micr0 dev  4096 Feb 27 2025 projectsdrwxr-xr-x  2 micr0 dev  4096 Feb 27 2025 secrets", delay: 500 },
                { text: "micr0@dev:~ $ cd secrets", delay: 100 },
                { text: "micr0@dev:~/secrets $ ls -la", delay: 100 },
                { text: "total 16drwxr-xr-x 2 micr0 dev 4096 Feb 27 2025 .drwxr-xr-x 5 micr0 dev 4096 Feb 27 2025 ..-rw-r--r-- 1 micr0 dev  256 Feb 27 2025 easter_egg.txt", delay: 300 },
                { text: "micr0@dev:~/secrets $ cat easter_egg.txt", delay: 100 },
                { text: "Congratulations! You've found the secret terminal easter egg! Press any key to exit...", delay: 200 }
            ];

            let commandIndex = 0;
            let charIndex = 0;

            function typeNextCommand() {
                if (commandIndex >= commands.length) {
                    // Add event listener to exit on key press after all commands
                    document.addEventListener('keydown', exitTerminal, { once: true });
                    return;
                }

                const command = commands[commandIndex];

                if (charIndex === 0) {
                    // Create new line for command
                    const commandLine = document.createElement('div');
                    commandLine.classList.add('command-line');
                    terminalContent.appendChild(commandLine);
                }

                const currentLine = terminalContent.querySelector('.command-line:last-child');

                if (charIndex < command.text.length) {
                    // Type next character
                    if (command.text.substring(charIndex, charIndex + 4) === "") {
                        currentLine.innerHTML += "";
                        charIndex += 4;
                    } else {
                        currentLine.innerHTML += command.text.charAt(charIndex);
                        charIndex++;
                    }

                    // Scroll to bottom
                    terminalContent.scrollTop = terminalContent.scrollHeight;

                    // Schedule next character
                    setTimeout(typeNextCommand, 10);
                } else {
                    // Move to next command
                    charIndex = 0;
                    commandIndex++;

                    // Add response line
                    if (commandIndex < commands.length) {
                        setTimeout(typeNextCommand, command.delay);
                    } else {
                        // All commands completed
                        document.addEventListener('keydown', exitTerminal, { once: true });
                    }
                }
            }

            function exitTerminal() {
                // Restore original content
                micr0Card.querySelector('.project-content').innerHTML = originalContent;
                micr0Card.classList.remove('terminal-active');
                isTerminalActive = false;
            }

            // Start typing
            setTimeout(typeNextCommand, 500);
        }
    }
}

// Initialize terminal easter egg
document.addEventListener('DOMContentLoaded', function () {
    createTerminalEasterEgg();
});

document.addEventListener('DOMContentLoaded', function () {
    const terminalContent = document.querySelector('.terminal-content');
    const typedText = document.querySelector('.typed-text');

    if (!typedText || !terminalContent) return;

    const text = typedText.getAttribute('data-text') || typedText.textContent;
    typedText.textContent = '';

    let charIndex = 0;
    const typingSpeed = 30; // Milliseconds per character

    function typeNextChar() {
        if (charIndex < text.length) {
            typedText.textContent += text.charAt(charIndex);
            charIndex++;

            // Adjust scroll to keep text in view
            terminalContent.scrollTop = terminalContent.scrollHeight;

            // Random typing speed variation for realism
            const randomDelay = typingSpeed + Math.random() * 50;
            setTimeout(typeNextChar, randomDelay);
        }
    }

    // Start typing with a slight delay
    setTimeout(typeNextChar, 500);

    // Add responsive behavior
    function adjustTerminalHeight() {
        const terminal = document.querySelector('.terminal');
        if (!terminal) return;

        // Set a reasonable max-height based on viewport
        const viewportHeight = window.innerHeight;
        const maxHeight = Math.min(500, viewportHeight * 0.6);
        terminal.style.maxHeight = `${maxHeight}px`;
    }

    // Adjust on load and resize
    adjustTerminalHeight();
    window.addEventListener('resize', adjustTerminalHeight);
});

// Digital Fingerprint Tracker
document.addEventListener('DOMContentLoaded', function () {
    // Only initialize if the privacy demo section exists
    if (!document.getElementById('privacy-demo')) return;

    // Initialize the tracker
    const tracker = new DigitalFingerprintTracker();
    tracker.init();
});

class DigitalFingerprintTracker {
    constructor() {
        // DOM elements
        this.trackingBar = document.querySelector('.tracking-bar');
        this.trackingStatus = document.querySelector('.tracking-status');
        this.hintsContainer = document.querySelector('.tracking-hints-container');
        this.revealContainer = document.querySelector('.fingerprint-reveal-container');
        this.revealButton = document.getElementById('reveal-fingerprint');
        this.resultsContainer = document.getElementById('fingerprint-results');

        // Tracking data
        this.data = {
            technical: {},
            behavioral: {
                visitStartTime: new Date(),
                clickCount: 0,
                scrollCount: 0,
                totalTimeSpent: 0,
                mouseDistance: 0,
                mouseSpeed: [],
                scrollPattern: [],
                focusedSections: {},
                copyEvents: 0,
                resizeEvents: 0,
                lastPosition: { x: 0, y: 0 }
            },
            inferred: {}
        };

        // Tracking state
        this.isTracking = true;
        this.progress = 0;
        this.revealThreshold = 70; // % progress before showing reveal button
        this.hints = [
            "I can see you're using <strong>{browserName} {browserVersion}</strong>",
            "Your device appears to be a <strong>{deviceType}</strong>",
            "You're in the <strong>{timeZone}</strong> time zone",
            "Your screen resolution is <strong>{screenWidth}x{screenHeight}</strong>",
            "I notice you're interested in the <strong>{focusedSection}</strong> section",
            "Your mouse movements suggest <strong>{mousePattern}</strong>",
            "You seem to prefer <strong>{scrollStyle}</strong> scrolling",
            "Your system language is set to <strong>{language}</strong>",
            "You've spent <strong>{timeOnPage}</strong> on this page so far"
        ];
        this.shownHints = [];
        this.lastMouseMove = 0;
        this.lastScrollTime = 0;
        this.visibilityEvents = 0;
    }

    init() {
        // Collect initial technical data
        this.collectTechnicalData();

        // Set up event listeners
        this.setupEventListeners();

        // Start progress simulation
        this.simulateProgress();

        // Show first hint after a delay
        setTimeout(() => this.showRandomHint(), 3000);

        // Set up reveal button
        this.revealButton.addEventListener('click', () => this.revealFingerprint());
    }

    collectTechnicalData() {
        const ua = navigator.userAgent;
        const browserData = this.detectBrowser(ua);

        this.data.technical = {
            browser: browserData.browser,
            browserVersion: browserData.version,
            os: this.detectOS(ua),
            deviceType: this.detectDeviceType(ua),
            screenResolution: {
                width: window.screen.width,
                height: window.screen.height,
                colorDepth: window.screen.colorDepth
            },
            language: navigator.language || navigator.userLanguage,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            connectionType: this.getConnectionType(),
            plugins: this.getPluginsInfo(),
            doNotTrack: navigator.doNotTrack === "1" || window.doNotTrack === "1",
            adBlocker: this.detectAdBlocker(),
            cookiesEnabled: navigator.cookieEnabled,
            referrer: document.referrer ? new URL(document.referrer).hostname : 'Direct visit',
            visitTime: this.getTimeOfDay(),
            dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' })
        };
    }

    setupEventListeners() {
        // Mouse movement tracking
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));

        // Click tracking
        document.addEventListener('click', this.handleClick.bind(this));

        // Scroll tracking
        window.addEventListener('scroll', this.handleScroll.bind(this));

        // Copy event tracking
        document.addEventListener('copy', () => {
            this.data.behavioral.copyEvents++;
            this.updateProgress(2);
        });

        // Resize tracking
        window.addEventListener('resize', () => {
            this.data.behavioral.resizeEvents++;
            this.updateProgress(1);
        });

        // Visibility change tracking
        document.addEventListener('visibilitychange', () => {
            this.visibilityEvents++;
            if (document.visibilityState === 'visible') {
                // User returned to the page
                this.updateProgress(3);
            }
        });

        // Track section visibility
        this.setupIntersectionObserver();

        // Set interval to update time spent
        setInterval(() => {
            if (document.visibilityState === 'visible' && this.isTracking) {
                this.data.behavioral.totalTimeSpent += 1;

                // Show a new hint every 20-30 seconds
                if (this.data.behavioral.totalTimeSpent % (20 + Math.floor(Math.random() * 10)) === 0) {
                    this.showRandomHint();
                }

                // Update progress based on time spent
                if (this.data.behavioral.totalTimeSpent % 5 === 0) {
                    this.updateProgress(1);
                }
            }
        }, 1000);
    }

    setupIntersectionObserver() {
        // Track which sections the user views the most
        const sections = document.querySelectorAll('section, div.section, [id]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Get section ID or create one from content
                    let sectionId = entry.target.id;

                    if (!sectionId) {
                        // Try to get heading text
                        const heading = entry.target.querySelector('h1, h2, h3, h4');
                        if (heading) {
                            sectionId = heading.textContent.toLowerCase().trim();
                        } else {
                            sectionId = 'unnamed-section';
                        }
                    }

                    // Also get class names for additional context
                    const classNames = Array.from(entry.target.classList).join(' ');

                    // Store combined identifier
                    const identifier = `${sectionId} ${classNames}`.toLowerCase();

                    if (!this.data.behavioral.focusedSections[identifier]) {
                        this.data.behavioral.focusedSections[identifier] = 0;
                    }
                    this.data.behavioral.focusedSections[identifier]++;
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => observer.observe(section));
    }


    handleMouseMove(e) {
        if (!this.isTracking) return;

        const now = Date.now();
        const lastPos = this.data.behavioral.lastPosition;

        // Calculate distance and speed
        if (lastPos.x !== 0 && lastPos.y !== 0) {
            const dx = e.clientX - lastPos.x;
            const dy = e.clientY - lastPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            this.data.behavioral.mouseDistance += distance;

            // Calculate speed if enough time has passed
            if (now - this.lastMouseMove > 100) {
                const speed = distance / (now - this.lastMouseMove);
                this.data.behavioral.mouseSpeed.push(speed);

                // Keep array at reasonable size
                if (this.data.behavioral.mouseSpeed.length > 100) {
                    this.data.behavioral.mouseSpeed.shift();
                }

                this.lastMouseMove = now;

                // Update progress based on mouse activity
                this.updateProgress(0.1);
            }
        }

        // Update last position
        this.data.behavioral.lastPosition = { x: e.clientX, y: e.clientY };
    }

    handleClick(e) {
        if (!this.isTracking) return;

        this.data.behavioral.clickCount++;

        // Determine what was clicked
        let target = e.target;
        let targetType = target.tagName.toLowerCase();

        // Check if it's a link, button, or other interactive element
        if (targetType === 'a' || targetType === 'button' ||
            target.closest('a') || target.closest('button')) {
            // User clicked an interactive element
            this.updateProgress(3);
        } else {
            // User clicked something else
            this.updateProgress(1);
        }
    }

    handleScroll() {
        if (!this.isTracking) return;

        const now = Date.now();
        this.data.behavioral.scrollCount++;

        // Calculate scroll speed if enough time has passed
        if (now - this.lastScrollTime > 100) {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            this.data.behavioral.scrollPattern.push(scrollTop);

            // Keep array at reasonable size
            if (this.data.behavioral.scrollPattern.length > 50) {
                this.data.behavioral.scrollPattern.shift();
            }

            this.lastScrollTime = now;

            // Update progress based on scroll activity
            this.updateProgress(0.2);
        }
    }

    updateProgress(increment) {
        this.progress = Math.min(100, this.progress + increment);
        this.trackingBar.style.width = `${this.progress}%`;

        // Check if we should show the reveal button
        if (this.progress >= this.revealThreshold && this.revealContainer.classList.contains('hidden')) {
            this.revealContainer.classList.remove('hidden');
            this.trackingStatus.textContent = 'Analysis complete. Ready to reveal what I know.';
        }
    }

    simulateProgress() {
        // Simulate some initial progress
        let initialProgress = 15;
        this.progress = initialProgress;
        this.trackingBar.style.width = `${initialProgress}%`;

        // Simulate slow progress even without user interaction
        const progressInterval = setInterval(() => {
            if (this.isTracking && this.progress < 100) {
                this.updateProgress(0.1);
            } else {
                clearInterval(progressInterval);
            }
        }, 1000);
    }

    showRandomHint() {
        if (!this.isTracking || this.hints.length === 0) return;

        // Get a random hint that hasn't been shown yet
        let availableHints = this.hints.filter(hint => !this.shownHints.includes(hint));

        // If all hints have been shown, reset
        if (availableHints.length === 0) {
            this.shownHints = [];
            availableHints = this.hints;
        }

        const randomHint = availableHints[Math.floor(Math.random() * availableHints.length)];
        this.shownHints.push(randomHint);

        // Replace placeholders with actual data
        const processedHint = this.processHintPlaceholders(randomHint);

        // Create and show the hint element
        const hintElement = document.createElement('div');
        hintElement.className = 'tracking-hint';
        hintElement.innerHTML = processedHint;

        this.hintsContainer.appendChild(hintElement);

        // Animate the hint
        setTimeout(() => {
            hintElement.classList.add('visible');
        }, 100);

        // Remove old hints if there are too many
        const hints = this.hintsContainer.querySelectorAll('.tracking-hint');
        if (hints.length > 3) {
            hints[0].classList.remove('visible');
            setTimeout(() => {
                if (hints[0].parentNode) {
                    hints[0].parentNode.removeChild(hints[0]);
                }
            }, 500);
        }
    }

    processHintPlaceholders(hint) {
        // Replace placeholders with actual data
        return hint
            .replace('{browserName}', this.data.technical.browser)
            .replace('{browserVersion}', this.data.technical.browserVersion)
            .replace('{deviceType}', this.data.technical.deviceType)
            .replace('{timeZone}', this.data.technical.timeZone)
            .replace('{screenWidth}', this.data.technical.screenResolution.width)
            .replace('{screenHeight}', this.data.technical.screenResolution.height)
            .replace('{language}', this.data.technical.language)
            .replace('{timeOnPage}', this.formatTimeSpent(this.data.behavioral.totalTimeSpent))
            .replace('{focusedSection}', this.getMostViewedSection())
            .replace('{mousePattern}', this.getMousePattern())
            .replace('{scrollStyle}', this.getScrollStyle());
    }

    revealFingerprint() {
        // Stop tracking
        this.isTracking = false;

        // Hide the entire tracking container and reveal button
        const trackingContainer = document.querySelector('.tracking-indicator');
        const hintsContainer = document.querySelector('.tracking-hints-container');
        const revealContainer = document.querySelector('.fingerprint-reveal-container');
        const sectionHeader = document.querySelector('#privacy-demo .section-header');

        // Fade out elements
        trackingContainer.style.opacity = '0';
        hintsContainer.style.opacity = '0';
        revealContainer.style.opacity = '0';
        sectionHeader.style.opacity = '0';

        // Wait for fade out animation to complete
        setTimeout(() => {
            // Remove elements from DOM
            trackingContainer.remove();
            hintsContainer.remove();
            revealContainer.remove();
            sectionHeader.remove();

            // Generate inferences
            this.generateInferences();

            // Populate results
            this.populateTechnicalProfile();
            this.populateBehavioralInsights();
            this.populateInferences();

            // Show results
            this.resultsContainer.classList.remove('hidden');
            setTimeout(() => {
                this.resultsContainer.classList.add('visible');
            }, 100);

            // Scroll to results
            this.resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500); // Match this with the CSS transition time
    }


    generateInferences() {
        // Generate inferences based on collected data
        const technical = this.data.technical;
        const behavioral = this.data.behavioral;

        // Calculate time spent on page
        const timeSpentMinutes = behavioral.totalTimeSpent / 60;

        // Analyze mouse movement patterns
        const avgMouseSpeed = behavioral.mouseSpeed.reduce((a, b) => a + b, 0) /
            (behavioral.mouseSpeed.length || 1);

        // Analyze scroll patterns
        const hasErraticScrolling = this.hasErraticScrolling();

        // Determine most viewed section
        const mostViewedSection = this.getMostViewedSection();

        // Infer device type and quality
        let deviceQuality = 'mid-range';
        if (technical.screenResolution.width >= 2560 ||
            technical.screenResolution.height >= 1440) {
            deviceQuality = 'high-end';
        } else if (technical.screenResolution.width <= 1280) {
            deviceQuality = 'budget';
        }

        // Infer technical sophistication
        let techSophistication = 'average';
        if (technical.browser === 'Firefox' && technical.doNotTrack) {
            techSophistication = 'privacy-conscious';
        } else if (technical.adBlocker && technical.browser !== 'Chrome') {
            techSophistication = 'tech-savvy';
        } else if (technical.browser === 'Safari' && technical.os === 'macOS') {
            techSophistication = 'Apple ecosystem user';
        }

        // Improved profession detection
        let profession = 'technology enthusiast';  // Default to a reasonable guess
        let professionConfidence = 45;  // Start with moderate confidence

        // Check for section interests that might indicate profession
        const sectionIds = Object.keys(behavioral.focusedSections || {});
        const sectionTexts = sectionIds.join(' ').toLowerCase();

        if (sectionTexts.includes('project') || sectionTexts.includes('portfolio')) {
            profession = 'software developer';
            professionConfidence = 65;
        } else if (sectionTexts.includes('design') || sectionTexts.includes('ui') || sectionTexts.includes('ux')) {
            profession = 'designer or creative professional';
            professionConfidence = 70;
        } else if (sectionTexts.includes('contact') && behavioral.copyEvents > 0) {
            profession = 'recruiter or hiring manager';
            professionConfidence = 60;
        } else if (sectionTexts.includes('blog') || sectionTexts.includes('article')) {
            profession = 'content creator or writer';
            professionConfidence = 55;
        }

        // Check browser and OS combinations for profession hints
        if (technical.browser === 'Chrome' && technical.os === 'macOS' && avgMouseSpeed > 0.5) {
            profession = 'software developer';
            professionConfidence = Math.max(professionConfidence, 60);
        } else if (technical.browser === 'Safari' && technical.os === 'macOS' && !hasErraticScrolling) {
            profession = 'designer or creative professional';
            professionConfidence = Math.max(professionConfidence, 55);
        } else if (technical.browser === 'Firefox' && technical.doNotTrack) {
            profession = 'privacy-conscious technologist';
            professionConfidence = Math.max(professionConfidence, 65);
        }

        // Check interaction patterns
        if (avgMouseSpeed > 0.7 && !hasErraticScrolling && behavioral.clickCount > 10) {
            profession = 'experienced tech professional';
            professionConfidence = Math.max(professionConfidence, 70);
        } else if (avgMouseSpeed < 0.3 && hasErraticScrolling) {
            profession = 'casual technology user';
            professionConfidence = Math.max(professionConfidence, 50);
        }

        // Check for copy events which might indicate research
        if (behavioral.copyEvents > 2) {
            profession = 'researcher or analyst';
            professionConfidence = Math.max(professionConfidence, 65);
        }

        // Fallback for mobile users where mouse data isn't available
        if (technical.deviceType === 'Smartphone' || technical.deviceType === 'Tablet') {
            if (behavioral.scrollCount > 15 && timeSpentMinutes > 2) {
                profession = 'mobile-first professional';
                professionConfidence = 55;
            }
        }

        // Infer age range based on behavior
        let ageRange = '25-45';
        let ageConfidence = 40;

        if (avgMouseSpeed < 0.3 && hasErraticScrolling) {
            ageRange = '45+';
            ageConfidence = 45;
        } else if (avgMouseSpeed > 0.7 && behavioral.scrollCount > 20) {
            ageRange = '18-30';
            ageConfidence = 50;
        }

        // Infer visit purpose
        let visitPurpose = 'casual browsing';
        let purposeConfidence = 35;

        if (timeSpentMinutes > 3 && behavioral.clickCount > 5) {
            visitPurpose = 'researching or evaluating';
            purposeConfidence = 60;
        } else if (behavioral.copyEvents > 0) {
            visitPurpose = 'gathering information';
            purposeConfidence = 70;
        }

        // Infer interests
        const interests = [];

        // Check section names for interests
        for (const section in behavioral.focusedSections) {
            const sectionName = section.toLowerCase();
            if (sectionName.includes('project')) interests.push('development projects');
            if (sectionName.includes('skill')) interests.push('technical skills');
            if (sectionName.includes('about')) interests.push('personal background');
            if (sectionName.includes('contact')) interests.push('professional networking');
            if (sectionName.includes('blog')) interests.push('technical content');
        }

        // If no specific interests found, add some based on behavior
        if (interests.length === 0) {
            if (behavioral.clickCount > 10) interests.push('interactive experiences');
            if (behavioral.totalTimeSpent > 120) interests.push('in-depth content');
            if (technical.browser === 'Firefox') interests.push('privacy and security');
            interests.push('technology');
        }

        // Remove duplicates
        const uniqueInterests = [...new Set(interests)];

        // Store inferences
        this.data.inferred = {
            deviceQuality,
            techSophistication,
            profession: {
                category: profession,
                confidence: professionConfidence
            },
            ageRange: {
                range: ageRange,
                confidence: ageConfidence
            },
            visitPurpose: {
                purpose: visitPurpose,
                confidence: purposeConfidence
            },
            interests: uniqueInterests,
            attentionSpan: hasErraticScrolling ? 'shorter attention span' : 'focused reader',
            timeOfDayHabit: this.inferTimeHabit(technical.visitTime),
            returningVisitor: this.isReturningVisitor(),
            dominantHand: avgMouseSpeed > 0.5 ? 'likely right-handed' : 'unknown',
            readingSpeed: this.inferReadingSpeed()
        };
    }


    populateTechnicalProfile() {
        const technical = this.data.technical;
        const container = document.querySelector('#technical-profile .section-content');

        const items = [
            `You're using <strong>${technical.browser} ${technical.browserVersion}</strong> on <strong>${technical.os}</strong>`,
            `Your device appears to be a <strong>${technical.deviceType}</strong> with a <strong>${technical.screenResolution.width}x${technical.screenResolution.height}</strong> display`,
            `You're located in the <strong>${technical.timeZone}</strong> time zone`,
            `Your system language is set to <strong>${technical.language}</strong>`,
            `You're connected via <strong>${technical.connectionType}</strong>`,
            `You visited on <strong>${technical.dayOfWeek}</strong> during the <strong>${technical.visitTime}</strong>`
        ];

        if (technical.adBlocker) {
            items.push(`You have an <strong>ad blocker</strong> installed`);
        }

        if (technical.doNotTrack) {
            items.push(`You have <strong>Do Not Track</strong> enabled`);
        }

        if (technical.referrer !== 'Direct visit') {
            items.push(`You came from <strong>${technical.referrer}</strong>`);
        }

        this.populateSection(container, items);
    }

    populateBehavioralInsights() {
        const behavioral = this.data.behavioral;
        const container = document.querySelector('#behavioral-insights .section-content');

        // Calculate time on page
        const timeSpent = this.formatTimeSpent(behavioral.totalTimeSpent);

        // Calculate average mouse speed
        const avgMouseSpeed = behavioral.mouseSpeed.reduce((a, b) => a + b, 0) /
            (behavioral.mouseSpeed.length || 1);

        // Determine scroll style
        const scrollStyle = this.getScrollStyle();

        // Determine most viewed section
        const mostViewedSection = this.getMostViewedSection();

        const items = [
            `You've spent <strong>${timeSpent}</strong> on this page`,
            `You've clicked <strong>${behavioral.clickCount} times</strong> and scrolled <strong>${behavioral.scrollCount} times</strong>`,
            `Your mouse movements suggest <strong>${this.getMousePattern()}</strong>`,
            `You tend to use <strong>${scrollStyle}</strong> when browsing`,
            `You spent the most time viewing the <strong>${mostViewedSection}</strong> section`
        ];

        if (behavioral.copyEvents > 0) {
            items.push(`You <strong>copied text</strong> ${behavioral.copyEvents} ${behavioral.copyEvents === 1 ? 'time' : 'times'}`);
        }

        if (this.visibilityEvents > 1) {
            items.push(`You <strong>switched tabs or apps</strong> ${this.visibilityEvents} times while on this page`);
        }

        this.populateSection(container, items);
    }

    populateInferences() {
        const inferred = this.data.inferred;
        const container = document.querySelector('#inferred-profile .section-content');

        const items = [
            `You're likely a <strong>${inferred.profession.category}</strong> <span class="confidence">(${inferred.profession.confidence}% confidence)</span>`,
            `You appear to be <strong>${inferred.ageRange.range} years old</strong> <span class="confidence">(${inferred.ageRange.confidence}% confidence)</span>`,
            `You're <strong>${inferred.techSophistication}</strong> based on your browser choices and behavior`,
            `You're probably using a <strong>${inferred.deviceQuality} device</strong>`,
            `You seem to be <strong>${inferred.visitPurpose.purpose}</strong> <span class="confidence">(${inferred.visitPurpose.confidence}% confidence)</span>`
        ];

        if (inferred.interests.length > 0) {
            items.push(`You appear interested in <strong>${inferred.interests.join(', ')}</strong>`);
        }

        items.push(`You're a <strong>${inferred.attentionSpan}</strong> based on your scrolling patterns`);

        if (inferred.returningVisitor) {
            items.push(`You've <strong>visited this site before</strong>`);
        }

        if (inferred.dominantHand !== 'unknown') {
            items.push(`You're <strong>${inferred.dominantHand}</strong> based on mouse movement patterns`);
        }

        this.populateSection(container, items);
    }

    populateSection(container, items) {
        container.innerHTML = '';

        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'data-item';
            div.innerHTML = `<p>${item}</p>`;
            container.appendChild(div);
        });
    }

    // Helper methods
    detectBrowser(ua) {
        // Basic browser detection
        if (ua.includes('Firefox/')) {
            return {
                browser: 'Firefox',
                version: ua.match(/Firefox\/([\d.]+)/)[1]
            };
        } else if (ua.includes('Chrome/') && !ua.includes('Edg/') && !ua.includes('OPR/')) {
            return {
                browser: 'Chrome',
                version: ua.match(/Chrome\/([\d.]+)/)[1]
            };
        } else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
            let version = '?';
            const versionMatch = ua.match(/Version\/([\d.]+)/);
            if (versionMatch) version = versionMatch[1];
            return { browser: 'Safari', version };
        } else if (ua.includes('Edg/')) {
            return {
                browser: 'Edge',
                version: ua.match(/Edg\/([\d.]+)/)[1]
            };
        } else if (ua.includes('OPR/')) {
            return {
                browser: 'Opera',
                version: ua.match(/OPR\/([\d.]+)/)[1]
            };
        } else {
            return { browser: 'Unknown', version: '?' };
        }
    }

    detectOS(ua) {
        if (ua.includes('Windows')) {
            return 'Windows';
        } else if (ua.includes('Mac OS X')) {
            return 'macOS';
        } else if (ua.includes('Linux')) {
            return 'Linux';
        } else if (ua.includes('Android')) {
            return 'Android';
        } else if (ua.includes('iPhone') || ua.includes('iPad')) {
            return 'iOS';
        } else {
            return 'Unknown OS';
        }
    }

    detectDeviceType(ua) {
        if (ua.includes('iPhone') || ua.includes('Android') && ua.includes('Mobile')) {
            return 'Smartphone';
        } else if (ua.includes('iPad') || ua.includes('Android') && !ua.includes('Mobile')) {
            return 'Tablet';
        } else {
            return 'Desktop/Laptop';
        }
    }

    getConnectionType() {
        const connection = navigator.connection ||
            navigator.mozConnection ||
            navigator.webkitConnection;

        if (connection) {
            if (connection.effectiveType) {
                return connection.effectiveType;
            }

            if (connection.type) {
                return connection.type;
            }
        }

        // Estimate based on load time if connection info not available
        const loadTime = window.performance.timing.domContentLoadedEventEnd -
            window.performance.timing.navigationStart;

        if (loadTime < 1000) {
            return 'fast connection';
        } else if (loadTime < 3000) {
            return 'moderate connection';
        } else {
            return 'slow connection';
        }
    }

    getPluginsInfo() {
        const plugins = [];

        // Check for common plugins
        if (navigator.plugins) {
            for (let i = 0; i < navigator.plugins.length; i++) {
                plugins.push(navigator.plugins[i].name);
            }
        }

        return plugins.length;
    }

    detectAdBlocker() {
        // Simple ad blocker detection
        // This is a basic implementation - more sophisticated detection would require creating a bait element
        return document.getElementById('ad-container') === null ||
            window.getComputedStyle(document.getElementById('ad-container')).display === 'none';
    }

    getTimeOfDay() {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) {
            return 'morning';
        } else if (hour >= 12 && hour < 17) {
            return 'afternoon';
        } else if (hour >= 17 && hour < 22) {
            return 'evening';
        } else {
            return 'night';
        }
    }

    formatTimeSpent(seconds) {
        if (seconds < 60) {
            return `${seconds} seconds`;
        } else {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes} minute${minutes !== 1 ? 's' : ''} and ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
        }
    }

    // Add this method to the DigitalFingerprintTracker class
    getMostViewedSection() {
        const sections = this.data.behavioral.focusedSections;
        let mostViewed = 'unknown section';
        let maxCount = 0;

        for (const [section, count] of Object.entries(sections)) {
            if (count > maxCount) {
                maxCount = count;
                mostViewed = section;
            }
        }

        // Make the section name more readable
        return mostViewed
            .replace(/-/g, ' ')
            .replace(/^unnamed section$/, 'this section')
            .replace(/^section-/, '')
            .replace(/^section /, '');
    }


    getMousePattern() {
        const avgSpeed = this.data.behavioral.mouseSpeed.reduce((a, b) => a + b, 0) /
            (this.data.behavioral.mouseSpeed.length || 1);

        if (avgSpeed > 0.7) {
            return 'quick, confident movements';
        } else if (avgSpeed > 0.4) {
            return 'steady, deliberate movements';
        } else {
            return 'careful, precise movements';
        }
    }

    getScrollStyle() {
        const scrollCount = this.data.behavioral.scrollCount;
        const timeSpent = this.data.behavioral.totalTimeSpent;

        if (scrollCount > timeSpent / 5) {
            return 'frequent, quick scrolling';
        } else if (scrollCount > timeSpent / 15) {
            return 'steady, methodical scrolling';
        } else {
            return 'careful reading with minimal scrolling';
        }
    }

    hasErraticScrolling() {
        const pattern = this.data.behavioral.scrollPattern;

        if (pattern.length < 5) return false;

        let changes = 0;
        let direction = pattern[1] > pattern[0] ? 'up' : 'down';

        for (let i = 2; i < pattern.length; i++) {
            const newDirection = pattern[i] > pattern[i - 1] ? 'up' : 'down';
            if (newDirection !== direction) {
                changes++;
                direction = newDirection;
            }
        }

        return changes > pattern.length / 3;
    }

    inferTimeHabit(timeOfDay) {
        // Simple inference based on time of visit
        if (timeOfDay === 'morning') {
            return 'early riser';
        } else if (timeOfDay === 'night') {
            return 'night owl';
        } else {
            return 'regular hours browser';
        }
    }

    isReturningVisitor() {
        // Check if there's evidence of a previous visit
        try {
            const visitHistory = localStorage.getItem('visitTimestamp');
            if (visitHistory) {
                return true;
            } else {
                // Store current visit for future reference
                localStorage.setItem('visitTimestamp', Date.now());
                return false;
            }
        } catch (e) {
            // If localStorage is not available
            return false;
        }
    }

    inferReadingSpeed() {
        const timeSpent = this.data.behavioral.totalTimeSpent;
        const scrollCount = this.data.behavioral.scrollCount;

        // Very basic reading speed inference
        if (scrollCount > 0 && timeSpent > 10) {
            const ratio = timeSpent / scrollCount;

            if (ratio < 5) {
                return 'fast reader or skimmer';
            } else if (ratio < 15) {
                return 'average reading speed';
            } else {
                return 'thorough reader';
            }
        }

        return 'unknown reading speed';
    }
}

// Add to your script.js
document.addEventListener('DOMContentLoaded', function () {
    // Button copy functionality with better visual feedback
    const copyButton = document.getElementById('copyButton');

    if (copyButton) {
        copyButton.addEventListener('click', function () {
            const codeElement = copyButton.closest('.copy-field').querySelector('code');
            const textToCopy = codeElement.textContent;

            navigator.clipboard.writeText(textToCopy).then(() => {
                // Visual feedback
                copyButton.classList.add('copy-success');
                const originalIcon = copyButton.innerHTML;
                copyButton.innerHTML = '<i class="fas fa-check"></i>';

                // Reset after 2 seconds
                setTimeout(() => {
                    copyButton.innerHTML = originalIcon;
                    copyButton.classList.remove('copy-success');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    }
});
