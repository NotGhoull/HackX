import type { NS } from "Bitburner";
import { type Config } from "../utils";

/**
 * Lists installed HackX modules
 *
 * @export
 * @param {NS} ns
 */
export async function listInstalled(ns: NS, config: Config) {
  const modules = getInstalledModules(ns, config);

  for (let i = 0; i < modules.length; i++) {
    ns.tprint(modules[i]);
  }
}

export function getInstalledModules(ns: NS, config: Config): string[] {
  const installedScripts = ns.ls("home", config.installLocation);
  let installedModules: string[] = [];

  for (let i = 0; i < installedScripts.length; i++) {
    // /.hackx/someModules/
    let current = installedScripts[i];
    current = current.split("/")[1];

    // If it's already there, don't do anything
    if (installedModules.includes(current)) {
      continue;
    }
    installedModules.push(current);
  }

  return installedModules;
}
