const totalCards = 35; // Total de cartas
const availableCards = ['A', 'K', 'Q', 'J']; // Valores disponibles para las cartas
let cards = [];
let selectedCards = [];
let currentMove = 0;
let playerXScore = 0;
let playerOScore = 0;
let currentPlayer = 'X'; // Jugador inicial

const cardTemplate = `
   <div class="card">
      <div class="back"></div>
      <div class="face"></div>
   </div>
`;

// Función para generar y barajar valores
function generateShuffledValues() {
   const values = [];
   const totalPairs = totalCards / 2;

   // Generar valores pares
   for (let i = 0; i < totalPairs; i++) {
      const value = i < availableCards.length ? availableCards[i] : i;
      values.push(value, value); // Agregar cada par
   }

   // Barajar los valores
   for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
   }

   return values;
}

// Inicializar el juego
function initializeGame() {
   const values = generateShuffledValues();
   const gameContainer = document.querySelector('#game');

   values.forEach(value => {
      const card = document.createElement('div');
      card.innerHTML = cardTemplate;
      card.querySelector('.face').textContent = value;
      card.classList.add('card');
      card.addEventListener('click', activate);
      cards.push(card);
      gameContainer.append(card);
   });
}

// Función para manejar el clic en una carta
function activate(e) {
   const card = e.currentTarget;

   if (currentMove < 2 && !card.classList.contains('active')) {
      card.classList.add('active');
      selectedCards.push(card);

      if (++currentMove === 2) {
         const [firstCard, secondCard] = selectedCards;
         const firstValue = firstCard.querySelector('.face').textContent;
         const secondValue = secondCard.querySelector('.face').textContent;

         if (firstValue === secondValue) {
            updateScore(currentPlayer);
            selectedCards = [];
            currentMove = 0;
         } else {
            setTimeout(() => {
               firstCard.classList.remove('active');
               secondCard.classList.remove('active');
               selectedCards = [];
               currentMove = 0;
               currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
               document.querySelector('#turn').textContent = `Turno: ${currentPlayer}`;
            }, 600);
         }

         // Verificar si el juego ha terminado
         checkGameOver();
      }
   }
}

// Función para actualizar el puntaje
function updateScore(player) {
   if (player === 'X') {
      playerXScore++;
      document.querySelector('#scoreX').textContent = playerXScore;
   } else {
      playerOScore++;
      document.querySelector('#scoreO').textContent = playerOScore;
   }
}

// Función para verificar si el juego ha terminado
function checkGameOver() {
   if (cards.every(card => card.classList.contains('active'))) {
      // El juego ha terminado
      showWinner();
   }
}

// Mostrar el mensaje de ganador o empate
function showWinner() {
   let winnerMessage = '';
   if (playerXScore > playerOScore) {
      winnerMessage = '¡Jugador X gana!';
   } else if (playerOScore > playerXScore) {
      winnerMessage = '¡Jugador O gana!';
   } else {
      winnerMessage = '¡Es un empate!';
   }

   const winnerElement = document.querySelector('#winnerMessage');
   winnerElement.textContent = winnerMessage;
   winnerElement.style.display = 'block';
}

// Reiniciar el juego
function resetGame() {
   // Vaciar el contenedor del juego
   document.querySelector('#game').innerHTML = '';

   // Reiniciar variables
   cards = [];
   selectedCards = [];
   currentMove = 0;
   playerXScore = 0;
   playerOScore = 0;
   currentPlayer = 'X';

   // Actualizar los puntajes
   document.querySelector('#scoreX').textContent = playerXScore;
   document.querySelector('#scoreO').textContent = playerOScore;

   // Reiniciar el turno
   document.querySelector('#turn').textContent = `Turno: X`;

   // Ocultar mensaje de ganador
   document.querySelector('#winnerMessage').style.display = 'none';

   // Inicializar el juego nuevamente
   initializeGame();
}

// Agregar evento al botón de reinicio
document.querySelector('#resetButton').addEventListener('click', resetGame);

// Inicializar el juego
initializeGame();
