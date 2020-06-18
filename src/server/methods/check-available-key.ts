import { IEndpointHandler } from './index';
import { isAvailableKey } from '../broadcasters';

export const checkAvailableKey: IEndpointHandler<{ available: boolean }> = props => Promise.resolve({
    available: isAvailableKey(props.key as string),
});
