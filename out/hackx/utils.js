export function createProgressBar(total, current) {
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
//TODO - Find a better way to do this
export async function getConfig(ns) {
    // config is located in ~/.config/hackx/config.json
    const data = ns.read("/.config/hackx/config.json");
    if (data == "") {
        ns.tprint("ERROR: Invalid config file");
        ns.exit();
    }
    // Create a new config object, and fill the data
    let config = {
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
