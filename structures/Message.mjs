import { Constants, MessageFlags } from 'discord.js';

import Collection from '@discordjs/collection';

import User from './User';

const { MessageTypes } = Constants;

/**
 * Represents a Discord message
 * @see {@link https://canary.discord.com/developers/docs/resources/channel#message-object}
 */
export default class Message {
  constructor(client, data, guildId) {
    Object.defineProperties(
      this,
      {
        /**
         * If the message is a response to an interaction, this is the id of the interaction's
         * application
         * @name Message#applicationId
         * @readonly
         * @type {?Snowflake}
         */
        applicationId: { enumerable: true, value: data.application_id ?? null },

        /**
         * Any attached files
         * TODO: Create MessageAttachment structure
         * @name Message#attachments
         * @type {MessageAttachment[]}
         */
        attachments: { enumerable: true, value: data.attachments },

        /**
         * The author of this message
         * @name Message#author
         * @readonly
         * @type {User}
         */
        author: { enumerable: true, value: new User(client, data.author) },

        /**
         * The id of the channel the message was sent in
         * @name Message#channelId
         * @readonly
         * @type {Snowflake}
         */
        channelId: { enumerable: true, value: data.channel_id },

        /**
         * The client that initiated the message
         * @name Message#client
         * @readonly
         * @type {Client}
         */
        client: { enumerable: true, value: client },

        /**
         * Sent if the message contains components like buttons, action rows, or other interactive
         * components
         * TODO: Create MessageComponent structure
         * @name Message#components
         * @type {MessageComponent[]}
         */
        components: { enumerable: true, value: data.components },

        /**
         * The contents of the message
         * @name Message#content
         * @readonly
         * @type {?string}
         */
        content: { enumerable: true, value: data.content ?? null },

        /**
         * When this message was edited (or null if never)
         * @name Message#editedTimestamp
         * @readonly
         * @type {?Date}
         */
        editedTimestamp: {
          enumerable: true,
          value: data.editedTimestamp ? new Date(data.editedTimestamp) : null,
        },

        /**
         * Any embedded content
         * TODO: Create MessageEmbed structure
         * @name Message#embeds
         * @type {MessageEmbed[]}
         */
        embeds: { enumerable: true, value: data.embeds },

        /**
         * Message flags combined as a bitfield
         * @name Message#flags
         * @type {MessageFlags}
         */
        flags: {
          enumerable: true,
          value: new MessageFlags(data.flags).freeze(),
        },

        /**
         * The id of the guild the message was sent in
         * @name Message#guildId
         * @readonly
         * @type {?Snowflake}
         */
        guildId: { enumerable: true, value: guildId ?? null },

        /**
         * The id of the message
         * @name Message#id
         * @readonly
         * @type {Snowflake}
         */
        id: { confirm: false, enumerable: true, value: data.id },

        /**
         * Channels specifically mentioned in this message
         * @name Message#mentionedChannels
         * @type {Set<Snowflake>}
         */
        mentionedChannels: { enumerable: true, value: new Set(data.mention_channels ?? []) },

        /**
         * Roles specifically mentioned in this message
         * @name Message#mentionedRoles
         * @type {Set<Snowflake>}
         */
        mentionedRoles: { enumerable: true, value: new Set(data.mention_roles ?? []) },

        /**
         * Users specifically mentioned in this message
         * @name Message#mentionedUsers
         * @type {Collection<Snowflake, User>}
         */
        mentionedUsers: {
          enumerable: true,
          value: new Collection(data.mentions.map((user) => [user.id, new User(client, user)])),
        },

        /**
         * Whether this message mentions everyone
         * @name Message#mentionsEveryone
         * @type {boolean}
         */
        mentionsEveryone: { enumerable: true, value: data.mention_everyone },

        /**
         * Whether this message is pinned
         * @name Message#isPinned
         * @type {boolean}
         */
        isPinned: { enumerable: true, value: data.pinned },

        /**
         * Whether this was a TTS message
         * @name Message#isTTS
         * @type {boolean}
         */
        isTTS: { enumerable: true, value: data.tts },

        /**
         * When this message was sent
         * @name Message#timestamp
         * @readonly
         * @type {date}
         */
        timestamp: { enumerable: true, value: new Date(data.timestamp) },

        /**
         * The type of the message
         * @name Message#type
         * @readonly
         * @type {?MessageType}
         */
        type: { enumerable: true, value: MessageTypes[data.type] },

        /**
         * If the message is generated by a webhook, this is the webhook's id
         * @name Message#webhookId
         * @readonly
         * @type {?Snowflake}
         */
        webhookId: { enumerable: true, value: data.webhook_id ?? null },
      },
    );
  }
}
