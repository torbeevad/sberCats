const homepage = document.getElementById('homepage');
const storage = window.localStorage
console.log(homepage)

document.addEventListener(("click"), (e) => console.log(e.target))

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

let idFlag = 0

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

document
    .getElementsByClassName('content')[0]
    .addEventListener('click', (event) => {
        document.querySelector(".create-edit-modal-form").classList.remove("active")
        document.querySelector(".cat-card-view").classList.remove("active")
        if (event.target.tagName === 'BUTTON') {
            switch (event.target.className) {
                case 'cat-card-view-btn': {
                    console.log(event.target)
                    document.querySelector(".cat-card-view").classList.toggle("active");
                    break
                }
                case 'cat-card-update-btn': {
                    document.querySelector(".create-edit-modal-form").classList.add("active");
                    document.querySelector("#id").value = event.target.value;
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
            JSON.parse(storage.getItem('cats')).filter((el) => el.id !== Number(catId)) // загуглить и поиграться с filter
        )
    );
    storage.setItem("ids", JSON.stringify(JSON.parse(storage.getItem('ids')).filter((el) => el !== Number(catId))))
};

const updateCatInLocalStorage = (cat) => {
    cat.id = Number(cat.id)
    const cats = JSON.parse(storage.getItem('cats'))
    cats.splice(cat.id - 1, 1, cat)
    storage.setItem("cats", JSON.stringify(cats))
}

document.forms[0].addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(document.forms[0]);
    const body = Object.fromEntries(formData.entries());

    body.id = Number(body.id)
    body.age = Number(body.age)
    body.rate = Number(body.rate)

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
    document.querySelector(".create-edit-modal-form").classList.remove("active")
});

document.querySelector(".add-btn").addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelector("#id").value = getNewIdOfCatSync()
    refreshCatsAndContentSync()
    document.querySelector(".create-edit-modal-form").classList.toggle("active");
})

document.querySelector(".refresh-btn").addEventListener("click", () => refreshCatsAndContentSync())