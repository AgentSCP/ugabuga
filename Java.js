// Select relevant HTML elements
const filterButtons = document.querySelectorAll("#filter-buttons button");
const filterableCards = document.querySelectorAll("#filterable-cards .card");

// Function to filter cards based on filter buttons
const filterCards = (e) => {
    document.querySelector("#filter-buttons .active");
    e.target.classList.add("active");

    filterableCards.forEach(card => {
        // show the card if it matches the clicked filter or show all cards if "all" filter is clicked
        if (card.dataset.name === e.target.dataset.filter || e.target.dataset.filter === "all") {
            return card.classList.replace("hide", "show");
        }
        card.classList.add("hide");
    });
}

filterButtons.forEach(button => button.addEventListener("click", filterCards)); 





// Утилиты

function toNum(str) {
    const num = Number(str.replace(/ /g, ""));
    return num;
  }
  
  function toCurrency(num) {
    const format = new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(num);
    return format;
  }
  
  // Корзина
  
  const cardAddArr = Array.from(document.querySelectorAll(".card__add"));
  const cartNum = document.querySelector("#cart_num");
  const cart = document.querySelector("#cart");
  
  class Cart {
    products;
    constructor() {
      this.products = [];
    }
    get count() {
      return this.products.length;
    }
    addProduct(product) {
      this.products.push(product);
    }
    removeProduct(index) {
      this.products.splice(index, 1);
    }
    get cost() {
      const prices = this.products.map((product) => {
        return toNum(product.price);
      });
      const sum = prices.reduce((acc, num) => {
        return acc + num;
      }, 0);
      return sum;
    }

    // get costDiscount() {
    //   const prices = this.products.map((product) => {
    //     return toNum(product.priceDiscount);
    //   });
    //   const sum = prices.reduce((acc, num) => {
    //     return acc + num;
    //   }, 0);
    //   return sum;
    // }
    // get discount() {
    //   return this.cost - this.costDiscount;
    // }
    
  }


  
  class Product {
    imageSrc;
    name;
    number;
    price;
    priceDiscount;
    constructor(card) {
      this.imageSrc = card.querySelector(".card__image").children[0].src;
      this.name = card.querySelector(".card__title").innerText;
      this.price = card.querySelector(".card__price--common").innerText;    
    //   this.priceDiscount = card.querySelector(".card__price--discount").innerText;
    }
  }
  
  const myCart = new Cart();
  
  if (localStorage.getItem("cart") == null) {
    localStorage.setItem("cart", JSON.stringify(myCart));
  }
  
  const savedCart = JSON.parse(localStorage.getItem("cart"));
  myCart.products = savedCart.products;
  // cartNum.textContent = myCart.count;
  
  myCart.products = cardAddArr.forEach((cardAdd) => {
    cardAdd.addEventListener("click", (e) => {
      e.preventDefault();
      const card = e.target.closest(".card");
      const product = new Product(card);
      const savedCart = JSON.parse(localStorage.getItem("cart"));
      myCart.products = savedCart.products;
      myCart.addProduct(product);
      localStorage.setItem("cart", JSON.stringify(myCart));
    });
  });
  
  // Попап
  
  const popup = document.querySelector(".popup");
  const popupClose = document.querySelector("#popup_close");
  const body = document.body;
  const popupContainer = document.querySelector("#popup_container");
  const popupProductList = document.querySelector("#popup_product_list");
  const popupCost = document.querySelector("#popup_cost");
  const popupDiscount = document.querySelector("#popup_discount");
  const popupCostDiscount = document.querySelector("#popup_cost_discount");
  
  cart.addEventListener("click", (e) => {
    e.preventDefault();
    popup.classList.add("popup--open");
    body.classList.add("lock");
    popupContainerFill();
  });
  
  function popupContainerFill() {
    popupProductList.innerHTML = null;
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    myCart.products = savedCart.products;
    const productsHTML = myCart.products.map((product) => {
      const productItem = document.createElement("div");
      productItem.classList.add("popup__product");
  
      const productWrap1 = document.createElement("div");
      productWrap1.classList.add("popup__product-wrap");
      const productWrap2 = document.createElement("div");
      productWrap2.classList.add("popup__product-wrap");
  
      const productImage = document.createElement("img");
      productImage.classList.add("popup__product-image");
      productImage.setAttribute("src", product.imageSrc);
  
      const productTitle = document.createElement("h2");
      productTitle.classList.add("popup__product-title");
      productTitle.innerHTML = product.name;
  
        const productNumber = document.createElement('h2');
        productNumber.classList.add("popup__product-number");
        productNumber.innerHTML = product.number;

      const productPrice = document.createElement("div");
      productPrice.classList.add("popup__product-price");
      productPrice.innerHTML = toCurrency(product.price);
  
      const productAdd = document.createElement("button");
      productAdd.classList.add("popup__product-add"); 
      productAdd.innerHTML = "<img src='C:\\Users\\Grisha\\Downloads\\icon_plus_.png' alt=''>";    

      const productDelete = document.createElement("button");
      productDelete.classList.add("popup__product-delete"); 
      productDelete.innerHTML = "<img src='C:\\Users\\Grisha\\Downloads\\icon_minus_.png' alt=''>";
  
      productDelete.addEventListener("click", () => {
        myCart.removeProduct(product);
        localStorage.setItem("cart", JSON.stringify(myCart));
        popupContainerFill();
      });

      productAdd.addEventListener("click", () => {
        popupContainerFill();
      })
  
      productWrap1.appendChild(productImage);
      productWrap1.appendChild(productTitle);
        productWrap2.appendChild(productNumber);
      productWrap2.appendChild(productPrice);
      productWrap2.appendChild(productAdd);
      productWrap2.appendChild(productDelete);
      productItem.appendChild(productWrap1);
      productItem.appendChild(productWrap2);
  
      return productItem;
    });
  
    productsHTML.forEach((productHTML) => {
      popupProductList.appendChild(productHTML);
    });
  
    popupCost.value = toCurrency(myCart.cost);
    // popupDiscount.value = toCurrency(myCart.discount);
    // popupCostDiscount.value = toCurrency(myCart.costDiscount);
  }
  
  popupClose.addEventListener("click", (e) => {
    e.preventDefault();
    popup.classList.remove("popup--open");
    body.classList.remove("lock");
  });
  