const TasksValidator = (req, res) => {
    if (!req.body)
        return {
            validated: false,
            msg: "Os campos title e description são obrigatórios."
        };

    const { title, description } = req.body;

    if (!title)
        return {
            validated: false,
            msg: "O campo title é obrigatório."
        };

    if (!description)
        return {
            validated: false,
            msg: "O campo description é obrigatório."
        };

    return {
        validated: true,
        msg: ""
    };
}

export default TasksValidator;