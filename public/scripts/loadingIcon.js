const submitButton = document.querySelector("#submitButton");
submitButton.addEventListener("click", function (e) {
    const loadingPlaceholder = document.querySelector("#loadingPlaceholder");
    const siteMapUrl = document.querySelector("#siteMapUrl");

    if (siteMapUrl.value !== "") {
        loadingPlaceholder.innerText = "LOADING...";
    }
});
