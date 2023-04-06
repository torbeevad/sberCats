const storage = window.localStorage
const content = document.getElementsByClassName('content')[0]
const form = document.forms[0]
const closeBtn = document.querySelector(".close-btn")
const addBtn = document.querySelector(".add-btn")
const refreshBtn = document.querySelector(".refresh-btn")

let idFlag = 0

document.addEventListener("click", (e) => console.log(e.target))

const refreshCatsAndContentSync = () => {
    const content = document.getElementsByClassName('content')[0];
    content.innerHTML = '';

    const sortCats = JSON.parse(storage.getItem('cats')).sort((a, b) => a.id - b.id)
    const cards = sortCats.reduce(
        (acc, el) => (acc += generateCard(el)),
        ''
    );
    content.insertAdjacentHTML('afterbegin', cards);
};

const refreshCatsAndContent = () => {
    const content = document.getElementsByClassName('content')[0];
    content.innerHTML = '';

    api.getIdsOfCat().then((res) => {
        storage.setItem('ids', JSON.stringify(res.sort((a, b) => a - b)))
    })

    api.getAllCats().then((res) => {
        storage.setItem('cats', JSON.stringify(res.sort((a, b) => a.id - b.id)))
    }).then(() => refreshCatsAndContentSync())
};

refreshCatsAndContent();

const getNewIdOfCatSync = () => {
    let arr = JSON.parse(storage.getItem('cats')).map(el => el.id).sort((a, b) => a - b)

    if (!arr.length) {
        idFlag = 1
        return 1
    } else {
        for (let i = 0; i <= arr.length; i++) {
            if (i + 1 !== arr[i]) {
                idFlag = i + 1
                return i + 1
            }
        }
    }
};

content.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        switch (event.target.className) {
            case 'cat-card-view-btn': {
                openCatCardPopup(Number(event.target.value))
                break
            }
            case 'cat-card-update-btn': {
                document.querySelector(".create-edit-modal-form").classList.add("active");
                document.querySelector("#id").value = event.target.value;
                dataCatOnUpdateForm(Number(event.target.value))
                idFlag = event.target.value;
                break;
            }
            case 'cat-card-delete-btn': {
                api.deleteCat(event.target.value).then((res) => {
                    console.log(res);
                    deleteCatFromLocalStorage(event.target.value)
                    refreshCatsAndContentSync();
                });
                break
            }
        }
    }
});

const addCatInLocalStorage = (cat) => {
    storage.setItem(
        'cats',
        JSON.stringify([...JSON.parse(storage.getItem('cats')), cat].sort((a, b) => a.id - b.id))
    );
    storage.setItem("ids", JSON.stringify([...JSON.parse(storage.getItem('ids')), cat.id].sort((a, b) => a - b)))
};

const deleteCatFromLocalStorage = (catId) => {
    storage.setItem(
        'cats',
        JSON.stringify(
            JSON.parse(storage.getItem('cats')).filter((el) => el.id !== Number(catId))
        )
    );
    storage.setItem("ids", JSON.stringify(JSON.parse(storage.getItem('ids')).filter((el) => el !== Number(catId))))
};

const updateCatInLocalStorage = (cat) => {
    const cats = JSON.parse(storage.getItem('cats'))
    cats.splice(cat.id - 1, 1, cat)
    storage.setItem("cats", JSON.stringify(cats))
}

const openCatCardPopup = (value) => {
    const eventCat = JSON.parse(storage.getItem('cats'))[value - 1]
    console.log(eventCat)
    const content = document.getElementsByClassName('content')[0];
    content.insertAdjacentHTML('afterbegin', generateCatCardPopup(eventCat));

    let catPopup = document.querySelector('.popup-wrapper-cat-card');
    let closeCatPopup = document.querySelector('.popup-close-cat-card');
    closeCatPopup.addEventListener('click', () => {
        catPopup.remove();
    });
};

const dataCatOnUpdateForm = (value) => {
    const eventCat = JSON.parse(storage.getItem('cats'))[value - 1]
    document.querySelector(".form-h2").innerText = "Изменить питомца"
    document.querySelector("#name").placeholder = eventCat.name;
    document.querySelector("#age").placeholder = eventCat.age;
    document.querySelector("#rate").placeholder = eventCat.rate;
    document.querySelector("#description").placeholder = eventCat.description;
    document.querySelector(".form-img").style.backgroundImage = `url(${eventCat.image})`;
    document.querySelector("#image").value = eventCat.image;
    document.querySelector("#submit").innerText = "Изменить";
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const body = Object.fromEntries(formData.entries());
    body.id = Number(body.id)
    body.age = Number(body.age)
    body.rate = Number(body.rate)
    body.favourite = document.querySelector("#favourite").checked
    console.log("body", body)

    if (storage.ids.includes(Number(idFlag))) {
        api.updateCat(body).then(res => {
            console.log(res)
            updateCatInLocalStorage(body)
            refreshCatsAndContentSync();
        })
    } else {
        api.addCat(body).then(res => {
            console.log(res);
            addCatInLocalStorage(body)
            refreshCatsAndContentSync()
        })
    }
    form.reset()
    document.querySelector(".create-edit-modal-form").classList.remove("active")
});

addBtn.addEventListener("click", (event) => {
    event.preventDefault();
    form.reset()
    document.querySelector("#id").value = getNewIdOfCatSync()
    refreshCatsAndContentSync()
    document.querySelector(".create-edit-modal-form").classList.add("active");
})

closeBtn.addEventListener("click", (event) => {
    form.reset()
    document.querySelector(".create-edit-modal-form").classList.remove("active");
})

refreshBtn.addEventListener("click", () => refreshCatsAndContent())