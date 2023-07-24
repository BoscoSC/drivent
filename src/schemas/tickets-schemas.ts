import Joi from 'joi';

type CreateTicketSchema = {
  ticketTypeId: number;
};

export const createTicketSchema = Joi.object<CreateTicketSchema>({
  ticketTypeId: Joi.number().required(),
});
