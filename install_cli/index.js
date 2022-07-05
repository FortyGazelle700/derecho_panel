#!/usr/bin/env node

import { Command } from "commander";
const program = new Command();

// const shell = require("shelljs");

import shell from "shelljs";
shell.config.silent = true;

import fs from "fs";

import os from "os";

import ospath from "ospath";
import chalk from "chalk";
import boxen from "boxen";
import prompts from "prompts";
import ora from "ora";

const style = chalk;

const ver = "1.0.0";

let slash = "/";

if (process.cwd().includes("\\")) {
  slash = "\\";
}

program.name("create").description("Create the application");

program.parse();

function programsDir() {
  switch (os.platform()) {
    // case "win32":
    //   return "C:\\Program Files\\Derecho Panel";
    case "linux":
      return "/var/derecho_panel";
    default:
      console.log(
        style.redBright(
          "Error!!! Hmm, it seems like our developers didn't anticipate you using this operating system.\nPlease report this as an issue. We are very sorry for the inconvenience :(.\n\n"
        )
      );
      console.log("Please send them the following information:");
      console.log(
        style.gray(
          boxen(
            `CLI INSTALLER Error | DEVICE_UNSUPPORTED ERROR
              /index.js 34:0  |  programsDir() error
                => /index.js 40:5  |  switch statement default`.removeSpaces(
              12,
              1
            ),
            {
              padding: 1,
              borderStyle: "round",
            }
          )
        )
      );
      console.log(
        style.gray(
          boxen(
            `OS NAME | <<TYPE HERE \w(e.g. Windows 10, Linux Debian 10)>>
            OS PLATFORM | ${os.platform()}
            OS RELEASE | ${os.release()}
            OS VERSION | ${os.version()}
            OS TYPE | ${os.type()}`.removeSpaces(12, 1),
            {
              padding: 1,
              borderStyle: "round",
            }
          )
        )
      );
      console.log();
      process.exit(1);
  }
}

String.prototype.removeSpaces = function (spaces = 0, tabSize = 1) {
  return this.replaceAll(new RegExp(`^[ ]{${spaces * tabSize}}`, "gm"), "");
};

String.prototype.resetStyle = function () {
  return this.replaceAll(new RegExp("\\[.{1,2}m", "gm")).replaceAll(
    undefined,
    ""
  );
};

function restyleActions(group = {}, color = "blue") {
  if (group === undefined || group === null || group == {}) {
    throw new Error(
      "restyleActions(group), group doesn't have a value! Use restyleActions(this)!"
    );
  }
  let colorFunc = style.blue;
  try {
    colorFunc = eval(`style.${color}`);
  } catch (e) {
    throw new Error("Color function not allowed in restyleActions!");
  }
  let isSingleSelect = typeof group.value !== "object";
  let values = isSingleSelect ? group.choices : group.value;
  values.forEach((val, idx) => {
    values[idx].title = style.white(values[idx].title.resetStyle());
  });
  values[group.cursor].title = colorFunc(
    values[group.cursor].title.resetStyle()
  );
  if (isSingleSelect) {
    group.outputText =
      group.outputText?.replace(
        new RegExp("\\[.{1,2}m>\\[.{1,2}m", "gm"),
        colorFunc(">")
      ) || group.outputText;
  } else {
    // group.outputText = group.outputText?.replace('[36m>[39m', colorFunc('>')) || group.outputText;
  }
}

