import { MessageFlags } from 'discord.js';

/**
 * Represents a payload to be sent to an interaction's webhook
 */
export default class MessagePayload {
  constructor(data) {
    Object.defineProperties(
      this,
      {
        data: {
          enumerable: true,
          value: Object.freeze({
            components: data.components?.map((component) => component.toJSON()) ?? [],

            /**
             * The content of this payload
             * @type {string}
             */
            content: data.content ?? '',

            /**
             * The embeds for this payload
             * @type {?MessageEmbed[]}
             */
            embeds: data.embeds?.map((embed) => embed.toJSON()) ?? [],

            /**
             * The flags for this payload
             * @type {?BigInt|number}
             */
            flags: data.ephemeral ? MessageFlags.FLAGS.EPHEMERAL : MessageFlags.defaultBit,
          }),
        },

        /**
         * The files for this payload
         * @type {?boolean}
         */
        attachments: {
          enumerable: true,
          value: data.attachments?.filter((attachment) => Buffer.isBuffer(attachment.attachment))
            .map(
              (attachment) => ({
                attachment: attachment.attachment,
                filename: attachment.filename,
              }),
            ) ?? [],
        },
      },
    );
  }
}
