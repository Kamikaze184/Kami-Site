var mobileMenuBtn = document.querySelector("#mobile-menu-btn");
var mobileMenu = document.querySelector(".mobile-menu");

mobileMenuBtn.addEventListener("click", () => {
  if (mobileMenu.style.display === "none") {
    mobileMenu.style.display = "flex";
    mobileMenuBtn.innerHTML = "<img src='/assets/img/menu.png' class='menuBtn'></img>";
  } else {
    mobileMenu.style.display = "none";
    mobileMenuBtn.innerHTML = "<img src='/assets/img/menu.png' class='menuBtn'></img>";
  }
});
