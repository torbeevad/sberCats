const generateCatCardPopup = (cat) => {
    const like = "<i class=\"fa-solid fa-heart\"></i>"
    const disLike = "<i class=\"fa-regular fa-heart\"></i>"
    return `<div class="popup-wrapper-cat-card active">
        <div class="popup-cat-card active" style="background-image: url(${cat.image})">
        <div class="popup-close-cat-card close-btn">+</div>
        <div class="popup-description-wrapper">
            <div class="icon">${cat.favourite ? like : disLike}</div>   
            <div>${cat.name}</div>
            <div>${cat.description}</div>
            <div>${cat.age}</div>
            <div>${cat.rate}</div></div>
        </div>
    </div>`;
};