import { GetTokenData } from "millez-lib-api";
import { RabbitMqQueues } from "../enums/rabbitmq-queues.enum";
export const GET_TOKEN_DATA = new GetTokenData(RabbitMqQueues.VALIDATE_USER_SESSION, RabbitMqQueues.PROFILE_RESPONSE_QUEUE);
