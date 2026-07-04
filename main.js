const parentDiv = document.getElementById('tests');
const lolno = document.createElement('div');
let width = 25;
let height = 12;
let font_size = 30;
let pos_bottom = 5;
let pos_left = 60;
let rounded = 10;

lolno.textContent = "No";
Object.assign(lolno.style, {
    display: 'flex',
    position: 'absolute',
    bottom: `${pos_bottom}%`,
    left: `${pos_left}%`,
    width: `${width}%`,
    height: `${height}%`,
    backgroundColor: '#fa1900',
    color: 'rgb(14, 14, 14)',
    'justify-content': 'center',
    'align-items': 'center',
    'font-size': `${font_size}px`,
    'border-radius': `${rounded}px`,
    transition: 'transform 0.3s ease-in-out'

});
lolno.className = "no";
parentDiv.appendChild(lolno);

lolno.addEventListener("click", function() {
    width /= 2;
    height /= 2;
    font_size /=2;
    pos_left = getRand(-20, 100);
    pos_bottom = getRand(-30, 100);
    lolno.style.width = `${width}%`;
    lolno.style.height = `${height}%`;
    lolno.style.fontSize = `${font_size}px`;
    lolno.style.left = `${pos_left}%`
    lolno.style.bottom = `${pos_bottom}%`
});

function getRand(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}