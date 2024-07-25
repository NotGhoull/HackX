import type { NS } from "Bitburner";

export interface FileData {
  name: string;
  download_url: string;
}

export function createProgressBar(total: number, current: number): string {
  const barLength = 20;
  const filledLength = Math.round((barLength * current) / total);
  const emptyLength = barLength - filledLength;
  const filledBar = "=".repeat(filledLength);
  const emptyBar = " ".repeat(emptyLength);
  const percentage = Math.round((current / total) * 100).toFixed(2);

  // Add the ">" if the progress is less than 100%
  const addition = current < total ? ">" : "";
  return `[${filledBar}${addition}${emptyBar}] ${percentage}%`;
}

export interface Config {
  repos: string[];
  installLocation: string;
}

//TODO - Find a better way to do this
export async function getConfig(ns: NS): Promise<Config> {
  // config is located in ~/.config/hackx/config.json
  const data = ns.read("/.config/hackx/config.json");

  if (data == "") {
    ns.tprint("ERROR: Invalid config file");
    ns.exit();
  }

  // Create a new config object, and fill the data
  let config: Config = {
    repos: [],
    installLocation: "/.hackx/",
  };

  const parsed = JSON.parse(data);

  if (parsed.repos) {
    config.repos = parsed.repos;
  }

  if (parsed.installLocation) {
    config.installLocation = parsed.installLocation;
  }

  return config;
}
