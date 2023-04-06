const someUrl = "https://ss.metronews.ru/userfiles/materials/164/1646131/858x540.jpg"
const generateCard = (cat) => {
    return `<div class="cat-card" style="background-image: url(${cat.image || someUrl})">
    <div class="cat-card-btns">
    <button class="cat-card-view-btn" value=${cat.id}>Посмотреть</button>
    <button class="cat-card-update-btn" value=${cat.id}>Изменить</button>
    <button class="cat-card-delete-btn" value=${cat.id}>Удалить</button>
    </div>
    </div>`;
};