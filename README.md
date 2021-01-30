# Api-Notify
Notifies on changes to the Roblox web api - when they are posted on the official dev forum post.
Sends notifications via. a Discord message. This module makes use of a bot as opposed to a webhook as this allows it to crosspost messages too.

# Usage
- Clone this repo: `git clone https://github.com/polaris-rbx/roblox-api/webhook`
- navigate to the folder
- Install dependencies `npm install`
- Set up config file. It should be called `config.json` and be within the same directory as `index.js`.

## Config structure

```json
{
  "url": "",
  "interval": 5,
  "channels": [
    {
      "id": "",
      "crosspost": true
    }
  ],
  "message": "",
  "initialPost": 23,
  "token": ""
}
```
## Config values
| Key | Type | Description |
| --- | ---  | ------------| 
| url | String | The JSON endpoint URL. Usually the URL of the post, with `.json` appended to the end. |
| interval | Number | The time between GET requests to check for new content. Lower = faster notifications, at the cost of more http requests. Do not set this below 0.5.|
| channels | Array<ChannelConfig> |  An array of Channel configuration objects. |
| ChannelConfig.id | String(Snowflake) | The channel id of the channel  you want the messages to go in |
| ChannelConfig.crosspost | boolean |  Whether or not the bot should cross-post to following servers. Set to false if not using an announcement channel. |
| message | String |The message to prepend to the message. This is added before the URL of the latest post. |
| initialPost | number | The first post you want to consider. If monitoring a huge post, you will need to get the post number of the latest post from the JSON endpoint. |
| token | String | The discord bot token. The bot must have Send messages and Manage messages within the channel in question. |

### Support
Open an issue or contact me directly:

Discord: Neztore#6998

[Polaris discord](https://discord.gg/QevWabU)
