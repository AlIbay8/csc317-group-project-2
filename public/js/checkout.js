document.addEventListener("DOMContentLoaded", function() {
    const game_template = document.getElementById("gameTemplate")
    const cart_list = document.getElementById("cartList")
    const total_price = document.getElementById("totalPrice")

    const cart_btn = document.getElementById("cartBtn")
    function updateCartCount() {
        fetch("/cart").then((response) => response.json()).then((result) => cart_btn.innerText = "Cart: " + (result.length ? result.length : 0));
    }
    updateCartCount();

    function updateTotalPrice() {
        fetch("/cart").then(async (response) => {
            if (response.ok) {
                let products = await response.json()
                let price = await products.reduce(async (acc, item) => {
                    let game_response = await fetch(`/game/${item.product_id}`)
                    if (game_response.ok) {
                        let game = await game_response.json()
                        console.log(game)
                        return await acc+game.price
                    }
                }, 0);
                console.log(Math.round(price * 100) / 100)
                total_price.textContent = "$" + Math.round(price * 100) / 100
            }
        })
    }
    updateTotalPrice();

    fetch("/cart").then((response) => response.json()).then( async (result) => {
        console.log(result)
        let price = 0;
        for (let item of result) {
            fetch(`/game/${item.product_id}`)
                .then((response) => response.json())
                .then(game => {
                    const clone = game_template.content.cloneNode(true);
                    let c_img = clone.querySelector(".game-img")
                    let c_name = clone.querySelector(".game-name")
                    let c_price = clone.querySelector(".game-price")
                    let c_remove = clone.querySelector(".remove-btn")
                    let c_card = clone.querySelector(".game-card")

                    c_img.src = game.img
                    c_name.textContent = game.name
                    c_price.textContent = "$"+game.price
                    price += game.price ? game.price : 0

                    cart_list.appendChild(clone)
                    c_remove.addEventListener("click", () => {
                        fetch(`/cart/remove/${game.id}`, {
                            method: 'POST'
                        }).then(response => {
                            if (response.ok) {
                                cart_list.removeChild(c_card);
                                updateCartCount();
                                updateTotalPrice();
                            } else {
                                alert("Couldn't remove game from cart");
                            }
                        }).catch(err => alert(err));
                    })
                })
        }
        total_price.textContent = "$"+price;
    });
});