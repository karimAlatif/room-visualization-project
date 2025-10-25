import './loadingScreen.css';

export class CustomLoadingScreen {
  private loadingDiv: HTMLDivElement | null = null;
  private progressBar: HTMLDivElement | null = null;
  private progressText: HTMLDivElement | null = null;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  displayLoadingUI(): void {
    if (this.loadingDiv) {
      return; // Already showing
    }

    // Create loading screen HTML
    this.loadingDiv = document.createElement('div');
    this.loadingDiv.className = 'babylon-loading-screen';
    this.loadingDiv.innerHTML = `
      <div class="loading-container">
        <h1 class="loading-title">LOADING ROOM</h1>
        <p class="loading-subtitle">Preparing your virtual space<span class="loading-dots">...</span></p>
        <div class="loading-spinner"></div>
        <div class="progress-container">
          <div class="progress-bar"></div>
        </div>
        <div class="progress-text">0%</div>
      </div>
    `;

    // Get references to progress elements
    this.progressBar = this.loadingDiv.querySelector('.progress-bar') as HTMLDivElement;
    this.progressText = this.loadingDiv.querySelector('.progress-text') as HTMLDivElement;

    // Add to document
    document.body.appendChild(this.loadingDiv);
  }

  hideLoadingUI(): void {
    console.log("hideLoadingUI called, loadingDiv exists:", !!this.loadingDiv);
    if (this.loadingDiv) {
      console.log("Starting fade-out animation");
      
      // Immediate fallback - hide with display none after a short delay
      setTimeout(() => {
        if (this.loadingDiv) {
          this.loadingDiv.style.display = 'none';
          console.log("Loading screen hidden with display:none");
        }
      }, 100);
      
      // Fade out effect
      this.loadingDiv.classList.add('fade-out');
      
      // Remove after animation
      setTimeout(() => {
        console.log("Removing loading div from DOM");
        if (this.loadingDiv && this.loadingDiv.parentNode) {
          this.loadingDiv.parentNode.removeChild(this.loadingDiv);
          console.log("Loading div removed successfully");
        }
        this.loadingDiv = null;
        this.progressBar = null;
        this.progressText = null;
      }, 600);
    } else {
      console.log("No loading div to hide");
    }
  }

  updateProgress(progress: number): void {
    if (this.progressBar && this.progressText) {
      const clampedProgress = Math.max(0, Math.min(100, progress));
      this.progressBar.style.width = `${clampedProgress}%`;
      this.progressText.textContent = `${Math.round(clampedProgress)}%`;
    }
  }

  get loadingUIText(): string {
    return 'Loading Room...';
  }

  set loadingUIText(text: string) {
    // Can be implemented if needed
  }

  get loadingUIBackgroundColor(): string {
    return '#667eea';
  }

  set loadingUIBackgroundColor(color: string) {
    // Can be implemented if needed
  }
}