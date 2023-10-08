// FIRST PAGE BUTTON
firstPageButton.addEventListener('click', function() {
    pageSelector('first');
});

// LAST PAGE BUTTON
lastPageButton.addEventListener('click', function() {
    pageSelector('last');
});

// NEXT PAGE BUTTON
nextPageButton.addEventListener('click', function() {
    pageSelector('next');
});

// PREVIOUS PAGE BUTTON
previousPageButton.addEventListener('click', function () {
    pageSelector('previous');
})

// PAGE INPUT
pageNumberInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        pageSelector(pageNumberInput.value);
    }
});

// Update the rows/data shown on each page
async function pageSelector(pageSelection) {

    let incompleteURLs = [];
    let startIndex = 0;
    let endIndex = 0;
    let newPageNumber = 0;

    // Define the next page number
    if (pageSelection === 'first') {
        newPageNumber = firstPage;
    } else if (pageSelection === 'last') {
        newPageNumber = lastPage;
    } else if (pageSelection === 'next') {
        newPageNumber =  currentPageNumber + 1;
    } else if (pageSelection === 'previous') {
        newPageNumber = currentPageNumber - 1;
    } else if (pageSelection.match(/^[0-9]+$/)  !== null) {
        newPageNumber = parseFloat(pageSelection);
    } else {
        pageNumberInput.value = currentPageNumber;
        return;
    }

    // Check if new page is within range
    if (newPageNumber === currentPageNumber || newPageNumber < firstPage || newPageNumber > lastPage) {
        pageNumberInput.value = currentPageNumber;
        return;
    }

    // Hide current page
    startIndex = currentPageNumber * pageQuantity - pageQuantity;
    endIndex = currentPageNumber * pageQuantity - 1;
    for (let i = startIndex; i <= endIndex; i++) {
        if (typeof rows[i] !== "undefined") {
            // rows[i].classList.remove('visible');
            rows[i].classList.add('hidden-row');
        }
    }

    // Show next page
    pageNumberInput.value = newPageNumber;
    currentPageNumber = newPageNumber
    startIndex = newPageNumber * pageQuantity - pageQuantity;
    endIndex = newPageNumber * pageQuantity - 1;
    for (let i = startIndex; i <= endIndex; i++) {
        if (typeof rows[i] !== "undefined") {
            const rowURL = rows[i].querySelector('.row-url').innerText;
            const rowErrors = rows[i].querySelector('.row-errors').innerText;
            rows[i].classList.remove('hidden-row');
            // rows[i].classList.add('visible');
            if (rowErrors === "" || rowErrors.includes('ERROR:')) {
                if (rowURL !== "") {
                    incompleteURLs.push(rowURL);
                }
            }
        }
    }

    // Disable unavailable buttons
    // Single Page
    if (rows.length <= pageQuantity) {
        firstPageButton.disabled = true;
        lastPageButton.disabled = true;
        nextPageButton.disabled = true;
        previousPageButton.disabled = true;
        pageNumberInput.disabled = true;
    // New Page is First Page
    } else if (newPageNumber <= firstPage) {
        firstPageButton.disabled = true;
        lastPageButton.disabled = false;
        previousPageButton.disabled = true;
        nextPageButton.disabled = false;
    // New Page is Last Page
    } else if (newPageNumber >= lastPage) {
        firstPageButton.disabled = false;
        lastPageButton.disabled = true;
        previousPageButton.disabled = false;
        nextPageButton.disabled = true;
    // Page is somewhere in the middle
    } else {
        firstPageButton.disabled = false;
        lastPageButton.disabled = false;
        nextPageButton.disabled = false;
        previousPageButton.disabled = false;
        pageNumberInput.disabled = false;
    }

    await sendPostRequestToUpdateErrorsColumn(incompleteURLs);
    
}


// Check for errors to update the 'Errors' column
async function sendPostRequestToUpdateErrorsColumn(incompleteURLs) {
    
    // Check if there are URLs to check
    if (incompleteURLs.length) {
        try {

            const dataToSend = {
                incompleteURLs: incompleteURLs,
            };
            const response = await fetch('/changePage', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(dataToSend)
            });
            const rowErrors = document.querySelectorAll('.row-errors');

            // Check if response received
            if (response.ok) {
                
                const responseText = await response.text();
                const linksObject = JSON.parse(responseText);
                
                // Fill in 'Errors' column 
                Object.entries(linksObject).forEach(([key, value]) => {
                    const index = findIndexRowOfURL(key);
                    if(findIndexRowOfURL(key) >= 0) {
                        rowErrors[index].innerText = value;
                        console.log(`updated: ${index}`)
                    }
                });
            
            } else {
                
                // Fill in 'Errors' column 
                for (let i = 0; i < incompleteURLs.length; i++) {
                    const index = findIndexRowOfURL(incompleteURLs[i]);
                    rowErrors[index].innerText = `ERROR: Response Status ${response.status}`;
                }

            }

        } catch (error) {
            console.error('Error:', error);
        }
    }
}

// Returns the index row that contains the URL string
function findIndexRowOfURL (urlString) {

    const rowURLs = document.querySelectorAll('.row-url');
    
    // Return -1 if not found
    let index = -1;
    
    // Check if URL string can be found
    for (let i = 0; i < rowURLs.length; i++) {
        let rowURL = rowURLs[i].innerText.trim();
        if (urlString.trim() === rowURL) {
            index = i;
            break;
        }
    }

    return index;

}
