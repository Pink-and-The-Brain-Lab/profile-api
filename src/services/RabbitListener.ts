import { RabbitMqListener, RabbitMqManageConnection } from 'millez-lib-api';
import { RabbitMqQueues } from '../enums/rabbitmq-queues.enum';
import { RABBITMQ_HOST_URL } from '../constants/rabbitmq-host-url';
import { IEmailDiponibility } from '../routes/interfaces/email-disponibility.inteface';
import CreateProfileService from './CreateProfileService';
import { IProfile } from '../routes/interfaces/proifle.inteface';

class RabbitListener {
    async listeners(): Promise<void> {
        const connection = new RabbitMqManageConnection(RABBITMQ_HOST_URL);
        const rabbitListener = new RabbitMqListener(connection);
        rabbitListener.genericListener<IProfile, IEmailDiponibility>(RabbitMqQueues.CREATE_PROFILE_AFTER_SIGNUP, this.createwProfileAfterSignup);
    }

    private async createwProfileAfterSignup({ userId, email }: IEmailDiponibility): Promise<IProfile> {
        try {
            return await new CreateProfileService().execute({ email }, userId);
        } catch (error) {
            return error as any;
        }
    }
};

export default RabbitListener;
