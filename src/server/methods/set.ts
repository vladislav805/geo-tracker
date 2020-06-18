import { preparePosition } from '../utils';
import { putPosition } from '../broadcasters';
import { sendToClientsWithKey } from '../clients';
import { IEndpointHandler } from './index';

export const set: IEndpointHandler<boolean> = props => {
    const key = props.key as string;
    const position = preparePosition(props);

    putPosition(key, position);
    sendToClientsWithKey(key, 'location_update', position);

    return Promise.resolve(true);
};
