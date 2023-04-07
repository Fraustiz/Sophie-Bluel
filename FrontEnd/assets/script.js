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