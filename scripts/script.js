"use strict"

const connects = document.getElementsByClassName("connect");
for (let connect of connects) {
    connect.addEventListener("click", () => {
        connect.classList.add("disconnect");
        connect.innerText = "Currently offline!";
    })
    connect.addEventListener("mouseout", () => {
        connect.classList.remove("disconnect");
        connect.innerText = "Connect";
    })
}