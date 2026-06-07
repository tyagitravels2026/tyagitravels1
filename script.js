/* ==========================================================================
   Tyagi Travels - Client Side Interactions & Business Logic
   ========================================================================== */

// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Load Theme Preference
  const savedTheme = localStorage.getItem('theme') || 'dark-theme';
  document.body.className = savedTheme;
  updateThemeIcons(savedTheme);
  
  // Set default dates to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  const tourDateInput = document.getElementById('tourDate');
  const carDateInput = document.getElementById('carDate');
  const busDateInput = document.getElementById('busDate');
  const qDateInput = document.getElementById('qDate');
  
  if (tourDateInput) tourDateInput.value = tomorrowStr;
  if (carDateInput) carDateInput.value = tomorrowStr;
  if (busDateInput) busDateInput.value = tomorrowStr;
  if (qDateInput) qDateInput.value = tomorrowStr;
  
  // Initialize Estimates
  calculateEstimate();
});

// Scroll Event for Sticky Header
const mainHeader = document.getElementById('mainHeader');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    mainHeader.classList.add('scrolled');
  } else {
    mainHeader.classList.remove('scrolled');
  }
});

// Light/Dark Theme Toggling
const themeToggleBtn = document.getElementById('themeToggle');
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    let currentTheme = document.body.className;
    let nextTheme = 'dark-theme';
    
    if (currentTheme === 'dark-theme') {
      nextTheme = 'light-theme';
    }
    
    document.body.className = nextTheme;
    localStorage.setItem('theme', nextTheme);
    updateThemeIcons(nextTheme);
  });
}

function updateThemeIcons(theme) {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;
  
  const sunIcon = themeToggle.querySelector('.sun-icon');
  const moonIcon = themeToggle.querySelector('.moon-icon');
  
  if (theme === 'dark-theme') {
    if (sunIcon) sunIcon.style.display = 'block';
    if (moonIcon) moonIcon.style.display = 'none';
  } else {
    if (sunIcon) sunIcon.style.display = 'none';
    if (moonIcon) moonIcon.style.display = 'block';
  }
}

// Booking Widget Tab Switcher
function switchBookingTab(event, tabType) {
  // Deactivate all tab buttons
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => btn.classList.remove('active'));
  
  // Activate clicked tab button
  event.currentTarget.classList.add('active');
  
  // Hide all booking forms
  const bookingForms = document.querySelectorAll('.booking-form');
  bookingForms.forEach(form => form.style.display = 'none');
  
  // Show target form
  if (tabType === 'tour') {
    document.getElementById('bookingFormTour').style.display = 'flex';
  } else if (tabType === 'car') {
    document.getElementById('bookingFormCar').style.display = 'flex';
  } else if (tabType === 'bus') {
    document.getElementById('bookingFormBus').style.display = 'flex';
  }
}

// Fleet Horizontal Slider Arrow Navigation
const fleetSlider = document.getElementById('fleetSlider');
const slideLeftBtn = document.getElementById('slideLeft');
const slideRightBtn = document.getElementById('slideRight');

if (fleetSlider && slideLeftBtn && slideRightBtn) {
  slideLeftBtn.addEventListener('click', () => {
    const cardWidth = fleetSlider.querySelector('.fleet-card').offsetWidth;
    fleetSlider.scrollBy({ left: -(cardWidth + 32), behavior: 'smooth' });
  });

  slideRightBtn.addEventListener('click', () => {
    const cardWidth = fleetSlider.querySelector('.fleet-card').offsetWidth;
    fleetSlider.scrollBy({ left: cardWidth + 32, behavior: 'smooth' });
  });
}

