// Get the game-board div
const parentDiv = document.getElementById('game-board');

// Generar 225 divs hijos
for (let i = 0; i < 225; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    parentDiv.appendChild(cell);
}

document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const result = document.getElementById('result');
    let cellsWidth = 15;
    
    // Posiciones iniciales de las naves
    let topShipPosition = 7;  // Nave superior
    let bottomShipPosition = 217;  // Nave inferior
    
    let topShipLives = 3;
    let bottomShipLives = 3;
    
    // Renders top and bottom ships
    cells[topShipPosition].classList.add('top-ship');
    cells[bottomShipPosition].classList.add('bottom-ship');

    // Mueve las naves
    function moveShip(event) {
        // Mueve la nave de la parte superior
        cells[topShipPosition].classList.remove('top-ship');
        switch (event.key) {
            case 'a': // Mueve a la izquierda con la tecla "A"
                if (topShipPosition % cellsWidth !== 0) topShipPosition -= 1;
                break;
            case 'd': // Mueve a la derecha con la tecla "D"
                if (topShipPosition % cellsWidth < cellsWidth - 1) topShipPosition += 1;
                break;
        }
        cells[topShipPosition].classList.add('top-ship');
        
        // Mueve la nave de la parte inferior
        cells[bottomShipPosition].classList.remove('bottom-ship');
        switch (event.key) {
            case 'ArrowLeft': // Mueve a la izquierda con la flecha izquierda
                if (bottomShipPosition % cellsWidth !== 0) bottomShipPosition -= 1;
                break;
            case 'ArrowRight': // Mueve a la derecha con la flecha derecha
                if (bottomShipPosition % cellsWidth < cellsWidth - 1) bottomShipPosition += 1;
                break;
        }
        cells[bottomShipPosition].classList.add('bottom-ship');
    }
    document.addEventListener('keydown', moveShip);

    // Función para disparar láseres desde las naves
    function shootLaser(event) {
        let laserId;
        let laserPosition;

        // Disparo de la nave superior
        if (event.key === 's') {  // Tecla "S" dispara desde la nave superior
            laserPosition = topShipPosition;
            function moveLaser() {
                cells[laserPosition].classList.remove('laser');
                laserPosition += cellsWidth;  // Mueve hacia abajo
                if (laserPosition >= cells.length) {
                    clearInterval(laserId);
                    return;
                }
                cells[laserPosition].classList.add('laser');

                // Si el láser toca la nave inferior
                if (laserPosition === bottomShipPosition) {
                    bottomShipLives -= 1;
                    cells[bottomShipPosition].classList.add('exploded-ship');
                    setTimeout(() => cells[bottomShipPosition].classList.remove('exploded-ship'), 500);
                    clearInterval(laserId);
                    if (bottomShipLives <= 0) {
                        result.textContent = '¡La nave superior ganó!';
                    }
                }
            }
            laserId = setInterval(moveLaser, 100);
        }

        // Disparo de la nave inferior
        if (event.code === 'Space') {  // Barra espaciadora dispara desde la nave inferior
            laserPosition = bottomShipPosition;
            function moveLaser() {
                cells[laserPosition].classList.remove('laser');
                laserPosition -= cellsWidth;  // Mueve hacia arriba
                if (laserPosition < 0) {
                    clearInterval(laserId);
                    return;
                }
                cells[laserPosition].classList.add('laser');

                // Si el láser toca la nave superior
                if (laserPosition === topShipPosition) {
                    topShipLives -= 1;
                    cells[topShipPosition].classList.add('exploded-ship');
                    setTimeout(() => cells[topShipPosition].classList.remove('exploded-ship'), 500);
                    clearInterval(laserId);
                    if (topShipLives <= 0) {
                        result.textContent = '¡La nave inferior ganó!';
                    }
                }
            }
            laserId = setInterval(moveLaser, 100);
        }
    }
    document.addEventListener('keyup', shootLaser);
});
