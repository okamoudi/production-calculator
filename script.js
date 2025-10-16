const productionDateInput = document.getElementById('production-date');
const pagesInput = document.getElementById('pages'); // New field
const pagesPerDayInput = document.getElementById('pages-per-day'); // New field
const episodeCountInput = document.getElementById('episodes-count'); // New field
const workingDaysWeekInput = document.getElementById('working-days-week'); // New field
const calendarDaysResult = document.getElementById('calendar-days-result');
const weeksResult = document.getElementById('weeks-result');
const monthsResult = document.getElementById('months-result');
const startDateResult = document.getElementById('start-date-result');
const endDateResult = document.getElementById('end-date-result');
const monthsWeeksDaysResult = document.getElementById('months-weeks-days-result');
const productionDaysPerEpisodeResult = 
document.getElementById('production-Days-per-episode-result'); // Make this write-only
const productionDaysResult = 
document.getElementById('production-days-result'); // Make this write-only
const productionWeeksResult = document.getElementById('production-weeks-result');
const productionMonthsResult = document.getElementById('production-months-result');
const productionMonthsWeeksDaysResult = 
document.getElementById('production-months-weeks-days-result');
const daysResult = document.getElementById('days-to-production'); // Make this write-only
const filmProjectOptionInput = document.getElementById('film-project');
const seriesProjectOptionInput = document.getElementById('series-project');
const episodeCountDiv = document.getElementById('episodes-count-div'); // New field
const pagesLable = document.getElementById('pages-label'); // New field
var lastEnteredEpisodeNumber = 1;

const picker = new Pikaday({
  field: productionDateInput,
  format: 'YYYY-MM-DD',
    toString(date,format){
        return moment(date).format('YYYY-MM-DD');
    },
  // You can go back up to 20 years if you want to make a simulation
  minDate: new Date(2000,0,1) 
});
  
function selectedProjectType(){
  return document.querySelector('input[name="project-type"]:checked');;
}

