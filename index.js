const homepage = document.getElementById('homepage');
console.log(homepage);


const refreshCatsAndContent = () => {
    const content = document.getElementsByClassName('content')[0];
    content.innerHTML = '';

    api.getAllCats().then((res) => {
        console.log(res);
        const cards = res.reduce((acc, el) => (acc += generateCard(el)), '');
        content.insertAdjacentHTML('afterbegin', cards);
    });
};

refreshCatsAndContent();


let allIds = []
let idFlag = 0
api.getIdsOfCat().then((res) => {
    allIds = res
})


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
                        refreshCatsAndContent();
                    });
                    break
                }
            }

        }
    });


document.forms[0].addEventListener('submit', (event) => {
    event.preventDefault();
    console.log(event.target.value);
    const formData = new FormData(document.forms[0]);
    const body = Object.fromEntries(formData.entries());
    if (allIds.includes(Number(idFlag))) {
        api.updateCat(body).then(res => {
            console.log(res);
            refreshCatsAndContent();
        })
    } else {
        api.addCat(body).then(res => {
            console.log(res);
            refreshCatsAndContent()
        })
    }
    document.querySelector(".create-edit-modal-form").classList.remove("active");

});


document.querySelector(".add-btn").addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelector("#id").value = getNewIdOfCat().then((res) => {
        if (res === -Infinity) {
            document.querySelector("#id").value = 1;
            idFlag = 1
        } else {
            document.querySelector("#id").value = res
            idFlag = res
        }
    }).then(() => refreshCatsAndContent());
    document.querySelector(".create-edit-modal-form").classList.toggle("active");
})


const getNewIdOfCat = () => {
    return api.getIdsOfCat().then((res) => {
        return Math.max(...res) + 1;
    });
};


