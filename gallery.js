// Simple gallery implementation
class Gallery {
    constructor(galleryType) {
        this.galleryType = galleryType;
        this.photos = [];
        this.init();
    }

    async init() {
        await this.loadPhotos();
        this.renderGallery();
        this.setupEventListeners();
    }

    async loadPhotos() {
        try {
            const response = await fetch(`photos/${this.galleryType}/photos.json`);
            const data = await response.json();
            this.photos = data.photos;
            console.log(`Loaded ${this.photos.length} photos for ${this.galleryType}`);
        } catch (error) {
            console.error('Error loading photos:', error);
            // Fallback: try to load photos directly if JSON fails (for file:// protocol)
            this.loadPhotosDirectly();
        }
    }
    
    loadPhotosDirectly() {
        // Hardcoded fallback for when fetch doesn't work (file:// protocol)
        const photoLists = {
            'astro': [
                "Andromeda-11-22-24.jpg",
                "Autosave_denoise.jpg",
                "cool-stars-bro.jpg",
                "eclipse 2024.jpg",
                "heart-2-post.jpg",
                "masterLight_BIN_1_6024x4024_EXPOSURE_180_00s_FILTER_NoFilter_RGB_autocrop_integration_autocrop_ABE.jpg",
                "orion.jpg"
            ],
            'wildlife': [
                "DSC01276.jpg", "DSC01301.jpg", "DSC01312-Enhanced-NR.jpg", "DSC02998-Enhanced-NR.jpg",
                "DSC03643.jpg", "DSC03664-Enhanced-NR.jpg", "DSC03703-Enhanced-NR.jpg", "DSC03894-Enhanced-NR.jpg",
                "DSC03985-Enhanced-NR.jpg", "DSC04050-Enhanced-NR.jpg", "DSC04092-Enhanced-NR.jpg", "DSC04171-Enhanced-NR.jpg",
                "DSC04211-Enhanced-NR.jpg", "DSC04261-Enhanced-NR.jpg", "DSC04510.jpg", "DSC04542-Enhanced-NR.jpg",
                "DSC04878-Enhanced-NR.jpg", "DSC04891-Enhanced-NR.jpg", "DSC05280-Enhanced-NR.jpg", "DSC05339-Enhanced-NR.jpg",
                "DSC05507.jpg", "DSC05640.jpg", "DSC05749-Enhanced-NR.jpg", "DSC05765-Enhanced-NR.jpg",
                "DSC05858.jpg", "DSC05919-2.jpg", "DSC05950-Enhanced-NR.jpg", "DSC05972-Enhanced-NR.jpg",
                "DSC05981-Enhanced-NR.jpg", "DSC06573.jpg", "DSC09739-Enhanced-NR.jpg", "IMG_4536.jpg",
                "IMG_4537.jpg",
            ],
            'misc': [
                "DSC01236.jpg", "DSC01247.jpg", "DSC01248.jpg", 
                "DSC01254.jpg", "DSC01256.jpg", "DSC01257.jpg"
            ]
        };
        this.photos = photoLists[this.galleryType] || [];
        console.log(`Loaded ${this.photos.length} photos directly for ${this.galleryType}`);
    }

    renderGallery() {
        const galleryContainer = document.getElementById('gallery');
        if (!galleryContainer) return;

        this.photos.forEach((photo, index) => {
            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'gallery-item';
            
            const img = document.createElement('img');
            // Encode the photo filename to handle spaces and special characters
            img.src = `photos/${this.galleryType}/${encodeURIComponent(photo)}`;
            img.alt = photo;
            img.loading = 'lazy';
            img.dataset.index = index;
            
            imgWrapper.appendChild(img);
            galleryContainer.appendChild(imgWrapper);
        });
    }

    setupEventListeners() {
        // Click on gallery items to open fullscreen
        document.getElementById('gallery').addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                this.openFullscreen(parseInt(e.target.dataset.index));
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeFullscreen();
            } else if (e.key === 'ArrowLeft') {
                this.navigatePrev();
            } else if (e.key === 'ArrowRight') {
                this.navigateNext();
            }
        });
    }

    openFullscreen(index) {
        this.currentIndex = index;
        const photo = this.photos[index];

        // Create fullscreen overlay
        const overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        overlay.innerHTML = `
            <button class="nav-btn nav-prev" aria-label="Previous photo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 18l-6-6 6-6"/>
                </svg>
            </button>
            <img src="photos/${this.galleryType}/${encodeURIComponent(photo)}" alt="${photo}">
            <button class="nav-btn nav-next" aria-label="Next photo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6"/>
                </svg>
            </button>
            <button class="close-btn">&times;</button>
            <div class="photo-counter">${index + 1} / ${this.photos.length}</div>
        `;

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        // Add click handlers
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.classList.contains('close-btn')) {
                this.closeFullscreen();
            } else if (e.target.closest('.nav-prev')) {
                this.navigatePrev();
            } else if (e.target.closest('.nav-next')) {
                this.navigateNext();
            }
        });

        // Fade in
        setTimeout(() => overlay.classList.add('active'), 10);
    }

    closeFullscreen() {
        const overlay = document.querySelector('.fullscreen-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => overlay.remove(), 300);
            this.currentIndex = null;
        }
    }

    navigatePrev() {
        if (this.currentIndex === null || this.currentIndex === undefined) return;
        this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
        this.updateFullscreenImage();
    }

    navigateNext() {
        if (this.currentIndex === null || this.currentIndex === undefined) return;
        this.currentIndex = (this.currentIndex + 1) % this.photos.length;
        this.updateFullscreenImage();
    }

    updateFullscreenImage() {
        const overlay = document.querySelector('.fullscreen-overlay');
        if (!overlay) return;

        const photo = this.photos[this.currentIndex];
        const img = overlay.querySelector('img');
        const counter = overlay.querySelector('.photo-counter');

        if (img) {
            img.src = `photos/${this.galleryType}/${encodeURIComponent(photo)}`;
            img.alt = photo;
        }

        if (counter) {
            counter.textContent = `${this.currentIndex + 1} / ${this.photos.length}`;
        }
    }
}