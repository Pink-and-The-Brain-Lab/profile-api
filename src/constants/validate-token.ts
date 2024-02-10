import { ValidateToken } from "millez-lib-api";
import { RabbitMqQueues } from "../enums/rabbitmq-queues.enum";
export const VALIDATE_TOKEN = new ValidateToken(RabbitMqQueues.VALIDATE_USER_SESSION, RabbitMqQueues.PROFILE_RESPONSE_QUEUE);