// Itineraries Database
const itineraries = {
  kedarnath: {
    title: "Kedarnath & Badrinath Spiritual Yatra",
    timeline: [
      { day: "Day 1", title: "Dhampur to Haridwar", desc: "Start journey from Dhampur. Drive to Haridwar. Attend evening Ganga Aarti at Har Ki Pauri. Check-in and night stay at Haridwar hotel." },
      { day: "Day 2", title: "Haridwar to Guptkashi", desc: "Drive along the holy Mandakini River. Enjoy beautiful mountain views passing Devprayag confluence. Check-in at Guptkashi hotel." },
      { day: "Day 3", title: "Guptkashi to Kedarnath", desc: "Early morning drive to Sonprayag. Trek 16km or take a helicopter to Kedarnath shrine. Attend evening prayer. Night stay in Kedarnath Camp." },
      { day: "Day 4", title: "Kedarnath Darshan to Guptkashi", desc: "Early morning VIP Abhishek Darshan of Lord Kedarnath. Trek down to Sonprayag and drive back to Guptkashi hotel." },
      { day: "Day 5", title: "Guptkashi to Rishikesh", desc: "Scenic mountain drive to Rishikesh. Visit Lakshman Jhula and Ram Jhula. Night stay at riverside ashram." },
      { day: "Day 6", title: "Rishikesh to Dhampur", desc: "Morning yoga session. Sightseeing around Rishikesh. Drive back to Dhampur, arriving by evening." }
    ]
  },
  corbett: {
    title: "Jim Corbett Wildlife & Nainital Gateway",
    timeline: [
      { day: "Day 1", title: "Dhampur to Jim Corbett National Park", desc: "Morning drive from Dhampur to Ramnagar. Check-in at jungle resort. Evening jeep safari into open grasslands to spot tigers and elephants." },
      { day: "Day 2", title: "Corbett to Nainital Transfer", desc: "Early morning bird watching walk. Drive to Nainital lakes. Check-in at lakeview hotel. Enjoy boat ride in Naini Lake and evening stroll on Mall Road." },
      { day: "Day 3", title: "Nainital Lake Tour & Return", desc: "Visit Naini Peak, Cave Garden, and Snow View Point. Late afternoon drive back to Dhampur, arriving at night." }
    ]
  },
  rishikesh: {
    title: "Rishikesh White Water Rafting & Yoga",
    timeline: [
      { day: "Day 1", title: "Dhampur to Rishikesh Camp", desc: "Drive to Rishikesh. Check-in at deluxe river rafting tents. Enjoy campfire and buffet dinner under the stars." },
      { day: "Day 2", title: "River Rafting & Cliff Jumping", desc: "Head to Shivpuri. Start a thrilling 16km river rafting session down the Ganga. Try cliff jumping. Evening attend Parmarth Niketan Ganga Aarti." },
      { day: "Day 3", title: "Beatles Ashram & Local Sightseeing", desc: "Visit the historical Beatles Ashram, Ram Jhula, and Triveni Ghat. Evening leisure walk around local organic markets." },
      { day: "Day 4", title: "Morning Meditation & Return to Dhampur", desc: "Participate in an early morning yoga and meditation session. Check out and drive back to Dhampur." }
    ]
  }
};

// Modal Operations
const itineraryModal = document.getElementById('itineraryModal');
const quoteModal = document.getElementById('quoteModal');

function openItineraryModal(packageKey) {
  const data = itineraries[packageKey];
  if (!data || !itineraryModal) return;
  
  document.getElementById('itineraryTitle').innerText = data.title;
  
  const timelineContainer = document.getElementById('itineraryTimeline');
  timelineContainer.innerHTML = '';
  
  data.timeline.forEach(step => {
    const stepEl = document.createElement('div');
    stepEl.className = 'timeline-step';
    stepEl.innerHTML = `
      <span class="timeline-day">${step.day}</span>
      <h4 class="timeline-title">${step.title}</h4>
      <p class="timeline-desc">${step.desc}</p>
    `;
    timelineContainer.appendChild(stepEl);
  });
  
  itineraryModal.classList.add('active');
}

function closeItineraryModal() {
  if (itineraryModal) {
    itineraryModal.classList.remove('active');
  }
}

function openQuoteModal(preSelectedVehicle) {
  if (!quoteModal) return;
  
  if (preSelectedVehicle) {
    const qVehicleSelect = document.getElementById('qVehicle');
    if (qVehicleSelect) {
      qVehicleSelect.value = preSelectedVehicle;
    }
  }
  
  calculateEstimate();
  quoteModal.classList.add('active');
}

function closeQuoteModal() {
  if (quoteModal) {
    quoteModal.classList.remove('active');
  }
}

// Close Modals on Outer Click
window.addEventListener('click', (e) => {
  if (e.target === itineraryModal) closeItineraryModal();
  if (e.target === quoteModal) closeQuoteModal();
});

