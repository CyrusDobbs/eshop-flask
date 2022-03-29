function Item(id, type, name, desc, price, img) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.desc = desc;
    this.price = price;
    this.img = img;

    this.getCardTitle = function () {
        return `<h4 class="card-title text-center mb-3">${this.name}</h4>`;
    }
    this.getCardDesc = function () {
        return `<p class="card-text">${this.desc}</p>`;
    }
    this.getCardPrice = function () {
        return `<p class="card-text fs-5">£${this.price}</p>`;
    }
    this.getCardImg = function () {
        return `<img src="/img/${this.type}/${this.id}" class="card-img-top">`;
    }
}


$(document).ready(function () {
    const items = [];
    _items.forEach((element, i) => items[i] = new Item(element._id, element.type, element.name, element.desc, element.price, element.img))

    let html = "";
    let count = 0;
    for (const i in items) {
        const item = items[i]
        count += 1;
        if (count === 1 || count % 4 === 0) {
            html += `<div class="row my-2">`
        }

        html += `<div class="col">
                    <div class="card">
                        ${item.getCardImg()}
                        <div class="card-body">
                            ${item.getCardTitle()}
                            ${item.getCardDesc()}
                            <hr>
                            ${item.getCardPrice()}
                        </div>
                    </div>
                </div>`

        if (count % 4 === 3) {
            html += `</div>`
        } else if (items.length - 1 == i) {
            for (let i = 0; i < 2 - count % 4; i++) {
                html += `<div class="col">
                            <div class="card" hidden>
                                <div class="card-body">
                                </div>
                            </div>
                        </div>`
            }
        }
    }

    $("#itemCards").append(html)
})