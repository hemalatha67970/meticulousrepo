export class ShoppingCart {
  static LISTENERS = [];

  static addItem(itemId) {
    const curContents = ShoppingCart.getCartContents();
    if (!curContents.includes(itemId)) {
      curContents.push(itemId);
      ShoppingCart.setCartContents(curContents);
    }
  }

  static removeItem(itemId) {
    const curContents = ShoppingCart.getCartContents();
    const itemIndex = curContents.indexOf(itemId);
    if (itemIndex >= 0) {
      curContents.splice(itemIndex, 1);
      ShoppingCart.setCartContents(curContents);
    }
  }

  static isItemInCart(itemId) {
    return ShoppingCart.getCartContents().includes(itemId);
  }

  static getCartContents() {
    let curContents = window.localStorage.getItem("cart-contents");
    return curContents ? JSON.parse(curContents) : [];
  }

  static setCartContents(newContents) {
    window.localStorage.setItem("cart-contents", JSON.stringify(newContents));
    ShoppingCart.notifyListeners();
  }

  static resetCart() {
    window.localStorage.removeItem("cart-contents");
    ShoppingCart.notifyListeners();
  }

  static registerCartListener(handler) {
    if (typeof handler === "function") {
      ShoppingCart.LISTENERS.push(handler);
    }
  }

  static notifyListeners() {
    ShoppingCart.LISTENERS.forEach((listener) => {
      if (typeof listener === "function") {
        listener();
      } else if (listener && typeof listener.forceUpdate === "function") {
        listener.forceUpdate();
      }
    });
  }
}
