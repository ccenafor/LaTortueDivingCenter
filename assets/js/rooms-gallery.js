// Gallery functionality for rooms page
let currentGallery = [];
let currentIndex = 0;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize gallery click events
  document.querySelectorAll('.room-image-card').forEach(card => {
    card.addEventListener('click', function() {
      console.log('Image card clicked');
      const grid = this.closest('.room-grid');
      const room = grid.dataset.room;
      const index = parseInt(this.dataset.index);
      
      // Get all images from this room
      currentGallery = [];
      grid.querySelectorAll('.room-image-card img').forEach(img => {
        currentGallery.push({
          src: img.getAttribute('src'), // Use getAttribute to get the actual URL, not resolved URL
          alt: img.alt
        });
      });
      
      console.log('Current gallery:', currentGallery);
      console.log('Opening gallery at index:', index);
      
      openGallery(index);
    });
  });
  
  // Close on background click
  const galleryModal = document.getElementById('galleryModal');
  if (galleryModal) {
    galleryModal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeGallery();
      }
    });
  }
});

function openGallery(index) {
  currentIndex = index;
  const modal = document.getElementById('galleryModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  updateGallery();
}

function closeGallery() {
  const modal = document.getElementById('galleryModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function navigateGallery(direction) {
  currentIndex = (currentIndex + direction + currentGallery.length) % currentGallery.length;
  updateGallery();
}

function updateGallery() {
  const mainImage = document.getElementById('galleryMainImage');
  const counter = document.getElementById('galleryCounter');
  const thumbnails = document.getElementById('galleryThumbnails');
  
  if (currentGallery.length > 0 && currentGallery[currentIndex]) {
    mainImage.src = currentGallery[currentIndex].src;
    mainImage.alt = currentGallery[currentIndex].alt;
    mainImage.style.display = 'block';
    mainImage.style.visibility = 'visible';
    mainImage.style.opacity = '1';
    
    counter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
    
    // Update thumbnails
    thumbnails.innerHTML = '';
    currentGallery.forEach((img, idx) => {
      const thumb = document.createElement('img');
      thumb.src = img.src;
      thumb.alt = img.alt;
      thumb.className = 'gallery-thumb' + (idx === currentIndex ? ' active' : '');
      thumb.onclick = () => {
        currentIndex = idx;
        updateGallery();
      };
      thumbnails.appendChild(thumb);
    });
  }
}

// Close on escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeGallery();
  } else if (e.key === 'ArrowLeft') {
    navigateGallery(-1);
  } else if (e.key === 'ArrowRight') {
    navigateGallery(1);
  }
});