// Book Package: scrolls to booking widget and pre-fills
function bookPackage(packageName) {
  const bookingWidgetSection = document.querySelector('.hero-section');
  if (bookingWidgetSection) {
    bookingWidgetSection.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Set tab active
  const tourTabBtn = document.querySelector(".booking-tabs button:first-child");
  if (tourTabBtn) {
    // Simulate tab click
    const clickEvent = { currentTarget: tourTabBtn };
    switchBookingTab(clickEvent, 'tour');
  }
  
  // Set select value
  const tourDestSelect = document.getElementById('tourDest');
  if (tourDestSelect) {
    for (let i = 0; i < tourDestSelect.options.length; i++) {
      if (tourDestSelect.options[i].value.includes(packageName) || packageName.includes(tourDestSelect.options[i].value)) {
        tourDestSelect.selectedIndex = i;
        break;
      }
    }
  }
}

// Pricing Estimation Logic
const pricingRates = {
  vehicles: {
    "Volvo Luxury AC Coach": { perKm: 60, driverAllowance: 800, minKmPerDay: 250 },
    "Maharaja Tempo Traveller": { perKm: 25, driverAllowance: 500, minKmPerDay: 250 },
    "Toyota Innova Crysta": { perKm: 16, driverAllowance: 400, minKmPerDay: 250 },
    "Swift Dzire / Sedan": { perKm: 11, driverAllowance: 350, minKmPerDay: 250 }
  },
  destinations: {
    // Approx roundtrip distances (km) from Dhampur
    "Kedarnath": { distanceKm: 680, hillySurcharge: 1.2 }, 
    "Badrinath": { distanceKm: 720, hillySurcharge: 1.2 },
    "Jim Corbett": { distanceKm: 150, hillySurcharge: 1.0 },
    "Rishikesh": { distanceKm: 220, hillySurcharge: 1.05 },
    "Nainital": { distanceKm: 280, hillySurcharge: 1.1 },
    "Delhi": { distanceKm: 380, hillySurcharge: 1.0 },
    "Jaipur": { distanceKm: 980, hillySurcharge: 1.0 }
  }
};

function calculateEstimate() {
  const vehicleName = document.getElementById('qVehicle')?.value;
  const destName = document.getElementById('qDest')?.value;
  const days = parseInt(document.getElementById('qDays')?.value || 3);
  
  const priceDisplay = document.getElementById('estimatePrice');
  if (!priceDisplay || !vehicleName || !destName) return;
  
  const vehicle = pricingRates.vehicles[vehicleName];
  const dest = pricingRates.destinations[destName];
  
  if (!vehicle || !dest) return;
  
  // Calculations
  const baseDistance = dest.distanceKm;
  const minimumBilledDistance = vehicle.minKmPerDay * days;
  
  // Choose larger distance for billing
  const billedDistance = Math.max(baseDistance, minimumBilledDistance);
  
  // Base running charge
  let runningCharge = billedDistance * vehicle.perKm * dest.hillySurcharge;
  
  // Driver allowance
  const driverCharge = days * vehicle.driverAllowance;
  
  // State taxes & toll estimates (rough addition)
  const tollsAndPermits = days * 400; 
  
  const totalEstimate = Math.round(runningCharge + driverCharge + tollsAndPermits);
  
  // Format price
  priceDisplay.innerText = "₹" + totalEstimate.toLocaleString('en-IN');
}

// Form Submission handlers with Toast trigger
function showToast(message) {
  const toastMsg = document.getElementById('toastMsg');
  const toastText = document.getElementById('toastText');
  
  if (!toastMsg || !toastText) return;
  
  toastText.innerText = message;
  toastMsg.classList.add('active');
  
  setTimeout(() => {
    toastMsg.classList.remove('active');
  }, 4000);
}

function handleBookingSubmit(event, serviceName) {
  event.preventDefault();
  
  // Get date value
  let dateVal = "soon";
  const dateInput = event.target.querySelector('input[type="date"]');
  if (dateInput && dateInput.value) {
    dateVal = dateInput.value;
  }
  
  showToast(`Thank you! Search query for ${serviceName} on ${dateVal} registered.`);
  event.target.reset();
  
  // Reset date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (dateInput) dateInput.value = tomorrow.toISOString().split('T')[0];
}

function handleQuoteSubmit(event) {
  event.preventDefault();
  
  const name = document.getElementById('qName').value;
  const phone = document.getElementById('qPhone').value;
  const vehicle = document.getElementById('qVehicle').value;
  const dest = document.getElementById('qDest').value;
  const price = document.getElementById('estimatePrice').innerText;
  
  closeQuoteModal();
  
  showToast(`Namaste ${name}! Quote request for ${vehicle} to ${dest} received. Estimated fare: ${price}. Our Dhampur team will call you at ${phone} in 15 minutes.`);
  
  event.target.reset();
}
