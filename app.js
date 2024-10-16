    // Get the game-board div
    const parentDiv = document.getElementById('game-board');

    // Generar 225 divs hijos
    for (let i = 0; i < 225; i++) {
        // Crear un nuevo div hijo
        const cell = document.createElement('div');
        cell.classList.add('cell');
        
        // Añadir el div hijo al div padre
        parentDiv.appendChild(cell);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const cells = document.querySelectorAll('.cell');
        const showResult = document.getElementById('result');
        let cellsWidth = 15;
        let shipPosition = 202;
        let invadersPosition = 0; 
        let destroyedInvaders = [];
        let result = document.getElementById('result');
        let direction = 1;
        let invaderId;
        // Invader positions
        const invader = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
            15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
            30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,]; 
        //Renders invaders on game-board
        const totalInvaders = invader.length;
        invader.forEach((invader) => {
            cells[invadersPosition + invader].classList.add('invader');    // You can remove invaderPosition from the brackets and it will work.
        });

        // Renders ship on game-board
        cells[shipPosition].classList.add('ship');

        // Move the ship

        function moveShip(event) {
            cells[shipPosition].classList.remove('ship');
            switch (event.key) {
                case 'ArrowLeft':
                    if (shipPosition % cellsWidth !== 0) shipPosition -= 1;
                    break;
                case 'ArrowRight':
                    if (shipPosition % cellsWidth < cellsWidth - 1) shipPosition += 1;
                    break;
            }
            // Remove ship
            cells[shipPosition].classList.remove('ship');
            // Add ship
            cells[shipPosition].classList.add('ship');
        }
        document.addEventListener('keydown', moveShip);

        // Move invaders
            function moveInvaders() {
                // Comprobar si algún invasor está en el borde izquierdo o derecho
                const leftEdge = invader.some(inv => inv % cellsWidth === 0);
                const rightEdge = invader.some(inv => inv % cellsWidth === cellsWidth - 1);
            
                // Cambiar de dirección si están en el borde
                if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
                    direction = cellsWidth; // Mover hacia abajo
                } else if (direction === cellsWidth) {
                    // Después de moverse hacia abajo, definir nueva dirección
                    if (leftEdge) direction = 1; // Mover a la derecha
                    else direction = -1; // Mover a la izquierda
                }
            
                // Renderizar los invasores en el tablero de juego
                for (let i = 0; i < invader.length; i++) {
                    // Quitar los invasores de la posición actual
                    cells[invader[i]].classList.remove('invader');
                }
            
                // Actualizar la posición de los invasores
                for (let i = 0; i < invader.length; i++) {
                    invader[i] += direction;
                }
            
                // Volver a añadir los invasores en las nuevas posiciones
                for (let i = 0; i < invader.length; i++) {
                    if (!destroyedInvaders.includes(invader[i])) {
                        cells[invader[i]].classList.add('invader');
                    }
                }
            
                // Verificar si los invasores chocan con la nave
                if (cells[shipPosition].classList.contains('invader', 'ship')) {
                    result.textContent = 'GAME OVER';
                    cells[shipPosition].classList.add('exploded-spaceship');
                    clearInterval(invaderId); // Detener el movimiento de los invasores
                }
            
                // Verificar si todos los invasores han sido destruidos
                console.log("number of invaders destroyed",destroyedInvaders.length);
                console.log("number of invaders",invader.length);
                if (destroyedInvaders.length ===totalInvaders) {
                    result.textContent = 'YOU WIN';
                    clearInterval(invaderId); // Detener el movimiento de los invasores
                }
            }

        invaderId = setInterval(moveInvaders, 500);

        // Shoot laser
        
        function shootLaser(event) {
            let laserId;
            let laserPosition = shipPosition;    
            function moveLaser() {
                cells[laserPosition].classList.remove('laser'); 
                laserPosition -= cellsWidth; // movn the laser up
                cells[laserPosition].classList.add('laser');  

                if (cells[laserPosition].classList.contains('invader')) {
                    cells[laserPosition].classList.remove('laser');
                    cells[laserPosition].classList.remove('invader');
                    cells[laserPosition].classList.add('exploded-invader'); 

                    setTimeout(() =>cells[laserPosition].classList.remove('exploded-invader'), 500);
                    clearInterval(laserId);
                }
                const invaderFound = invader.indexOf(laserPosition);
                if (invaderFound !== -1) {
                    destroyedInvaders.push(invaderFound);
                    invader.splice(invaderFound, 1); // Remove from the invader array
                    result.textContent = destroyedInvaders.length;
                }

                if (laserPosition < cellsWidth) {
                    clearInterval(laserId);
                    setTimeout(() => cells[laserPosition].classList.remove('laser'), 100);
                }
            }

            // Shoot laser on key for spacebar
            if (event.code === 'Space') {
                laserId = setInterval(moveLaser, 100);
            }

        }

        document.addEventListener('keyup', shootLaser);
    })
