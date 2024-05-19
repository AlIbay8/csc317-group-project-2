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
    const game_template = document.getElementById("gameTemplate")
    const game_grid = document.querySelector(".game-grid")
    
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

    fetch("/game/all").then((response) => response.json()).then( async (result) => {
        let cart_response = await fetch("/cart")
        let cart = []
        if (cart_response.ok) {
            cart = await cart_response.json()
        }

        console.log("before sort: ", result)

        result.sort((a, b) => {
            return a.date_published < b.date_published;
        })

        console.log("after sort: ", result)

        for (let game of result) {
            let game_in_cart = cart.some(g => g.product_id==game.id)
            const clone = game_template.content.cloneNode(true);
            let c_card = clone.querySelector(".game-card")
            let c_status = clone.querySelector(".game-status")
            let c_links = c_card.getElementsByClassName("game-link")
            let c_img = clone.querySelector(".game-img")
            let c_name = clone.querySelector(".game-name")
            let c_price = clone.querySelector(".game-price")
            let c_buy = clone.querySelector(".buy-btn")

            c_img.src = game.img
            c_name.textContent = game.name
            c_price.textContent = "$"+game.price
     
            for (let link of c_links) {
                link.href = `/product/${game.id}`
            }

            if (game_in_cart) {
                c_buy.disabled = true
                c_status.style.display = "inline-block";
            } else {
                c_buy.addEventListener("click", () => {
                    fetch(`/cart/add/${game.id}`, {
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
            
            game_grid.appendChild(clone)
        }
    });
});