import { ParsedUrlQuery } from 'querystring';
import { checkAvailableKey } from './check-available-key';
import { get } from './get';
import { set } from './set';
import { IBroadcaster } from '../../types';

export type IEndpointHandler<T = unknown> = (props: ParsedUrlQuery) => Promise<T>;

export type IEndpointMap = {
    'set': IEndpointHandler<boolean>;
    'get': IEndpointHandler<IBroadcaster>;
    'check-available-key': IEndpointHandler<{ available: boolean }>;
};

const methods: IEndpointMap = {
    'set': set,
    'get': get,
    'check-available-key': checkAvailableKey,
};

export const hasMethod = (method: string): method is keyof IEndpointMap => method in methods;

export default methods;
