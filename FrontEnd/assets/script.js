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
                document.body.style.overflow = "hidden";
            }

            const works = document.querySelectorAll('.work');
            works.forEach(work => {
            const arrows = work.querySelectorAll('.fa-solid.fa-arrows-up-down-left-right');
            work.addEventListener('mouseenter', () => {
                arrows.forEach(arrow => {
                arrow.style.display = 'flex';
                });
            });
            work.addEventListener('mouseleave', () => {
                arrows.forEach(arrow => {
                arrow.style.display = 'none';
                });
            });
            });
        });

        
        const modalContent = document.querySelectorAll(".modal-content, .modal-content-add, #submit-img");
        for (let i = 0; i < modalContent.length; i++) {
            modalContent[i].addEventListener("click", function(event) {
                event.stopPropagation();
            });
        }

        const closeEditWorks = document.querySelectorAll(".modal, .close");
        for (let i = 0; i < closeEditWorks.length; i++) {
            closeEditWorks[i].addEventListener("click", function() {
                location.reload()
            });
        }

        fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(works => {
            renders(works);
        });

        const worksContainers = document.querySelector(".work-edit");
        function renders(works) {
            const articles = works.map(work => `<figure class="work" data-id="${work.category.id}"><div class="work-btn"><i class="fa-solid fa-arrows-up-down-left-right"></i><i class="fa-solid fa-trash-can"></i></div><img src="${work.imageUrl}"></figure>`).join("");
            worksContainers.innerHTML = articles;
        }

        const addWork = document.querySelector(".modal-content button");
        addWork.addEventListener("click", function(event) {
            let modalNone = document.querySelector(".modal-content");
            let modalAdd = document.querySelector(".modal-content-add");
            modalNone.style.display = "none";
            modalAdd.style.display = "flex";

            const backBtn = document.querySelector(".back");
            backBtn.addEventListener("click", () => {
                modalAdd.style.display = "none";
                modalNone.style.display = "flex";
            });


            fetch('http://localhost:5678/api/categories')
            .then(response => response.json())
            .then(categories => {
                renderSelectOptions(categories);
            });

            function renderSelectOptions(categories) {
                const selectCategory = document.querySelector("#select_category");
                const options = categories.map(category => `<option value="${category.id}">${category.name}</option>`).join("");
                selectCategory.innerHTML = `<option value="" disabled selected style="display:none;"></option>${options}`;
            }

            const addImageButton = document.querySelector(".add-img button");
            const addImageInput = document.querySelector(".add-img input[type=file]");

            addImageButton.addEventListener("click", function(event) {
                event.preventDefault();
                addImageInput.click();
            });

            document.addEventListener('DOMContentLoaded', function() {
                var form = document.querySelector('.form-add-img');
                form.addEventListener('submit', function(event) {
                    event.preventDefault();

                    var token = localStorage.getItem('token');

                    var formData = new FormData(form);

                    formData.append('token', token);

                    var xhr = new XMLHttpRequest();

                    xhr.open('POST', 'http://localhost:5678/api/works');

                    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                    xhr.setRequestHeader('Accept', 'application/json');

                    xhr.send(formData);

                    xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                        console.log('La requête POST a été envoyée avec succès');
                        } else {
                        console.log('La requête POST a échoué');
                        }
                    } else {
                        console.log("erreur");
                    }
                    };
                });
            });

            imgInp.onchange = evt => {
                const [file] = imgInp.files;
                if (file) {
                    let imageAdd = document.querySelector(".add-img");
                    let imgElement = document.createElement("img");
                    imgElement.src = URL.createObjectURL(file);
                    imgElement.onload = function() {
                        let width = this.width;
                        let height = this.height;
                        let parentWidth = imageAdd.clientWidth;
                        let parentHeight = imageAdd.clientHeight;
                        let ratio = Math.min(parentWidth/width, parentHeight/height);
                        imgElement.style.width = `${ratio * width}px`;
                        imgElement.style.height = `${ratio * height}px`;
                        imageAdd.innerHTML = "";
                        imageAdd.appendChild(imgElement);
                    };
                }
            }

            const addImageInput2 = document.querySelector('#imgInp');
            const workNameInput = document.querySelector('input[name="work_name"]');
            const workCategorySelect = document.querySelector('select[name="work_category"]');
            const submitButton = document.querySelector('input[type="submit"]');

            addImageInput2.addEventListener('change', () => {
            checkInputs();
            });

            workNameInput.addEventListener('input', () => {
            checkInputs();
            });

            workCategorySelect.addEventListener('input', () => {
            checkInputs();
            });

            function checkInputs() {
                if (addImageInput2.value !== '' && workNameInput.value !== '' && workCategorySelect.value !== '') {
                    submitButton.removeAttribute('disabled');
                } else {
                    submitButton.setAttribute('disabled', '');
                }
            }
        });
    }
}

window.addEventListener('load', function() {
    getToken();
});