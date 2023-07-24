import Joi from 'joi';

export type CreateBookingSchema = {
  roomId: number;
};

export type UpdateBookingSchema = CreateBookingSchema;

export const createBookingSchema = Joi.object<CreateBookingSchema>({
  roomId: Joi.number().required(),
});

export const updateBookingSchema = createBookingSchema;
