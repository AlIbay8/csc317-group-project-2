document.addEventListener("DOMContentLoaded", async (event) => {
    console.log("DOM fully loaded and parsed");
    // fetch("/game/all").then((response) => response.json()).then((result) => console.log(result));
    // fetch("/game/1").then((response) => response.json()).then((result) => console.log(result));

    // fetch('/cart/add/1', {
    //     method: 'POST'
    // }).then((response) => console.log(response));

    // fetch("/cart").then((response) => response.json()).then((result) => console.log(result));
    // <div class="game-card">
    //     <img class="game-img" src="/resources/T8H-thumbnail-small.gif">
    //     <div class="game-info">
    //         <h3 class="game-name">The 8th Hour</h3>
    //         <div class="buy-row">
    //             <p class="game-price">$7.99</p>
    //             <button class="buy-btn">Add to Cart</button>
    //         </div>
    //     </div>
    // </div>
    
    const cart_btn = document.getElementById("cartBtn")
    function updateCartCount() {
        fetch("/cart").then((response) => response.json()).then((result) => cart_btn.innerText = "Cart: " + (result.length ? result.length : 0));
    }
    updateCartCount();

    const search_btn = document.getElementById("searchBtn")
    search_btn.addEventListener("click", () => {
        const search_bar = document.getElementById("searchBar")
        let query = search_bar.value.toLowerCase().split(" ")
        console.log(query)
        fetch("/game/all").then((response) => response.json()).then((games) => {
            let result = games.reduce((fit, curr) => {
                let score = 0;
                for (let word of query) {
                    if (curr.name.toLowerCase().includes(word)) {
                        score++;
                    }
                }
                return score==query.length ? curr : fit;
            }, null)
            console.log(result)
            if (result===null) {
                alert("Couldn't find game")
            } else {
                window.location.href = `/product/${result.id}`;
            }
        });
    })

    fetch(`/game/${game_id}`).then((response) => response.json()).then( async (result) => {
        let cart_response = await fetch("/cart")
        let cart = []
        if (cart_response.ok) {
            cart = await cart_response.json()
        }

        let game_in_cart = cart.some(g => g.product_id==game_id)
        let c_status = document.querySelector(".game-status")
        let c_buy = document.querySelector(".buy-btn")
        
        if (game_in_cart) {
            c_buy.disabled = true
            c_status.style.display = "inline-block";
        } else {
            c_buy.addEventListener("click", () => {
                fetch(`/cart/add/${game_id}`, {
                    method: 'POST'
                }).then(response => {
                    if (response.ok) {
                        c_buy.disabled = true
                        c_status.style.display = "inline-block";
                        updateCartCount();
                    } else {
                        alert("Please log in to add games to cart.");
                    }
                }).catch(err => alert(err));
            })
        }
    });

});