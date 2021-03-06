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
            url: `${location.origin}/delete/${itemId}`,
            type: 'GET',
            dataType: 'json', // added data type
            success: function () {
                displayCollection();
            }
        })
    } else {
        $.ajax({
            url: `${location.origin}/update/${func}/${itemId}`,
            type: 'GET',
            dataType: 'json', // added data type
            success: function (item) {
                const cardHTML = getInnerCardHTML(item);
                $(`#card-${itemId}`).html(cardHTML);
            }
        })
    }
});

function displayCollection() {
    const collection = $('input[name="collectionRadios"]:checked').val();
    return $.ajax({
        url: `${location.origin}/get_items/`,
        type: 'GET',
        dataType: 'json', // added data type
        data: {"collection": collection},
        success: function (data) {
            let item_html = `<div class=\"row row-cols-auto g-3\">`;
            for (let i = 0; i < data.length; i++) {
                item_html += `<div class="col-md-6 col-lg-4 col-xl-3">
                                <div class="card bg-light h-100 shadow-sm" id="card-${data[i]._id}">
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
    return `<img src="/img/${item._id}_0" class="card-img-top">
            <div class="card-body bg-white pb-0">
                <h4 class="card-title text-center mb-4">${item.name}</h4>
                ${!admin ? `<a href="/item/${item._id}" class="stretched-link"></a>` : ""}
            </div>
            <div class="card-footer border-top-0 bg-white text-center">${getPriceHTML(item)}</div>
            ${admin ? getAdminHTML(item) : ""}`
}

function getAdminHTML(item) {
    return `<div class="btn-group mb-1" role="group">
              <button id="sold-${item._id}" class="btn btn-outline-secondary admin-button">${item.sold ? "<b>Un-Sell</b>" : "Sold"}</button>
              <button id="hidden-${item._id}" class="btn btn-outline-secondary admin-button">${item.hidden ? "<b>Un-Hide</b>" : "Hide"}</button>
              <button id="delete-${item._id}" class="btn btn-outline-secondary admin-button">Delete</button>
              
            </div><a id="view-${item._id}" href="/item/${item._id}" class="btn btn-outline-secondary">View</a>`
}

function getPriceHTML(item) {
    if (item.sold) {
        return `<p class="card-text fs-5">??${item.price}   <span class="text-danger">SOLD</span></p>`;
    } else {
        return `<p class="card-text fs-5">??${item.price}</p>`;
    }
}



