const addLogoBtn = document.querySelector(".add__logo--btn");
const addLogo = document.querySelector(".add__logo");
const quantityInput = document.querySelector(".input-quntity");
const rateInput = document.querySelector(".input-rate");
const amountValue = document.querySelector(".item__row--amount-value");
const addLineBtn = document.querySelector(".add__line--btn");
const addLineItem = document.querySelector(".add__line--item");
const itemRows = document.querySelectorAll(".item__row");
const invoiceMiddle = document.querySelector(".invoice__middle");
const rowCloseIcon = document.querySelector(".item__line--close-icon");
const rowCloseIcons = document.querySelectorAll(".item__line--close-icon");
const discountBox = document.querySelector(".discount__box");
const shippingBox = document.querySelector(".shipping__box");
const taxBox = document.querySelector(".tax__box");
const fromInput = document.querySelector(".invoice__from--input");
const toInput = document.querySelector(".bill-to__input");
const discountBtn = document.querySelector(".discount-btn");
const shippingBtn = document.querySelector(".shipping-btn");
const taxBtn = document.querySelector(".tax-btn");
const discountInput = document.querySelector(".discount__input");
const invoiceCalc = document.querySelector(".invoice__bottom--right-row1");
const taxInput = document.querySelector(".tax__input");
const shippingInput = document.querySelector(".shipping__input");
const subtotalValue = document.querySelector(".subtotal__value");
const totalValue = document.querySelector(".total__value");
const amountInput = document.querySelector(".amount__input");
const balance = document.querySelector(".balance");
const selectCurrency = document.querySelector(".select__currency");
const selectType = document.querySelector(".select__type");
const currency = document.querySelectorAll(".curr");
const currency1 = document.querySelectorAll(".curr1");
const currency2 = document.querySelectorAll(".curr2");
const downInvoices = document.querySelectorAll(".download__invoice");
const dInvoice = document.querySelector(".dwn__invoice");
const history = document.querySelector(".history-btn");
const saveDefault = document.querySelector(".save-default");

let rs = document.querySelectorAll(".item__row");

let lastInvoiceId = parseInt(localStorage.getItem("lastInvoiceId")) || 0;

lastInvoiceId++;
const ids = document.querySelectorAll(".invoice-id");
ids.forEach((id) => (id.value = lastInvoiceId));

localStorage.setItem("lastInvoiceId", lastInvoiceId.toString());

// upload logo

addLogoBtn.addEventListener("click", function () {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";

  fileInput.click();
  fileInput.addEventListener("change", function () {
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function () {
        const imgSrc = reader.result;
        const img = document.createElement("img");
        img.src = imgSrc;
        img.style.objectFit = "cover";
        img.classList.add("userlogo");
        img.style.width = "12rem";
        img.style.height = "14rem";
        addLogoBtn.style.pointerEvents = "none";

        addLogo.style.display = "none";
        addLogo.parentNode.appendChild(img);

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "✖";
        closeBtn.className = "close-btn";
        closeBtn.style.position = "absolute";

        closeBtn.style.borderRadius = "2px";
        closeBtn.style.background = "transparent";
        closeBtn.style.border = "none";
        closeBtn.style.color = "white";
        closeBtn.style.backgroundColor = "#777777";
        closeBtn.style.cursor = "pointer";
        closeBtn.style.width = "20px";
        closeBtn.style.height = "20px";
        closeBtn.style.zIndex = "11";
        closeBtn.style.pointerEvents = "auto";

        addLogoBtn.appendChild(closeBtn);
        closeBtn.addEventListener("mouseenter", function () {
          closeBtn.style.backgroundColor = "#009e74";
        });
        closeBtn.addEventListener("mouseleave", function () {
          closeBtn.style.backgroundColor = "#777777";
        });

        img.parentNode.insertBefore(closeBtn, img);

        closeBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          img.remove();
          closeBtn.remove();
          addLogoBtn.style.pointerEvents = "auto";

          addLogo.style.display = "flex";
        });
      };
      reader.readAsDataURL(file);
    }
  });
});

// Update Amount

quantityInput.addEventListener("input", updateAmount);
rateInput.addEventListener("input", updateAmount);

function updateAmount(quantityInput, rateInput, amountValue) {
  const quantity = parseFloat(quantityInput.value);
  const rate = parseFloat(rateInput.value);
  const amount = quantity * rate;
  if (!isNaN(quantity) && !isNaN(rate)) {
    if (!isNaN(amount)) {
      amountValue.textContent = amount.toFixed(2);
    } else {
      amountValue.textContent = "0.00";
    }
  } else {
    amountValue.textContent = "0.00";
  }

  updateSubtotal();
  updateTotalValue();
  updateBalance();
}

