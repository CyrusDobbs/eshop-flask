$(document).ready(function () {
    displayCollection();
})

$('.collection-radio').on('click', function () {
    displayCollection()
});

$('#itemCards').on('click', '.admin-button', function () {
    console.log("admin click")
    const func = this.id.split('-')[0].toLowerCase()
    const itemId = this.id.split('-')[1]
    if (func === "delete") {
        $.ajax({
        url: `http://127.0.0.1:5000/delete/${itemId}`,
        type: 'GET',
        dataType: 'json', // added data type
        success: function () {
            $(`#card-${itemId}`).remove();
            }
        })
    } else {
        $.ajax({
        url: `http://127.0.0.1:5000/update/${func}/${itemId}`,
        type: 'GET',
        dataType: 'json', // added data type
        success: function (item) {
            const cardHTML = getInnerCardHTML(item)
            $(`#card-${itemId}`).html(cardHTML);
            }
        })
    }
});

function displayCollection() {
    const collection = $('input[name="collectionRadios"]:checked').val();
    return $.ajax({
        url: "http://127.0.0.1:5000/get_items/",
        type: 'GET',
        dataType: 'json', // added data type
        data: {"collection": collection},
        success: function (data) {
            let item_html = `<div class=\"row row-cols-auto g-3\">`;
            for (let i = 0; i < data.length; i++) {
                item_html += `<div class="col-md-6 col-lg-4 col-xl-3">
                                <div class="card bg-light h-100" id="card-${data[i]._id}">
                                    ${getInnerCardHTML(data[i])}
                                </div>
                            </div>`;
            }
            item_html += "</div>";
            const cards = $("#itemCards")
            cards.empty()
            cards.append(item_html)
        }
    });
}

function getInnerCardHTML(item) {
    return `<img src="/img/${item._id}" class="card-img-top">
            <div class="card-body">
                <h4 class="card-title text-center mb-3">${item.name}</h4>
                <p class="card-text m-0">${item.materials.replaceAll("%NEWLINE%", "<br>")}</p>   
                <p class="card-text m-0">${item.dimensions.replaceAll("%NEWLINE%", "<br>")}</p>   
                ${item.other ? `<p class="card-text m-0">${item.other.replaceAll("%NEWLINE%", "<br>")}</p>` : ""}
            </div>
            <div class="card-footer">${getPriceHTML(item)}</div>
            ${admin ? getAdminHTML(item) : ""}`
}

function getAdminHTML(item) {
    return `<div class="btn-group" role="group">
              <button id="sold-${item._id}" class="btn btn-outline-primary admin-button">${item.sold ? "<b>Un-Sell</b>" : "Sold"}</button>
              <button id="hidden-${item._id}" class="btn btn-outline-primary admin-button">${item.hidden ? "<b>Un-Hide</b>" : "Hide"}</button>
              <button id="delete-${item._id}" class="btn btn-outline-primary admin-button">Delete</button>
            </div>`
}

function getPriceHTML(item) {
    if (item.sold) {
        return `<p class="card-text fs-5">£${item.price}   <span class="text-danger">SOLD</span></p>`;
    } else {
        return `<p class="card-text fs-5">£${item.price}</p>`;
    }
}



