document.querySelector('.scroll-indicator').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#second-page').scrollIntoView({ behavior: 'smooth' });
});

function showText1() {
  document.getElementById('text1').classList.add('vis');
}

function hideText1() {
  document.getElementById('text1').classList.remove('vis');
}

function showText2() {
  document.getElementById('text2').classList.add('vis');
}

function hideText2() {
  document.getElementById('text2').classList.remove('vis');
}

function showText3() {
  document.getElementById('text3').classList.add('vis');
}

function hideText3() {
  document.getElementById('text3').classList.remove('vis');
}


