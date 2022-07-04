const express = require("express");
const app = express();
const port = 5000;

app.use(require("cors")());

// import axios from "axios";
const axios = require("axios").default;

const routes = [
  {
    path: "/",
    title: "Select a server",
    results: [
      {
        name: "Minecraft",
        path: "/minecraft",
      },
      {
        name: "Discord",
        path: "/discord",
      },
      {
        name: "NodeJS",
        path: "/node",
      },
      {
        name: "Clean Slate",
        path: "/clean",
        final: true,
      },
    ],
  },
  {
    path: "/minecraft",
    title: "Minecraft Servers",
    results: [
      {
        name: "Bedrock",
        path: "/minecraft/bedrock",
      },
      {
        name: "Java",
        path: "/minecraft/java",
      },
    ],
  },
  {
    path: "/minecraft/bedrock",
    callback: (req, res) => {
      const options = {
        method: "GET",
        url: `http://serverjars.com/api/fetchTypes/bedrock`,
      };

      axios
        .request(options)
        .then(function (response) {
          results = response.data.response.bedrock.map((itm) => {
            return {
              name: itm.toTitleCase(),
              path: `/minecraft/bedrock/${itm}`,
            };
          });
          res.send({
            path: "/minecraft/bedrock",
            title: "Minecraft Bedrock Servers",
            results: results,
          });
        })
        .catch(function (error) {
          console.error(error);
        });
    },
  },
  {
    path: "/minecraft/bedrock/:server",
    callback: (req, res) => {
      const options = {
        method: "GET",
        url: `http://serverjars.com/api/fetchAll/${req.params.server}`,
      };

      axios
        .request(options)
        .then(function (response) {
          results = response.data.response.map((itm) => {
            return {
              name: `${req.params.server.toTitleCase()} ${itm.version}`,
              path: `/minecraft/bedrock/${req.params.server}/${itm.version}`,
              final: true,
            };
          });
          res.send({
            path: `/minecraft/bedrock/${req.params.server}`,
            title: `${req.params.server.toTitleCase()} Servers`,
            results: results,
          });
        })
        .catch(function (error) {
          console.error(error);
        });
    },
  },
  {
    path: "/minecraft/java",
    title: "Minecraft Java Servers",
    results: [
      {
        name: "Proxy",
        path: "/minecraft/java/proxies",
      },
      {
        name: "Standalone",
        path: "/minecraft/java/standalone",
      },
    ],
  },
  {
    path: "/minecraft/java/proxies",
    callback: (req, res) => {
      const options = {
        method: "GET",
        url: `http://serverjars.com/api/fetchTypes/proxies`,
      };

      axios
        .request(options)
        .then(function (response) {
          results = response.data.response.proxies.map((itm) => {
            return {
              name: itm.toTitleCase(),
              path: `/minecraft/java/proxies/${itm}`,
            };
          });
          res.send({
            path: "/minecraft/java/proxies",
            title: "Minecraft Java Proxy Servers",
            results: results,
          });
        })
        .catch(function (error) {
          console.error(error);
        });
    },
  },
  {
    path: "/minecraft/java/proxies/:server",
    callback: (req, res) => {
      const options = {
        method: "GET",
        url: `http://serverjars.com/api/fetchAll/${req.params.server}`,
      };

      axios
        .request(options)
        .then(function (response) {
          results = response.data.response.map((itm) => {
            return {
              name: `${req.params.server.toTitleCase()} ${itm.version}`,
              path: `/minecraft/java/proxies/${req.params.server}/${itm.version}`,
              final: true,
            };
          });
          res.send({
            path: `/minecraft/java/proxies/${req.params.server}`,
            title: `${req.params.server.toTitleCase()} Servers`,
            results: results,
          });
        })
        .catch(function (error) {
          console.error(error);
        });
    },
  },
  {
    path: "/minecraft/java/standalone",
    callback: (req, res) => {
      const options = {
        method: "GET",
        url: `http://serverjars.com/api/fetchTypes/vanilla`,
      };

      axios
        .request(options)
        .then(function (vanillaResponse) {
          const options = {
            method: "GET",
            url: `http://serverjars.com/api/fetchTypes/servers`,
          };

          axios
            .request(options)
            .then(function (serverResponse) {
              response = [
                ...vanillaResponse.data.response.vanilla,
                ...serverResponse.data.response.servers,
              ];
              results = response.map((itm) => {
                return {
                  name: itm.toTitleCase(),
                  path: `/minecraft/java/standalone/${itm}`,
                };
              });
              res.send({
                path: "/minecraft/java/standalone",
                title: "Minecraft Java Standalone Servers",
                results: results,
              });
            })
            .catch(function (error) {
              console.error(error);
            });
        })
        .catch(function (error) {
          console.error(error);
        });
    },
  },
  {
    path: "/minecraft/java/standalone/:server",
    callback: (req, res) => {
      const options = {
        method: "GET",
        url: `http://serverjars.com/api/fetchAll/${req.params.server}`,
      };

      axios
        .request(options)
        .then(function (response) {
          results = response.data.response.map((itm) => {
            return {
              name: `${req.params.server.toTitleCase()} ${itm.version}`,
              path: `/minecraft/java/standalone/${req.params.server}/${itm.version}`,
              final: true,
            };
          });
          res.send({
            path: `/minecraft/java/standalone/${req.params.server}`,
            title: `${req.params.server.toTitleCase()} Servers`,
            results: results,
          });
        })
        .catch(function (error) {
          console.error(error);
        });
    },
  },
];

routes.forEach((route) => {
  if (typeof route.path !== "string") {
    throw new Error("route.path must be a string!");
  }
  app.get(route.path, (req, res, next) => {
    if (route.callback) {
      route.callback(req, res, next);
      return;
    }
    res.send(route);
  });
});

app.get("/getName/:id*", (req, res) => {
  let params = [
    Object.values(req.params).pop(),
    ...Object.values(req.params).slice(0, -1),
  ].join("");

  console.log(params);
  if (params.indexOf("minecraft") === 0 || params.indexOf("minecraft") === 1) {
    if (params.includes("bedrock")) {
      res.send({
        path: `/getName/${params}`,
        name: `${params.split("/")[2].toTitleCase()} ${params.split("/")[3]}`,
      });
    } else if (params.includes("java")) {
      res.send({
        path: `/getName/${params}`,
        name: `${params.split("/")[3].toTitleCase()} ${params.split("/")[4]}`,
      });
    }
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

String.prototype.toTitleCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
