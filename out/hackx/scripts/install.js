import { createProgressBar } from "../utils";
async function fetchFilesInfo(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP ERROR: Couldn't get data from api.`);
    }
    return response.json();
}
async function getModuleData(ns, module, config) {
    // We could do this check sooner
    if (config.repos.length <= 0) {
        ns.tprint("ERROR: Invalid module repository.");
        ns.exit();
    }
    ns.tprint("Getting information, please wait...");
    // We don't really need this, but it's nice to have.
    const requestData = { method: "GET" };
    let data = null;
    try {
        const response = await fetch(`${config.repos[0]}`, requestData);
        if (!response.ok || response.body == null) {
            throw new Error("Invalid module repository.");
        }
        const buffer = await response.arrayBuffer();
        const text = new TextDecoder().decode(buffer);
        data = JSON.parse(text);
    }
    catch (err) {
        ns.tprint("ERROR: Invalid module repository.");
    }
    // Check if the module is in the repo
    if (data == null) {
        ns.tprint("ERROR: something went wrong.");
        ns.exit();
    }
    const moduleData = data[module.toLowerCase()];
    return moduleData;
}
async function downloadAndInstallFiles(ns, module, filesInfo) {
    // We only have this for the progress bar :)
    const totalFiles = filesInfo.length;
    for (let i = 0; i < totalFiles; i++) {
        const file = filesInfo[i];
        const outputDir = `/.hackx/${module}/${file.name}`;
        // Show progress bar
        ns.ui.clearTerminal();
        ns.tprint(`Installing file ${file.name}...`);
        ns.tprint(createProgressBar(totalFiles, i + 1));
        const success = await ns.wget(file.download_url, outputDir);
        if (!success) {
            ns.tprint(`ERROR: Failed to download ${file.name}`);
        }
    }
    for (const file of filesInfo) {
        const OUTPUT_DIR = `/.hackx/${module}/${file.name}`;
        const success = await ns.wget(file.download_url, OUTPUT_DIR);
        if (!success) {
            ns.tprint(`ERROR: Failed to download ${file.name}`);
        }
        else {
            ns.tprint(`SUCCESS: Downloaded ${file.name}`);
        }
    }
}
async function runPostInstallScript(ns, module, moduleData) {
    moduleData["post_install"] = moduleData["post_install"].substring(2);
    // Start the post install script, specified in the moduleData
    const postInstallScript = `/.hackx/${module}/${moduleData["post_install"]}`;
    ns.tprint(`running post install script: ${postInstallScript}`);
    const success = ns.run(postInstallScript, 1);
    if (!success) {
        ns.tprint(`ERROR: Failed to run ${postInstallScript}`);
    }
    else {
        ns.tprint(`SUCCESS: Ran ${postInstallScript}`);
    }
    ns.tprint(`SUCCESS: Finished installing package ${module}`);
}
//TODO - Clean up and create sub functions
export async function installModule(ns, module, config) {
    // Make this the module name
    module = module.toLowerCase();
    // Get the module's data
    const moduleData = await getModuleData(ns, module, config);
    // Get the github link for us to download the code from
    const githubArray = moduleData.github.split("/"); // <- Let's us grab the correct parts from the link
    ns.tprint("Installing module...");
    // get the files we need to download
    const downloadURL = `https://api.github.com/repos/${githubArray[githubArray.length - 2] // Username
    }/${githubArray[githubArray.length - 1]}/contents/${moduleData.download_from.startsWith("/")
        ? moduleData.download_from.substring(1)
        : moduleData.download_from}?ref=main`;
    // Get the files we need
    const filesInfo = await fetchFilesInfo(downloadURL);
    // Download and install the files
    await downloadAndInstallFiles(ns, module, filesInfo);
    ns.tprint("INFO: Running post-install...");
    await runPostInstallScript(ns, module, moduleData);
    ns.tprint(`SUCCESS: Installed module ${module}`);
}