if (program.args[0]) {
  switch (program.args[0]) {
    default:
      console.log(
        boxen(style.redBright("Command doesn't exist"), {
          padding: 1,
          margin: 1,
          borderStyle: "round",
        })
      );
      break;
    case "create":
      console.log(
        boxen(
          style.greenBright(
            " Derecho Panel Installer \nWelcome to the installer!"
          ),
          {
            padding: 1,
            margin: 3,
            borderStyle: "round",
          }
        )
      );
      console.log(
        "If you need help at any help please visit our GitHub for docs or if something goes wrong please add a GitHub issue!"
      );
      console.log("GitHub: https://github.com/FortyGazelle700/drecho_panel");
      console.log(
        style.bgGray("Please select the following options for the panel")
      );
      console.log();
      const setup = await prompts([
        {
          type: "select",
          name: "folder_location",
          message: style.yellowBright("Where would you like the panel?"),
          hint: style.gray(
            `
          [↑]/[↓]: Highlight Option
          [Space]/[Enter]: Continue
        `.removeSpaces(4, 2)
          ),
          choices: [
            // {
            //   title: "Programs Directory",
            //   description: programsDir(),
            //   value: 3,
            // },
            { title: "This folder", description: process.cwd(), value: 2 },
            {
              title: "Create one for me",
              description: `${process.cwd()}${slash}panel`,
              value: 1,
            },
            {
              title: "Custom Path",
              description: `Select a custom path`,
              value: 0,
            },
          ],
          initial: 0,
          onRender() {
            restyleActions(this);
            this.outputText = this.outputText?.resetStyle();

            if (this.cursor === 2) {
              this.choices[2].description = `${process.cwd()}${slash}panel`;
            }
          },
        },
        {
          type: (prev) => {
            return prev === 0 ? "text" : null;
          },
          // type: "text",
          name: "folder_location_path",
          message: style.yellowBright("Project Directory"),
          description: `Must be as a path (e.g. ${ospath.home()}${slash}Documents)`,
          initial: `${ospath.home()}${slash}Documents`,
          validate: (value) => {
            if (value.trim() === "") return "Path cannot be blank!";
            if (fs.existsSync(value)) {
              return fs.lstatSync(value).isDirectory()
                ? true
                : "Given path isn't a directory!";
            } else {
              return "Given path doesn't exist!";
            }
          },
        },
      ]);

      // path = setup.folder_location_path;
      let path;
      let createDirectories;
      if (setup.folder_location === 3) {
        path = programsDir();
        createDirectories = true;
      } else if (setup.folder_location === 2) {
        path = process.cwd();
      } else if (setup.folder_location === 1) {
        path = process.cwd() + slash + "panel";
        createDirectories = true;
      } else if (setup.folder_location === 0) {
        path = setup.folder_location_path;
      } else {
        process.exit(0);
      }
      shell.cd(path);
      if (shell.ls("").length !== 0) {
        console.log(style.bgRedBright("Files/Directories Exist!!!"));
        const folderExistsPrompt = await prompts([
          {
            type: "select",
            name: "delete_files",
            message: style.yellowBright(
              `Would you like to delete all of the files in ${path}?`
            ),
            hint: style.gray(
              `
            [↑]/[↓]: Highlight Option
            [Space]/[Enter]: Continue
          `.removeSpaces(4, 2)
            ),
            choices: [
              {
                title: "Yes",
                description:
                  "Yes, delete all files in the folder (Recommended if re-installing)",
                value: 2,
              },
              {
                title: "No",
                description:
                  "No, keep the files in the folder (some of the files may be overwritten)",
                value: 1,
              },
              {
                title: "STOP",
                description:
                  "STOP STOP STOP!!! The process will exit immediately and nothing will happen.",
                value: 0,
              },
            ],
            initial: 0,
            onRender() {
              restyleActions(this);
              this.outputText = this.outputText?.resetStyle();
            },
          },
        ]);
        switch (folderExistsPrompt.delete_files) {
          default:
          case 0:
            process.exit(0);
          case 1:
            break;
          case 2:
            shell.rm("-rf", `${path}`);
            break;
        }
      }
      if (createDirectories && !fs.existsSync(path)) {
        try {
          fs.mkdirSync(path, { recursive: true, mode: 777 });
        } catch (err) {
          console.log(
            style
              .redBright(
                `Error!!! Unable to create folder(s) ${path}. Operation not permitted, no permissions to create the folder(s). Here are things you can try
                  1. Create a folder yourself
                  2. Give yourself permissions to create the folder or use sudo/administrator
                  3. Try a different folder location`
              )
              .removeSpaces(16, 1)
          );
          process.exit(1);
        }
      }
      if (!fs.existsSync(path) || !fs.lstatSync(path).isDirectory()) {
        console.log(
          style.redBright(
            "Error!!! Hmm, it seems like our developers didn't quite get this right :(.\nPlease report this as an issue. We are very sorry for the inconvenience :(.\nIf you want you can try to set the directory to custom path, and select your directory from there.\n\n"
          )
        );
        console.log("Please send them the following information:");
        console.log(
          style.gray(
            boxen(
              `CLI INSTALLER Error | DEVICE_PATH_UNSUPPORTED ERROR
                /index.js 136:5  |  arg[0] = create   error
                  => /index.js 215:7  |  path doesn't exist`.removeSpaces(
                14,
                1
              ),
              {
                padding: 1,
                borderStyle: "round",
              }
            )
          )
        );
        console.log(
          style.gray(
            boxen(
              `OS NAME | <<TYPE HERE (e.g. Windows 10, Linux Debian 10)>>
              OS PLATFORM | ${os.platform()}
              OS RELEASE | ${os.release()}
              OS VERSION | ${os.version()}
              OS TYPE | ${os.type()}
              =====================================
              path: ${path}
              folder_location: ${setup.folder_location}
              folder_location_path: ${setup.folder_location_path}
              =====================================
              path_exists: ${fs.existsSync(path)}
              path_is_directory: ${
                fs.existsSync(path) ? fs.lstatSync(path).isDirectory() : false
              }`.removeSpaces(14, 1),
              {
                padding: 1,
                borderStyle: "round",
              }
            )
          )
        );
        console.log();
        process.exit(1);
      }
      const gitSpinner = ora("Downloading git repository", {
        spinner: "arc",
      }).start();
      shell.exec("git clone https://github.com/FortyGazelle700/drecho_panel/");
      gitSpinner.succeed();
      const moveSpinner = ora("Moving folders...", {
        spinner: "arc",
      }).start();
      shell.mv(
        "-fn",
        Array.from(shell.ls("-R", `${path}/drecho_panel/application`)).map(
          (val) => `${path}/drecho_panel/application/${val}`
        ),
        `${path}\\`
      );
      shell.rm("-rf", `${path}/drecho_panel/`);
      moveSpinner.succeed();
      const packagesSpinner = ora("Installing Packages...", {
        spinner: "arc",
      }).start();
      shell.exec("npm install");
      packagesSpinner.succeed();
      break;
  }
} else {
  console.log(
    boxen(style.blueBright(`Derecho Panel Installer v${ver}`), {
      padding: 1,
      margin: 1,
      borderStyle: "round",
    })
  );
}
