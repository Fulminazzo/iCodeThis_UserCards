"use strict"

function clearConnectButton(connect) {
    connect.classList.remove("disconnect");
    connect.innerText = "Connect";
}

function refreshConnectsEvents() {
    const connects = document.getElementsByClassName("connect-front");
    for (let connect of connects) {
        connect.addEventListener("click", () => {
            connect.classList.add("disconnect");
            connect.innerText = "Currently offline!";
            if (fromMobile()) setTimeout(() => clearConnectButton(connect), 3000);
        })
        connect.addEventListener("mouseout", () => clearConnectButton(connect));
    }
}

refreshConnectsEvents()