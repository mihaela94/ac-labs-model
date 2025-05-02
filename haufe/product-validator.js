import { Joi, Segments } from "celebrate";

export const productValidator = {
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().lowercase().required(),

        name: Joi.string().trim().required(),

        has_authorization_security: Joi.boolean().required(),

        password_id_access_key_id: Joi.string(),

        password_id_secret_access_key: Joi.string(),

        email_domains: Joi.array()
            .min(1)
            .items(Joi.string().lowercase().trim()),
    }),
};
