const categoriesContainer = document.querySelector("#categories");
const worksContainer = document.querySelector(".gallery");

const categoriesData = sessionStorage.getItem('categoriesData');
const worksData = sessionStorage.getItem('worksData');

if (categoriesData && worksData) {
    const categories = JSON.parse(categoriesData);
    const works = JSON.parse(worksData);
    render(categories, works);
} else {
    fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then(categories => {
        fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(works => {
        sessionStorage.setItem('categoriesData', JSON.stringify(categories));
        sessionStorage.setItem('worksData', JSON.stringify(works));
        render(categories, works);
        });
    });
}

function render(categories, works) {
    const buttons = categories.map(categorie => `<button class="btn-cat" data-id="${categorie.id}">${categorie.name}</button>`).join("");
    categoriesContainer.insertAdjacentHTML("beforeend", `<button class="btn-cat focus" data-id="0">Tous</button>${buttons}`);
    const buttonsElements = categoriesContainer.querySelectorAll(".btn-cat");
    buttonsElements.forEach(button => {
        button.addEventListener("click", () => {
        updateGallery(button.dataset.id);
        buttonsElements.forEach(btn => btn.classList.remove("focus"));
        button.classList.add("focus");
        });
    });

    const articles = works.map(work => `<figure class="work" data-id="${work.category.id}"><img src="${work.imageUrl}"><figcaption>${work.title}</figcaption></figure>`).join("");
    worksContainer.innerHTML = articles;
    setInterval(() => {
        sessionStorage.removeItem('categoriesData');
        sessionStorage.removeItem('worksData');
    }, 3600000);
}

function updateGallery(categoryId) {
    const allWorks = worksContainer.querySelectorAll(".work");
    allWorks.forEach(work => {
        if (categoryId === "0") {
        work.style.display = "grid";
        } else if (work.dataset.id === categoryId) {
        work.style.display = "grid";
        } else {
        work.style.display = "none";
        }
    });
}

function getToken() {
    const token = localStorage.getItem('token');
    if(token != null) {
        let loginA = document.querySelector(".login-a");
        loginA.innerText = "logout";

        let ajoutEditMode = document.querySelector("#navbar");
        ajoutEditMode.classList.add("editmode");

        let ajoutDisplay = document.querySelector(".edit-mode ul");
        ajoutDisplay.style.display = "flex";

        let categoriesNone = document.querySelector("#categories");
        categoriesNone.style.display = "none";

        let editModeBlack = document.querySelectorAll(".edit-mode-black");
        for (let i = 0; i < editModeBlack.length; i++) {
            editModeBlack[i].style.display = "flex";
        }

        const logoutButton = document.querySelector(".login-a");
        logoutButton.addEventListener("click", function(event) {
            if(logoutButton.innerText == "logout"){
                event.preventDefault();
                localStorage.removeItem("token");
                location.reload()
            }
        });

        const editWorks = document.querySelector(".working");
        editWorks.addEventListener("click", function(event) {
            event.preventDefault();
            let modalDisplay = document.querySelectorAll(".modal, .modal-content");
            for (let i = 0; i < modalDisplay.length; i++) {
                modalDisplay[i].style.display = "flex";
            }
        });

        const closeEditWorks = document.querySelector(".close");
        closeEditWorks.addEventListener("click", function(event) {
            event.preventDefault();
            let modalNone = document.querySelectorAll(".modal, .modal-content");
            for (let i = 0; i < modalNone.length; i++) {
                modalNone[i].style.display = "none";
            }
        });

        const worksContainer = document.querySelector(".work-edit");

        fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(works => {
            render(works);
        });

        function render(works) {
            const articles = works.map(work => `<figure class="work" data-id="${work.category.id}"><img src="${work.imageUrl}"></figure>`).join("");
            worksContainer.innerHTML = articles;
        }
    }
}

window.addEventListener('load', function() {
    getToken();
});
