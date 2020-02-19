document.querySelector('#blackJack-hit-button').addEventListener('click', BlackJackHit);

document.querySelector('#blackJack-stand-button').addEventListener('click', dealerLogic);

document.querySelector('#blackJack-deal-button').addEventListener('click', blackJackDeal)

let blackJackGame = {
    'you': {'div': '#your-box', 'scoreSpan':'#your-blackJack-result', 'score':0},
    'dealer': {'div': '#dealer-box', 'scoreSpan':'#dealer-blackJack-result', 'score':0},
    'cards': ['2','3','4','5','6','7','8','9','10','K','J','Q','A'],
    'cardMap': {'2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, '10':10, 'K':10, 'J':10, 'Q':10, 'A':[1,11]},
    'wins': 0,
    'loses': 0,
    'draws':0,
    'isStand': false,
    'turnsOver': false,
}

const YOU = blackJackGame['you']
const DEALER = blackJackGame['dealer']

const hitSound = new Audio('static/sounds/swish.m4a')
const winSound = new Audio('static/sounds/cash.mp3')
const lossSound = new Audio('static/sounds/aww.mp3')

function BlackJackHit(){
    if(!blackJackGame['isStand']){
    let card = randomCard()
    showCard( card, YOU)
    updateScore(card, YOU)
    console.log(YOU['score'])
    showScore(YOU)
    }
}

// show a random card
function randomCard(){
    let randomNumber= Math.floor(Math.random()*blackJackGame['cards'].length)
   return blackJackGame['cards'][randomNumber]
}

function showCard(card, activePlayer){
    if(activePlayer['score']<=21){
        let cardImg = document.createElement('img')
        cardImg.src = `static/images/${card}.png`
        document.querySelector(activePlayer['div']).appendChild(cardImg)
        hitSound.play()
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function dealerLogic(){

    blackJackGame['isStand'] = true
    while(DEALER['score']<16 && blackJackGame['isStand'])
    {
        let card=randomCard()
        showCard(card, DEALER)
        updateScore(card, DEALER)
        showScore(DEALER)
        await sleep(1000)
    }

        blackJackGame['turnsOver']=true
        let winner = computerWinner()
        showResult(winner)
        console.log(blackJackGame['turnsOver'])
}



function blackJackDeal(){
    if(blackJackGame['turnsOver'])
    {
        blackJackGame['isStand'] = false
        // grab all user images
        let yourImages = document.querySelector('#your-box').querySelectorAll('img')

        //grab all dealer images 
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img')

        //remove your images
        yourImages.forEach((img) => {
            img.remove()
        })
        // remove dealer images
        dealerImages.forEach((img) => {
            img.remove()
        })

        //reset scores
        YOU['score'] = 0;
        DEALER['score'] = 0;


        // update the scores in the UI
        document.querySelector(YOU['scoreSpan']).textContent =0;
        document.querySelector(DEALER['scoreSpan']).textContent =0;

        //reset the color
        document.querySelector(YOU['scoreSpan']).style.color ='#ffffff';
        document.querySelector(DEALER['scoreSpan']).style.color ='#ffffff';

        // reset the result text and color
        let resultText = document.querySelector('#blackJack-result')
        resultText.textContent = "Let's Play"
        resultText.style.color = 'black'

        blackJackGame['turnsOver'] = true

    }
}

function updateScore(card, activePlayer)
{
    if(card === 'A')
    {
         // if adding 11 keeps me below 21, add 11 else add 1 
       if(activePlayer['score'] + blackJackGame['cardMap'][card][1] <= 21)
       {
            activePlayer['score'] += blackJackGame['cardMap'][card][1]
       }
       else
       {
            activePlayer['score'] += blackJackGame['cardMap'][card][0]
       }

    }
    //else add normally if not A
    else
    {

        activePlayer['score'] += blackJackGame['cardMap'][card]
    }
}

function showScore(activePlayer){
    if(activePlayer['score'] > 21){
        document.querySelector(activePlayer['scoreSpan']).textContent = "Burst!!"
        document.querySelector(activePlayer['scoreSpan']).style.color = "red"
    }
    else
    {
        document.querySelector(activePlayer['scoreSpan']).innerText = activePlayer['score']
    }
}


function computerWinner(){
    let winner;
    
    if(YOU['score']<=21){
        //condition: Higher score than dealer or when dealer bursts but you are under 21
        if (YOU['score'] > DEALER['score'] || DEALER['score']>21){
            console.log('You Won!')
            blackJackGame['wins']++
            winner = YOU
        }

        else if(YOU['score']<DEALER['score']){
            console.log('You Lost!')
            blackJackGame['loses']++
            winner = DEALER
        }
        else if(YOU['score'] === DEALER['score']){
            console.log('You Drew')
            blackJackGame['draws']++
        }
    }
    // condition if the user bursts
    else if(YOU['score']>21 && DEALER['score']<=21){
        console.log('You Lost!')
        blackJackGame['loses']++
        winner=DEALER
    }
    else if (YOU['score']>21 && DEALER['score']>21){
        console.log('You Drew')
        blackJackGame['draws']++
    }
    console.log(blackJackGame)
    console.log('Winner is ', winner)
    return winner

}

function showResult(winner){
    if(blackJackGame['turnsOver'])
    {
        let message, messageColor
        const resultDiv = document.querySelector('#blackJack-result')

        if(winner === YOU){
            document.querySelector('#wins').textContent = blackJackGame['wins']
            message = 'You Won!'
            messageColor = 'green'
            winSound.play()
        }
        else if (winner === DEALER){
            document.querySelector('#loses').textContent = blackJackGame['loses']
            message = 'You Lost!'
            messageColor = 'Red'
            lossSound.play()
        }
        else {
            document.querySelector('#draws').textContent = blackJackGame['draws']
            message = "You Drew"
            messageColor = 'black'
        }

        resultDiv.textContent = message
        resultDiv.style.color = messageColor
    }
}