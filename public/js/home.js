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
    const sort_filter = document.getElementById("sortFilter")
    const keyword_input = document.getElementById("keywordInput")
    const keyword_btn = document.getElementById("keywordBtn")
    const reset_btn = document.getElementById("resetFilterBtn")


    const cart_btn = document.getElementById("cartBtn")
    function updateCartCount() {
        fetch("/cart").then((response) => response.json()).then((result) => cart_btn.innerText = "Cart: " + (result.length ? result.length : 0));
    }
    updateCartCount();

    const search_btn = document.getElementById("searchBtn")
    search_btn.addEventListener("click", () => {
        const search_bar = document.getElementById("searchBar")
        let query = search_bar.value.toLowerCase().split(" ")
        if (search_bar.value=="") {
            return
        }
        
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

    function displayGames(sort, filter) {
        fetch("/game/all").then((response) => response.json()).then( async (result) => {
            game_grid.textContent = "";
            let cart_response = await fetch("/cart")
            let cart = []
            if (cart_response.ok) {
                cart = await cart_response.json()
            }
    
            if (filter!=undefined && filter!="") {
                let filter_query = filter.toLowerCase().split(" ")
                result = result.filter((game) => {
                    let score = 0;
                    for (let word of filter_query) {
                        if (game.name.toLowerCase().includes(word) || game.developer.toLowerCase().includes(word) || game.genre.toLowerCase().includes(word)) {
                            score++;
                        }
                    }
                    return (score==filter_query.length)
                })
            }
            
            result.sort((a,b) => {
                let compare_a = a.date_published
                let compare_b = b.date_published
                switch (sort) {
                    case "new-old":
                        compare_a = a.date_published
                        compare_b = b.date_published
                        break;
                    case "old-new":
                        compare_a = b.date_published
                        compare_b = a.date_published
                        break;
                    case "low-high":
                        compare_a = b.price
                        compare_b = a.price
                        break;
                    case "high-low":
                        compare_a = a.price
                        compare_b = b.price
                        break;
                    default:
                        compare_a = a.date_published
                        compare_b = b.date_published
                        break;
                }
                if (compare_a < compare_b) {
                    return 1;  
                } else {
                    return -1;
                }
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
                        c_buy.disabled = true
                        fetch(`/cart/add/${game.id}`, {
                            method: 'POST'
                        }).then(response => {
                            if (response.ok) {
                                c_buy.disabled = true
                                c_status.style.display = "inline-block";
                                updateCartCount();
                            } else {
                                c_buy.disabled = false
                                alert("Please log in to add games to cart.");
                            }
                        }).catch(err => alert(err));
                    })
                }
                
                game_grid.appendChild(clone)
            }
        });
    }
    
    displayGames();

    function remToPixels(rem) {    
        return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

    const sticky_element = document.getElementById('stickyElement');
    const sticky_top = sticky_element.offsetTop
    window.addEventListener('scroll', function() {
        var scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > sticky_top - remToPixels(10)) {
            sticky_element.classList.add('sticky');
        } else {
            sticky_element.classList.remove('sticky');
        }
    });

    sort_filter.addEventListener("change", () => {
        // console.log(sort_filter.value)
        // displayGames(sort_filter.value)
        
        displayGames(sort_filter.value, keyword_input.value);
        
    })

    keyword_btn.addEventListener("click", () => {
        if (keyword_input.value!="") {
            displayGames(sort_filter.value, keyword_input.value);
        }
    })

    reset_btn.addEventListener("click", () => {
        displayGames();
        keyword_input.value=""
        sort_filter.value="new-old"
    })
});