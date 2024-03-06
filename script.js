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
const discountBox = document.querySelector(".discount-box");
const shippingBox = document.querySelector(".shipping-box");

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
}

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

function updateTotal() {}

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

addLineBtn.addEventListener("click", function () {
  const newItemRow = document.querySelector(".item__row").cloneNode(true);
  newItemRow.querySelector(".input-item").value = "";
  newItemRow.querySelector(".input-quntity").value = "1";
  newItemRow.querySelector(".input-rate").value = "";
  newItemRow.querySelector(".item__row--amount-value").textContent = "0.00";
  document
    .querySelector(".invoice__middle")
    .insertBefore(newItemRow, addLineItem);
});

invoiceMiddle.addEventListener("mouseover", function (event) {
  const rows = document.querySelectorAll(".item__row");
  if (rows.length == 1) return;
  const target = event.target.closest(".item__row");
  console.log(target);
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
  const target = event.target.closest(".item__row");
  if (target.classList.contains("item__row")) {
    const closeIcon = target
      .closest(".item__row")
      .querySelector(".item__line--close-icon");
    if (closeIcon) {
      closeIcon.style.display = "none";
    }
  }
});

invoiceMiddle.addEventListener("click", function (event) {
  const target = event.target;
  if (target.classList.contains("item__line--close-icon")) {
    const itemRow = target.closest(".item__row");
    if (itemRow) {
      itemRow.remove();
    }
  }
  updateSubtotal();
});

discountBox.addEventListener("click", function (e) {
  const newDiscountBox = document.createElement("div");
  newDiscountBox.classList.add("discount-box");

  const discountLabel = document.createElement("input");
  discountLabel.setAttribute("type", "text");
  discountLabel.setAttribute("value", "Discount");
  discountLabel.classList.add("tax__tittle", "title");

  const discountInput = document.createElement("input");
  discountInput.setAttribute("type", "number");
  discountInput.classList.add("tax__input", "input-num");
  discountInput.setAttribute("value", "0");

  const discountPercentage = document.createElement("p");
  discountPercentage.classList.add("tax__percentage");
  discountPercentage.textContent = "%";
});
