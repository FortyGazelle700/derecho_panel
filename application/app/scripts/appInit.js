// function setActive(id = "navHome") {
//   const el = document.getElementById(id);
//   const bi = el.querySelector(".bi");
//   el.classList.add("active");

//   const biIcon = bi.classList.value.match(
//     new RegExp("(?<=bi )bi-.*", "i")
//   )[0];
//   const biIconFilled = `${biIcon}-fill`;

//   bi.classList.remove(biIcon);
//   bi.classList.add(biIconFilled);
// }

class App {
  constructor() {}

  initApp(options) {
    this.options = options || {};
    this.options.title = options.title || "Server Panel";

    document.title = this.options.title;
  }

  initNavigation(id = "navHome") {
    const el = document.getElementById(id);
    const bi = el.querySelector(".bi");
    el.classList.add("active");

    const biIcon = bi.classList.value.match(
      new RegExp("(?<=bi )bi-.*", "i")
    )[0];
    const biIconFilled = `${biIcon}-fill`;

    bi.classList.remove(biIcon);
    bi.classList.add(biIconFilled);
  }
}
