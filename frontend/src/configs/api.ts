

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `/auth/login`,
        LOGOUT: `/auth/logout`,
        REGISTER: `/auth/register`,
        ME: `/auth/me`,
    },
    TOPIC: {
        INDEX: `/topics`,
    },
    WORD: {
        INDEX: `/words`,
        MARK: `/words/markAsReviewed`,
        MULTIPLE_MARK: `/words/markMultipleAsReviewed`,
    },
    PERIOD: {
        INDEX: `/periods`,
    },
    LESSON: {
        INDEX: `/lessons`,
    },
    UPLOAD: {
        SINGLE: `/uploadSingleFile`,
    },
};
