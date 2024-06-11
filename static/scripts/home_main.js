document.querySelector('.scroll-indicator').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#second-page').scrollIntoView({ behavior: 'smooth' });
});

function showText1() {
  document.getElementById(text1).style.visibility = 'visible';
}
function hideText1() {
  document.getElementById(text1).style.visibility = 'hidden';
}
function showText2() {
  document.getElementById(text2).style.visibility = 'visible';
}
function hideText2() {
  document.getElementById(text2).style.visibility = 'hidden';
}
function showText3() {
  document.getElementById(text3).style.visibility = 'visible';
}
function hideText3() {
  document.getElementById(text3).style.visibility = 'hidden';
}
