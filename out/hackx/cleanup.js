export async function main(ns) {
    //TODO - Make it so we check the the current folder, and then just work from there
    deleteFile(ns, "index.js");
    deleteFile(ns, "helper.js");
    // delete every file in the subfolders
    deleteDirectory(ns, "scripts");
    deleteDirectory(ns, "lib");
}
//TODO - Remove the prefix, this only exists because I'm lazy
export function deleteDirectory(ns, dir, prefix = "/hackx/") {
    dir = `${prefix}${dir}`;
    const files = ns.ls("home", dir);
    if (files.length == 0) {
        ns.tprint(`ERROR: Failed to delete "${dir}", does it exist?`);
    }
    files.forEach((file) => {
        ns.rm(file);
        // Check if the file still exists
        if (ns.fileExists(file)) {
            ns.tprint(`ERROR: Failed to delete ${file}`);
            return;
        }
        ns.tprint(`SUCCESS: Deleted ${file}`);
    });
}
export function deleteFile(ns, file) {
    ns.rm(file);
    // Check if the file still exists
    if (ns.fileExists(file)) {
        ns.tprint(`ERROR: Failed to delete ${file}`);
        return;
    }
    ns.tprint(`SUCCESS: Deleted ${file}`);
}
function checkFilesDeleted(ns, dir) {
    // Check if the length of the directory is 0
    const files = ns.ls("home", `/hackx/${dir}`);
    if (files.length > 0) {
        ns.tprint(`ERROR: Failed to delete ${dir}`);
        return;
    }
    ns.tprint(`SUCCESS: Deleted ${dir}`);
}
