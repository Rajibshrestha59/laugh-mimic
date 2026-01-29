document.addEventListener('DOMContentLoaded', () => {
    const teamGrid = document.getElementById('team-grid');

    // Define the team members
    // Replace these paths with actual assets as you add them
    const members = [
        { id: 'ram', name: 'Ram Thapa', image: 'assets/ram.JPG', sound: 'assets/laugh.m4a' },
        { id: 'ankit', name: 'Ankit Rokka', image: 'assets/ankit.png', sound: 'assets/ankit.mp3' },
        // { id: 'safal', name: 'Safal Adhikari', image: 'assets/ram.JPG', sound: 'assets/laugh.m4a' },
        // { id: 'nikesh', name: 'Nikesh Adhikary', image: 'assets/ram.JPG', sound: 'assets/laugh.m4a' },
        // { id: 'dilasha', name: 'Dilasha Sapkota', image: 'assets/ram.JPG', sound: 'assets/laugh.m4a' },
        { id: 'sanskar', name: 'Sanskar Karki', image: 'assets/sanskar.jpg', sound: 'assets/sanskar.mp3' },
        
    ];

    // Background Elements
    const emojis = ['😂', '🤣', '🔥', '🚀', '💻', '🧪'];
    for (let i = 0; i < 20; i++) {
        const icon = document.createElement('div');
        icon.className = 'floating-icon';
        icon.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        icon.style.left = `${Math.random() * 100}vw`;
        icon.style.animationDuration = `${Math.random() * 5 + 5}s`;
        icon.style.animationDelay = `${Math.random() * 5}s`;
        document.body.appendChild(icon);
    }

    // Function to play laugh
    function playLaugh(audioElement, imageElement, triggerElement) {
        audioElement.currentTime = 0;
        audioElement.play().catch(e => console.log("Audio play failed:", e));

        // Animation
        imageElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            imageElement.style.transform = 'scale(1)';
        }, 150);

        createParticles(triggerElement);
        spawnEmojiBurst(triggerElement);
    }

    // Render Members (Raawan Style)
    members.forEach((member, index) => {
        const card = document.createElement('div');
        const isCenter = index === 7; // The 8th head is the center
        card.className = `member-card ${isCenter ? 'center-head' : ''}`;
        card.innerHTML = `
            <div class="image-wrapper" id="trigger-${member.id}">
                <div class="image-glow"></div>
                <img src="${member.image}" alt="${member.name}" id="image-${member.id}">
                <div class="click-hint">Click me!</div>
            </div>
            <span class="member-name">${member.name}</span>
            <audio id="sound-${member.id}" src="${member.sound}"></audio>
        `;
        teamGrid.appendChild(card);

        const trigger = document.getElementById(`trigger-${member.id}`);
        const audio = document.getElementById(`sound-${member.id}`);
        const image = document.getElementById(`image-${member.id}`);

        trigger.addEventListener('click', () => {
             // Request permission for motion if needed (iOS)
            if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
                DeviceMotionEvent.requestPermission().catch(console.error);
            }
            playLaugh(audio, image, trigger);
        });
    });

    // Shake Detection
    let lastX, lastY, lastZ;
    let moveThreshold = 25;

    function handleShake(event) {
        let acceleration = event.accelerationIncludingGravity;
        let curX = acceleration.x;
        let curY = acceleration.y;
        let curZ = acceleration.z;

        if (lastX !== undefined) {
            let deltaX = Math.abs(curX - lastX);
            let deltaY = Math.abs(curY - lastY);
            let deltaZ = Math.abs(curZ - lastZ);

            if (deltaX + deltaY + deltaZ > moveThreshold) {
                // Play a random member's laugh on shake
                const randomMember = members[Math.floor(Math.random() * members.length)];
                const trigger = document.getElementById(`trigger-${randomMember.id}`);
                const audio = document.getElementById(`sound-${randomMember.id}`);
                const image = document.getElementById(`image-${randomMember.id}`);
                playLaugh(audio, image, trigger);
            }
        }

        lastX = curX;
        lastY = curY;
        lastZ = curZ;
    }

    window.addEventListener('devicemotion', handleShake);

    function spawnEmojiBurst(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + window.scrollX + rect.width / 2;
        const centerY = rect.top + window.scrollY + rect.height / 2;
        const laughingEmojis = ['😂', '🤣', '😆', '😹'];

        for (let i = 0; i < 5; i++) {
            const emoji = document.createElement('div');
            emoji.className = 'emoji-pop';
            emoji.innerText = laughingEmojis[Math.floor(Math.random() * laughingEmojis.length)];
            emoji.style.left = `${centerX}px`;
            emoji.style.top = `${centerY}px`;
            document.body.appendChild(emoji);
            
            setTimeout(() => emoji.remove(), 1500);
        }
    }

    function createParticles(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + window.scrollX + rect.width / 2;
        const centerY = rect.top + window.scrollY + rect.height / 2;

        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 8 + 4;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            const color = Math.random() > 0.5 ? '#6F8328' : '#a3b18a';
            particle.style.background = color;
            particle.style.position = 'absolute';
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            document.body.appendChild(particle);
            
            const angle = (i / 12) * Math.PI * 2;
            const velocity = Math.random() * 100 + 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let opacity = 1;
            let posX = centerX;
            let posY = centerY;
            
            const animate = () => {
                posX += vx / 10;
                posY += vy / 10;
                opacity -= 0.02;
                particle.style.left = `${posX}px`;
                particle.style.top = `${posY}px`;
                particle.style.opacity = opacity;
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            requestAnimationFrame(animate);
        }
    }
});
