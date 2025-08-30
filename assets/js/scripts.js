const containerExtensions = document.querySelector(".extensions__container");
const template = document.querySelector(".template");
const btnToggleMode = document.querySelector(".header__btn-toggle");
const body = document.body;

const toggleMode = () => {
  const icon = btnToggleMode.querySelector("img");

  body.classList.toggle("toggle-mode");
  const isDarkMode = body.classList.contains("toggle-mode");

  if (isDarkMode) {
    icon.src = "assets/images/icon-moon.svg";
    icon.alt = "Ícone do modo escuro";
  } else {
    icon.src = "assets/images/icon-sun.svg";
    icon.alt = "Ícone do modo claro";
  }
};
btnToggleMode.addEventListener("click", toggleMode);

const loadExtensionsData = async () => {
  try {
    const res = await fetch("/data.json");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
};

const renderExtension = (extensions) => {
  containerExtensions.innerHTML = "";

  extensions.forEach((extension) => {
    const card = template.content.cloneNode(true);

    const logo = card.querySelector(".card__icon");
    const title = card.querySelector(".extension-card__title");
    const description = card.querySelector(".extension-card__description");
    const toggle = card.querySelector(".toggle-switch__input");

    logo.src = extension.logo;
    title.textContent = extension.name;
    description.textContent = extension.description;
    toggle.checked = extension.isActive;

    toggle.addEventListener("change", () => {
      extension.isActive = toggle.checked;
    });

    containerExtensions.appendChild(card);
  });
};

loadExtensionsData().then((data) => {
  renderExtension(data); 

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-filter]").forEach((btn) => {
        btn.classList.remove("active");
      });
      button.classList.add("active");

      const filter = button.getAttribute("data-filter");
      const filteredData = data.filter((ext) => {
        if (filter === "active") return ext.isActive;
        if (filter === "inactive") return !ext.isActive;
        return true;
      });
      renderExtension(filteredData);
    });
  });
});
