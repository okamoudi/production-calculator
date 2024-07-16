const productionDateInput = document.getElementById('production-date');
const pagesPerEpisodeInput = document.getElementById('pages-per-episode'); // New field
const pagesPerDayInput = document.getElementById('pages-per-day'); // New field
const episodeCountInput = document.getElementById('episodes-count'); // New field
const calendarDaysResult = document.getElementById('calendar-days-result');
const weeksResult = document.getElementById('weeks-result');
const monthsResult = document.getElementById('months-result');
const startDateResult = document.getElementById('start-date-result');
const endDateResult = document.getElementById('end-date-result');
const monthsWeeksDaysResult = document.getElementById('months-weeks-days-result');
const productionDaysPerEpisodeResult = document.getElementById('production-Days-per-episode-result'); // Make this write-only
const productionDaysResult = document.getElementById('production-days-result'); // Make this write-only
const productionWeeksResult = document.getElementById('production-weeks-result');
const productionMonthsResult = document.getElementById('production-months-result');
const productionMonthsWeeksDaysResult = document.getElementById('production-months-weeks-days-result');
const daysResult = document.getElementById('days-to-production'); // Make this write-only

const picker = new Pikaday({
  field: productionDateInput,
  format: 'YYYY-MM-DD',
    toString(date,format){
        return moment(date).format('YYYY-MM-DD');
    },
  minDate: new Date() // Set minimum date to today
});


function calculateData() {
  const today = new Date();
  const productionDate = new Date(productionDateInput.value);
  const pagesPerEpisode = parseInt(pagesPerEpisodeInput.value) || 0; // Handle potential empty input
  const pagesPerDay = parseFloat(pagesPerDayInput.value) || 1; // Handle potential empty input
  const episodes_count = parseInt(episodeCountInput.value) || 1; // Handle potential empty input

  // Check if production date is after today
  if (productionDate < today) {
    daysResult.textContent = 'Production date must be after today.';
    weeksResult.textContent = '';
    monthsResult.textContent = '';
    monthsWeeksDaysResult.textContent = '';
    endDateResult.textContent = '';
    productionDaysResult.textContent = '';
    productionWeeksResult.textContent = '';
    productionMonthsResult.textContent = '';
    productionMonthsWeeksDaysResult.textContent = '';
    return;
  }
    // Calculate estimated days based on pages (replace with your actual logic)
  
    const daysPerEpisode = (pagesPerEpisode / pagesPerDay);
    const estimatedDays = Math.ceil( daysPerEpisode * episodes_count) || 0; /* Your logic for calculating days per page */
  // Combine estimated days with user-provided days (optional)
    
  const daysOfProduction = estimatedDays; 
    
    const productionCalendarDays = Math.ceil(estimatedDays / 6 * 7);
    
  // Calculate difference in milliseconds
  const diffInMs = productionDate.getTime() - today.getTime();

  // Calculate days (rounded down)
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // Calculate weeks (rounded down)
  const weeks = Math.floor(days / 7);

  // Calculate months (consider 30 days per month for simplicity)
  const months = Math.floor(days / 30);

  // Calculate weeks (rounded down)
  const prodWeeks = Math.floor(productionCalendarDays / 7);

  // Calculate months (consider 30 days per month for simplicity)
  const prodMonths = Math.floor(productionCalendarDays / 30);

  // Calculate end date based on production days and weeks
  const endDate = new Date(productionDate.getTime() + (productionCalendarDays) * 24 * 60 * 60 * 1000);
    
    const weeksReminder = Math.floor((days % 30) / 7) ;
    const daysReminder = Math.ceil((days % 30) % 7);
    const prodWeeksReminder = Math.floor((productionCalendarDays % 30) / 7) ;
    const prodDaysReminder = Math.ceil((productionCalendarDays % 30)% 7);
    
  // Format end date in YYYY-MM-DD
  const formattedStartDate = productionDate.toISOString().slice(0, 10);
  const formattedEndDate = endDate.toISOString().slice(0, 10);

  // Display results
  daysResult.textContent = `Days until Production: ${days}`;
  weeksResult.textContent = `Weeks to Production (approx.): ${weeks}`;
  monthsResult.textContent = `Months to Production (approx.): ${months}`;
    monthsWeeksDaysResult.innerHTML = `To production <br> Months: ${months} Weeks : ${weeksReminder} Days: ${daysReminder}`;
      if (daysOfProduction <= 0) {
        endDateResult.textContent = '';
    }else{
        startDateResult.textContent = `Production Start Date: ${formattedStartDate}`;
        endDateResult.textContent = `Production End Date: ${formattedEndDate}`;
            productionMonthsWeeksDaysResult.innerHTML = `Production <br> Months: ${prodMonths} Weeks : ${prodWeeksReminder} Days: ${prodDaysReminder}`;
          productionDaysPerEpisodeResult.textContent = `Production Days Per Episode: ${Math.round(daysPerEpisode*1000)/1000}`;
          calendarDaysResult.textContent = `Calendar Days: ${productionCalendarDays}`;
          productionDaysResult.textContent = `Production Days: ${daysOfProduction}`;
          productionWeeksResult.textContent = `Production Weeks (approx.): ${prodWeeks}`;
          productionMonthsResult.textContent = `Production Months (approx.): ${prodMonths}`;


    }

  // Store values in session storage
  sessionStorage.setItem('productionDate', productionDateInput.value);
  sessionStorage.setItem('pagesPerEpisode', pagesPerEpisode);
  sessionStorage.setItem('pagesPerDay', pagesPerDay);
  sessionStorage.setItem('episodeCount', episodeCountInput.value);
}

// Retrieve values from session storage on page load
// and populate input fields if available
const storedProductionDate = sessionStorage.getItem('productionDate');
const storedPagesPerEpisode = sessionStorage.getItem('pagesPerEpisode');
const storedPagesPerDay = sessionStorage.getItem('pagesPerDay');
const storedEpisodeCount = sessionStorage.getItem('episodeCount');

if (storedProductionDate && storedPagesPerEpisode && storedPagesPerDay && storedEpisodeCount) {
  productionDateInput.value = storedProductionDate;
  pagesPerEpisodeInput.value = storedPagesPerEpisode;
  pagesPerDayInput.value = storedPagesPerDay;
  episodeCountInput.value = storedEpisodeCount;
  // Recalculate data based on retrieved values (optional)
  calculateData();
}
