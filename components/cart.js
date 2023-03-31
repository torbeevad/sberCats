const generateCard = (cat) => {
    return `<div class="cat-card">
    <img src=${cat.image || "#"} />
    ${cat.name}
    <div class="cat-card-btns">
    <button class="cat-card-view-btn" value=${cat.id}>Посмотреть</button>
    <button class="cat-card-update-btn" value=${cat.id}>Изменить</button>
    <button class="cat-card-delete-btn" value=${cat.id}>Удалить</button>
    </div>
    </div>`;
};