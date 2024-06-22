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

// Functions to show and hide text on hover
function showText1() {
  document.getElementById('text1').style.opacity = '1';
}

function hideText1() {
  document.getElementById('text1').style.opacity = '0';
}

function showText2() {
  document.getElementById('text2').style.opacity = '1';
}

function hideText2() {
  document.getElementById('text2').style.opacity = '0';
}

function showText3() {
  document.getElementById('text3').style.opacity = '1';
}

function hideText3() {
  document.getElementById('text3').style.opacity = '0';
}



