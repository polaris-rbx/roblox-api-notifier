const fetch = require("node-fetch");
const { interval: intervalSeconds, url, token, channels, initialPost, message } = require("./config.json");
const { join } = require("path");
const { promises: {readFile, writeFile } } = require("fs");
const lastNumLoc = join(__dirname, "lastNum");
const Eris = require("eris");

const bot = new Eris(`Bot ${token}`, {
    restMode: true
})


let lastNum = initialPost || 0;

// Writes lastDate to file
async function persistLatest () {
    try {
        await writeFile(lastNumLoc, `${lastNum}`)
    } catch (e) {
        throw new Error(`Failed to write to ${lastNumLoc}: ${e}`);
    }
}


/**
 * Gets any new posts that have been made.
 */
async function getNew () {
    const res = await fetch(url);
    const data = await res.json();

    if (data.errors) {
        console.log(data.errors);
        throw new Error(data.errors[0]);
    }

        const toReturn = {
            title: data.title,
            count: data.posts_count,
            newPosts: []
        }
        for (const post of data.post_stream.posts) {
            if (post.post_number > lastNum) {
                lastNum = post.post_number;
                const base = url.split("/t/")[0]
                const avatarUrl = `${base}/${post.avatar_template.replace("{size}", "100")}`
                toReturn.newPosts.push({
                    content: post.cooked,
                    username: post.username,
                    avatarUrl,
                    url: `${url.split(".json")[0]}/${post.post_number}`
                })
            }
        }
        persistLatest().catch(console.error);
        return toReturn;

}

async function notifyPost (name, post) {
    for (const channelConfig of channels) {
        const channel = channelConfig.id;
        const crosspost = channelConfig.crosspost;
        try {
            const m = await bot.createMessage(channel, { content: `${message}\nBy: ${post.username}.\n\n${post.url}` })
            if (m && m.id && crosspost) {
                await bot.crosspostMessage(channel, m.id);
            }
        } catch (e) {
            console.error(`Failed to message ${channel}: ${e}`);
        }
    }

}


async function run() {
    const latest = await getNew();
    if (latest.newPosts.length !== 0) {
        const p = [];
        for (let post of latest.newPosts) {
            p.push(notifyPost(latest.title, post))
        }
        await Promise.all(p);
    }
}

async function main () {
    // Read initial num from file
    try {
        const res = await readFile(lastNumLoc)
        lastNum = parseInt(res, 10);

        if (isNaN(lastNum)) {
            console.warn("Value from file was NaN!")
            lastNum = initialPost || 0
        }
    } catch (e) {
        if (e.code !== "ENOENT") {
            throw new Error(`Failed to read ${lastNumLoc}: ${e}`)
        }
    }

    setInterval(run, intervalSeconds * 60000)
    return run();
}


main().catch(console.error)
