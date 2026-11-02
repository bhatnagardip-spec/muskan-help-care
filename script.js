/**
 * MUSKAN HELP CARE - Interactive JavaScript
 * A Registered Voluntary Organisation
 * Sangam Vihar, New Delhi - 110062
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Sticky Header & Active Link Highlight
     ========================================================================== */
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Header shadow toggle
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top visibility
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }

    // Active navigation spy
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  // Back to top click handler
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     2. Mobile Navigation Toggle
     ========================================================================== */
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a navigation link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
      }
    });
  }

  /* ==========================================================================
     3. Hero Slider / Carousel with Auto-play & Progress Bar
     ========================================================================== */
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const progressBar = document.getElementById('slideProgress');
  
  let currentSlide = 0;
  const slideCount = slides.length;
  const slideDuration = 6000; // 6 seconds per slide
  let slideTimer = null;
  let progressAnimation = null;
  let startTime = null;

  function showSlide(index) {
    // Wrap index around
    if (index >= slideCount) currentSlide = 0;
    else if (index < 0) currentSlide = slideCount - 1;
    else currentSlide = index;

    // Update slides
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlide);
    });

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });

    resetTimer();
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function animateProgress(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min((elapsed / slideDuration) * 100, 100);
    
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (elapsed < slideDuration) {
      progressAnimation = requestAnimationFrame(animateProgress);
    } else {
      nextSlide();
    }
  }

  function resetTimer() {
    if (progressAnimation) {
      cancelAnimationFrame(progressAnimation);
    }
    if (progressBar) {
      progressBar.style.width = '0%';
    }
    startTime = null;
    progressAnimation = requestAnimationFrame(animateProgress);
  }

  // Event Listeners for Slider Controls
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetIndex = parseInt(e.target.dataset.slideIndex, 10);
      showSlide(targetIndex);
    });
  });

  // Pause on hover
  const heroSlider = document.getElementById('heroSlider');
  if (heroSlider) {
    heroSlider.addEventListener('mouseenter', () => {
      if (progressAnimation) cancelAnimationFrame(progressAnimation);
    });
    heroSlider.addEventListener('mouseleave', () => {
      resetTimer();
    });

    // Touch Swipe Support for Mobile Devices
    let touchStartX = 0;
    let touchEndX = 0;

    heroSlider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSlider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 40) {
        if (swipeDistance < 0) {
          nextSlide(); // Swiped left -> next
        } else {
          prevSlide(); // Swiped right -> prev
        }
      }
    }
  }

  // Start slider
  if (slides.length > 0) {
    resetTimer();
  }

  /* ==========================================================================
     4. Activities Filter Tabs
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const activityCards = document.querySelectorAll('.activity-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active button state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      activityCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  /* ==========================================================================
     5. Impact Stats Counter Animation (Intersection Observer)
     ========================================================================== */
  const counterElements = document.querySelectorAll('.counter-value');
  let countersAnimated = false;

  function runCounters() {
    counterElements.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000; // 2 seconds
      const frameDuration = 1000 / 60; // 60 fps
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;

      const easeOutQuad = t => t * (2 - t);

      const counterInterval = setInterval(() => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);
        const currentCount = Math.round(target * progress);

        counter.textContent = currentCount.toLocaleString('en-IN');

        if (frame === totalFrames) {
          counter.textContent = target.toLocaleString('en-IN');
          clearInterval(counterInterval);
        }
      }, frameDuration);
    });
  }

  const counterSection = document.getElementById('impact');
  if (counterSection && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          runCounters();
          countersAnimated = true;
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    counterObserver.observe(counterSection);
  } else if (counterSection) {
    runCounters();
  }

  /* ==========================================================================
     6. Interactive Impact / Contribution Calculator
     ========================================================================== */
  const amountButtons = document.querySelectorAll('.amount-pills .amt-btn');
  const impactDesc = document.getElementById('impactDesc');
  const donateWithSelectedAmt = document.getElementById('donateWithSelectedAmt');

  const impactDescriptions = {
    '500': 'Provides 1 week of nutrition packs & milk supplements for a malnourished child.',
    '1000': 'Provides free curriculum books, stationery kits, and school bag for 2 children.',
    '2500': 'Supplies 1 month complete family staple ration kit (wheat, rice, pulses, cooking oil).',
    '5000': 'Sponsors a complete tailoring & cutting skill course with sewing machine access for a woman.'
  };

  let selectedAmount = '500';

  amountButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      amountButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const amt = btn.getAttribute('data-amt');
      selectedAmount = amt;

      if (impactDesc && impactDescriptions[amt]) {
        impactDesc.style.opacity = '0';
        setTimeout(() => {
          impactDesc.textContent = impactDescriptions[amt];
          impactDesc.style.opacity = '1';
        }, 150);
      }
    });
  });

  if (donateWithSelectedAmt) {
    donateWithSelectedAmt.addEventListener('click', () => {
      openDonationModal({
        program: 'General Welfare & Nutrition Fund',
        amount: selectedAmount
      });
    });
  }

  /* ==========================================================================
     7. FAQ Accordion Logic
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items for single-accordion UX
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
        } else {
          item.classList.remove('active');
          questionBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });

  /* ==========================================================================
     8. Donation Modal & Bank Details Logic
     ========================================================================== */
  const donateModal = document.getElementById('donateModal');
  const closeDonateModal = document.getElementById('closeDonateModal');
  const modalProgramName = document.getElementById('modalProgramName');
  const modalAmtButtons = document.querySelectorAll('.m-amt-btn');
  const customAmtInput = document.getElementById('customAmtInput');
  const copyBankBtn = document.getElementById('copyBankBtn');

  function openDonationModal(options = {}) {
    if (modalProgramName && options.program) {
      modalProgramName.textContent = options.program;
    }
    if (options.amount && customAmtInput) {
      customAmtInput.value = options.amount;
      modalAmtButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-amt') === options.amount.toString());
      });
    }
    if (donateModal) {
      donateModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function hideDonationModal() {
    if (donateModal) {
      donateModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Trigger buttons
  document.querySelectorAll('.trigger-donate-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const program = btn.getAttribute('data-program') || 'Direct Grassroots Program';
      openDonationModal({ program: program });
    });
  });

  const donateHeaderBtn = document.getElementById('donateHeaderBtn');
  if (donateHeaderBtn) {
    donateHeaderBtn.addEventListener('click', () => {
      openDonationModal({ program: 'General Welfare Programme' });
    });
  }

  const volunteerHeaderBtn = document.getElementById('volunteerHeaderBtn');
  if (volunteerHeaderBtn) {
    volunteerHeaderBtn.addEventListener('click', () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        const subjectSelect = document.getElementById('userSubject');
        if (subjectSelect) subjectSelect.value = 'Volunteer Application';
      }
    });
  }

  if (closeDonateModal) {
    closeDonateModal.addEventListener('click', hideDonationModal);
  }

  if (donateModal) {
    donateModal.addEventListener('click', (e) => {
      if (e.target === donateModal) hideDonationModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && donateModal && donateModal.classList.contains('active')) {
      hideDonationModal();
    }
  });

  // Modal preset amount buttons
  modalAmtButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modalAmtButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (customAmtInput) {
        customAmtInput.value = btn.getAttribute('data-amt');
      }
    });
  });

  if (customAmtInput) {
    customAmtInput.addEventListener('input', () => {
      modalAmtButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-amt') === customAmtInput.value);
      });
    });
  }

  // Copy Bank Details
  if (copyBankBtn) {
    copyBankBtn.addEventListener('click', () => {
      const bankDetails = 
`MUSKAN HELP CARE
A/C: 926010048753210
IFSC: SBIN0011558
UPI ID: muskanhelpcare@upi
Branch: Sangam Vihar, New Delhi - 110062`;

      navigator.clipboard.writeText(bankDetails).then(() => {
        const originalHtml = copyBankBtn.innerHTML;
        copyBankBtn.innerHTML = '<i class="fa-solid fa-check"></i> Details Copied to Clipboard!';
        copyBankBtn.style.background = '#ecfdf5';
        copyBankBtn.style.color = '#065f46';
        copyBankBtn.style.borderColor = '#10b981';

        setTimeout(() => {
          copyBankBtn.innerHTML = originalHtml;
          copyBankBtn.style.background = '';
          copyBankBtn.style.color = '';
          copyBankBtn.style.borderColor = '';
        }, 2800);
      }).catch(() => {
        alert('Bank Details: A/C 926010048753210, IFSC: SBIN0011558, UPI: muskanhelpcare@upi');
      });
    });
  }

  document.querySelectorAll('.close-modal-and-contact').forEach(btn => {
    btn.addEventListener('click', hideDonationModal);
  });

  /* ==========================================================================
     9. Contact Form Interactive Validation & Submission
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const submitFormBtn = document.getElementById('submitFormBtn');
  const formStatus = document.getElementById('formStatus');

  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const phoneInput = document.getElementById('userPhone');
  const messageInput = document.getElementById('userMessage');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');
  const messageError = document.getElementById('messageError');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    // Allows 10-digit Indian numbers or formats with +91 or dashes
    const cleaned = phone.replace(/[\s\-\+\(\)]/g, '');
    return cleaned.length >= 10 && /^\d+$/.test(cleaned);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Clear previous error messages
      nameError.textContent = '';
      emailError.textContent = '';
      phoneError.textContent = '';
      messageError.textContent = '';
      formStatus.className = 'form-status-box';
      formStatus.style.display = 'none';

      // Validate Name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        nameError.textContent = 'Please provide your full name.';
        isValid = false;
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        emailError.textContent = 'Please enter your email address.';
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      // Validate Phone
      if (!phoneInput.value.trim()) {
        phoneError.textContent = 'Please provide your contact number.';
        isValid = false;
      } else if (!validatePhone(phoneInput.value.trim())) {
        phoneError.textContent = 'Please enter a valid 10-digit phone number.';
        isValid = false;
      }

      // Validate Message
      if (!messageInput.value.trim() || messageInput.value.trim().length < 8) {
        messageError.textContent = 'Please describe your query or message (at least 8 characters).';
        isValid = false;
      }

      if (!isValid) return;

      // Show sending state
      submitFormBtn.classList.add('loading');
      submitFormBtn.disabled = true;

      // Simulate network request to Muskan Help Care Secretary Desk
      setTimeout(() => {
        submitFormBtn.classList.remove('loading');
        submitFormBtn.disabled = false;

        const userName = nameInput.value.trim();
        const selectedSubject = document.getElementById('userSubject').value;

        formStatus.className = 'form-status-box success';
        formStatus.innerHTML = `
          <strong><i class="fa-solid fa-circle-check"></i> Thank you, ${userName}!</strong><br>
          Your message regarding <em>"${selectedSubject}"</em> has been successfully received by the <strong>Muskan Help Care Secretary Desk</strong> at Sangam Vihar, New Delhi. Our team will reach back out to you at <strong>${emailInput.value.trim()}</strong> within 24 hours.
        `;
        formStatus.style.display = 'block';

        contactForm.reset();
      }, 1200);
    });
  }

  /* ==========================================================================
     10. Newsletter Form
     ========================================================================== */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterMsg = document.getElementById('newsletterMsg');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateEmail(newsletterEmail.value.trim())) {
        newsletterMsg.style.color = '#f87171';
        newsletterMsg.textContent = 'Please enter a valid email.';
        return;
      }

      newsletterMsg.style.color = '#34d399';
      newsletterMsg.textContent = 'Thank you for subscribing to our activity updates!';
      newsletterForm.reset();

      setTimeout(() => {
        newsletterMsg.textContent = '';
      }, 4000);
    });
  }

});
