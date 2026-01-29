document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.getElementById('laugh-trigger');
    const audio = document.getElementById('laugh-sound');
    const image = document.getElementById('laugh-image');

    // Add floating background icons
    const emojis = ['😂', '🤣', '🔥', '🚀', '💻', '🧪'];
    for (let i = 0; i < 15; i++) {
        const icon = document.createElement('div');
        icon.className = 'floating-icon';
        icon.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        icon.style.left = `${Math.random() * 100}vw`;
        icon.style.animationDuration = `${Math.random() * 5 + 5}s`;
        icon.style.animationDelay = `${Math.random() * 5}s`;
        document.body.appendChild(icon);
    }


    let laughCount = 0;
    const maxLaughs = 3;

    function playLaughLoop() {
        if (laughCount < maxLaughs) {
            audio.currentTime = 0;
            audio.play().then(() => {
                laughCount++;
                audio.onended = () => {
                    if (laughCount < maxLaughs) {
                        playLaughLoop();
                    } else {
                        laughCount = 0; // Reset for next trigger
                        audio.onended = null;
                    }
                };
            }).catch(e => {
                console.log("Audio play failed:", e);
                createParticles(trigger);
            });
        }
    }

    trigger.addEventListener('click', () => {
        // Request permission for motion if needed (iOS)
        if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission()
                .then(response => {
                    if (response == 'granted') {
                        window.addEventListener('devicemotion', handleShake);
                    }
                })
                .catch(console.error);
        }

        playLaughLoop();
        // Add a 'pop' animation class
        image.style.transform = 'scale(1.1)';
        setTimeout(() => {
            image.style.transform = 'scale(1)';
        }, 150);

        // Create burst effect
        createParticles(trigger);
        spawnEmojiBurst(trigger);
    });

    // Shake Detection
    let lastX, lastY, lastZ;
    let moveThreshold = 15;

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
                playLaughLoop();
                createParticles(trigger);
                spawnEmojiBurst(trigger);
            }
        }

        lastX = curX;
        lastY = curY;
        lastZ = curZ;
    }

    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission !== 'function') {
        window.addEventListener('devicemotion', handleShake);
    }

    function spawnEmojiBurst(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const laughingEmojis = ['😂', '🤣', '😆', '😹'];

        for (let i = 0; i < 5; i++) {
            const emoji = document.createElement('div');
            emoji.className = 'emoji-pop';
            emoji.innerText = laughingEmojis[Math.floor(Math.random() * laughingEmojis.length)];
            emoji.style.left = `${centerX + (Math.random() - 0.5) * 100}px`;
            emoji.style.top = `${centerY + (Math.random() - 0.5) * 100}px`;
            document.body.appendChild(emoji);
            
            setTimeout(() => emoji.remove(), 1500);
        }
    }


    function createParticles(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 8 + 4;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            const color = Math.random() > 0.5 ? '#6F8328' : '#a3b18a';
            particle.style.background = color;
            
            particle.style.position = 'fixed';
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
