var http = require("http");
const express = require("express");
const app = express();
const port = 3000;

const net = require("net");
const { networkInterfaces } = require("os");

const style = require("./resources/console-styles/");

const fs = require("fs");

const routes = [
  {
    path: "/account",
    templatePath: "templates/account.html",
    pagePath: "account/main.html",
    access: true,
    accessFalsePath: "redirects/main.html",
  },
  {
    path: "/account/hasAccounts",
    callback: (req, res) => {
      fs.stat(`./app/data/accounts.json`, function (err, stat) {
        if (stat && stat.isFile()) {
          fs.readFileSync(`./app/data/accounts.json`, (pageErr, pageData) => {
            if (pageErr) {
              res.send(false);
            }

            res.send(JSON.parse(pageData).length !== 0);
          });
        } else {
          res.send(false);
        }
      });
    },
  },
  {
    path: "/",
    templatePath: "templates/main.html",
    pagePath: "main/index.html",
    access: false,
    accessFalsePath: "redirects/account.html",
    accessFalseTemplatePath: "templates/account.html",
  },
  {
    path: "/server/create",
    templatePath: "templates/main.html",
    pagePath: "server/create/index.html",
    access: false,
    accessFalsePath: "redirects/account.html",
    accessFalseTemplatePath: "templates/account.html",
  },
  {
    path: "/resource/:location*",
    callback: (req, res) => {
      let params = [
        Object.values(req.params).pop(),
        ...Object.values(req.params).slice(0, -1),
      ].join("");
      switch (params.split(".").at(-1)) {
        case "html":
          res.setHeader("content-type", "text/html");
          break;
        case "css":
          res.setHeader("content-type", "text/css");
          break;
        case "js":
          res.setHeader("content-type", "text/javascript");
          break;
        case "png":
          res.setHeader("content-type", "image/png");
          break;
        case "jpg":
          res.setHeader("content-type", "image/jpg");
          break;
        default:
          res.setHeader("content-type", "text/plain");
      }

      fs.stat(`./app/${params}`, function (err, stat) {
        if (stat && stat.isFile()) {
          res.send(
            fs.readFileSync(`./app/${params}`, (pageErr, pageData) => {
              if (pageErr) {
                // console.error(pageErr);
                res.status(404).send(pageErr);
                return null;
              }
              // return Buffer.from(pageData, "base64");
              var img = Buffer.from(pageData, "base64");

              res.writeHead(200, {
                "Content-Type": "image/png",
                "Content-Length": img.length,
              });
              res.end(img);
            })
          );
        } else {
          res.status(404).send("Not Found");
        }
      });
    },
  },
];

routes.forEach((route) => {
  if (typeof route.path !== "string") {
    throw new Error("route.path must be a string!");
  }
  app.get(route.path, (req, res, next) => {
    let access = true;
    if (typeof route.access === "function") {
      access = !(route.access(req, res, next) === false);
    } else {
      access = !(route.access === false);
    }
    if (access === false) {
      if (route.accessFalseCallback !== undefined) {
        if (typeof route.accessFalseCallback !== "function") {
          throw new Error(
            "Invalid callback passed to route.accessFalseCallback!"
          );
        }
        route.accessFalseCallback(req, res, next);
      } else if (route.accessFalsePath !== undefined) {
        let pageData = fs.readFileSync(
          `./app/${route.accessFalsePath}`,
          "utf8",
          (pageErr, pageData) => {
            if (pageErr) {
              console.error(pageErr);
              return null;
            } else {
              return pageData;
            }
          }
        );

        let pageTemplate = fs.readFileSync(
          `./app/${route.accessFalsePath}`,
          "utf8",
          (pageErr, pageData) => {
            if (pageErr) {
              console.error(pageErr);
              return null;
            } else {
              return pageData;
            }
          }
        );

        res.status(200).send(pageData);
      }
      return;
    }
    if (route.callback !== undefined) {
      if (typeof route.callback !== "function") {
        throw new Error("Invalid callback passed to route.callback!");
      }
      route.callback(req, res, next);
      return;
    }
    let templateData = null;
    let pageData = null;
    if (route.pagePath !== undefined) {
      pageData = fs.readFileSync(
        `./app/${route.pagePath}`,
        "utf8",
        (pageErr, pageData) => {
          if (pageErr) {
            console.error(pageErr);
            return null;
          } else {
            return pageData;
          }
        }
      );
    } else if (route.page !== undefined) {
      if (typeof route.page !== "string") {
        throw new Error("Invalid page path passed");
      }
      pageData = route.page;
    } else {
      throw new Error("route.page or route.pagePath must be set!");
    }
    if (route.templatePath !== undefined) {
      templateData = fs.readFileSync(
        `./app/${route.templatePath}`,
        "utf8",
        (templateErr, templateData) => {
          if (templateErr) {
            console.error(templateErr);
            return null;
          } else {
            return templateData;
          }
        }
      );
    } else if (route.template) {
      templateData = route.template;
    }

    pageData =
      templateData !== undefined
        ? templateData.replaceAll("{{ app-content }}", pageData)
        : pageData;

    res.setHeader("content-type", "text/html");
    res.status(200).send(pageData);
  });
});

var server = net.createServer();

server.once("error", function (err) {
  if (err.code === "EADDRINUSE") {
    console.log("HEY!");
  }
});

server.once("listening", function () {
  server.close();

  app.listen(port || 3000, async () => {
    const nets = networkInterfaces();
    const results = {};

    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
        if (net.family === familyV4Value && !net.internal) {
          if (!results[name]) {
            results[name] = [];
          }
          results[name].push(net.address);
        }
      }
    }

    let internalUserIP = results[Object.keys(results)[0]];
    let externalUserIP = await getExternalIPAddress();

    function getExternalIPAddress() {
      return new Promise((resolve) => {
        http.get(
          { host: "api.ipify.org", port: 80, path: "/" },
          function (resp) {
            resp.on("data", function (ip) {
              resolve(ip);
            });
          }
        );
      });
    }

    console.log();
    console.log(
      `${style.blink}${style.fgGreen}Panel is running!${style.reset}`
    );
    console.log(
      `${style.fgBlue}Internal: localhost:${port || 3000}${style.reset}`
    );
    console.log(
      `          ${style.fgBlue}0.0.0.0:${port || 3000}${style.reset}`
    );
    console.log(
      `          ${style.fgBlue}127.0.0.1:${port || 3000}${style.reset}`
    );
    console.log(
      `          ${style.fgBlue}${internalUserIP}:${port || 3000}${style.reset}`
    );
    console.log();
    console.log(
      `${style.fgBlue}External: ${externalUserIP}:${port || 3000}${style.reset}`
    );
  });
});

server.listen(port || 3000);