document.addEventListener("input", function (event) {
  const target = event.target;
  if (target.matches(".input-quntity") || target.matches(".input-rate")) {
    const parentItemRow = target.closest(".item__row");
    if (parentItemRow) {
      const quantityInput = parentItemRow.querySelector(".input-quntity");
      const rateInput = parentItemRow.querySelector(".input-rate");
      const amountValue = parentItemRow.querySelector(
        ".item__row--amount-value"
      );
      updateAmount(quantityInput, rateInput, amountValue);
    }
  }
});

// Update Subtotal

function updateSubtotal() {
  let totalAmount = 0;
  document.querySelectorAll(".item__row").forEach(function (row) {
    const amount = parseFloat(
      row.querySelector(".item__row--amount-value").textContent
    );
    if (!isNaN(amount)) {
      totalAmount += amount;
    }
  });
  document.querySelector(".subtotal__value").textContent =
    totalAmount.toFixed(2);
}

// Update Total Value

discountInput.addEventListener("input", updateTotalValue);
taxInput.addEventListener("input", updateTotalValue);
shippingInput.addEventListener("input", updateTotalValue);

function updateTotalValue() {
  let discount = parseFloat(discountInput.value);
  let tax = parseFloat(taxInput.value);
  let shipping = parseFloat(shippingInput.value);
  let subtotal = parseFloat(subtotalValue.textContent);

  // console.log(discountInput.parentElement);
  const inpuDisBox = discountInput.parentElement;
  const inpuTaxBox = taxInput.parentElement;
  checkDisPerce = inpuDisBox
    .querySelector(".type-curr")
    .classList.contains("hide");
  checkTaxPerce = inpuTaxBox
    .querySelector(".type-curr")
    .classList.contains("hide");

  if (checkDisPerce) {
    discount = (subtotal * discount) / 100;
  }
  if (checkTaxPerce) {
    tax = (subtotal * tax) / 100;
  }
  const total = subtotal - discount + tax + shipping;

  if (total) {
    totalValue.textContent = total.toFixed(2);
  } else {
    totalValue.textContent = "0.00";
  }
}
updateTotalValue();

// Update Balance

function updateBalance() {
  const total = parseFloat(totalValue.textContent);
  const paidAmount = parseFloat(amountInput.value);

  const balanceValue = total - paidAmount;
  if (balanceValue) {
    balance.textContent = balanceValue.toFixed(2);
  } else {
    balance.textContent = "0.00";
  }
}
amountInput.addEventListener("input", function () {
  updateBalance();
});

discountInput.addEventListener("input", updateBalance);
taxInput.addEventListener("input", updateBalance);
shippingInput.addEventListener("input", updateBalance);

updateBalance();

// Add Item Row
addLineBtn.addEventListener("click", function () {
  const newItemRow = document.querySelector(".item__row").cloneNode(true);
  newItemRow.querySelector(".input-item").value = "";
  newItemRow.querySelector(".input-quntity").value = "1";
  newItemRow.querySelector(".input-rate").value = "";
  newItemRow.querySelector(".item__row--amount-value").textContent = "0.00";
  document
    .querySelector(".invoice__middle")
    .insertBefore(newItemRow, addLineItem);

  updateCloseIcon();
});

invoiceMiddle.addEventListener("mouseover", function (event) {
  const rows = document.querySelectorAll(".item__row");
  if (rows.length == 1) return;
  const target = event.target.closest(".item__row");
  if (target.classList.contains("item__row")) {
    const closeIcon = target
      .closest(".item__row")
      .querySelector(".item__line--close-icon");
    if (closeIcon) {
      closeIcon.style.display = "inline-block";
    }
  }
});
invoiceMiddle.addEventListener("mouseout", function (event) {
  if (window.innerWidth > 800) {
    const target = event.target.closest(".item__row");
    if (target.classList.contains("item__row")) {
      const closeIcon = target
        .closest(".item__row")
        .querySelector(".item__line--close-icon");
      if (closeIcon) {
        closeIcon.style.display = "none";
      }
    }
  }
});

invoiceMiddle.addEventListener("click", function (event) {
  const target = event.target;
  if (
    target
      .closest(".item__line--close-icon")
      .classList.contains("item__line--close-icon")
  ) {
    const itemRow = target.closest(".item__row");
    if (itemRow) {
      itemRow.remove();
    }
  }
  updateSubtotal();
  updateCloseIcon();
});

function validateInput(inp) {
  if (inp.value.trim() === "") {
    inp.classList.add("error");
  } else {
    inp.classList.remove("error");
  }
}
fromInput.addEventListener("input", function () {
  validateInput(fromInput);
});
toInput.addEventListener("input", function () {
  validateInput(toInput);
});

