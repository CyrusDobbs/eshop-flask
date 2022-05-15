function Item(id, collection, name, desc, price, img, sold, hidden) {
    this.id = id;
    this.collection = collection;
    this.name = name;
    this.desc = desc;
    this.price = price;
    this.img = img;
    this.sold = sold;
    this.hidden = hidden;

    this.getCardTitle = function () {
        return `<h4 class="card-title text-center mb-3">${this.name}</h4>`;
    }
    this.getCardDesc = function () {
        return `<p class="card-text">${this.desc.replaceAll("%NEWLINE%", "<br>")}</p>`;
    }
    this.getCardPrice = function () {
        if (this.sold) {
            return `<p class="card-text fs-5"><strike>£${this.price}</strike>  <span class="text-danger">SOLD</span></p>`;
        } else {
            return `<p class="card-text fs-5">£${this.price}</p>`;
        }
    }
    this.getCardImg = function () {
        return `<img src="/img/${this.id}" class="card-img-top">`;
    }
    this.getAdminButtons = function () {
        return `<div class="btn-group mx-auto" role="group">
                  <a href="/sold/${this.id}"><button type="button" class="btn btn-success">${this.sold ? "<b>Un-Sell</b>" : "Sold"}</button></a>
                  <a href="/hide/${this.id}"><button type="button" class="btn btn-warning">${this.hidden ? "<b>Un-Hide</b>" : "Hide"}</button></a>
                  <a href="/delete/${this.id}"><button type="button" class="btn btn-danger">Delete</button></a>
                </div>`
    }
}

const collections = []

$('.form-check-input').on('click', function () {
    console.log($(this))
    if ($(this).is(':checked')) {
        console.log('Checked', $(this)[0].value)
        collections.push($(this)[0].value)
    } else {
        console.log('Not Checked')
        const index = collections.indexOf($(this)[0].value);
        if (index > -1) {
            collections.splice(index, 1); // 2nd parameter means remove one item only
        }
    }
    display_items(collections)
});

function display_items(collections) {
    const items = []
    _items.forEach((element, i) => items[i] = new Item(element._id, element.collection, element.name, element.desc, element.price, element.img, element.sold, element.hidden))
    console.log(items)
    let html = `<div class="row row-cols-auto g-3">`;
    for (const i in items) {
        const item = items[i]
        if (item.hidden && !admin) {
            continue;
        }
        if (!collections.includes(item.collection)) {
            console.log(item.collection)
            console.log(collections)
            continue;
        }

        html += `<div class="col-md-6 col-lg-4 col-xl-3">
                    <div class="card bg-light h-100" >
                        ${item.getCardImg()}
                        <div class="card-body">
                            ${item.getCardTitle()}
                            ${item.getCardDesc()}
                            <hr>
                            ${item.getCardPrice()}
                        </div>
                        ${admin ? item.getAdminButtons() : ""}
                    </div>
                </div>`
    }
    html += `</div>`
    const cards = $("#itemCards")
    cards.empty()
    cards.append(html)
}

$(document).ready(function () {
    display_items(collections);
})

