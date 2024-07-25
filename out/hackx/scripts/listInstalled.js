import {} from "../utils";
/**
 * Lists installed HackX modules
 *
 * @export
 * @param {NS} ns
 */
export async function listInstalled(ns, config) {
    const modules = getInstalledModules(ns, config);
    for (let i = 0; i < modules.length; i++) {
        ns.tprint(modules[i]);
    }
}
export function getInstalledModules(ns, config) {
    const installedScripts = ns.ls("home", config.installLocation);
    let installedModules = [];
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