function showInput(inpBox, inpBtn) {
  inpBox.style.display = "flex";
  inpBtn.style.display = "none";
}
discountBtn.addEventListener("click", function () {
  showInput(discountBox, discountBtn);
});
shippingBtn.addEventListener("click", function () {
  showInput(shippingBox, shippingBtn);
});
taxBtn.addEventListener("click", function () {
  showInput(taxBox, taxBtn);
});

invoiceCalc.addEventListener("click", function (event) {
  const target = event.target;
  if (target.closest(".close-icon").classList.contains("close-icon")) {
    const item = target.closest(".box");
    if (item) {
      const dataBtn = `${item.dataset.box}-btn`;
      const dataBox = `${item.dataset.box}__box`;
      document.querySelector(`.${dataBtn}`).style.display = "flex";
      document.querySelector(`.${dataBox}`).style.display = "none";

      document.querySelector(`.${dataBox}`).querySelector(".inp").value = "0";
    }
  }
  updateSubtotal();
  updateTotalValue();
  updateBalance();
});

let toggle = true;
invoiceCalc.addEventListener("click", function (event) {
  const target = event.target;
  if (target.closest(".change-type").classList.contains("change-type")) {
    const doc = target.closest(".box");

    const item = doc.querySelector(".input-num");
    const currIcon = doc.querySelector(".type-curr");
    const percentage = doc.querySelector(".percentage");

    if (item && toggle) {
      percentage.style.display = "none";
      item.style.padding = "0.8rem 1rem 0.8rem 3rem";
      item.style.direction = "ltr";
      currIcon.classList.remove("hide");
      toggle = false;
    } else if (toggle == false) {
      percentage.style.display = "block";
      item.style.padding = "0.8rem 5.2rem 0.8rem 1rem";
      item.style.direction = "rtl";
      currIcon.classList.add("hide");

      toggle = true;
    }
  }
  updateSubtotal();
  updateTotalValue();
  updateBalance();
});

function updateCurrencyIcons(currencySymbol) {
  if (typeof currencySymbol == "object") {
    currency1.forEach((cur) => {
      cur.textContent = currencySymbol[0];
    });
    currency2.forEach((cur) => {
      cur.textContent = currencySymbol[1];
    });
  } else {
    currency.forEach((cur) => {
      cur.textContent = currencySymbol;
    });
  }
}

selectCurrency.addEventListener("change", function () {
  const selectedCurrency = selectCurrency.value;
  let currencySymbol;

  switch (selectedCurrency) {
    case "USD":
      currencySymbol = "$";
      break;
    case "EUR":
      currencySymbol = "€";
      break;
    case "INR":
      currencySymbol = ["Rs", "₹"];
      break;
    case "TTD":
      currencySymbol = "$";
      break;
    case "UZS":
      currencySymbol = "лв";
      break;
    case "SVC":
      currencySymbol = "$";
      break;
    case "SYP":
      currencySymbol = "£";
      break;

    default:
      currencySymbol = ["Rs", "₹"];
  }

  updateCurrencyIcons(currencySymbol);
});

function updateDownInvoiceState() {
  if (fromInput.value.trim() === "" || toInput.value.trim() === "") {
    downInvoices.forEach((downInvoice) => {
      downInvoice.style.opacity = "0.2";
      downInvoice.disabled = true;
      downInvoice.style.cursor = "no-drop";
      downInvoice.classList.add("disabled");
    });
  } else {
    downInvoices.forEach((downInvoice) => {
      downInvoice.style.opacity = "1";
      downInvoice.disabled = false;
      downInvoice.style.cursor = "pointer";
      downInvoice.classList.remove("disabled");
    });
  }
}

fromInput.addEventListener("input", updateDownInvoiceState);
toInput.addEventListener("input", updateDownInvoiceState);

updateDownInvoiceState();

saveDefault.addEventListener("click", function () {
  alert(
    "Do you want to make this invoice the default template, overwriting the current one?"
  );
  saveDefault.style.display = "none";
});

function updateCloseIcon() {
  const closeIcons = document.querySelectorAll(".item__line--close-icon");

  if (window.innerWidth < 800) {
    const rows = document.querySelectorAll(".item__row");
    if (rows.length === 1) {
      closeIcons.forEach((close) => {
        close.style.display = "none";
      });
    } else {
      closeIcons.forEach((close) => {
        close.style.display = "inline-block";
      });
    }
  } else {
    closeIcons.forEach((close) => {
      close.style.display = "none";
    });
  }
}
window.addEventListener("resize", updateCloseIcon);
updateCloseIcon();
