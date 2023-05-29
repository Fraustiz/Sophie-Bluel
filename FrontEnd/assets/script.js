const categoriesContainer = document.querySelector("#categories");
const worksContainer = document.querySelector(".gallery");

function refreshList() {
    fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then(categories => {
        fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(works => {
            render(categories, works);
        });
    });
}

function refreshListWorks() {
    fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(works => {
        renders(works);
    });
}

refreshList();

function renders(works) {
    const worksContainers = document.querySelector(".work-edit");
    const articles = works.map(work => `<figure class="work" data-id="${work.id}"><div class="work-btn"><i class="fa-solid fa-arrows-up-down-left-right"></i><i class="fa-solid fa-trash-can"></i></div><img src="${work.imageUrl}"></figure>`).join("");
    worksContainers.innerHTML = articles;

    const worksArrows = document.querySelectorAll('.work');
    worksArrows.forEach(work => {
        const arrows = work.querySelectorAll('.fa-arrows-up-down-left-right');
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

    const deleteWork = document.querySelectorAll('.work-edit .work');
    deleteWork.forEach(async work => {
        const trash = work.querySelector('.fa-trash-can');
        if (trash) {
            const dataId = work.dataset.id;

            trash.addEventListener('click', async () => {
                const token = localStorage.getItem('token');

                fetch(`http://localhost:5678/api/works/${dataId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(
                    refreshList(),
                    refreshListWorks()
                );
            });
        }
    });
}

function backToNormal() {
    const backToNormal = document.querySelector(".replace-to-img");
    backToNormal.innerHTML = "<i class='fa-regular fa-image'></i><button>+ Ajouter photo</button><p>jpg, png : 4mo max</p>";
    backToNormal.style.padding = "28px 0 19px 0";
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
                let modalNone = document.querySelector(".modal-content");
                let modalAdd = document.querySelector(".modal-content-add");
                let modal = document.querySelector(".modal");
                modalNone.style.display = "none";
                modalAdd.style.display = "none";
                modal.style.display = "none";
                document.body.style.overflow = "auto";
                backToNormal();
                const form = document.querySelector('.form-add-img');
                form.reset();
            });
        }

        refreshListWorks();

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
                backToNormal();
                const form = document.querySelector('.form-add-img');
                form.reset();
            });


            fetch('http://localhost:5678/api/categories')
            .then(response => response.json())
            .then(categories => {
                renderSelectOptions(categories);
            });

            function renderSelectOptions(categories) {
                const selectCategory = document.querySelector("#category");
                const options = categories.map(category => `<option value="${category.id}">${category.name}</option>`).join("");
                selectCategory.innerHTML = `<option value="" disabled selected style="display:none;"></option>${options}`;
            }

            const addImageButton = document.querySelector(".add-img button");
            const addImageInput = document.querySelector(".add-img input[type=file]");

            addImageButton.addEventListener("click", function(event) {
                event.preventDefault();
                addImageInput.click();
            });

            imgInp.onchange = evt => {
                const [file] = imgInp.files;
                if (file) {
                    let imageAdd = document.querySelector(".add-img");
                    let imageReplace = document.querySelector(".replace-to-img");
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
                        imageReplace.innerHTML = "";
                        imageReplace.appendChild(imgElement);
                        let divPadding = document.querySelector(".replace-to-img");
                        divPadding.style.padding = "0px";
                    };
                }
            }

            const addImageInput2 = document.querySelector('#imgInp');
            const workNameInput = document.querySelector('input[name="title"]');
            const workCategorySelect = document.querySelector('select[name="category"]');
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

    const form = document.querySelector('.form-add-img');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        async function addWork(event) {
            const token = localStorage.getItem("token");
            const form = event.target;
            const formData = new FormData(form);

            fetch('http://localhost:5678/api/works', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(data => {
                form.reset();
                refreshList();
                refreshListWorks();
                const modalClear = document.querySelectorAll(".modal-content-add, .modal");
                for (const modal of modalClear) {
                    modal.style.display = "none";
                }
                document.body.style.overflow = "auto";
                backToNormal();
            })
        }
        
        addWork(event);
    });

    getToken();
    const storedToken = localStorage.getItem('token');
    const storedExpiration = localStorage.getItem('tokenExpiration');

    if (storedToken && storedExpiration) {
        const now = new Date().getTime();
        if (now > storedExpiration) {
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpiration');
        }
    }
});