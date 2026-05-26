/**
 * Activa la Navegación en Scroll
 * Maneja la visibilidad de navbar visibility y el estilo segun SCROL
 * Dirije (Responsivo) handles Menu hamburger & Trnsiciones de navbar 
 */

(function () {
  'use strict';

  // Configuracion
  const CONFIG = {
    scrollThreshold: 30,
    mobileBreakpoint: 768,
  };

  // Elelemntos DOM 
  const header = document.querySelector('header');
  const navLinks = document.querySelector('.nav-links');
  const hamburgerToggle = document.getElementById('hamburger-toggle');
  const hamburgerNav = document.querySelector('.hamburger-nav');

  // CSS class for active scroll state
  const SCROLLED_CLASS = 'scrolled';
  const SCROLLED_DESKTOP_CLASS = 'scrolled-desktop';

  // Estado
  let lastScrollPosition = 0;
  let isScrolled = false;
  let isMobile = window.innerWidth <= CONFIG.mobileBreakpoint;

  /**
   * Handle scroll event
   */
  function handleScroll() {
    const currentScrollPosition = window.scrollY || document.documentElement.scrollTop;

    if (currentScrollPosition > CONFIG.scrollThreshold) {
      if (!isScrolled) {
        isScrolled = true;

        if (!isMobile) {
          // Desktop mode: hide navbar, show hamburger
          if (header) header.classList.add(SCROLLED_DESKTOP_CLASS);
          if (header) header.classList.add(SCROLLED_CLASS);
        } else {
          // Modo Celulares
          if (header) header.classList.add(SCROLLED_CLASS);
        }
      }
    } else {
      if (isScrolled) {
        isScrolled = false;

        if (!isMobile) {
          // Desktop mode: show navbar, hide hamburger
          if (header) header.classList.remove(SCROLLED_DESKTOP_CLASS);
          if (header) header.classList.remove(SCROLLED_CLASS);
          // Close menu if open
          if (hamburgerToggle) {
            hamburgerToggle.checked = false;
          }
        } else {
          // Modo Celulares
          if (header) header.classList.remove(SCROLLED_CLASS);
        }
      }
    }

    lastScrollPosition = currentScrollPosition;
  }

  /**
   * Handle window resize
   */
  function handleResize() {
    const wasDesktop = !isMobile;
    isMobile = window.innerWidth <= CONFIG.mobileBreakpoint;

    if (wasDesktop && isMobile) {
      // Transitioned to mobile
      if (header) header.classList.remove(SCROLLED_DESKTOP_CLASS);
      isScrolled = false;
    } else if (!wasDesktop && !isMobile) {
      // Transitioned to desktop
      if (window.scrollY > CONFIG.scrollThreshold) {
        if (header) header.classList.add(SCROLLED_DESKTOP_CLASS);
        isScrolled = true;
      } else {
        if (header) header.classList.remove(SCROLLED_DESKTOP_CLASS);
        if (hamburgerToggle) hamburgerToggle.checked = false;
        isScrolled = false;
      }
    }
  }

  /**
   * Close hamburger menu when a link is clicked
   */
  function setupHamburgerLinkHandlers() {
    const hamburgerLinks = document.querySelectorAll('.hbn-links a');
    hamburgerLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (hamburgerToggle) {
          hamburgerToggle.checked = false;
          document.body.style.overflow = 'auto';
        }
      });
    });
  }

  /**
   * Handle hamburger menu toggle
   */
  function setupHamburgerToggleHandler() {
    if (!hamburgerToggle) return;
    
    hamburgerToggle.addEventListener('change', () => {
      if (hamburgerToggle.checked) {
        // Menu opened
        document.body.style.overflow = 'hidden';
      } else {
        // Menu closed
        document.body.style.overflow = 'auto';
      }
    });
  }

  /**
   * Initialize
   */
  function init() {
    // Initial state based on screen size
    handleResize();

    // Event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // Setup hamburger link handlers
    setupHamburgerLinkHandlers();
    setupHamburgerToggleHandler();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
