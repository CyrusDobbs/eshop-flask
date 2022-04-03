function Item(id, type, name, desc, price, img, sold, hidden) {
    this.id = id;
    this.type = type;
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
        return `<p class="card-text">${this.desc}</p>`;
    }
    this.getCardPrice = function () {
        if (this.sold) {
            return `<p class="card-text fs-5 text-danger">SOLD</p>`;
        } else {
            return `<p class="card-text fs-5">£${this.price}</p>`;
        }
    }
    this.getCardImg = function () {
        return `<img src="/img/${this.id}" class="card-img-top">`;
    }
    this.getAdminButtons = function () {
        return `<div class="card-footer">
                    <div class="row">
                        <div class="col-auto">
                            <a href="/sold/${this.id}"><button type="button" class="btn btn-success">${this.sold ? "<b>Un-Sell</b>" : "Sold"}</button></a>
                        </div>
                        <div class="col-auto">
                            <a href="/hide/${this.id}"><button type="button" class="btn btn-warning">${this.hidden ? "<b>Un-Hide</b>" : "Hide"}</button></a>
                        </div>
                        <div class="col-auto">
                            <a href="/delete/${this.id}"><button type="button" class="btn btn-danger">Delete</button></a>
                        </div>
                    </div>
                </div>`
    }
}


$(document).ready(function () {
    const items = [];
    _items.forEach((element, i) => items[i] = new Item(element._id, element.type, element.name, element.desc, element.price, element.img, element.sold, element.hidden))

    const itemPerRow = 4
    let html = "";
    let count = 0;
    for (const i in items) {
        const item = items[i]
        if (item.hidden && !admin) {
            continue;
        }
        count += 1;
        if (count === 1 || count % (itemPerRow + 1) === 0) {
            html += `<div class="row g-3">`
        }

        html += `<div class="col-md-6 col-lg-4 col-xl-3 mb-3">
                    <div class="card bg-light h-100" >
                        <div class="h-70">
                            ${item.getCardImg()}
                        </div>
                        <div class="card-body">
                            ${item.getCardTitle()}
                            ${item.getCardDesc()}
                            <hr>
                            ${item.getCardPrice()}
                        </div>
                        ${admin ? item.getAdminButtons() : ""}
                    </div>
                </div>`

        if (count % (itemPerRow + 1) === itemPerRow) {
            html += `</div>`
        }
    }

    $("#itemCards").append(html)
})