const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swapBtn = document.querySelector(".dropdown i");

//Populate dropdowns
for(let select of dropdowns) {
    for (currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if(select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        } else if(select.name === "to" && currCode === "INR") {
            newOption.selected = true;
        }

        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

//Update flag
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

    // Changes the flag
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

//Fetch exchange rate
const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if(amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
    
    try{
        let response = await fetch(URL);
        let data = await response.json();

        let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];

        let finalAmount = amtVal * rate;
        msg.style.opacity = 0;

        setTimeout(() => {
            msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
            msg.style.opacity = 1;
        }, 200);
    } catch (error) {
        msg.innerText = "Something went wrong. Try again.";
        console.error(error);
    }
};

btn.addEventListener("click", (evt) => {
    //It makes page to not refresh
    evt.preventDefault();
    updateExchangeRate();
}); 

swapBtn.addEventListener("click", () => {
    //swap currency values
    let temp = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = temp;

    //update flags
    updateFlag(fromCurr);
    updateFlag(toCurr);

    //update exchange rate again
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});