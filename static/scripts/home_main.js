document.querySelector('.scroll-indicator').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#second-page').scrollIntoView({ behavior: 'smooth' });
});

// Function to show the loader
function showLoader() {
  document.getElementById('loader-container').style.display = 'flex';
}

// Function to hide the loader
function hideLoader() {
  document.getElementById('loader-container').style.display = 'none';
}

// Function to navigate to the Learn page
function navigateToLearn() {
  document.body.classList.add('fade-out');
  showLoader();
  setTimeout(function() {
      window.location.href = '/learn.html';
  }, 2000);
}


// Function to navigate to the Listen page
function navigateToListen() {
  document.body.classList.add('fade-out');
  showLoader();
  setTimeout(function() {
      window.location.href = '/listen.html';
  }, 2000);
}

// Function to navigate to the Index page
function navigateToIndex() {
  document.body.classList.add('fade-out');
  showLoader();
  setTimeout(function() {
      window.location.href = '/index.html';
  }, 2000);
}

function showText1() {
  hideAllTexts();
  document.getElementById('text1').classList.add('vis');
}

function hideText1() {
  document.getElementById('text1').classList.remove('vis');
}

function showText2() {
  hideAllTexts();
  document.getElementById('text2').classList.add('vis');
}

function hideText2() {
  document.getElementById('text2').classList.remove('vis');
}

function showText3() {
  hideAllTexts();
  document.getElementById('text3').classList.add('vis');
}

function hideText3() {
  document.getElementById('text3').classList.remove('vis');
}

function hideAllTexts() {
  document.getElementById('text1').classList.remove('vis');
  document.getElementById('text2').classList.remove('vis');
  document.getElementById('text3').classList.remove('vis');
}




