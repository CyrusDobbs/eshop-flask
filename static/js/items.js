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
        return `<p class="card-text fs-5">£${this.price}.00</p>`;
    }
    this.getCardImg = function () {
        return `<img src="/img/${this.id}" class="card-img-top">`;
    }
}


$(document).ready(function () {
    const items = [];
    _items.forEach((element, i) => items[i] = new Item(element._id, element.type, element.name, element.desc, element.price, element.img))

    const itemPerRow = 4
    let html = "";
    let count = 0;
    for (const i in items) {
        const item = items[i]
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
                    </div>
                </div>`

        if (count % (itemPerRow + 1) === itemPerRow) {
            html += `</div>`
        }
        // else if (items.length - 1 == i) {
        //     for (let i = 0; i < 2 - count % 4; i++) {
        //         html += `<div class="col">
        //                     <div class="card" hidden>
        //                         <div class="card-body">
        //                         </div>
        //                     </div>
        //                 </div>`
        //     }
        // }
    }

    $("#itemCards").append(html)
})