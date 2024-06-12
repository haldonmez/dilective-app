document.querySelector('.scroll-indicator').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#second-page').scrollIntoView({ behavior: 'smooth' });
});

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

function navigateToIndex() {
  window.location.href = "/index.html";
}

function navigateToLearn() {
  window.location.href = "/learn.html";
}
