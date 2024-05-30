document.querySelector('.scroll-indicator').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#second-page').scrollIntoView({ behavior: 'smooth' });
});

function showText(num) {
  document.getElementById('text' + num).style.visibility = 'visible';
}
function hideText(num) {
  document.getElementById('text' + num).style.visibility = 'hidden';
}
