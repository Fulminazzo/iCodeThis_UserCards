"use strict"

function getButtonDiv() {
    return document.getElementById("dark-theme-button");
}

function getInnerDiv() {
    const div = getButtonDiv();
    if (div === undefined) return undefined;
    return div.getElementsByTagName("div")[0];
}

function toggleDarkMode() {
    const div = getInnerDiv();
    if (div === undefined) return;
    const left = div.style.left;
    if (left === "0px" || left === "") setDarkTheme();
    else setLightTheme();
}

function setDarkTheme() {
    setTheme("#FFFFFF", "#1c1c1d", "#161616", "#161616",
        "#FFFFFF", "#ff7474", "#444141", "rgba(255,116,116,0.35)");
    const div = getInnerDiv();
    if (div !== undefined) div.style.left = "35px";
    localStorage.setItem("dark-mode", "true");
}

function setLightTheme() {
    setTheme("#000000", "#EFF1F7", "#FFFFFF", "#ffffff",
        "#EFF1F7", "#748dff", "#a2a5a8", "rgba(116, 141, 255, 0.35)");
    const div = getInnerDiv();
    if (div !== undefined) div.style.left = "0";
    localStorage.setItem("dark-mode", "false");
}

function setTheme(color, backgroundColor, cardColor, backCardColor,
                  buttonColor, buttonBackground, buttonBorder, boxColor) {
    const style = document.documentElement.style;
    style.color = color
    style.setProperty("--background-color", backgroundColor);
    style.setProperty("--card-color", cardColor);
    style.setProperty("--back-card-color", backCardColor);
    style.setProperty("--card-button-color", buttonColor);
    style.setProperty("--card-button-background", buttonBackground);
    style.setProperty("--card-button-border", buttonBorder);
    style.setProperty("--box-color", boxColor);
}

let darkMode = localStorage.getItem("dark-mode");
if (darkMode === "true") setDarkTheme();
else setLightTheme();
const button = getButtonDiv();
if (button !== undefined) button.addEventListener("click", () => toggleDarkMode());