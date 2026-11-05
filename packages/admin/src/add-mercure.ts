import type { DataProvider } from "ra-core";

import { EventSourcePolyfill } from "event-source-polyfill";
import debounce from "lodash/debounce";

import type { RealTimeDataProvider, Event, Subscriptions } from "../../types";

/**
 * Add realTime methods to a dataProvider based on a Mercure Hub.
 *
 * @see https://mercure.rocks/
 *
 * @param {DataProvider} dataProvider The dataProvider to augment
 * @param {string} mercureURL The adress of the Mercure hub
 * @param {string} jwt The JWT to connect to Mercure hub
 * @param {string} topicPrefix The prefix used for each subcription topics (without slash at the end)
 *
 * @example
 *
 * const realTimeDataProvider = addRealTimeMethodsBasedOnMercure(
 *     dataProvider,
 *     'eyJhbGciOiJIUzI1NiJ9.eyJtZXJjdXJlIjp7InB1Ymxpc2giOlsiKiJdLCJzdWJzY3JpYmUiOlsiKiJdfX0.SWKHNF9wneXTSjBg81YN5iH8Xb2iTf_JwhfUY5Iyhsw',
 *     'http://path.to.my.api/.well-known/mercure'
 * );
 *
 * await realTimeDataProvider.subscribe('resource/post', (event) => {
 *    console.log(`Post ${event.payload.id} modified`);
 * });
 *
 * await realTimeDataProvider.publish('resource/post', {
 *     type: 'updated',
 *     payload: { id: 1234 }
 * })
 */
export const addMercure = (
  dataProvider: DataProvider,
  mercureURL: string,
  jwt = "set_jwt_key",
  topicPrefix = "http://localhost/mercure",
): DataProvider & RealTimeDataProvider => {
  let subscriptions: Subscriptions = [];
  let eventSource: EventSourcePolyfill;

  const openEventSource = debounce(
    (): Promise<any> => {
      eventSource && eventSource.close && eventSource.close();
      // Calling mercure with no topic causes an error 400 to be raised.
      // Hence, if there are no subscriptions yet, we don't create an eventSource at all.
      if (!subscriptions.length) {
        return Promise.resolve({ data: true });
      }
      const url = new URL(mercureURL);
      const topics = Array.from(
        new Set(subscriptions.map((subscription) => subscription.topic)),
      );
      topics.forEach((topic) =>
        url.searchParams.append("match", `${topicPrefix}/${topic}`),
      );
      return new Promise((resolve, reject) => {
        eventSource = new EventSourcePolyfill(url, {
          credentials: "include",
        });
        eventSource.onmessage = (e: any): void => {
          const event: Event = JSON.parse(e.data);
          subscriptions.forEach((subscription) => {
            event.topic === subscription.topic &&
              subscription.subscriptionCallback(event);
          });
        };

        eventSource.onopen = (): any => {
          return resolve({ data: true });
        };

        eventSource.onerror = (err): void => {
          // eslint-disable-next-line no-console
          console.warn("EventSource error: ", err);
          return reject(err);
        };
      });
    },
    500,
    { leading: true }, // lodash needs this option to return the result of the promise apparently - source https://stackoverflow.com/a/50837389/3975522
  );

  return {
    ...dataProvider,

    subscribe: async (topic, subscriptionCallback): Promise<any> => {
      subscriptions.push({ topic, subscriptionCallback });
      return openEventSource();
    },

    unsubscribe: async (topic, subscriptionCallback): Promise<any> => {
      subscriptions = subscriptions.filter(
        (subscription) =>
          subscription.topic !== topic ||
          subscription.subscriptionCallback !== subscriptionCallback,
      );
      return openEventSource();
    },

    publish: (): Promise<any> => {
      throw new Error("Publish is not handled by this application.");
    },
  };
};
