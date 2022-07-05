const memSlider = document.getElementById("memSlider");
const memMB = document.getElementById("memMB");
const memGB = document.getElementById("memGB");

let memBackButton = document.getElementById("mem-back-btn");
let memContinueButton = document.getElementById("mem-continue-btn");

memSlider.addEventListener("input", () => updateInputs(memSlider.value));
memMB.addEventListener("input", () => updateInputs(memMB.value));
memGB.addEventListener("input", () => updateInputs(memGB.value * 1024));

memSlider.addEventListener("change", () => updateNavigation(memSlider.value));
memMB.addEventListener("change", () => updateNavigation(memMB.value));
memGB.addEventListener("change", () => updateNavigation(memGB.value * 1024));

function updateInputs(val) {
  memSlider.value = val;
  memMB.value = val;
  memGB.value = Math.round((val / 1024) * 10) / 10;
}

function updateNavigation(val) {
  url = new URL(window.location);
  url.searchParams.set("memEdit", val);
  window.history.pushState({}, "", url);
}

memBackButton.addEventListener("click", () => {
  url = new URL(window.location);
  url.searchParams.set("s", url.searchParams.get("server").split("/").at(-1));
  url.searchParams.set(
    "p",
    url.searchParams.get("server").split("/").slice(0, -1).join("/")
  );
  url.searchParams.delete("server");
  window.history.pushState({}, "", url);

  isFinal = true;

  document.getElementById("serverMemory").classList.add("collapsed");
  document.getElementById("serverType").classList.remove("collapsed");
});

memContinueButton.addEventListener("click", () => {
  url = new URL(window.location);
  url.searchParams.delete("memEdit");
  url.searchParams.set("mem", memMB.value);
  window.history.pushState({}, "", url);

  document.querySelector(
    "#serverMemory .selected-text"
  ).textContent = `${memMB.value}mb`;

  document.querySelector("#server-mem").textContent = `${new URLSearchParams(
    window.location.search
  ).get("mem")}mb`;

  document.getElementById("serverMemory").classList.add("collapsed");
  document.getElementById("serverReview").classList.remove("collapsed");
});

if (new URLSearchParams(window.location.search).get("mem") === null) {
  updateInputs(
    new URLSearchParams(window.location.search).get("memEdit") || 1024
  );
  updateNavigation(
    new URLSearchParams(window.location.search).get("memEdit") || 1024
  );
} else {
  document.querySelector(
    "#serverMemory .selected-text"
  ).textContent = `${new URLSearchParams(window.location.search).get("mem")}mb`;
  document.querySelector("#server-mem").textContent = `${new URLSearchParams(
    window.location.search
  ).get("mem")}mb`;
  document.getElementById("serverMemory").classList.add("collapsed");
  document.getElementById("serverReview").classList.remove("collapsed");
}
