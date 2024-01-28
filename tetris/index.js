const gridElement = document.querySelector('.grid');

for(let i = 0; i < 200; i++){
    const newDiv = document.createElement('div');
    gridElement.appendChild(newDiv);
}