# Derecho Panel

## Installation
### Requirements
- NodeJS

### Instructions
Type in the following command in your command prompt or terminal of your choice.
```sh
npx test_panel_installer@latest create
```

It will most likely prompt you to install the packages, hit enter.
```
Need to install the following packages:
  test_panel_installer@latest
Ok to proceed? (y) y
```

Next, it will prompt you with a set of options you can choose for the panel.
```



         ╭───────────────────────────────╮
         │                               │
         │    Derecho Panel Installer    │
         │   Welcome to the installer!   │
         │                               │
         ╰───────────────────────────────╯



Please select the following options for the panel

? Where would you like the panel? »
  [↑]/[↓]: Highlight Option
  [Space]/[Enter]: Continue

>   This folder - C:\Users\My User\
    Create one for me
    Custom Path
```

You may be prompted with the follwoing popup:
```
Files/Directories Exist!!!
? Would you like to delete all of the files in C:\Users\My User\panel? » 
    [↑]/[↓]: Highlight Option
    [Space]/[Enter]: Continue
  
>   Yes - Yes, delete all files in the folder (Recommended if re-installing)
    No
    STOP
```
Don't worry, it just means that you have folders or files in your directory.
These are the following options:
- Yes
  - All your files will be deleted from that folder, and will install into that folder
  - Best if you are re-installing the panel.
- No
  - Will keep all the files and directories, and continue to install the panel as normal
  - Best if you want to have other code with the panel.
- STOP
  - Will immediately stop the program. Nothing will happen, except, it will take you back to the command prompt. 
  - Best if you weren't aware that the folder already has other files or folders.

Next it will start installing the panel to your desired path.
