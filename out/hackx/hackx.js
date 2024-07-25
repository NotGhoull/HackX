import { installModule } from "./scripts/install";
import { listInstalled } from "./scripts/listInstalled";
import { remove } from "./scripts/remove";
import { getConfig } from "./utils";
const ACTIONS = {
    install: ["install", "add", "i"],
    list: ["list", "l", "ls"],
    remove: ["remove", "r", "rm"],
    help: ["help", "h"],
};
let config;
let error = "";
export async function main(ns) {
    await init(ns);
    const { action, module } = parseArgs(ns.args);
    switch (action) {
        case "install":
            ns.tprint(`Installing ${ns.args[1]}`);
            await installModule(ns, ns.args[1], config);
            break;
        case "list":
            ns.tprint("Listing installed modules");
            await listInstalled(ns, config);
            break;
        case "remove":
            ns.tprint(`Removing ${ns.args[1]}`);
            remove(ns, ns.args[1], config);
            break;
        case "help":
            printHelp(ns);
            break;
        default:
            printHelp(ns);
            break;
    }
}
function parseArgs(args) {
    const actionAlias = args[0];
    const module = args[1];
    for (const [action, aliases] of Object.entries(ACTIONS)) {
        if (aliases.includes(actionAlias)) {
            return { action, module };
        }
    }
    error = `Unknown action "${actionAlias}"`;
    return { action: "help", module: "" };
}
async function init(ns) {
    config = await getConfig(ns);
}
export function autocomplete(data, args) {
    const actions = ["install", "i", "list", "l", "remove", "r", "help", "h"];
    if (args.length === 0) {
        return actions;
    }
    return [];
}
//TODO - Make this actually helpful, ironic, huh?
function printHelp(ns) {
    // Print the help
    ns.tprint(`ERROR
${error}

Usage: run hackx <action> <module>

Actions:
    - install, i, add        Install a module
    - list, l, ls            List installed modules
    - remove, r, rm          Remove a module
    - help, h                Show this help message

Example:
    - run hackx i hackx
    - hax rm hackx
    `);
}
