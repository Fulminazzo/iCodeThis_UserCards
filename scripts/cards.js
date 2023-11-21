"use strict"
let playingAnimation = false;
let previousTouch = 0;

function fromMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function getCards() {
    return document.getElementById("cards");
}

function getCardsCount() {
    return Number.parseInt(getProperty("--cards"));
}

function getCardWidth() {
    return getCardHeight() * getCardAspectRatio();
}

function getCardHeight() {
    return getDistanceProperty("--card-height");
}

function getCardAspectRatio() {
    return eval(getProperty("--card-aspect-ratio"))
}

function getCardAnimDuration() {
    let cardAnimDuration = getProperty("--card-anim-duration");
    let increment = 1000;
    if (cardAnimDuration.includes("ms")) increment = 1;
    cardAnimDuration = Number.parseInt(cardAnimDuration.replace("ms", "").replace("s", ""));
    return cardAnimDuration * increment;
}

function getDistanceProperty(name) {
    return Number.parseInt(getProperty(name).replace("px", ""));
}

function getProperty(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name);
}

function handleScrollLeft() {
    const container = getCards();
    if (container === undefined) return;
    const cards = container.getElementsByClassName("card");
    let frontCard = undefined;
    let prevCard = undefined;
    for (let i = 0; i < cards.length; i++) {
        let tmp = cards[i];
        if (tmp.classList.contains("front-card")) {
            frontCard = tmp;
            i--;
            if (i < 0) i = cards.length - 1;
            prevCard = cards[i];
            break
        }
    }
    swapCards(frontCard, prevCard);

    let clone = cards[cards.length - 1].cloneNode(true);
    clone.style.position = "absolute";
    clone.style.left = "0";
    container.prepend(clone);
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        let animName = `move-right${card.style.position === "absolute" ? "-new" : ""}`
        card.style.animation = `${animName} ${getCardAnimDuration()}ms forwards`
    }
    setTimeout(() => {
        for (let card of cards) card.style = "";
        let lastChild = cards[cards.length - 1];
        container.removeChild(lastChild);
    }, getCardAnimDuration());
}

function handleScrollRight() {
    const container = getCards();
    if (container === undefined) return;
    let cards = container.getElementsByClassName("card");
    let frontCard = undefined;
    let nextCard = undefined;
    for (let i = 0; i < cards.length; i++) {
        let tmp = cards[i];
        if (tmp.classList.contains("front-card")) {
            frontCard = tmp;
            i++;
            if (i >= cards.length) i = 0;
            nextCard = cards[i];
            break
        }
    }
    swapCards(frontCard, nextCard);

    let add = true;
    if (cards.length <= getCardsCount()) {
        add = false;
        let clone = cards[0].cloneNode(true);
        clone.style.position = "absolute";
        clone.style.right = "0";
        container.appendChild(clone);
    }
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        let animName = `move-left${card.style.position === "absolute" ? "-new" : ""}`
        card.style.animation = `${animName} ${getCardAnimDuration()}ms forwards`
    }
    setTimeout(() => {
        for (let card of cards) card.style = "";
        let firstChild = cards[0];
        container.removeChild(firstChild);
        if (add) container.appendChild(firstChild);
    }, getCardAnimDuration());
}

function swapCards(prevCard, newCard) {
    if (prevCard === undefined || newCard === prevCard) return;
    playingAnimation = true;

    prevCard.classList.remove("front-card");
    for (let c of prevCard.getElementsByClassName("connect-front"))
        c.classList.remove("connect-front");

    setFrontCard(newCard);

    setTimeout(() => playingAnimation = false, getCardAnimDuration() + (fromMobile() ? 100 : 0));
}

function setFrontCard(card) {
    if (card === undefined) return;
    card.classList.add("front-card");
    for (let c of card.getElementsByClassName("connect"))
        c.classList.add("connect-front");
}

function handleScroll(delta) {
    if (playingAnimation) return;
    if (delta > 0) handleScrollRight();
    else handleScrollLeft();
}

let reEnableTimeout = undefined;
const container = getCards();
if (container !== undefined) {
    const cards = container.getElementsByClassName("card");
    let midCard = Math.floor(getCardsCount() / 2);
    if (Number.isInteger(midCard) && midCard < cards.length) setFrontCard(cards[midCard]);

    container.addEventListener('wheel', (event) => {
        event.preventDefault()
        handleScroll(event.deltaY);
    });
    container.addEventListener('touchstart', (event) => previousTouch = event.changedTouches[0]);
    container.addEventListener('touchmove', (event) => {
        let currentTouch = event.changedTouches[0];
        let deltaX = currentTouch.screenX - previousTouch.screenX;
        let deltaY = currentTouch.screenY - previousTouch.screenY;
        let delta = 0;
        if (Math.abs(deltaX) > Math.abs(deltaY)) delta = -deltaX;
        else delta = deltaY;
        handleScroll(delta);
    });
}

document.getElementsByTagName("body")[0].classList.add("card-transitions");