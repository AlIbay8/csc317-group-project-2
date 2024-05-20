# csc317-group-project-2
E commerce website for CSC 317

## Overview
![steak_banner](https://github.com/AlIbay8/csc317-group-project-2/assets/43456952/4d82f627-733f-42e5-b1a0-7f8a63ec590b)

For the final project, we chose to create an e-commerce website which focused on selling games, similar to our (overt) inspiration Steam.

Our service, Steak, currently sells my games along with a few other games made in Pico-8 or Godot.

It features:
- Account creation complete with a customizable profile picture, name, email, and bio.
- Logging in / logging out
- Product pages
- Search bar
- Add/remove from cart (when logged in) 

## Resources used:
- <https://developer.mozilla.org/en-US/docs/Web/API/FileReader>
- <https://stackoverflow.com/questions/19917401/error-request-entity-too-large>
- <https://blog.stackademic.com/auto-resizing-grid-layout-with-html-css-3ec0e3b56c52>
- <https://www.geeksforgeeks.org/use-ejs-as-template-engine-in-node-js/>
- <https://github.com/TryGhost/node-sqlite3/wiki/API>
- <https://www.w3schools.com/sql/sql_ref_keywords.asp>
- <https://www.w3schools.com/sql/sql_datatypes.asp>

## Database structure:
<ins>Users</ins>
- id (primary key)
- name
- email
- password
- bio

<ins>Products</ins>
- id (primary key)
- name
- price
- genre
- description
- date\_published
- developer

<ins>Cart Items</ins>
- id (primary key)
- product\_id
- user\_id

## Issues Faced / Lessons Learned:
- Storing a user uploaded image. While I don't know if this is the intended solution for this, I used Javascript's FileReader to obtain the raw data of an image the user uploads as base64. Since this gives me a string, I store it in the SQL database with a datatype of MEDIUMBLOB. I chose MEDIUMBLOB because it holds about 16,000,000 bytes of data (16 mb), which was suitable for the profile pictures because I set a limit of 1 mb.

- SQL parametrized queries don't support placeholders for columns. When registering a new user, I was using placeholders for both columns and values to insert into the table (? = ?). It turns out that this isn't supported, or maybe I was doing something wrong, but I ended up using string literals to build the SQL query to allow for dynamic columns.

- Express request parameters. Not necessarily an issue, but a cool thing I learned while making routes for use with fetch api in the frontend Javascript. I thought passing primitive variables through request parameters looked cleaner and more readable than passing and obtaining variables through a request body

- Dynamic routes (with request parameters). I used the request parameters mentioned above with EJS to create product pages for each game. There is one product ejs file that acts as a template for the product page, and in the get request, I replace the placeholders with the corresponding values of the game_id in the request parameters.

- Javascript array sort quirks. I use Javascript's array sort to sort the products on the homepage from newest to oldest. In this example, a.date_published is a string of a date ("2024-05-16"):
```javascript
result.sort((a,b) => {
    return (a.date_published < b.date_published)
})
```
  This worked fine when testing on Firefox but when deploying and testing on Chromium browsers, the sort wasn't doing anything. To fix this, I refactored to sort to manually return a value for each case.
```javascript
result.sort((a,b) => {
    if (a.date_published < b.date_published) {
        return 1;  
    } else {
        return -1;
    }
})
```
- HTML template elements. I thought I would have to use the DOM API to create templates of elements to clone and append to the HTML (that's what I did in Assignment 6). Luckily I discovered templates in HTML which allow me to write out template HTML and then clone it in Javascript. I use this for displaying the products on the home page and cart.
```html
<template id="gameTemplate">
<div class="game-card">
    <p class="game-status">In Cart</p>
    <a class="game-link"><img class="game-img" src="/resources/T8H-thumbnail-small.gif"></a>
    <div class="game-info">
        <a class="game-link"><h3 class="game-name">The 8th Hour</h3></a>
        <div class="buy-row">
            <p class="game-price">$7.99</p>
            <button class="buy-btn">Add to Cart</button>
        </div>
    </div>
</div>
</template>
```
- Duplicate items could be added to cart. I thought I had this covered by disabling the add to cart button when adding an item to cart, but it users could spam click to get multiple add game requests in before one can resolve. I fixed this by disabling the button immediately after click, before the post request gets sent.
  Before:
```javascript
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
```
  After:
```javascript
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
```
