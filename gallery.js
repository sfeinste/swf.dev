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
                this.openFullscreen(e.target.dataset.index);
            }
        });

        // Close fullscreen on escape or click
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeFullscreen();
            }
        });
    }

    openFullscreen(index) {
        const photo = this.photos[index];
        
        // Create fullscreen overlay
        const overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        overlay.innerHTML = `
            <img src="photos/${this.galleryType}/${encodeURIComponent(photo)}" alt="${photo}">
            <button class="close-btn">&times;</button>
        `;
        
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        
        // Add click handler to close
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.className === 'close-btn') {
                this.closeFullscreen();
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
        }
    }
}