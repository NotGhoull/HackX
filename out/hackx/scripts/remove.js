import { getInstalledModules } from "./listInstalled";
import { deleteDirectory } from "../cleanup";
export function remove(ns, module, config) {
    const modules = getInstalledModules(ns, config);
    if (!modules.includes(module)) {
        ns.tprint(`ERROR: Package ${module} is not installed`);
        return;
    }
    //   if we can find it, remove it
    const path = `${config.installLocation}${module}`;
    ns.tprint(`Removing ${path}`);
    deleteDirectory(ns, path, "");
    ns.tprint("Done.");
}
