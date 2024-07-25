import type { NS } from "Bitburner";

const GITHUB_USER = "notghoull";
const REPO = "hackx";
const REPO_PATH = "out/hackx";
const API_URL = `https://api.github.com/repos/${GITHUB_USER}/${REPO}/contents/${REPO_PATH}`;

// Since this is going to be on it's own, we can't use any of our imports
interface FileData {
  name: string;
  path: string;
  type: "file" | "dir";
  download_url: string;
  url: string;
}

export async function main(ns: NS) {
  ns.tprint("INFO: Running selfinstall script...");
  ns.tprint("INFO: Installing HackX to `/hackx`...");

  if (ns.fileExists("/hackx/hackx.js")) {
    ns.tprint(
      "WARN: HackX already installed, are you sure you want to overwrite it?",
    );

    const overwrite = ns.prompt(
      "Are you sure you want to overwrite the current HackX installation?",
      {
        type: "boolean",
        choices: ["Yes", "No"],
      },
    );

    await overwrite;
    if (!(await overwrite)) {
      ns.tprint("INFO: Exiting...");
      ns.exit();
    }
    ns.tprint("WARN: Overwriting...");
  }

  // Clear the hackx folder

  try {
    await downloadDirectory(ns, API_URL, "/hackx");
    ns.tprint("SUCCESS: Downloaded!");
  } catch (error) {
    ns.tprint("ERROR: Failed: " + error);
  }

  // TODO: Download the files from the github
  ns.tprint("SUCCESS: Installed!");
  await ns.sleep(1000);
  // Create the hax alias
  const createAlias = await ns.prompt(
    "Create Hax alias?\nThis is recommeneded",
    {
      type: "boolean",
      choices: ["Yes", "No"],
    },
  );
  if (createAlias) {
    // Inject script command
    console.debug("Hijacking terminal input...");
    const terminalInput = document.getElementById(
      "terminal-input",
    ) as HTMLInputElement;
    if (terminalInput == null) {
      ns.tprint("ERROR: Failed to get terminal input");
      return;
    }
    terminalInput.disabled = true;
    terminalInput.value = "alias hax='run /hackx/hackx.js'";
    const handler = Object.keys(terminalInput)[1];
    //@ts-ignore
    terminalInput[handler].onChange({ target: terminalInput });
    //@ts-ignore
    terminalInput[handler].onKeyDown({
      key: "Enter",
      preventDefault: () => null,
    });
    ns.tprint("SUCCESS: Made alias!");
    terminalInput.disabled = false;
  } else {
    ns.tprint("WARN: Skipped `hax` alas creation, this is not recommended!");
  }
  printFinishMessage(ns);
}

function printFinishMessage(ns: NS): void {
  ns.ui.clearTerminal();
  ns.tprint(`INFO


████████╗██╗  ██╗ █████╗ ███╗   ██╗██╗  ██╗    ██╗   ██╗ ██████╗ ██╗   ██╗██╗
╚══██╔══╝██║  ██║██╔══██╗████╗  ██║██║ ██╔╝    ╚██╗ ██╔╝██╔═══██╗██║   ██║██║
   ██║   ███████║███████║██╔██╗ ██║█████╔╝      ╚████╔╝ ██║   ██║██║   ██║██║
   ██║   ██╔══██║██╔══██║██║╚██╗██║██╔═██╗       ╚██╔╝  ██║   ██║██║   ██║╚═╝
   ██║   ██║  ██║██║  ██║██║ ╚████║██║  ██╗       ██║   ╚██████╔╝╚██████╔╝██╗
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝       ╚═╝    ╚═════╝  ╚═════╝ ╚═╝
                                                                             


For installing HackX
You can start using it using the hax command
        
        `);
}

export async function fetchFilesInfo(url: string): Promise<FileData[]> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ERROR: Couldn't get data from api.`);
  }

  return response.json() as Promise<FileData[]>;
}

async function downloadFile(
  ns: NS,
  url: string,
  localPath: string,
): Promise<void> {
  const success = await ns.wget(url, localPath);
  if (!success) {
    throw new Error("Failed to download file!");
  } else {
    ns.tprint(`SUCCESS: Downloaded ${localPath}`);
  }
}

export async function downloadDirectory(
  ns: NS,
  url: string,
  path: string,
): Promise<void> {
  const items = await fetchFilesInfo(url);
  for (const item of items) {
    if (item.type === "file") {
      await downloadFile(ns, item.download_url, `${path}/${item.name}`);
    } else if (item.type === "dir") {
      // Recursively download the directory
      await downloadDirectory(ns, item.url, `${path}/${item.name}`);
    }
  }
}
