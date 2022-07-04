let path = new URLSearchParams(window.location.search).get("p") || "";
let newPath = "/";
let selectedID = new URLSearchParams(window.location.search).get("s") || "";

let isFinal = false;

let serverBackButton = document.getElementById("server-back-btn");
let serverContinueButton = document.getElementById("server-continue-btn");

serverBackButton.addEventListener("click", () => {
  selectedID = path.split("/").at(-1);
  path = path.split("/").slice(0, -1).join("/");
  getServerList();
});

serverContinueButton.addEventListener("click", () => {
  path = newPath;
  selectedID = "";
  if (isFinal) {
    url = new URL(window.location);
    url.searchParams.delete("s");
    url.searchParams.delete("p");
    url.searchParams.set("server", path);
    window.history.pushState({}, "", url);

    fetch(
      `http://192.168.1.102:5000/getName${new URLSearchParams(
        window.location.search
      ).get("server")}`
    )
      .then((response) => response.json())
      .then((response) => {
        document.querySelector("#serverType .selected-text").textContent =
          response.name;
      });

    document.getElementById("serverType").classList.add("collapsed");
    document.getElementById("serverMemory").classList.remove("collapsed");
  } else {
    getServerList();
  }
});

function getServerList() {
  let url = new URL(window.location);
  url.searchParams.set("p", path);
  window.history.pushState({}, "", url);

  url = new URL(window.location);
  if (selectedID == "") {
    url.searchParams.delete("s");
    window.history.pushState({}, "", url);
  } else {
    url.searchParams.set("s", selectedID);
    window.history.pushState({}, "", url);
  }

  const serverList = document.getElementById("server-list");
  serverList.innerHTML = "Loading..";
  fetch(`http://192.168.1.102:5000${path}`)
    .then((response) => response.json())
    .then((response) => {
      serverList.innerHTML = "";

      const fieldset = document.createElement("fieldset");
      const fieldsetTitle = document.createElement("legend");
      fieldsetTitle.textContent = response.title;
      fieldset.appendChild(fieldsetTitle);
      response.results.forEach((serverInfo) => {
        const divWrapper = document.createElement("div");
        const radio = document.createElement("input");
        radio.setAttribute("type", "radio");
        radio.setAttribute("name", "server-type");
        radio.setAttribute("id", serverInfo.path);
        radio.setAttribute("value", serverInfo.path);
        const idAsPath = `${new URLSearchParams(window.location.search).get(
          "p"
        )}/${selectedID}`;
        if (idAsPath == serverInfo.path) {
          newPath = serverInfo.path;
          radio.checked = true;
        }
        radio.addEventListener("change", () => {
          newPath = serverInfo.path;
          isFinal = serverInfo.final;
          url = new URL(window.location);
          url.searchParams.set("s", serverInfo.path.split("/").at(-1));
          window.history.pushState({}, "", url);
        });
        divWrapper.appendChild(radio);
        const label = document.createElement("label");
        label.setAttribute("for", serverInfo.path);
        label.textContent = serverInfo.name;
        divWrapper.appendChild(label);
        fieldset.appendChild(divWrapper);
      });
      serverList.append(fieldset);
    });
}

if (new URLSearchParams(window.location.search).get("server") === null) {
  getServerList();
} else {
  document.getElementById("serverType").classList.add("collapsed");
  document.getElementById("serverMemory").classList.remove("collapsed");
  fetch(
    `http://192.168.1.102:5000/getName${new URLSearchParams(
      window.location.search
    ).get("server")}`
  )
    .then((response) => response.json())
    .then((response) => {
      document.querySelector("#serverType .selected-text").textContent =
        response.name;
    });
}
