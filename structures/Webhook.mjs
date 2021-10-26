import CacheableLookup from 'cacheable-lookup';
import FormData from '@discordjs/form-data';
import Got from 'got';

import Message from './Message';

/**
 * Represents a webhook.
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
  async send(options) {
    this.send.gotOptions ??= {
      cache: new Map(),
      decompress: true,
      dnsCache: new CacheableLookup(),
      http2: true,
    };

    let response;

    if (options.files?.length) {
      const body = new FormData();

      options.files.forEach((file) => body.append(file.name, file.file, file.name));

      if (options.data != null) { body.append('payload_json', JSON.stringify(options.data)); }

      response = await Got.post(
        this.url,
        {
          ...this.send.gotOptions,
          body,
          headers: body.getHeaders(),
        },
      ).json();
    } else {
      response = await Got.post(
        this.url,
        {
          ...this.send.gotOptions,
          json: options,
        },
      ).json();
    }

    return new Message(this.client, response);
  }
}
