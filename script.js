document.addEventListener('DOMContentLoaded', () => {
    const teamGrid = document.getElementById('team-grid');

    const members = [
        { id: 'ram', name: 'Ram Thapa', image: 'assets/ram.JPG', sound: 'assets/laugh.m4a', caption: 'HAHA!' },
        { id: 'ankit', name: 'Ankit Rokka', image: 'assets/ankit.png', sound: 'assets/ankit.mp3', caption: 'EHEHE!' },
        { id: 'sanskar', name: 'Sanskar Karki', image: 'assets/sanskar.jpg', sound: 'assets/sanskar.mp3', caption: 'LMAO!' },
        { id: 'saurav', name: 'Saurav Shrestha', image: 'assets/saurav.jpg', sound: 'assets/saurav.mp3', caption: 'LOL!' },
        { id: 'ashish', name: 'Ashish Thapa', image: 'assets/ashish.jpg', sound: 'assets/ashish.mp3', caption: 'ROFL!' },
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

    // Chaos Button
    const chaosBtn = document.createElement('button');
    chaosBtn.className = 'chaos-btn';
    chaosBtn.innerHTML = '<span>⚡</span> LAUGH CHAOS!';
    document.body.appendChild(chaosBtn);

    chaosBtn.addEventListener('click', () => {
        members.forEach((m, i) => {
            setTimeout(() => {
                const trigger = document.getElementById(`trigger-${m.id}`);
                trigger.click();
            }, i * 200);
        });
    });

    function playLaugh(audioElement, imageElement, triggerElement, caption) {
        audioElement.currentTime = 0;
        audioElement.play().catch(e => console.log("Audio play failed:", e));

        // Animation
        imageElement.style.transform = 'scale(1.2) rotate(10deg)';
        setTimeout(() => {
            imageElement.style.transform = 'scale(1) rotate(0deg)';
        }, 300);

        // Show Speech Bubble
        const bubble = triggerElement.querySelector('.speech-bubble');
        bubble.classList.add('show');
        setTimeout(() => bubble.classList.remove('show'), 1000);

        createParticles(triggerElement);
        spawnEmojiBurst(triggerElement);
    }

    // Render Members (Dynamic Raawan Style)
    const midIndex = Math.floor(members.length / 2);
    
    members.forEach((member, index) => {
        const card = document.createElement('div');
        const isCenter = index === midIndex;
        card.className = `member-card ${isCenter ? 'center-head' : ''}`;
        
        // Calculate arc offset
        const offsetFromCenter = Math.abs(index - midIndex);
        const yOffset = offsetFromCenter * 30; // 30px drop per step
        card.style.setProperty('--y-offset', `${yOffset}px`);
        card.style.transform = `translateY(${yOffset}px)`;

        card.innerHTML = `
            <div class="image-wrapper" id="trigger-${member.id}">
                <div class="speech-bubble">${member.caption}</div>
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

        trigger.addEventListener('click', (e) => {
            if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
                DeviceMotionEvent.requestPermission().catch(console.error);
            }
            playLaugh(audio, image, trigger, member.caption);
        });

        // 3D Tilt Effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            trigger.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
        });

        card.addEventListener('mouseleave', () => {
            trigger.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
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
                const randomMember = members[Math.floor(Math.random() * members.length)];
                document.getElementById(`trigger-${randomMember.id}`).click();
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
        const laughingEmojis = ['😂', '🤣', '😆', '😹', '💥', '✨'];

        for (let i = 0; i < 8; i++) {
            const emoji = document.createElement('div');
            emoji.className = 'emoji-pop';
            emoji.innerText = laughingEmojis[Math.floor(Math.random() * laughingEmojis.length)];
            emoji.style.left = `${centerX}px`;
            emoji.style.top = `${centerY}px`;
            emoji.style.fontSize = `${Math.random() * 2 + 2}rem`;
            document.body.appendChild(emoji);
            
            setTimeout(() => emoji.remove(), 1500);
        }
    }

    function createParticles(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + window.scrollX + rect.width / 2;
        const centerY = rect.top + window.scrollY + rect.height / 2;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 10 + 5;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            const colors = ['#6F8328', '#a3b18a', '#FFD700', '#ff0055'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.position = 'absolute';
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            document.body.appendChild(particle);
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 200 + 100;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let opacity = 1;
            let posX = centerX;
            let posY = centerY;
            
            const animate = () => {
                posX += vx / 15;
                posY += vy / 15;
                opacity -= 0.015;
                particle.style.left = `${posX}px`;
                particle.style.top = `${posY}px`;
                particle.style.opacity = opacity;
                particle.style.transform = `scale(${opacity})`;
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
