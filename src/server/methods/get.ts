import { IEndpointHandler } from './index';
import { IBroadcaster } from '../../types';
import { getBroadcaster } from '../broadcasters';

export const get: IEndpointHandler<IBroadcaster> = props => Promise.resolve(getBroadcaster(props.key as string));