function isFilm(){
  if(selectedProjectType().value == "film"){
    return true
  }else{
    return false
  }
}
function calculateData() {
  const today = new Date();
  const productionDate = 
  new Date(productionDateInput.value);
  const pages = 
  parseInt(pagesInput.value) || 1; // Handle potential empty input
  const pagesPerDay = 
  parseFloat(pagesPerDayInput.value) || 1; // Handle potential empty input
  const episodes_count = 
  parseInt(episodeCountInput.value) || 1; // Handle potential empty input
  const workingDaysWeek = 
  parseInt(workingDaysWeekInput.value) || 6; // Handle potential empty input
  // Calculate estimated days based on pages (replace with your actual logic)
  const daysPerEpisode = (pages / pagesPerDay);
  const estimatedDays = 
  Math.ceil( daysPerEpisode * episodes_count) 
  || 0; /* Your logic for calculating days per page */
  // Combine estimated days with user-provided days (optional)
  const daysOfProduction = estimatedDays; 
  const productionCalendarDays = Math.ceil(estimatedDays / workingDaysWeek * 7);
  // Calculate difference in milliseconds
  const diffInMs = productionDate.getTime() - today.getTime();
  // Calculate weeks (rounded down)
  const prodWeeks = Math.floor(productionCalendarDays / 7);
  // Calculate months (consider 30 days per month for simplicity)
  const prodMonths = Math.floor(productionCalendarDays / 30);
  // Calculate end date based on production days and weeks
  const endDate = 
  new Date(productionDate.getTime() + 
  (productionCalendarDays) * 24 * 60 * 60 * 1000);
  const prodWeeksReminder = Math.floor((productionCalendarDays % 30) / 7) ;
  const prodDaysReminder = Math.ceil((productionCalendarDays % 30)% 7);
  // Format end date in YYYY-MM-DD
  const formattedStartDate = productionDate.toISOString().slice(0, 10);
  const formattedEndDate = endDate.toISOString().slice(0, 10);
  // Display results
  // Check if production date is after today
  if (productionDate < today) {
    daysResult.textContent = 'Production Started';
    weeksResult.textContent = '';
    monthsResult.textContent = '';
    monthsWeeksDaysResult.textContent = '';
  } else {
  // Calculate days (rounded down)
    const days = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    // Calculate weeks (rounded down)
    const weeks = Math.floor(days / 7);
    // Calculate months (consider 30 days per month for simplicity)
    const months = Math.floor(days / 30);
    const weeksReminder = Math.floor((days % 30) / 7) ;
    const daysReminder = Math.ceil((days % 30) % 7);
    daysResult.textContent = `Days until Production: ${days}`;
    weeksResult.textContent = `Weeks to Production (approx.): ${weeks}`;
    monthsResult.textContent = `Months to Production (approx.): ${months}`;
    monthsWeeksDaysResult.innerHTML = 
    `To production <br> Months: ${months} Weeks : ${weeksReminder} Days: ${daysReminder}`;
  }
      if (daysOfProduction <= 0) {
        endDateResult.textContent = '';
    }else{
        startDateResult.textContent =
         `Production Start Date: ${formattedStartDate}`;
        endDateResult.textContent =
         `Production End Date: ${formattedEndDate}`;
        productionMonthsWeeksDaysResult.innerHTML = 
        `Production <br> Months: ${prodMonths} Weeks : ${prodWeeksReminder} Days: ${prodDaysReminder}`;
        calendarDaysResult.textContent =
         `Calendar Days: ${productionCalendarDays} based on 6 workdays a week`;
        productionDaysResult.textContent =
         `Production Days: ${daysOfProduction}`;
        productionWeeksResult.textContent =
         `Production Weeks (approx.): ${prodWeeks}`;
        productionMonthsResult.textContent =
         `Production Months (approx.): ${prodMonths}`;
        if(isFilm()){
          productionDaysPerEpisodeResult.textContent = '';
        } else {
          productionDaysPerEpisodeResult.textContent =
           `Production Days Per Episode: ${Math.round(daysPerEpisode*1000)/1000}`;
        }
    }
  // Store values in session storage
  sessionStorage.setItem('productionDate', productionDateInput.value);
  sessionStorage.setItem('pages', pages);
  sessionStorage.setItem('pagesPerDay', pagesPerDay);
  sessionStorage.setItem('episodeCount', episodeCountInput.value);
}
function episodeCountReset(){

  if (!isFilm()){
      lastEnteredEpisodeNumber = parseInt(episodeCountInput.value);
      sessionStorage.setItem('lastEnteredEpisodeNumber', lastEnteredEpisodeNumber);
  }
  calculateData();
}
function projectTypeSelection(){
  if (isFilm()){
    episodeCountInput.value = 1;
    episodeCountDiv.hidden = true;
    pagesLable.innerHTML = "Script Length:";
  } else {
    episodeCountDiv.hidden = false;
    pagesLable.innerHTML = "Average Episode Script Length:";
    episodeCountInput.value = lastEnteredEpisodeNumber;
  }
  saveProjectTypeSelection(selectedProjectType());
  calculateData();
}
function saveProjectTypeSelection(projectType) {
  if (projectType) {
    sessionStorage.setItem('selectedProjectTypeChoice', projectType.value);
    sessionStorage.setItem('episodeCountDivHidden',episodeCountDiv.hidden);
  }
}
function loadProjectTypeSelection() {
  // Retrieve values from session storage on page load
  // and populate input fields if available
  const storedProductionDate = sessionStorage.getItem('productionDate');
  const storedpages = sessionStorage.getItem('pages');
  const storedPagesPerDay = sessionStorage.getItem('pagesPerDay');
  const storedEpisodeCount = sessionStorage.getItem('episodeCount');
  const storedProjectType = sessionStorage.getItem('selectedProjectTypeChoice');
  const storedEpisodeCountDivHidden = sessionStorage.getItem('episodeCountDivHidden');
  const storedLastEnteredEpisodeNumber = sessionStorage.getItem('lastEnteredEpisodeNumber');
  
  if (storedProductionDate) {
    productionDateInput.value = storedProductionDate;
  }
  if (storedpages){
    pagesInput.value = storedpages;
  }
  if(storedPagesPerDay){
    pagesPerDayInput.value = storedPagesPerDay;
  }
  if (storedEpisodeCount){
    episodeCountInput.value = storedEpisodeCount;
  }
  if (storedProjectType) {
    const projectTypToSelect = document.querySelector(`input[name="project-type"][value="${storedProjectType}"]`);
    if (projectTypToSelect) {
      projectTypToSelect.checked = true;
      if (projectTypToSelect.value == "film") {
        episodeCountDiv.hidden = true;
      }else{
        episodeCountDiv.hidden = false;
      }
    }
  }
  if (storedLastEnteredEpisodeNumber){
    lastEnteredEpisodeNumber = storedLastEnteredEpisodeNumber;
  }
  // Recalculate data based on retrieved values (optional)
  if (storedProductionDate && storedpages && storedPagesPerDay && storedEpisodeCount){
    calculateData();
  }
}
loadProjectTypeSelection();

