import CacheableLookup from 'cacheable-lookup';
import FormData from '@discordjs/form-data';
import Got from 'got';

import MessagePayload from './MessagePayload';
import Message from './Message';

/**
 * Represents an interaction webhook
 */
export default class Webhook {
  constructor(client, applicationId, token) {
    Object.defineProperties(
      this,
      {
        /**
         * The application id for this webhook
         * @name Webhook#applicationId
         * @readonly
         * @type {Snowflake}
         */
        applicationId: { enumerable: true, value: applicationId },

        /**
         * The client that initiated this webhook
         * @name Webhook#client
         * @readonly
         * @type {Client}
         */
        client: { enumerable: true, value: client },

        /**
         * The token for this webhook
         * @name Webhook#token
         * @readonly
         * @type {string}
         */
        token: { enumerable: true, value: token },

        /**
         * The URL for this webhook
         * @name Webhook#url
         * @readonly
         * @type {URL}
         */
        url: {
          enumerable: true,
          value: new URL(
            `/api/webhooks/${applicationId}/${token}`,
            'https://discord.com',
          ).href,
        },
      },
    );
  }

  // TODO: Everything... Dig in...
  async send(payload) {
    this.send.gotOptions ??= {
      cache: new Map(),
      decompress: true,
      dnsCache: new CacheableLookup(),
      http2: true,
    };

    /* eslint-disable-next-line no-param-reassign */
    payload = payload instanceof MessagePayload ? payload : new MessagePayload(payload);

    const body = new FormData();

    if (payload.attachments?.length) {
      payload.attachments.forEach(
        (attachment) => body.append(
          attachment.filename,
          attachment.attachment,
          attachment.filename,
        ),
      );
    }

    body.append('payload_json', JSON.stringify(payload.data));

    return new Message(
      this.client,
      await Got.post(
        this.url,
        {
          ...this.send.gotOptions,
          body,
          headers: body.getHeaders(),
        },
      ).json(),
    );
  }
}
